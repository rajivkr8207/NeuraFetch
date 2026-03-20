import { GoogleGenAI } from "@google/genai";

export async function generateEmbedding(text) {
    const ai = new GoogleGenAI({});

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
    });
    const embebdvalues =response.embeddings[0].values
    return embebdvalues
}
