import { ScrollArea } from "@/components/ui/scroll-area";
import { Project, Step } from "../projects-tracker/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExpandIcon } from "lucide-react";
import { IntakeFormScreen } from "../intake-form";
import { Link, useNavigate } from "@tanstack/react-router";

interface ActionItemsListProps {
  className?: string;
  projects: Project[];
  config: {
    transloaditApiKey: string;
    transloaditTemplateId: string;
    mapboxAccessToken: string;
  };
}

export const ActionItemsList = ({
  className = "",
  projects,
}: ActionItemsListProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const navigate = useNavigate();

  // Extract all next steps from all projects
  const getAllNextSteps = () => {
    const allSteps: Array<{
      step: Step;
      project: Project;
      address: string;
    }> = [];

    projects.forEach((project) => {
      if (project.nextSteps && project.nextSteps.length > 0) {
        project.nextSteps.forEach((step) => {
          allSteps.push({
            step,
            project,
            address: project.address || project.id,
          });
        });
      }
    });

    return allSteps;
  };

  const nextSteps = getAllNextSteps();

  const handleStepClick = (step: Step, project: Project) => {
    setSelectedProject(project);
    setSelectedStep(step);

    if (step === Step.FillMissingItems) {
      setShowIntakeForm(true);
      return;
    }

    if (step === Step.ReviewViolations) {
      navigate({
        to: "/projects/$projectId/plan-review",
        params: { projectId: project.id },
      });
      return;
    }
  };

  return (
    <div className={`rounded-lg border bg-background h-full w-1/2`}>
      {/* Intake Form inline modal (matches Projects screen behavior) */}
      {selectedProject && (
        <Dialog open={showIntakeForm} onOpenChange={setShowIntakeForm}>
          <DialogContent className="w-[50vw] h-[80vh] sm:max-w-[80vw] flex-none flex flex-col overflow-hidden">
            <DialogHeader className="flex flex-row items-center justify-between w-full py-3 px-4">
              <div>
                <DialogTitle>Provide missing items</DialogTitle>
                <DialogDescription className="sr-only">
                  Answer Missing Information
                </DialogDescription>
              </div>

              <Link
                to="/projects/$projectId/intake-form"
                params={{ projectId: selectedProject.id }}
                aria-label="View full intake form"
                className="mr-12"
              >
                <Button variant="ghost" size="icon">
                  <ExpandIcon className="w-4 h-4" />
                </Button>
              </Link>
            </DialogHeader>
            <div className="w-full flex-grow overflow-y-auto h-full pl-2">
              <IntakeFormScreen
                showParsingModal={false}
                projectId={selectedProject.id}
                showPlanReviewButton={false}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="bg-muted px-3 py-3 rounded-t-lg grid grid-cols-2 gap-2 font-semibold text-sm flex-shrink-0">
        <div>Next Steps</div>
        <div>Address</div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="divide-y">
          {nextSteps.length === 0 ? (
            <div className="px-3 py-8 text-center text-muted-foreground text-sm">
              No next steps available
            </div>
          ) : (
            nextSteps.map((item, index) => (
              <div
                key={`${item.project.id}-${index}`}
                className="grid grid-cols-2 gap-2 items-center px-3 py-3 text-sm cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
                onClick={() => handleStepClick(item.step, item.project)}
              >
                <div className="flex items-start">
                  <span className="font-medium text-foreground leading-5">
                    {item.step}
                  </span>
                </div>
                <div className="text-muted-foreground text-sm leading-5">
                  {item.address}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
