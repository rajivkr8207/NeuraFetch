import config from "../config/config.js";
import { ChatMistralAI } from "@langchain/mistralai";


export const mistralEmbedding = new Mistral({
    apiKey: config.MISTRAL_API_KEY,
});
export const mistarmodel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: config.MISTRAL_API_KEY
});

const pc = new Pinecone({
    apiKey: config.PINE_CODE
});

export const index = pc.index("candybhai");
