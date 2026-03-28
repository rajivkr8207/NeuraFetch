import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { GenrateVectorEmbedding } from "../helpers/GenrateVectorEmbedding.js";

const worker = new Worker(
  "embedding-queue",
  async (job) => {
    const { title, description, userid, docId } = job.data;
    console.log(job.id);
    await GenrateVectorEmbedding({ title, description, userid, docId });
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log("✅ Done:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("❌ Failed:", err);
});