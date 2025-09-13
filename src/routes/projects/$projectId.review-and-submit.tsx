import { createFileRoute, useParams } from "@tanstack/react-router";
import { ReviewAndSubmitScreen } from "@/components/screens/review-and-submit/index";
import { AlertCircle } from "lucide-react";
import { useAppStore } from "@/providers/app-store-provider";
import { seo } from "../../utils/seo";

export const Route = createFileRoute("/projects/$projectId/review-and-submit")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Rescope | AI Plan Review",
        description: `Rescope simplifies the permitting process and reduces time to permit by 70%.`,
      }),
    ],
  }),
});

function RouteComponent() {
  const { projectId } = useParams({ from: Route.fullPath });
  const { getProjectById, updateProjectAcknowledgments } = useAppStore(
    (state) => state,
  );

  const project = getProjectById(projectId);

  if (!project) {
    return (
      <div className="h-full w-full p-3 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
        <p>The project with ID "{projectId}" could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-1">
      <ReviewAndSubmitScreen
        project={project}
        updateProjectAcknowledgments={updateProjectAcknowledgments}
      />
    </div>
  );
}
