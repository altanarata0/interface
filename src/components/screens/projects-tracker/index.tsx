import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { StarIcon } from "lucide-react";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { type ActivityLogItemProps } from "@/components/ui/activity-log";
import { AllProjectsSection } from "./all-projects-section";
import { ProjectDetailsSection } from "./project-details-section";
import { ProjectsMapSection } from "./projects-map-section";
import { ProjectStatus, Project } from "./types";
import "mapbox-gl/dist/mapbox-gl.css";
import { projectStatusStyles } from "./project-status-styles";

interface ProjectsTrackerConfig {
  mapboxAccessToken: string;
  transloaditApiKey: string;
  transloaditTemplateId: string;
}

interface AllProjectsTrackerProps {
  projects: Project[];
  config: ProjectsTrackerConfig;
  addProject: () => void;
}

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const authorAvatarMap: Record<string, string> = {
  "Olivia Martin": "/notion-avatars/01.svg",
  "Jackson Lee": "/notion-avatars/02.svg",
  System: "",
  "Public Works": "/notion-avatars/03.svg",
  "City Plan Check – MEP": "/notion-avatars/04.svg",
  "GSX Permitting Team": "/notion-avatars/05.svg",
  "City of Mesa Planning": "/notion-avatars/06.svg",
  "City of Mesa Building Safety": "/notion-avatars/07.svg",
  "GLX Construction": "/notion-avatars/08.svg",
  "LXC Permitting Team": "/notion-avatars/09.svg",
  "Loudoun Co. Building & Development": "/notion-avatars/10.svg",
  "Loudoun Co. Planning": "/notion-avatars/01.svg",
  "LXC Field Ops": "/notion-avatars/02.svg",
  "LXC Interiors": "/notion-avatars/03.svg",
  "SLX Permitting Team": "/notion-avatars/04.svg",
  "Salt Lake Co. Planning": "/notion-avatars/05.svg",
  "Salt Lake Co. Planning Commission": "/notion-avatars/06.svg",
  "Salt Lake Co. Public Works": "/notion-avatars/07.svg",
  "Rocky Mountain Power": "/notion-avatars/08.svg",
  "Salt Lake Co. Building Services": "/notion-avatars/09.svg",
  "SLX Construction": "/notion-avatars/10.svg",
  "SBX Permitting Team": "/notion-avatars/01.svg",
  "San Bernardino Co. Land Use Services": "/notion-avatars/02.svg",
  "County Plan Review – Building Safety": "/notion-avatars/03.svg",
  "SBX Design Team": "/notion-avatars/04.svg",
  "San Bernardino Co. Building Safety": "/notion-avatars/05.svg",
};

