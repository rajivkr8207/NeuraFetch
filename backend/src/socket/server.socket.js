import { Server } from 'socket.io'
// import { aiAssistantResponse } from '../helpers/aiAssistantResponse.js';
import { GenrateEmbeddingResponse } from '../helpers/GenrateEmbeddingResponse.js';


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
                const { message } = data;
                socket.emit("ai_typing", true);

                const aiResponse = await GenrateEmbeddingResponse(message);
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