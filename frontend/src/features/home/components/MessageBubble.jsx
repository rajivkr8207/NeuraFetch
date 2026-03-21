export default function MessageBubble({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 text-sm rounded-2xl max-w-[75%] break-words ${
          isUser
            ? "bg-black text-white rounded-br-sm"
            : "bg-white border text-gray-800 rounded-bl-sm"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}