import SavedItem from "../models/Items.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


// export const saveItem = async (req, res) => {
//     const { collection, limit = 50, page = 1 } = req.query;

//     let filteredItems = items;

//     if (collection) {
//         filteredItems = filteredItems.filter(item => item.collection === collection);
//     }

//     const start = (page - 1) * limit;
//     const end = start + parseInt(limit);

//     res.json({
//         items: filteredItems.slice(start, end),
//         total: filteredItems.length,
//         page: parseInt(page),
//         limit: parseInt(limit)
//     });

// }

export const CreateItemData = asyncHandler(async (req, res) => {
    const { url, type } = req.body;

    if (!url || !type) {
        throw new ApiError(400, "URL and type are required");
    }

    const item = await SavedItem.create({
        ...req.body,
        user: req.user._id
    });

    return res
        .status(201)
        .json(new ApiResponse(201, item, "Item saved successfully"));
})


export const getItems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type, search } = req.query;

  const query = {
    user: req.user._id
  };

  // 🔍 filter by type
  if (type) {
    query.type = type;
  }

  // 🔍 search (title + notes)
  if (search) {
    query.$text = { $search: search };
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
    user: req.user._id
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

  const item = await SavedItem.findOneAndDelete({
    _id: id,
    user: req.user._id
  });

  if (!item) {
    throw new ApiError(404, "Item not found or already deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Item deleted successfully"));
});

// const { title, url, type } = req.body;
// const item = await ItemsModel.create({
//     title,
//     url,
//     type
// });
// const embedding = await generateEmbedding(item.content);
// item.embedding = embedding;

// await item.save();
//  await itemQueue.add("itemEmbeded", {
//     itemId: item._id
// });
// return res.status(201).json({
//     message: "working",
//     title,
//     url ,
//     type
// })