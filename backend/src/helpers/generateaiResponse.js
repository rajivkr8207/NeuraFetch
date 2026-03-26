import { mistarmodel } from "../services/ai.service.js";


export const generateaiResponse = async (msg) => {
    try {
        const response = await mistarmodel.invoke(msg);
        return response.content
    } catch (error) {
        console.error("response error:", error);
        return [];
    }
};

