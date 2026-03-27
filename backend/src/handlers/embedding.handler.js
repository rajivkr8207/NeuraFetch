import { connection } from "../config/redis.js";
import { GenrateVectorEmbedding } from "../helpers/GenrateVectorEmbedding.js";

export const embeddingHandler = async (job) => {
    const { pincode, title, description } = job.data;

    console.log("Processing:", title, description);

    // 🔹 Step 1: embedding generate
    const vector = await GenrateVectorEmbedding({ title, description });

    // 🔹 Step 2: Redis key bana
    const key = `embeddings:${pincode}`;

    // 🔹 Step 3: store in Redis (list)
    await connection.rpush(
        key,
        JSON.stringify({
            title, description,
            vector,
        })
    );

    return { success: true };
};