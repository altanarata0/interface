import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProjectLayout } from "@/components/screens/plan-review/project-layout";
import { NavBar } from "@/components/nav-bar";
import { TopBar } from "@/components/top-bar";
import { useAppStore } from "@/providers/app-store-provider";
import { useCallback, useEffect } from "react";

export const Route = createFileRoute("/projects_/$projectId/plan-review")({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });
  const { getProjectById, selectProject, projects } = useAppStore(
    (state) => state,
  );

  const transloaditApiKey = import.meta.env.VITE_TRANSLOADIT_AUTH_KEY || "";
  const transloaditTemplateId =
    import.meta.env.VITE_TRANSLOADIT_TEMPLATE_ID || "";

  useEffect(() => {
    projectId && selectProject(projectId);
  }, [projectId, selectProject]);

  const handleProjectSelect = useCallback(
    (newProjectId: string) => {
      selectProject(newProjectId);
      navigate({
        to: "/projects/$projectId/plan-review",
        params: { projectId: newProjectId },
      });
    },
    [navigate, selectProject],
  );

  return (
    <div className="flex h-screen w-screen bg-background max-h-screen">
      <NavBar />
      <main className="flex-grow h-full flex flex-col">
        <TopBar
          className="shrink-0"
          onProjectSelect={handleProjectSelect}
          project={getProjectById(projectId)}
          projects={projects}
        />
        <div className="h-[calc(100vh-44px)]">
          <ProjectLayout
            transloaditApiKey={transloaditApiKey}
            transloaditTemplateId={transloaditTemplateId}
          />
        </div>
      </main>
    </div>
  );
}
