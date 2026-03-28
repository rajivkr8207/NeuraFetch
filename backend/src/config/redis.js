import Redis from "ioredis";
import config from "./config.js";

export const redisConnection = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
})
// 
redisConnection.on("connect", () => {
    console.log(`server is connected to redis`);
})

redisConnection.on('error', (err) => {
    console.log(err);
})

