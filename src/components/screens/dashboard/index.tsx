import { DataTable } from "./data-table";
import { Project } from "../projects-tracker/types";
import { MapBox } from "./map-box";
import { SectionCardsDashboard } from "@/components/ui/section-cards-dashboard";
import { Badge } from "@/components/ui/badge";
import { IconTrendingUp, IconExclamationCircle } from "@tabler/icons-react";
import { ActionItemsList } from "./action-items-list";
import {
  SectionCard,
  SectionCardContent,
  SectionCardHeader,
  SectionCardTitle,
} from "@/components/ui/section-card";
import { Clock } from "lucide-react";

interface ProjectsTrackerConfig {
  mapboxAccessToken: string;
  transloaditApiKey: string;
  transloaditTemplateId: string;
}

interface ProjectsDashboardProps {
  projects: Project[];
  config: ProjectsTrackerConfig;
  addProject: () => void;
}

export const Dashboard = (props: ProjectsDashboardProps) => {
  const cards = [
    {
      title: "Pending Submittals",
      value: "3",
      description: "Pending Applications",
      badge: (
        <Badge variant="outline">
          <Clock className="mr-1" />
          35 minutes
        </Badge>
      ),
      footer: (
        <>
          <div className="line-clamp-1 flex gap-2 font-medium">
            Urgency: High <IconExclamationCircle className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Applications you've started but not yet submitted.
          </div>
        </>
      ),
    },
    {
      title: "Approved Submittals",
      value: "28",
      description: "Approved Submittals",
      badge: (
        <Badge variant="outline">
          <IconTrendingUp className="mr-1" />
          +12.5%
        </Badge>
      ),
      footer: (
        <>
          <div className="line-clamp-1 flex gap-2 font-medium">
            Up 12.5% this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Approval rate after first review: 98%
          </div>
        </>
      ),
    },
    {
      title: "Approval Rate ",
      value: "98.6%",
      description: "Approval Rate",
      badge: (
        <Badge variant="outline">
          <IconTrendingUp className="mr-1" />
          +0.3%
        </Badge>
      ),
      footer: (
        <>
          <div className="line-clamp-1 flex gap-2 font-medium">
            Approval rate after first review{" "}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Approval Rate after second review: 20%
          </div>
        </>
      ),
    },
    {
      title: "Total Time saved",
      value: "348 hrs",
      description: "Total time saved",
      badge: (
        <Badge variant="outline">
          <IconTrendingUp className="mr-1" />+ 12 hours
        </Badge>
      ),
      footer: (
        <>
          <div className="line-clamp-1 flex gap-2 font-medium">
            Your permit operations are 12.4% more efficient this month.{" "}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Speed to permit exceeded forecasts by 1.2%
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="h-full">
      <SectionCard className="h-full p-0 gap-0 border">
        <SectionCardHeader className="">
          <SectionCardTitle>Dashboard</SectionCardTitle>
        </SectionCardHeader>
        <SectionCardContent className="flex-1 overflow-hidden p-0">
          <div className="flex flex-col gap-3 h-full overflow-y-auto">
            <div className="p-3 space-y-3">
              <SectionCardsDashboard cards={cards} />
              <div className="flex gap-3 h-[400px] w-full">
                <ActionItemsList
                  className="h-full w-1/2"
                  projects={props.projects}
                  config={props.config}
                />
                <div className="h-full w-1/2">
                  <MapBox
                    projects={props.projects}
                    mapboxAccessToken={props.config.mapboxAccessToken}
                  />
                </div>
              </div>

              <div>
                {/* <h2 className="text-lg font-bold pt-2 pb-3 ml-1"> */}
                {/*   All Projects */}
                {/* </h2> */}
                <DataTable
                  projects={props.projects}
                  config={props.config}
                  addProject={props.addProject}
                />
              </div>
            </div>
          </div>
        </SectionCardContent>
      </SectionCard>
    </div>
  );
};
