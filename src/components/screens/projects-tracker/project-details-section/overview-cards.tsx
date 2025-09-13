import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Project,
  ProjectStatus,
} from "@/components/screens/projects-tracker/types";
import { IndividualStatsCard } from "@/components/ui/individual-stats-card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";

interface OverviewCardsProps {
  selectedProject: Project;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  selectedProject,
}) => {
  let statusBadgeVariant: VariantProps<typeof badgeVariants>["variant"] =
    "outline";
  let statusBadgeClassName = "";
  const statusString = selectedProject.status;

  switch (selectedProject.status) {
    case ProjectStatus.OnTrack:
      statusBadgeVariant = "default";
      statusBadgeClassName =
        "bg-green-700/70 text-white border-transparent hover:bg-green-600/70";
      break;
    case ProjectStatus.AtRisk:
      statusBadgeVariant = "default";
      statusBadgeClassName =
        "bg-yellow-400 text-yellow-900 border-yellow-500 hover:bg-yellow-500";
      break;
    case ProjectStatus.Delayed:
      statusBadgeVariant = "destructive";
      break;
    case ProjectStatus.Completed:
      statusBadgeVariant = "default";
      statusBadgeClassName =
        "bg-blue-500 text-white border-transparent hover:bg-blue-600";
      break;
    case ProjectStatus.Canceled:
      statusBadgeVariant = "outline";
      break;
  }

  return (
    <div className="flex gap-2">
      <IndividualStatsCard
        title={
          <button>
            <Badge
              variant={statusBadgeVariant}
              className={cn(statusBadgeClassName, "cursor-pointer")}
            >
              {statusString}
            </Badge>
          </button>
        }
        description="Status"
        className="flex-1 shadow-xs"
      />
      <IndividualStatsCard
        title={
          <button>
            <Badge
              variant="default"
              className="bg-primary/70 cursor-pointer hover:bg-primary/60"
            >
              {selectedProject.progress.phase}
            </Badge>
          </button>
        }
        description="Current phase"
        className="flex-1 shadow-xs"
      />
      <IndividualStatsCard
        title={
          <button>
            <Badge
              variant="default"
              className="bg-primary/70 cursor-pointer hover:bg-primary/60"
            >
              {selectedProject.ballInCourt}
            </Badge>
          </button>
        }
        description="Ball in court"
        className="flex-1 shadow-xs"
      />
    </div>
  );
};
