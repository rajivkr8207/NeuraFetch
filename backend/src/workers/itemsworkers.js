// import { Worker } from "bullmq";
// import redis from "../config/redis.js";
// import itemHandlers from "../handlers/item.handlers.js";
// console.log("Worker start job:");
// const ItemWorker = new Worker(
//     "itemQueue",
//     async (job) => {
//         console.log("Worker received job:", job.data);
//         const handler = itemHandlers[job.name];
//         if (!handler) {
//             throw new Error(`No handler found for job: ${job.name}`);
//         }
//         return handler(job.data);
//     },
//     {
//         connection: redis,
//     }
// );

// ItemWorker.on("active", (job) => {
//     console.log(`Processing job ${job.name}`);
// });

// ItemWorker.on("completed", (job) => {
//     console.log(`Job ${job.name} completed`);
// });

// ItemWorker.on("failed", (job, err) => {
//     console.error(`Job ${job?.name} failed: ${err.message}`);
// });

// export default ItemWorker;