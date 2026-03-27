// utils/generateTags.js
import { mistarmodel } from "../services/ai.service.js";

export const generateTags = async ({ title, description }) => {
    try {
        const prompt = `
You are a tagging system.

Generate 5-8 short, relevant tags for the following content.

Rules:
- tags must be lowercase
- no sentences
- no explanations
- only comma separated values

Content:
Title: ${title}
Description: ${description}
`;
        const response = await mistarmodel.invoke(prompt);

        const text =
            typeof response === "string"
                ? response
                : response?.content || "";

        let tags = text
            .split(",")
            .map(tag => tag.trim().toLowerCase())
            .filter(Boolean);

        tags = [...new Set(tags)].slice(0, 8);
        return tags;

    } catch (error) {
        console.error("Tag generation error:", error);
        return [];
    }
};