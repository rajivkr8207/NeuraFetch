import { generateTags } from "../helpers/generateTags.js";
import SavedItem from "../models/Items.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { embeddingDeleteQueue, embeddingQueue } from '../queues/embedding.queue.js'
import crypto from 'crypto'
import { deleteEmbeddingByDocument } from "../helpers/deleteEmbeddingByDocument.js";

export const CreateItemData = asyncHandler(async (req, res) => {
  const { url, type, pageUrl, pageTitle, title, notes } = req.body;
  if (!url || !type) {
    throw new ApiError(400, "URL and type are required");
  }
  let metadata = null
  if (pageTitle && pageUrl) {
    metadata = {
      pageTitle,
      pageUrl
    }
  }
  let aitags
  if (type != 'image') {
    aitags = await generateTags({ title, url })
  }
  const docId = crypto.randomUUID();

  const item = await SavedItem.create({
    ...req.body,
    user: req.user.id,
    metadata,
    tags: aitags,
    documentId: docId
  });
  let vectorjob

  if (type != 'image') {
    vectorjob = await embeddingQueue.add("generate-embedding", { title, description: notes, userid: req.user.id, docId });
  }
  return res
    .status(201)
    .json(new ApiResponse(201, { item, vectorjob }, "Item saved successfully"));
})


export const getItems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type, search, tags } = req.query;

  const query = {
    user: req.user.id
  };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } }
    ];
  }
  if (type) {
    query.type = type;
  }
  if (tags) {
    const tagArray = tags.split(",");
    query.tags = { $in: tagArray };
  }
  const items = await SavedItem.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await SavedItem.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      items,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    }, "Items fetched successfully")
  );
});

export const getSingleItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await SavedItem.findOne({
    _id: id,
    user: req.user.id
  });

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, item, "Item fetched successfully"));
});



export const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userid = req.user.id
  const item = await SavedItem.findOne({
    documentId: id,
    user: req.user.id
  });

  if (!item) {
    throw new ApiError(404, "Item not found or already deleted");
  }
  if (item.type != 'image') {
    await deleteEmbeddingByDocument({ documentId: id, userId: userid })
  }
  await SavedItem.findByIdAndDelete(item._id)
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Item deleted successfully"));
});
