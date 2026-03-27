// queues/embedding.queue.js
import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis();
export const embeddingQueue = new Queue("embedding-queue", {
    connection,
});