import { mistarmodel } from "../services/ai.service.js";

export const aiAssistantResponse = async (msg) => {
  try {
    const prompt = `
Please generate a clear, helpful response to the following input. Your reply must be under 120 words. Do not exceed the word limit.

Input:
${msg}
`;

    const response = await mistarmodel.invoke(prompt);
    return response?.content || "";
  } catch (error) {
    console.error("response error:", error);
    return "";
  }
}
