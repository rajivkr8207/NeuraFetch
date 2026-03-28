import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import socket from "../../../lib/socket/socket";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../item.slice";

export default function ChatApp({ setChatbot }) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dragRef = useRef({
        dragging: false,
        offsetX: 0,
        offsetY: 0,
    });
    const positionRef = useRef({ x: 0, y: 0 });
    const frameRef = useRef(null);
    const bottomRef = useRef(null);
    const user = useSelector(state => state.auth.user)
    const messages = useSelector(state => state.items.messages)
    const dispatch = useDispatch()

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", message: input, userid: user.id };

        dispatch(addMessage(userMsg))

        socket.emit("send_message", userMsg);

        setInput("");
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);
    useEffect(() => {
        socket.on("receive_message", (data) => {
            dispatch(addMessage(data))

        });

        socket.on("ai_typing", setLoading);

        return () => {
            socket.off("receive_message");
            socket.off("ai_typing");
        };
    }, []);


    const handleMouseDown = (e) => {
        if (window.innerWidth < 1024) return;

        dragRef.current.dragging = true;

        const rect = e.currentTarget.parentElement.getBoundingClientRect();

        dragRef.current.offsetX = e.clientX - rect.left;
        dragRef.current.offsetY = e.clientY - rect.top;

        document.body.style.userSelect = "none"; 
    };

    const handleMouseMove = (e) => {
        if (!dragRef.current.dragging) return;

        const newX = e.clientX - dragRef.current.offsetX;
        const newY = e.clientY - dragRef.current.offsetY;

        const boxWidth = 360;
        const boxHeight = 520;

        const maxX = window.innerWidth - boxWidth;
        const maxY = window.innerHeight - boxHeight;

        positionRef.current = {
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY)),
        };
        document.body.style.userSelect = "none";
        // smooth update using RAF
        if (!frameRef.current) {
            frameRef.current = requestAnimationFrame(() => {
                setPosition(positionRef.current);
                frameRef.current = null;
            });
        }
    };
    const handleMouseUp = () => {
        dragRef.current.dragging = false;
        document.body.style.userSelect = "auto";
    };
    useEffect(() => {
        if (window.innerWidth >= 1024) {
            setPosition({
                x: window.innerWidth - 380,
                y: window.innerHeight - 560,
            });
        }
    }, []);
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);


    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });

        return () => {
            socket.disconnect();
        };
    }, []);
    return (
       <div className="fixed inset-0 z-50 flex items-end justify-end">

            <div
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                }}
                className="
                    relative flex flex-col bg-white text-neutral-900
                    w-full h-full 
                    sm:w-[360px] sm:h-[520px] 
                    sm:rounded-2xl sm:shadow-2xl 
                    overflow-hidden border
                    lg:absolute lg:top-0 lg:left-0
                    transition-transform duration-150 ease-out
                    "
            >

                {/* Header */}
                <div
                    onMouseDown={handleMouseDown}
                    className="px-4 py-3 bg-black  text-white font-semibold flex justify-between items-center cursor-grab active:cursor-grabbing"
                >
                    <span>AI Assistant</span>
                    <button
                        onClick={() => setChatbot(false)}
                        className="text-sm opacity-70 hover:opacity-100"
                    >
                        ✕
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} msg={msg} />
                    ))}

                    {loading && (
                        <div className="text-gray-400 text-sm">Typing...</div>
                    )}

                    <div ref={bottomRef}></div>
                </div>

                {/* Input */}
                <div className="p-3 border-t bg-white flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Ask anything..."
                        className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-black text-white px-4 py-2 rounded-full text-sm active:scale-95 transition"
                    >
                        Send
                    </button>
                </div>

            </div>
        </div>
    );
}