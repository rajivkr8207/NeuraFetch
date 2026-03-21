import SavedItem from "../models/Items.model.js";

export const getSavedItemsByUser = async (userId) => {
    if (!userId) {
        throw new Error("UserId required");
    }

    const items = await SavedItem.find({ user: userId });

    return items;
};