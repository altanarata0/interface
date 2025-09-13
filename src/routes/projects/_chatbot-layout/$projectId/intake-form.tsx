import { createFileRoute } from "@tanstack/react-router";
import { IntakeFormScreen } from "@/components/screens/intake-form/index";
import { useAppStore } from "@/providers/app-store-provider";
import { Project } from "@/components/screens/projects-tracker/types";

export const Route = createFileRoute(
  "/projects/_chatbot-layout/$projectId/intake-form",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { selectedProjectId, parseIntakeForm } = useAppStore((state) => state);

  if (!selectedProjectId) {
    return null;
  }

  return (
    <IntakeFormScreen
      showParsingModal={!!parseIntakeForm.find((p) => p === selectedProjectId)}
      projectId={selectedProjectId}
      showPlanReviewButton={true}
    />
  );
}
