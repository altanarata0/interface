import {
  SectionCard,
  SectionCardContent,
  SectionCardDescription,
  SectionCardHeader,
  SectionCardTitle,
} from "@/components/ui/section-card";
import { Chatbot } from ".";
import { cn } from "@/lib/utils";

interface ChatbotSectionProps {
  className?: string;
}

export const ChatbotSection: React.FC<ChatbotSectionProps> = ({
  className,
}) => {
  return (
    <SectionCard className={cn("gap-0", className)}>
      <SectionCardHeader>
        <SectionCardTitle>Project Assistant</SectionCardTitle>
        <SectionCardDescription>
          Ask questions about your projects and get instant answers
        </SectionCardDescription>
      </SectionCardHeader>
      <SectionCardContent className="p-2 flex flex-col h-full">
        <div className="border rounded-sm h-full overflow-hidden flex-grow">
          <Chatbot />
        </div>
      </SectionCardContent>
    </SectionCard>
  );
};
