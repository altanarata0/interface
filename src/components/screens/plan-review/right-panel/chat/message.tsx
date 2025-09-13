import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  content: string;
  isAi?: boolean;
}

export const ChatMessage = ({ content, isAi = false }: ChatMessageProps) => {
  return (
    <div
      className={cn("flex gap-3 mb-4", isAi ? "flex-row" : "flex-row-reverse")}
    >
      <Avatar className="w-8 h-8">
        {isAi ? (
          <>
            <AvatarImage src="/ai-assistant.png" alt="AI Assistant" />
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/avatars/1.png" alt="User" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>
      <div
        className={cn(
          "rounded-lg p-3 max-w-[80%]",
          isAi ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-700",
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
