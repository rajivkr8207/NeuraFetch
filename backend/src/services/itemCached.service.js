import { getSavedItemsByUser } from "../helpers/getSaveItem.js";
import { getCache, setCache } from "../utils/cache.js";

export const getUserItemsCached = async (userId) => {
  const key = `items:${userId}`;

  const cached = getCache(key);
  if (cached) return cached;

  const items = await getSavedItemsByUser(userId);
  setCache(key, items);

  return items;
};