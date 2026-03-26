import { mistarmodel } from "../services/ai.service.js";

export const generateShortContent = async ({ title, description }) => {
    try {
        const prompt = `
Create a short, clear summary (2-3 lines max) of the following content.

Rules:
- keep it concise
- no extra explanation
- plain text only

Content:
Title: ${title}
Description: ${description || ""}
`;

        const response = await mistarmodel.invoke(prompt);

        const text =
            typeof response === "string"
                ? response
                : response?.content || "";

        return text.trim();

    } catch (error) {
        console.error("Short content error:", error);
        return `${title} ${description || ""}`.slice(0, 200);
    }
};