import ReactMarkdown from 'react-markdown'
export default function MessageBubble({ msg }) {
    const isUser = msg.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`px-4 py-2 text-sm rounded-2xl max-w-[75%] break-words ${isUser
                        ? "bg-black text-white rounded-br-sm"
                        : "bg-white border text-gray-800 rounded-bl-sm"
                    }`}
            >
                <ReactMarkdown
                    components={{
                        p: ({ children }) => <p className='mb-3 last:mb-0 text-[15px] leading-relaxed'>{children}</p>,
                        ul: ({ children }) => <ul className='mb-3 space-y-1 list-disc pl-5'>{children}</ul>,
                        ol: ({ children }) => <ol className='mb-3 space-y-1 list-decimal pl-5'>{children}</ol>,
                        li: ({ children }) => <li className='text-[15px] leading-relaxed'>{children}</li>,
                        code: ({ children }) => <code className='rounded bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 font-mono text-sm text-pink-600 dark:text-pink-400'>{children}</code>,
                        pre: ({ children }) => <pre className='mb-3 overflow-x-auto rounded-xl bg-neutral-900 dark:bg-neutral-950 p-4 font-mono text-sm text-neutral-100'>{children}</pre>
                    }}
                >
                    {msg.message}
                </ReactMarkdown>
            </div>
        </div>
    );
}