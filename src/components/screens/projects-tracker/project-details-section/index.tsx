import * as React from "react";
import {
  SectionCard,
  SectionCardContent,
  SectionCardDescription,
  SectionCardHeader,
  SectionCardTitle,
  SectionCardAction,
} from "@/components/ui/section-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ActivityLog,
  type ActivityLogItemProps,
} from "@/components/ui/activity-log";
import { Link } from "@tanstack/react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  UploadIcon,
  AlertTriangleIcon,
  FileCheckIcon,
  SendIcon,
  FileSearchIcon,
  MessageSquareIcon,
  ThumbsUpIcon,
  CreditCardIcon,
  FileTextIcon,
  ShieldCheckIcon,
  PencilIcon,
  Circle,
  ExpandIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Phase,
  Project,
  Step,
} from "@/components/screens/projects-tracker/types";
import { OverviewCards } from "./overview-cards";
import { Chatbot } from "@/components/chatbot";
import { useState } from "react";
import { FileTable } from "@/components/ui/file-table";
import { FileUploadStep } from "./file-upload-step";
import { ProjectTimelineSection } from "./project-timeline";
import { motion, AnimatePresence } from "framer-motion";
import { IntakeFormScreen } from "../../intake-form";

enum TabType {
  GENERAL = "general",
  CHAT = "chat",
  FILES = "files",
}

const tabOrder = [TabType.GENERAL, TabType.CHAT, TabType.FILES];

interface ProjectDetailsSectionProps {
  selectedProject: Project | null;
  activityLogData: ActivityLogItemProps[];
  className?: string;
  transloaditApiKey: string;
  transloaditTemplateId: string;
}

const tabVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    position: "absolute",
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative",
    zIndex: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    position: "absolute",
    zIndex: 0,
    transition: {
      x: { duration: 0.3 },
    },
  }),
};

const tabTransition = {
  x: { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.5 },
  opacity: { duration: 0.2, delay: 0.1 },
};

