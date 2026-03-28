// queues/embedding.queue.js
import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const embeddingQueue = new Queue("embedding-queue", {
    connection: redisConnection,
});

export const embeddingDeleteQueue = new Queue("embedding-delete-queue", {
    connection: redisConnection,
});