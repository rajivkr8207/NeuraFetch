import api from "../../../lib/api/axios";


export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const profileUser = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};


export const getme = async () => {
  const res = await api.get("/auth/get-me");
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.get("/auth/logout");
  return res.data;
};