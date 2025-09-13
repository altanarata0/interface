import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";

import {
  Project,
  Acknowledgment,
  SubmissionStatus,
} from "../projects-tracker/types";

interface SectionData {
  id: string;
  linkTitle: string;
  cardTitle: string;
  content: (props: SectionContentProps) => React.JSX.Element; // Changed to React.JSX.Element
}

interface SectionContentProps {
  acknowledgments: Acknowledgment[];
  handleAcknowledgmentChange: (ackId: string) => void;
  allAcknowledgmentsChecked: boolean;
  handleSubmit: () => void;
  submissionStatus: SubmissionStatus;
  totalFee: number;
}

const SCROLL_THROTTLE_MS = 850;
const ANIMATION_DURATION = 500;

interface ReviewAndSubmitScreenProps {
  project?: Project; // Project can be undefined if not found or loading
  updateProjectAcknowledgments: (
    projectId: string,
    newAcknowledgments: Acknowledgment[],
  ) => void;
}

export function ReviewAndSubmitScreen({
  project,
  updateProjectAcknowledgments,
}: ReviewAndSubmitScreenProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [previousSectionData, setPreviousSectionData] =
    useState<SectionData | null>(null);
  const [currentAnimation, setCurrentAnimation] = useState<{
    outClass: string;
    inClass: string;
  } | null>(null);
  const lastWheelTime = useRef<number>(0);
  const [animationViewportHeight, setAnimationViewportHeight] = useState<
    number | null
  >(null);

  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("idle");

  const [acknowledgments, setAcknowledgments] = useState(
    project?.reviewAndSubmitDetails?.acknowledgments ?? [],
  );

  const allAcknowledgmentsChecked = useMemo(
    () => acknowledgments.every((ack) => ack.isChecked),
    [acknowledgments],
  );

  const totalFee =
    project?.reviewAndSubmitDetails?.fees
      ?.filter((item) => item.isApplicable)
      .reduce((sum, item) => sum + item.amount, 0) ?? 0;

  const handleAcknowledgmentChange = (ackId: string) => {
    const newAcknowledgments = acknowledgments.map((ack) =>
      ack.id === ackId ? { ...ack, isChecked: !ack.isChecked } : ack,
    );
    setAcknowledgments(newAcknowledgments);
    if (project?.id) {
      updateProjectAcknowledgments(project.id, newAcknowledgments);
    }
  };

  const handleAllAcknowledgmentsChange = () => {
    const allChecked = acknowledgments.every((ack) => ack.isChecked);
    setAcknowledgments((prev) =>
      prev.map((ack) => ({ ...ack, isChecked: !allChecked })),
    );
  };

  const handleSubmit = useCallback(async () => {
    if (!allAcknowledgmentsChecked || !project) return;
    setSubmissionStatus("submitting");
    // TODO: Integrate with actual submission logic, potentially updating project status
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API
    const success = Math.random() > 0.1; // 90% success
    setSubmissionStatus(success ? "success" : "error");
    if (success) {
      // Potentially update project status in the store, e.g. project submitted
      // Example: updateProjectStatus(project.id, "Submitted");
    }
  }, [allAcknowledgmentsChecked, project]);

  // Define content for each section
  const applicationOverviewContent = (props: SectionContentProps) => (
    <>
      <CardHeader className="border-b pb-4 [.border-b]:pb-2">
        <CardTitle>Your Application At a Glance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Project Summary</h3>
          <div className="rounded-lg border">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold align-top">
                    Project Address
                  </TableCell>
                  <TableCell className="whitespace-normal break-words max-w-md">
                    {project?.address}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold align-top">
                    Assessor&apos;s Block & Lot (APN)
                  </TableCell>
                  <TableCell className="whitespace-normal break-words max-w-md">
                    {project?.apn}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold align-top">
                    Zoning District
                  </TableCell>
                  <TableCell className="whitespace-normal break-words max-w-md">
                    {project?.zoningDistrict}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold align-top">
                    Existing Use (Units on Lot)
                  </TableCell>
                  <TableCell className="whitespace-normal break-words max-w-md">
                    {project?.existingUse}
                  </TableCell>
                </TableRow>
                <TableRow className="border-b-0">
                  <TableCell className="font-semibold align-top">
                    Proposed Work Summary
                  </TableCell>
                  <TableCell className="whitespace-normal break-words max-w-md">
                    {project?.reviewAndSubmitDetails?.proposedWorkSummary}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Uploaded Documents Checklist
          </h3>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project?.reviewAndSubmitDetails?.documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="flex items-center pl-4">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </TableCell>
                    <TableCell className="whitespace-normal break-words">
                      {doc.title}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-xs"
                        onClick={() => alert(`View: ${doc.title}`)}
                      >
                        [View]
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </>
  );

  const feesAndPaymentContent = (props: SectionContentProps) => (
    <>
      <CardHeader className="border-b pb-4 [.border-b]:pb-2">
        <CardTitle>Fee Summary & Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Fee Breakdown</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">Fee Type</th>
                <th className="text-right py-2 font-medium">Amount (USD)</th>
              </tr>
            </thead>
            <tbody>
              {project?.reviewAndSubmitDetails?.fees?.map((item) => (
                <tr
                  key={item.id}
                  className={cn(
                    !item.isApplicable && "text-gray-400 dark:text-gray-600",
                    "border-b last:border-b-0",
                  )}
                >
                  <td className="py-2">
                    {item.type} {!item.isApplicable && "(N/A)"}
                  </td>
                  <td className="text-right py-2">${item.amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-primary">
                <td className="py-2 font-bold">Total Amount Due Today</td>
                <td className="text-right py-2 font-bold">
                  ${props.totalFee.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 flex justify-between items-center">
            Billing Information
            <Button
              variant="link"
              size="sm"
              className="text-xs p-0 h-auto text-gray-700"
              onClick={() => alert("Edit billing info (not implemented).")}
            >
              Edit
            </Button>
          </h3>
          <div className="text-sm space-y-0.5">
            <p>
              <strong>Cardholder Name:</strong>{" "}
              {project?.reviewAndSubmitDetails?.billing?.cardholderName}
            </p>
            <p>
              <strong>Card Type & Last 4 Digits:</strong>{" "}
              {project?.reviewAndSubmitDetails?.billing?.cardType} ••••{" "}
              {project?.reviewAndSubmitDetails?.billing?.last4Digits}
            </p>
            <div>
              <strong>Billing Address:</strong>
              {project?.reviewAndSubmitDetails?.billing?.billingAddressLines.map(
                (line, i) => (
                  <p key={i} className="ml-4">
                    {line}
                  </p>
                ),
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );

  const acknowledgmentsAndSubmitContent = (props: SectionContentProps) => (
    <>
      <CardHeader className="border-b pb-4 [.border-b]:pb-2">
        <CardTitle>Final Acknowledgments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription>
          Please confirm the following before submitting.
        </CardDescription>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="acknowledgment"
            checked={
              acknowledgments.length > 0 &&
              acknowledgments.every((ack) => ack.isChecked)
            }
            onCheckedChange={handleAllAcknowledgmentsChange}
          />

          <label
            htmlFor="acknowledgment"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I acknowledge that all the information provided is accurate and I
            agree to the terms of service.
          </label>
        </div>
        <div className="text-sm mt-4">
          <Button
            variant="link"
            className="p-0 h-auto text-gray-700"
            onClick={() =>
              alert("View Rescope's Refund Policy (not implemented).")
            }
          >
            Click here to view Rescope&apos;s Refund Policy
          </Button>
        </div>
      </CardContent>
    </>
  );

  const sectionsData: SectionData[] = [
    {
      id: "section-app-overview",
      linkTitle: "Application Overview",
      cardTitle: "Your Application At a Glance", // This will be overridden by content function's CardHeader
      content: applicationOverviewContent,
    },
    {
      id: "section-fees-payment",
      linkTitle: "Fees & Payment",
      cardTitle: "Fee Summary & Payment", // Overridden
      content: feesAndPaymentContent,
    },
    {
      id: "section-ack-submit",
      linkTitle: "Acknowledgments",
      cardTitle: "Final Acknowledgments",
      content: acknowledgmentsAndSubmitContent,
    },
  ];

  const activeSection = sectionsData[activeIndex];
  const sectionContentProps: SectionContentProps = {
    acknowledgments,
    handleAcknowledgmentChange,
    allAcknowledgmentsChecked,
    handleSubmit,
    submissionStatus,
    totalFee,
  };

  const navigateToSection = useCallback(
    (newIndex: number, scrollDirection: "scrollUp" | "scrollDown") => {
      if (
        newIndex < 0 ||
        newIndex >= sectionsData.length ||
        newIndex === activeIndex ||
        currentAnimation ||
        submissionStatus === "submitting"
      ) {
        return;
      }

      setAnimationViewportHeight(500);
      setPreviousSectionData(sectionsData[activeIndex]);

      let animClasses = { outClass: "", inClass: "" };
      if (scrollDirection === "scrollDown") {
        animClasses = {
          outClass: "animate-slideOutToTop",
          inClass: "animate-slideInFromBottom",
        };
      } else {
        // scrollUp
        animClasses = {
          outClass: "animate-slideOutToBottom",
          inClass: "animate-slideInFromTop",
        };
      }
      setCurrentAnimation(animClasses);
      setActiveIndex(newIndex);

      setTimeout(() => {
        setPreviousSectionData(null);
        setCurrentAnimation(null);
        setAnimationViewportHeight(null);
      }, ANIMATION_DURATION);
    },
    [activeIndex, currentAnimation, submissionStatus, sectionsData],
  );

  const handleNavClick = (index: number) => {
    if (
      index === activeIndex ||
      currentAnimation ||
      submissionStatus === "submitting" ||
      submissionStatus === "success"
    )
      return;
    const scrollDirection = index > activeIndex ? "scrollDown" : "scrollUp";
    navigateToSection(index, scrollDirection);
  };

  const handleWheelScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (submissionStatus === "submitting" || submissionStatus === "success") {
      event.preventDefault();
      return;
    }
    const currentTime = Date.now();
    if (currentTime - lastWheelTime.current < SCROLL_THROTTLE_MS) {
      return;
    }
    lastWheelTime.current = currentTime;

    event.preventDefault();

    if (event.deltaY > 0) {
      navigateToSection(activeIndex + 1, "scrollDown");
    } else if (event.deltaY < 0) {
      navigateToSection(activeIndex - 1, "scrollUp");
    }
  };

  // --- Helper function to get dynamic content for the third column ---
  const getThirdColumnContent = () => {
    if (!project) {
      return (
        <>
          <CardHeader className="pb-4 border-b">
            <CardTitle>Loading Project Data...</CardTitle>
            <CardDescription>Please wait or select a project.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <p>No project data available to display details.</p>
          </CardContent>
        </>
      );
    }
    switch (activeIndex) {
      case 0: // Application Overview
        return (
          <>
            <CardHeader className="border-b pb-4 [.border-b]:pb-2">
              <CardTitle>Application Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="p-4 overflow-y-auto text-sm space-y-2">
              <p>
                <strong>Project:</strong> {project.address.split(",")[0]}
              </p>
              <p>
                <strong>Total Documents:</strong>{" "}
                {
                  project.reviewAndSubmitDetails?.documents.filter(
                    (doc) => doc.status === "✔️",
                  ).length
                }{" "}
                marked as completed.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Ensure all details in the main panel are correct before
                proceeding.
              </p>
            </CardContent>
          </>
        );
      case 1: // Fees & Payment
        return (
          <>
            <CardHeader className="border-b pb-4 [.border-b]:pb-2">
              <CardTitle>Fee Summary Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="p-4 overflow-y-auto text-sm space-y-2">
              <p>
                <strong>Total Amount Due:</strong>{" "}
                <span className="font-semibold">${totalFee.toFixed(2)}</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Detailed breakdown is available in the main panel. Billing info
                will be confirmed here.
              </p>
            </CardContent>
          </>
        );
      case 2: // Acknowledgments
        return (
          <>
            <CardHeader className="border-b pb-4 [.border-b]:pb-2">
              <CardTitle>Final Steps</CardTitle>
            </CardHeader>

            <CardContent className="p-4 overflow-y-auto text-sm space-y-2 space-x-6">
              <CardDescription>Ready to submit?</CardDescription>

              <p>
                Please review and check all acknowledgments in the main panel.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Submitting your application is final and will charge your card.
              </p>
            </CardContent>
          </>
        );
      default:
        return (
          <>
            <CardHeader className="border-b pb-4">
              <CardTitle>1. test Additional Info</CardTitle>{" "}
              {/* Your test title */}
              <CardDescription>
                1. TEST Contextual details.
              </CardDescription>{" "}
              {/* Your test description */}
            </CardHeader>
            <CardContent className="p-4 overflow-y-auto text-sm">
              {" "}
              {/* Ensured p-4 */}
              <p>General information will appear herej1fnsdfnodnfenfir.</p>{" "}
              {/* Your test content */}
            </CardContent>
          </>
        );
    }
  };

  if (!project) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center text-center h-full">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Project Not Loaded</h1>
        <p className="text-lg">Please select a project to review and submit.</p>
        {/* Optionally, add a button to navigate to project selection */}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col h-full text-gray-700">
      {submissionStatus === "success" && (
        <Dialog open={true}>
          <DialogContent
            className="max-w-3xl h-auto"
            hideCloseButton
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <span>Application Submitted Successfully!</span>
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <p>Payment of ${totalFee.toFixed(2)} has been processed.</p>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  Your Building Permit submittal will now enter the SF Planning
                  review workflow. You will receive an email at
                  jdoe.mobbin@gmail.com with:
                </p>
                <ul className="list-disc list-inside pl-4">
                  <li>
                    Your official Permit Number (e.g., Permit #B21-123456)
                  </li>
                  <li>A PDF copy of your stamped application</li>
                  <li>
                    Instructions for responding to Planning's 30-day public
                    notification (if additional info is requested)
                  </li>
                </ul>
                <p>
                  You can monitor your project status at any time via your
                  Rescope Dashboard.
                </p>
              </div>
              <p className="text-xs text-muted-foreground pt-4">
                If you have any questions or if you need to make a correction
                after submission, please contact Rescope support at support@.co
                or (628) 726-1100. Remember that once Planning has begun its
                30-day notice period, additional changes may require a re-notice
                fee.
              </p>
            </div>
            <div className="flex justify-end space-x-4 p-6 bg-muted/50 rounded-b-lg">
              <Link to="/projects">
                <Button>View My Projects</Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Page Header - Updated title */}
      <div className="mb-6 flex-shrink-0 text-center md:text-left">
        <h1 className="text-3xl font-bold">Final Review & Submit</h1>
      </div>

      {submissionStatus === "error" && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-900/30 mb-6">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" /> Submission Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 dark:text-red-300">
              There was an issue submitting your application. Please try again.
              If the problem persists, contact support.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-6 flex-grow min-h-0 md:items-start">
        {/* Left Navigation Panel */}
        <Card className="w-full md:w-2/9 flex flex-col pt-4">
          <CardHeader className="border-b [.border-b]:pb-2">
            <CardTitle>Review Sections</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto">
            <div className="space-y-1">
              {sectionsData.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => handleNavClick(index)}
                  disabled={submissionStatus === "submitting"}
                  className={cn(
                    "block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-gray-700",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    activeIndex === index &&
                      !currentAnimation &&
                      "bg-blue-100 font-semibold text-gray-700",
                    activeIndex === index &&
                      currentAnimation &&
                      "bg-blue-50 font-medium text-gray-700",
                  )}
                >
                  {section.linkTitle}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Middle Content Panel - Removed fixed h-[500px], uses min-h-0 */}
        <div className="flex-grow md:w-4/9 min-h-0" onWheel={handleWheelScroll}>
          {/* Animation Viewport: height is dynamic or fixed during animation */}
          <div
            className="relative overflow-hidden w-full"
            style={{
              height:
                animationViewportHeight !== null
                  ? `${animationViewportHeight}px`
                  : "auto",
            }}
          >
            {/* Previous Section Card (animating out) */}
            {previousSectionData && currentAnimation && (
              <Card
                key={`prev-${previousSectionData.id}`}
                className={cn(
                  "absolute top-0 left-0 w-full h-auto flex flex-col pt-4",
                  currentAnimation.outClass,
                )}
              >
                {/* Render previous section content. Ensure it's a function call */}
                {typeof previousSectionData.content === "function" &&
                  previousSectionData.content(sectionContentProps)}
              </Card>
            )}

            {/* Current Section Card (animating in or static) */}
            {activeSection && (
              <Card
                key={activeSection.id}
                className={cn(
                  "w-full h-auto flex flex-col pt-4",
                  previousSectionData && currentAnimation
                    ? `absolute top-0 left-0 w-full ${currentAnimation.inClass}`
                    : "",
                )}
              >
                {/* Render current section content. Ensure it's a function call */}
                {typeof activeSection.content === "function" &&
                  activeSection.content(sectionContentProps)}
              </Card>
            )}
          </div>
        </div>

        {/* Right Panel: Additional Info + Submit Button */}
        <div className="w-full md:w-3/9 flex flex-col space-y-6">
          {/* Dynamic "Additional Info" Panel */}
          <Card
            className="flex-shrink-0 pt-4"
            key={`third-col-content-${activeIndex}`}
          >
            {getThirdColumnContent()}
          </Card>

          {/* New Submit Application Card */}
          <Card className="pt-4">
            <CardHeader className="border-b pb-4 [.border-b]:pb-2">
              <CardTitle>Submit Application</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSubmit}
                disabled={
                  !allAcknowledgmentsChecked ||
                  submissionStatus === "submitting"
                }
                className="w-full text-lg py-3"
                title={
                  !allAcknowledgmentsChecked
                    ? "Please check all acknowledgments to proceed."
                    : `By clicking this button, you authorize Rescope to send your entire packet to SF Planning and charge your card for the fees above. This action cannot be undone—any further edits require contacting support.`
                }
              >
                {submissionStatus === "submitting"
                  ? "Submitting..."
                  : `Submit & Charge $${totalFee.toFixed(2)}`}
              </Button>
              {submissionStatus !== "submitting" && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  By clicking this button, you authorize Rescope to send your
                  entire packet to SF Planning and charge your card for the fees
                  above. This action cannot be undone—any further edits require
                  contacting support.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
