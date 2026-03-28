import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { deleteEmbeddingByDocument } from "../helpers/deleteEmbeddingByDocument.js";

const worker = new Worker(
    "embedding-delete-queue",
    async (job) => {
        const { documentId, userId } = job.data;
        console.log(job.id);
        await deleteEmbeddingByDocument({documentId, userId});
    },
    { connection: redisConnection }
);

worker.on("completed", (job) => {
    console.log("✅ Done:", job.id);
});

worker.on("failed", (job, err) => {
    console.error("❌ Failed:", err);
});