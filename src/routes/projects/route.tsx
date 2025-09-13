import { TopBar } from "@/components/top-bar";
import {
  Outlet,
  createFileRoute,
  useMatches,
  useNavigate,
} from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { NavBar } from "@/components/nav-bar";
import { useAppStore } from "@/providers/app-store-provider";

export const Route = createFileRoute("/projects")({
  loader: async ({ context }) => {
    // await context.queryClient.ensureQueryData(postsQueryOptions());
  },
  head: () => ({
    meta: [{ title: "Projects" }],
  }),
  component: ProjectsComponent,
});

function ProjectsComponent() {
  const { projects, selectProject, getProjectById } = useAppStore(
    (state) => state,
  );

  const matches = useMatches();
  const navigate = useNavigate({ from: Route.fullPath });

  // Check if there is a projectId param in the url
  const projectMatch = matches.find(
    (match) => match.params && "projectId" in match.params,
  );
  // @ts-expect-error projectMatch is either undefined or has projectId in params
  const projectId = projectMatch?.params.projectId;

  useEffect(() => {
    projectId && selectProject(projectId);
  }, [projectId, selectProject]);

  const handleProjectSelect = useCallback(
    (newProjectId: string) => {
      // selectProject(newProjectId);
      navigate({
        to: "/projects/$projectId",
        params: { projectId: newProjectId },
      });
    },
    [selectProject, navigate],
  );

  return (
    <div className="flex h-screen w-screen bg-background">
      <NavBar />
      <div className="flex-grow bg-muted">
        <TopBar
          onProjectSelect={handleProjectSelect}
          project={getProjectById(projectId)}
          projects={projects}
        />
        <main className="h-[calc(100vh-44px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
