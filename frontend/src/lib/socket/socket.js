import { io } from "socket.io-client";
const API_URl = import.meta.env.VITE_BACKEND_URL

const socket = io(`http://localhost:8000`, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;