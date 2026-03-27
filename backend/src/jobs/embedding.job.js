import {embeddingQueue} from '../queues/embedding.queue.js'
export const createEmbeddingJob = async (req, res) => {
  const { title, description } = req.body;

  await embeddingQueue.add("generate-embedding", {
    title,
    description,
    userid: req.user._id
  });

  return res.json({
    message: "Processing started 🚀"
  });
};