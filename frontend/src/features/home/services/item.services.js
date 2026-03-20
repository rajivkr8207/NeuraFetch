import api from "../../../lib/api/axios";

export const getItems = async (params = {}) => {
  const res = await api.get("/items", { params });
  return res.data;
};

export const deleteItem = async (id) => {
  const res = await api.delete(`/items/${id}`);
  return res.data;
};