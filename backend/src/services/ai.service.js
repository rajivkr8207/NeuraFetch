import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import config from "../config/config.js";
import { ChatMistralAI } from "@langchain/mistralai";
import { tavily } from "@tavily/core";
import { createAgent, HumanMessage, tool } from 'langchain'
import * as z from "zod";
import { getSavedItemsByUser } from "../helpers/getSaveItem.js";
import { getUserItemsCached } from "./itemCached.service.js";

const tvly = tavily({
    apiKey: config.TAVILY_KEY,
    maxResults: 3
});



const webSearchTool = tool(
    async ({ query }) => {
        const res = await tvly.search(query);
        const context = res.results
            .slice(0, 3)
            .map(r => r.content)
            .join("\n");
        return context;

    },
    {
        name: "web_search",
        description: "Search the internet for latest information",
        schema: z.object({
            query: z.string().describe("search query for web")
        })
    }
);





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
        return response.content
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

// system_msg = SystemMessage("You are a helpful assistant.")
// human_msg = HumanMessage("Hello, how are you?")



const assistantagent = createAgent({
    model: mistarmodel,
});


export const getRelevantItems = (items, query) => {
    const q = query.toLowerCase();

    const words = q.split(/\s+/);

    const scored = items.map(item => {
        let score = 0;

        const title = item.title?.toLowerCase() || "";
        const notes = item.notes?.toLowerCase() || "";
        const pageTitle = item.metadata?.pageTitle?.toLowerCase() || "";
        const tags = item.tags || [];

        words.forEach(word => {
            if (title.includes(word)) score += 3;
            if (pageTitle.includes(word)) score += 3;
            if (notes.includes(word)) score += 2;

            tags.forEach(tag => {
                if (tag.toLowerCase().includes(word)) score += 5;
                if (word.includes(tag.toLowerCase())) score += 5;
            });
        });

        if (title.includes(q)) score += 5;
        if (notes.includes(q)) score += 3;

        return { item, score };
    });

    return scored
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(x => x.item);
};
const userMemory = new Map();
const getUserMessages = (userId, context) => {
    if (!userMemory.has(userId)) {
        userMemory.set(userId, [
            {
                role: "system",
                content: `
You are a friendly AI assistant.

Rules:
- Use context to answer
- If unrelated → say "Out of context"
- Keep answers under 80 words
- Remember conversation flow

Context:
${context}
`
            }
        ]);
    }

    return userMemory.get(userId);
};

export const aiAssistantResponse = async (msg, userId) => {
    try {
        const items = await getUserItemsCached(userId);

        const relevant = getRelevantItems(items, msg);

        const context = relevant.map(item => `
            Title: ${item.title} || ${item.metadata.pageTitle}
            Notes: ${item.notes}
            Tags: ${item.tags.join(",")}
            `).join("\n\n");

        const messages = getUserMessages(userId, context);

        messages.push({
            role: "user",
            content: msg
        });

        const response = await assistantagent.invoke({ messages });

        return response.messages.at(-1).content;

    } catch (error) {
        console.error(error);
        return "Error";
    };
}




// utils/filter.js
