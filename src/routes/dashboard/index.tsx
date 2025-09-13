import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/providers/app-store-provider";
import { useCallback } from "react";
import { Dashboard } from "@/components/screens/dashboard/index";
import { ChatbotSection } from "@/components/chatbot/chatbot-section";
import { project } from "@/lib/dummy-data/projects/0GDKHg3LN";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexComponent,
});

function DashboardIndexComponent() {
  const {
    projects,
    addProject,
    addProjectToIntakeFormParseList,
    addProjectToBlueprintsParseList,
  } = useAppStore((state) => state);

  const addNewProject = useCallback(() => {
    addProject(project);
    addProjectToIntakeFormParseList(project.id);
    addProjectToBlueprintsParseList(project.id);
  }, [
    addProject,
    addProjectToIntakeFormParseList,
    addProjectToBlueprintsParseList,
  ]);

  return (
    <div className="h-full w-full p-3 flex gap-3">
      <div className="flex-grow h-full">
        <Dashboard
          projects={projects}
          addProject={addNewProject}
          config={{
            mapboxAccessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
            transloaditApiKey: import.meta.env.VITE_TRANSLOADIT_AUTH_KEY,
            transloaditTemplateId: import.meta.env.VITE_TRANSLOADIT_TEMPLATE_ID,
          }}
        />
      </div>
      <ChatbotSection className="w-1/4 h-full" />
    </div>
  );
}
