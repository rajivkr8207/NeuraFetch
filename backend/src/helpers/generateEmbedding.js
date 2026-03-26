import { mistralEmbedding } from "../services/ai.service.js";

export const generateEmbedding = async (text) => {
    try {
        const res = await mistralEmbedding.embeddings.create({
            model: "mistral-embed",
            inputs: [text],
        });
        return res.data[0].embedding;
    } catch (error) {
        console.error("Embedding error:", error);
        return null;
    }
};