export const AllProjectsTracker = (props: AllProjectsTrackerProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [starredProjects, setStarredProjects] = useState<Set<string>>(
    new Set(),
  );

  // Set initial selection after component mounts and projects are available - only on initial load
  useEffect(() => {
    if (props.projects.length > 0) {
      // Use a small delay to ensure the DataTable is ready
      const timer = setTimeout(() => {
        setSelectedProject(props.projects[0]);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Memoize the map pin click handler to prevent infinite re-renders
  const handleMapPinClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleDeselectProject = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handleToggleStar = useCallback((projectId: string) => {
    setStarredProjects((prevStarred) => {
      const newStarred = new Set(prevStarred);
      if (newStarred.has(projectId)) {
        newStarred.delete(projectId);
      } else {
        newStarred.add(projectId);
      }
      return newStarred;
    });
  }, []);

  // Memoize stats items to prevent unnecessary recalculations
  const statsItems = useMemo(() => {
    return Object.values(ProjectStatus).map((statusValue) => {
      const count = props.projects.filter(
        (p) => p.status === statusValue,
      ).length;
      return { description: statusValue, title: count.toString() };
    });
  }, [props.projects]);

  const activityLogData = useMemo((): ActivityLogItemProps[] => {
    if (!selectedProject) {
      return [];
    }
    // Sort activityLog by date in descending order and take the latest 4
    const sortedAndLimitedLog = selectedProject.activityLog
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);

    return sortedAndLimitedLog.map((log, index) => ({
      id: `log-${selectedProject.id}-${index}`,
      activity: log.title + (log.message ? `: ${log.message}` : ""),
      name: log.author,
      date: format(new Date(log.date), "MMMM d, yyyy"),
      avatarFallback: getInitials(log.author),
      avatarSrc: authorAvatarMap[log.author] || undefined,
    }));
  }, [selectedProject]);

  // Memoize columns to prevent recreation on every render
  const columns: ColumnDef<Project>[] = useMemo(
    () => [
      {
        accessorKey: "address",
        header: "Project",
        cell: ({ row }) => {
          const address = String(row.getValue("address"));
          return (
            <div>
              <span className="font-medium whitespace-normal break-words">
                {address}
              </span>
              <div className="text-sm pt-1 font-medium text-gray-500">
                {row.original.customerName}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const value = getValue<ProjectStatus>();
          return (
            <div className="flex gap-2 items-center">
              <div
                className={cn(
                  "w-3 h-3 rounded-full border",
                  projectStatusStyles[value],
                )}
              />
              {value}
            </div>
          );
        },
      },
      {
        accessorKey: "lastUpdate",
        header: "Last Update",
        cell: ({ getValue }) => {
          const value = getValue();

          let date: Date | null = null;
          if (value instanceof Date) {
            date = value;
          } else if (typeof value === "string" || typeof value === "number") {
            const tempDate = new Date(value);
            if (!isNaN(tempDate.getTime())) {
              date = tempDate;
            }
          }

          if (!date) return "-";
          return format(date, "MM/dd/yyyy");
        },
      },
      {
        id: "star",
        cell: ({ row }) => {
          const projectId = row.original.id;
          const isStarred = starredProjects.has(projectId);

          const handleStarClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            handleToggleStar(projectId);
          };

          return (
            <div onClick={handleStarClick} className="cursor-pointer p-1">
              <StarIcon
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-colors",
                  isStarred
                    ? "fill-yellow-400 text-yellow-600"
                    : "hover:fill-yellow-400/50 hover:text-yellow-600",
                )}
              />
            </div>
          );
        },
      },
    ],
    [starredProjects, handleToggleStar],
  );

  return (
    <div className="h-full w-full max-w-full flex flex-col">
      <div className={cn("flex h-full gap-3")}>
        <AllProjectsSection
          projects={props.projects}
          columns={columns}
          statsItems={statsItems}
          onRowSelect={setSelectedProject}
          selectedProject={selectedProject}
          transloaditApiKey={props.config.transloaditApiKey}
          transloaditTemplateId={props.config.transloaditTemplateId}
          addProject={props.addProject}
        />
        <div
          className={cn(
            "flex-1 flex h-full overflow-hidden",
            selectedProject ? "gap-3" : "gap-0",
          )}
        >
          <ProjectsMapSection
            selectedProject={selectedProject}
            allProjects={props.projects}
            onMapPinClick={handleMapPinClick}
            mapboxAccessToken={props.config.mapboxAccessToken}
            starredProjects={starredProjects}
            onToggleStar={handleToggleStar}
            className={cn(
              "transition-all duration-500 ease-in-out border border-gray-300",
              selectedProject ? "w-1/2" : "w-full",
            )}
          />
          <ProjectDetailsSection
            selectedProject={selectedProject}
            activityLogData={activityLogData}
            className={cn(
              "transition-all duration-500 ease-in-out border border-gray-300",
              selectedProject
                ? "w-1/2 opacity-100"
                : "w-0 opacity-0 pointer-events-none",
            )}
            transloaditApiKey={props.config.transloaditApiKey}
            transloaditTemplateId={props.config.transloaditTemplateId}
          />
        </div>
      </div>
    </div>
  );
};