export const ProjectDetailsSection: React.FC<ProjectDetailsSectionProps> = ({
  selectedProject,
  activityLogData,
  className,
  transloaditApiKey,
  transloaditTemplateId,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.GENERAL);
  const [previousTab, setPreviousTab] = useState<TabType>(TabType.GENERAL);
  const [showUploadStep, setShowUploadStep] = useState(false);
  const [showIntakeForm, setShowIntakeForm] = useState(false);

  const currentIndex = tabOrder.indexOf(activeTab);
  const prevIndex = tabOrder.indexOf(previousTab);
  const direction = currentIndex > prevIndex ? 1 : -1;

  const stepIconMap: Record<Step, React.ElementType> = {
    [Step.UploadFiles]: UploadIcon,
    [Step.ReviewViolations]: AlertTriangleIcon,
    [Step.ValidateDocuments]: FileCheckIcon,
    [Step.SubmitApplication]: SendIcon,
    [Step.ApplicationReview]: FileSearchIcon,
    [Step.AddressFeedback]: MessageSquareIcon,
    [Step.ApprovalProcess]: ThumbsUpIcon,
    [Step.FeePayment]: CreditCardIcon,
    [Step.PermitIssuance]: FileTextIcon,
    [Step.ComplianceMonitoring]: ShieldCheckIcon,
    [Step.FillMissingItems]: PencilIcon,
  };

  const phaseOrder: Phase[] = [
    Phase.PreApplication,
    Phase.Submitted,
    Phase.Accepted,
    Phase.PlanReview,
    Phase.Corrections,
    Phase.Approved,
    Phase.Issued,
  ];

  let completed = 0;
  const total = phaseOrder.length;
  let percent = 0;
  let daysElapsed = 0;
  let completionDate = new Date();

  if (selectedProject?.progress) {
    const completedPhasesCount =
      phaseOrder.findIndex((p) => p === selectedProject.progress.phase) + 1;
    completed = completedPhasesCount >= 0 ? completedPhasesCount : 0;
    percent = selectedProject.progress.percentComplete;
    daysElapsed = selectedProject.progress.daysElapsed;
    completionDate = new Date(selectedProject.progress.completionDate);
  }

  const handleTabChange = (value: string) => {
    const newTab = value as TabType;
    setPreviousTab(activeTab);
    setActiveTab(newTab);
  };

  return (
    <>
      <SectionCard className={cn("h-full gap-2", className)}>
        {selectedProject && (
          <>
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
            <SectionCardHeader>
              <SectionCardTitle>
                {selectedProject.address || "Project Details"}
              </SectionCardTitle>
              <SectionCardAction>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild></TooltipTrigger>
                    <TooltipContent>
                      <p>Open Project</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SectionCardAction>
              <SectionCardDescription className="sr-only">
                {selectedProject?.address
                  ? `Details for ${selectedProject.address}`
                  : "Project details, including its progress and activity log"}
              </SectionCardDescription>
            </SectionCardHeader>

            <SectionCardContent className="flex-1 overflow-hidden px-0 pb-2">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="h-full flex flex-col gap-0 "
              >
                <div className="px-2">
                  <TabsList className="w-full border shadow-xs rounded-sm h-10 p-1">
                    <TabsTrigger
                      value={TabType.GENERAL}
                      className="flex-1 rounded-sm"
                    >
                      General
                    </TabsTrigger>
                    <TabsTrigger
                      value={TabType.CHAT}
                      className="flex-1 rounded-sm"
                    >
                      Chat
                    </TabsTrigger>
                    <TabsTrigger
                      value={TabType.FILES}
                      className="flex-1 rounded-sm"
                    >
                      Files
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden relative">
                  <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="popLayout"
                  >
                    <motion.div
                      key={activeTab}
                      custom={direction}
                      variants={tabVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={tabTransition}
                      className="h-full w-full will-change-transform"
                      style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    >
                      {activeTab === TabType.GENERAL && (
                        <TabsContent
                          value={TabType.GENERAL}
                          className="h-full px-2 pt-2 pb-1"
                        >
                          <div className="space-y-4 p-2 border rounded-sm  h-full overflow-auto">
                            <OverviewCards selectedProject={selectedProject} />
                            <div className="space-y-3 px-1">
                              <div className="flex items-center">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-lg font-medium text-foreground">
                                    Progress
                                  </h3>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-foreground">
                                  {percent}% complete
                                </span>
                                <span className="text-muted-foreground">
                                  {completed} / {total} phases complete
                                </span>
                              </div>

                              <div className="flex w-full gap-px h-2.5">
                                {phaseOrder.map((_, index) => {
                                  let bgColor = "bg-muted";
                                  if (index < completed) {
                                    const blueShades = [
                                      "bg-blue-700",
                                      "bg-blue-600",
                                      "bg-blue-500",
                                      "bg-blue-400",
                                      "bg-blue-300",
                                    ];
                                    bgColor =
                                      blueShades[
                                        Math.min(index, blueShades.length - 1)
                                      ];
                                  }
                                  return (
                                    <div
                                      key={index}
                                      className={cn("flex-1", bgColor)}
                                    />
                                  );
                                })}
                              </div>

                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>
                                  <span className="font-medium">
                                    Projected completion date{" "}
                                  </span>
                                  <span>
                                    {format(completionDate, "MMMM d")}
                                  </span>
                                </span>
                                <span>{daysElapsed} total days elapsed</span>
                              </div>
                            </div>
                            {selectedProject.nextSteps.length > 0 ? (
                              <>
                                <Separator />
                                <div className="space-y-3">
                                  <div className="flex items-center">
                                    <div className="flex items-center gap-3">
                                      <h3 className="text-lg font-medium text-foreground">
                                        Next Steps
                                      </h3>
                                    </div>
                                  </div>
                                  <div className="flex gap-4">
                                    {selectedProject.nextSteps
                                      .slice(0, 3)
                                      .map((step) => {
                                        return (
                                          // <Link
                                          //   to="/projects/73WakrfVbNJ/intake-form"
                                          //   key={step}
                                          //   params={{
                                          //     projectId: selectedProject.id,
                                          //   }}
                                          //   className="flex gap-2 items-center hover:bg-gray-100 rounded px-1.5"
                                          //   aria-label="Fill out Missing Items in Intake Form"
                                          // >
                                          //   <Circle className="w-4 h-4 text-gray-600" />
                                          //   {step}
                                          // </Link>
                                          <Button
                                            key={step}
                                            onClick={() =>
                                              setShowIntakeForm(true)
                                            }
                                            className="flex gap-2 items-center hover:bg-transparent hover:text-inherit rounded px-1.5"
                                            aria-label="Fill out Missing Items in Intake Form"
                                            variant="ghost"
                                          >
                                            <Circle className="w-4 h-4 text-gray-600" />
                                            {step}
                                          </Button>
                                        );
                                      })}
                                    {selectedProject.nextSteps.length === 1 && (
                                      <div className="flex-0" />
                                    )}
                                    {selectedProject.nextSteps.length === 2 && (
                                      <div className="flex-0" />
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : selectedProject.projectTimeline?.length > 0 ? (
                              <>
                                <Separator />
                                <div className="space-y-3 px-2">
                                  <ProjectTimelineSection
                                    timelineItem={
                                      selectedProject.projectTimeline
                                    }
                                  />
                                </div>
                              </>
                            ) : null}
                            <Separator className="" />
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-lg font-medium text-foreground">
                                    Recent Activity
                                  </h3>
                                </div>
                              </div>
                              <ActivityLog items={activityLogData} />
                            </div>
                          </div>
                        </TabsContent>
                      )}

                      {activeTab === TabType.CHAT && (
                        <TabsContent
                          value={TabType.CHAT}
                          className="h-full flex flex-col p-0"
                        >
                          <div className="flex-1 overflow-hidden flex flex-col px-2 pt-2">
                            <div className="rounded-sm overflow-hidden border h-full">
                              <Chatbot />
                            </div>
                          </div>
                        </TabsContent>
                      )}

                      {activeTab === TabType.FILES && (
                        <TabsContent
                          value={TabType.FILES}
                          className="h-full pt-4"
                        >
                          <div className="space-y-3 px-2">
                            <div className="flex flex-col flex-grow min-h-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-foreground">
                                  Files
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => setShowUploadStep(true)}
                                  className="text-sm px-3 py-1.5 bg-muted rounded hover:bg-muted-foreground/20 cursor-pointer"
                                >
                                  + Upload File
                                </button>
                                <Dialog
                                  open={showUploadStep}
                                  onOpenChange={setShowUploadStep}
                                >
                                  <DialogContent
                                    className={cn(
                                      "p-0 w-full max-w-[800px]",
                                      "h-auto",
                                      "max-h-[90vh]",
                                      "overflow-hidden",
                                    )}
                                  >
                                    <FileUploadStep
                                      onDone={async (files) => {
                                        setShowUploadStep(false);
                                      }}
                                      onCancel={() => setShowUploadStep(false)}
                                      transloaditApiKey={transloaditApiKey}
                                      transloaditTemplateId={
                                        transloaditTemplateId
                                      }
                                    />
                                  </DialogContent>
                                </Dialog>
                              </div>

                              <div className="flex-grow min-h-0">
                                <ScrollArea className="h-full">
                                  <div className="pt-3">
                                    <FileTable files={selectedProject.files} />
                                  </div>
                                </ScrollArea>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Tabs>
            </SectionCardContent>
          </>
        )}
      </SectionCard>
    </>
  );
};
