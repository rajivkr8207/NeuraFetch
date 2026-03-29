import axios from "axios";
const API_URl = import.meta.env.VITE_BACKEND_URL
const api = axios.create({
    baseURL: `${API_URl}/api`,
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message || "Something went wrong";

        return Promise.reject(message);
    }
);

export default api;