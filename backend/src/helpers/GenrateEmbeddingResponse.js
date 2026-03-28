import { index } from "../services/ai.service.js"
import { generateEmbedding } from "./generateEmbedding.js"
import { generateaiResponse } from "./generateaiResponse.js"

export const GenrateEmbeddingResponse = async (msg) => {
    const embedding = await generateEmbedding(msg)
    const result = await index.query({
        vector: embedding,
        topK: 2,
        includeMetadata: true
    })

    const match = result.matches[0]
    if (!match || match.score < 0.65) {
        return "No relevant data found";
    }
    const data = match.metadata.text
    const aires = await generateaiResponse(data)
    return aires
}