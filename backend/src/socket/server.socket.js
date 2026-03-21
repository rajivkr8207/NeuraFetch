import { Server } from 'socket.io'
import { aiAssistantResponse } from '../services/ai.service.js';


let io
export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    console.log(`socket io server is running`);

    io.on('connection', (socket) => {
        console.log(`user is connected`, socket.id);

        socket.on("send_message", async (data) => {
            try {
                const { message, userid} = data;
                socket.emit("ai_typing", true);

                const aiResponse = await aiAssistantResponse(message, userid);
                socket.emit("receive_message", {
                    role: "ai",
                    message: aiResponse,
                });

            } catch (error) {
                console.error(error);
                socket.emit("error", "Something went wrong");
            } finally {
                socket.emit("ai_typing", false);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    })
}


export function getIO() {
    if (!io) {
        throw new Error("socket.io not initialized")
    }
    return io
}