// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import config from "../config/config.js";

// const model = new ChatGoogleGenerativeAI({
//   model: "text-embedding-004",
//   apiKey: config.GOOGLE_API_KEY
// });

// export const generateEmbedding = async (text) => {
//     try {
//         const response = await model.invoke("Why do parrots talk?");
//         console.log(response.content);
//         // return embedding;
//     } catch (error) {
//         console.error("Embedding error:", error);
//         return [];
//     }

// };