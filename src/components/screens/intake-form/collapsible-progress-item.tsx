import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  CircleDotDashed,
  Circle,
  ChevronDown,
} from "lucide-react";

// Assuming PacketSubsectionData will be implicitly typed via props from index.tsx
// or would be imported if index.tsx exports it.
// For clarity, this is the expected structure for PacketSubsectionData:
// interface PacketSubsectionData {
//   id: string;
//   title: string; // subsectionTitle
//   percentage: number;
//   items: SubItem[]; // Actual questions
// }

export type SubItemStatus = "completed" | "in-progress" | "pending";

export interface SubItem {
  name: string;
  status: SubItemStatus;
  questionId?: string;
}

// This is the PacketSubsectionData interface expected by this component
// It mirrors the one defined in index.tsx
interface PacketSectionDataForDisplay {
  id: string;
  title: string;
  percentage: number;
  items: SubItem[];
}

interface CollapsibleProgressItemProps {
  id: string; // Main section ID
  title: string; // Main section title
  percentage: number; // Main section overall percentage
  items: SubItem[]; // Old prop
  // subsections: PacketSectionDataForDisplay[]; // New prop
  isOpen: boolean;
  onToggle: (id: string, open: boolean) => void;
  className?: string;
  onSubItemClick?: (questionId: string) => void;
  onSectionTitleClick?: (sectionId: string) => void;
  activeQuestionId?: string;
}

const statusIcons: Record<SubItemStatus, React.ElementType> = {
  completed: CheckCircle2,
  "in-progress": CircleDotDashed,
  pending: Circle,
};

const statusColors: Record<SubItemStatus, string> = {
  completed: "text-emerald-700",
  "in-progress": "text-blue-500",
  pending: "text-muted-foreground",
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 75) return "bg-emerald-700";
  if (percentage >= 40) return "bg-yellow-500";
  return "bg-gray-300"; // Or a more distinct color for low progress
};
export function CollapsibleProgressItem({
  id,
  title,
  percentage,
  items,
  isOpen,
  onToggle,
  className,
  onSubItemClick,
  onSectionTitleClick,
  activeQuestionId,
}: CollapsibleProgressItemProps) {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => onToggle(id, open)}
      className={cn("bg-card p-2 rounded-lg border", className)}
    >
      <div
        onClick={() => {
          onSectionTitleClick?.(id);
          if (!isOpen) {
            onToggle(id, true);
          }
        }}
        className="flex flex-col w-full text-left p-2 gap-1"
      >
        <div className="flex items-center justify-between w-full">
          <p className="font-semibold text-sm text-card-foreground text-left">
            {title}
          </p>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                getProgressColor(percentage),
              )}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {percentage}%
            </span>
            <CollapsibleTrigger asChild>
              <button type="button">
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </CollapsibleTrigger>
          </div>
        </div>
        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full", getProgressColor(percentage))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <CollapsibleContent className="pb-1 overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <ul className="space-y-1 pb-2 pt-1 px-2">
          {items.map((item) => {
            const IconComponent = statusIcons[item.status];
            const isCurrentQuestionActive =
              item.questionId === activeQuestionId;

            return (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => onSubItemClick?.(item.questionId!)}
                  className={cn(
                    "flex items-center gap-2 w-full text-left p-1 pl-2 rounded text-xs",
                    isCurrentQuestionActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50",
                  )}
                >
                  <IconComponent
                    className={cn(
                      "h-3.5 w-3.5 flex-shrink-0",
                      statusColors[item.status],
                    )}
                  />
                  <span
                    className={cn(
                      "text-muted-foreground",
                      isCurrentQuestionActive && "font-semibold",
                    )}
                  >
                    {item.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
