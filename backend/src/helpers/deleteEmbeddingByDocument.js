import { index } from "../services/ai.service.js";

export const deleteEmbeddingByDocument = async ({ documentId, userId }) => {
    const namespace = index.namespace(userId);

    await namespace.deleteMany({
        documentId: { $eq: documentId },
        
    });

};