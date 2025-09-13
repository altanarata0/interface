import { addDays, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ClockIcon } from "lucide-react";
import { type Timeline } from "@/components/screens/projects-tracker/types";
import { TimelineStatus } from "@/components/screens/projects-tracker/types";

interface ProjectTimelineSectionProps {
  timelineItem: Timeline[];
}

export const timelineStatusColors: Record<string, string> = {
  [TimelineStatus.NotStarted]: "bg-blue-100 text-blue-800",
  [TimelineStatus.Pending]: "bg-yellow-100 text-yellow-800",
  [TimelineStatus.Completed]: "bg-green-100 text-green-800",
  [TimelineStatus.AskCorrections]: "bg-red-100 text-red-800",
};

export const ProjectTimelineSection = ({
  timelineItem,
}: ProjectTimelineSectionProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-foreground">Timeline</h3>
      <div className="space-y-4">
        {timelineItem.map((item) => {
          const approximateCompletionDate = addDays(
            new Date(item.createdAt),
            1,
          );

          // const approxRelative = formatDistanceToNowStrict(
          //   approximateCompletionDate,
          //   { addSuffix: true }
          // );

          const statusKey = item.status ?? "Pending";
          const badgeColorClass =
            timelineStatusColors[statusKey] ?? "bg-muted text-muted-foreground";

          return (
            <div key={item.id} className="flex gap-3 items-center">
              <div className="w-5 h-5 flex items-center justify-center rounded-full border border-muted-foreground" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <Badge
                    className={`${badgeColorClass} capitalize text-xs rounded-full px-2 py-0.5`}
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5" />
                  Approximate Completion Date:{" "}
                  <span className="font-medium">
                    {format(approximateCompletionDate, "d MMM yyyy")}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
