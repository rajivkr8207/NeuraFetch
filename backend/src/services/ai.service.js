import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import config from "../config/config.js";
import { ChatMistralAI } from "@langchain/mistralai";
const model = new ChatGoogleGenerativeAI({
    model: "text-embedding-004",
    apiKey: config.GOOGLE_API_KEY
});
const mistarmodel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: config.MISTRAL_API_KEY
});

export const generateaiResponse = async (msg) => {
    try {
        const response = await mistarmodel.invoke(msg);
        console.log(response.content);
        return
    } catch (error) {
        console.error("response error:", error);
        return [];
    }

};


export const generateEmbedding = async (text) => {
    try {
        const response = await model.invoke("Why do parrots talk?");
        console.log(response.content);
        // return embedding;
    } catch (error) {
        console.error("Embedding error:", error);
        return [];
    }

};