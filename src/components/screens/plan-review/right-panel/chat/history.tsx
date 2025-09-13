import { useEffect, useRef } from "react";
import { ChatMessage } from "./message";

interface Message {
  content: string;
  isAi: boolean;
}

interface ChatHistoryProps {
  messages: Message[];
}

export const ChatHistory = ({ messages }: ChatHistoryProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {/* Welcome message */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-700">
          Hi! I&apos;m your AI Copilot. I can help you understand building codes
          and regulations. How can I assist you today?
        </p>
      </div>

      {/* Chat messages */}
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          content={message.content}
          isAi={message.isAi}
        />
      ))}

      {/* Auto-scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};
