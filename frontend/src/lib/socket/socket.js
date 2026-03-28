import { io } from "socket.io-client";
const API_URl = import.meta.env.VITE_BACKEND_URL

const socket = io(`${API_URl}`, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;