import { Worker } from "bullmq";
import  connection  from "../config/redis.js";
import { GenrateVectorEmbedding } from "../helpers/GenrateVectorEmbedding.js";

const worker = new Worker(
  "embedding-queue",
  async (job) => {
    const { title, description, userid } = job.data;

    await GenrateVectorEmbedding({ title, description, userid });
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log("✅ Done:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("❌ Failed:", err);
});