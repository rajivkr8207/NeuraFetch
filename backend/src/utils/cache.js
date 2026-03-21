const cache = new Map();

export const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.time > 5 * 60 * 1000) {
    cache.delete(key);
    return null;
  }

  return entry.data;
};

export const setCache = (key, data) => {
  cache.set(key, { data, time: Date.now() });
};

export const invalidateCache = (key) => {
  cache.delete(key);
};