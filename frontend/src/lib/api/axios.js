// src/services/api.js

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true // 🔥 important for cookies
});

// 🔥 Response interceptor (optional but powerful)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // central error handling
        const message =
            error.response?.data?.message || "Something went wrong";

        return Promise.reject(message);
    }
);

export default api;