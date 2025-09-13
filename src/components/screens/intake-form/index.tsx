import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { initialQuestionsData } from "./dummy-data";
import { LoaderCircleIcon } from "lucide-react";
import { SubItem, SubItemStatus } from "./collapsible-progress-item";
import {
  QuestionData,
  PacketSectionData,
  ActiveDisplayType,
  AnswerEntry,
} from "./types";
import { SubmittalPacketPanel } from "./submittal-packet-panel";
import { QuestionPanel } from "./question-panel";

const isQuestionInitiallyAnswered = (question: QuestionData): boolean => {
  if (!question) return false;

  if (
    question.boolean_answer !== null &&
    question.boolean_answer !== undefined
  ) {
    return true;
  }

  // Check for string answer (text input, specific selects, or multi-selects stored as strings)
  if (typeof question.answer === "string" && question.answer.trim() !== "") {
    // Specifically for multi-select "Select all that apply" placeholder
    if (question.placeholder === "Select all that apply") {
      const initialAnswersFromData: string[] = [];
      let initialOtherSpecifyTextValue = "";

      // Determine the actual label for the "Other" option from questionText
      // This helps correctly identify if "Other" is selected among the parsed answers.
      let actualOtherOptionLabelInDefinition: string | undefined;
      const qTextMatch = question.questionText.match(
        /\(check all that apply: ([^)]+)\)/i,
      );
      if (qTextMatch && qTextMatch[1]) {
        const allOptionsInDefinition = qTextMatch[1].split(",").map((opt) =>
          opt
            .trim()
            .replace(/\(specify\)/i, "")
            .trim(),
        );
        actualOtherOptionLabelInDefinition = allOptionsInDefinition.find(
          (opt) => opt.toLowerCase().includes("other"),
        );
      }

      // Parse the 'answer' string which might contain multiple values and "Other: specification"
      question.answer.split(",").forEach((ans) => {
        const trimmedAns = ans.trim();
        if (trimmedAns.toLowerCase().startsWith("other:")) {
          // If the answer string explicitly has "Other: SomeText"
          if (actualOtherOptionLabelInDefinition) {
            // And "Other" is a defined option in the question text
            if (
              !initialAnswersFromData.includes(
                actualOtherOptionLabelInDefinition,
              )
            ) {
              initialAnswersFromData.push(actualOtherOptionLabelInDefinition); // Mark "Other" as selected
            }
          }
          initialOtherSpecifyTextValue = trimmedAns
            .substring("other:".length)
            .trim();
        } else {
          initialAnswersFromData.push(trimmedAns); // Add regular answers
        }
      });

      if (initialAnswersFromData.length === 0) return false; // No options selected at all

      const otherOptionIsSelected =
        actualOtherOptionLabelInDefinition &&
        initialAnswersFromData.includes(actualOtherOptionLabelInDefinition);

      if (otherOptionIsSelected) {
        // If "Other" is selected, its specification text must not be empty.
        return initialOtherSpecifyTextValue.trim() !== "";
      }
      // If "Other" is not selected, but other options are, it's considered answered.
      return true;
    }
    // For non-multi-select questions, any non-empty string answer is considered answered.
    return true;
  }

  // If it's not a boolean question and has no string answer (or empty string answer)
  return false;
};

// Helper function to generate submittal packet data from questions
const generateSubmittalPacketDataFromQuestions = (
  allQuestions: QuestionData[], // Changed from questions
  processedQuestionIds: Set<string>, // New parameter
  isParsingActive: boolean, // New parameter
): PacketSectionData[] => {
  const sectionsMap = new Map<
    string, // sectionTitle (e.g., "General Information")
    {
      id: string;
      items: SubItem[];
      completedCount: number;
      totalQuestionsInSection: number;
      totalCompletedInSection: number;
    }
  >();

  // Group questions by sectionTitle only
  allQuestions.forEach((q) => {
    const sectionTitle = q.sectionTitle;

    if (!sectionsMap.has(sectionTitle)) {
      const sectionId = sectionTitle
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      sectionsMap.set(sectionTitle, {
        id: sectionId,
        totalQuestionsInSection: 0,
        totalCompletedInSection: 0,
        items: [],
        completedCount: 0,
      });
    }
    const currentSection = sectionsMap.get(sectionTitle)!;

    let answered: boolean;
    if (isParsingActive) {
      if (processedQuestionIds.has(q.id)) {
        answered = isQuestionInitiallyAnswered(q); // If processed during parsing, check its actual answer
      } else {
        answered = false; // If not yet processed during parsing, it's pending
      }
    } else {
      answered = isQuestionInitiallyAnswered(q); // If not parsing, use actual answer
    }

    currentSection.items.push({
      name: q.shortName || q.questionText,
      status: answered ? "completed" : "pending",
      questionId: q.id,
    });

    currentSection.totalQuestionsInSection++;
    if (answered) {
      currentSection.completedCount++;
      currentSection.totalCompletedInSection++;
    }
  });

  // Second pass: Transform the map into the PacketSectionData[] structure
  return Array.from(sectionsMap.entries()).map(
    ([sectionTitle, sectionData]) => {
      const sectionPercentage =
        sectionData.totalQuestionsInSection > 0
          ? Number(
              (
                (sectionData.totalCompletedInSection /
                  sectionData.totalQuestionsInSection) *
                100
              ).toFixed(0),
            )
          : 0;

      return {
        id: sectionData.id,
        title: sectionTitle,
        percentage: sectionPercentage,
        items: sectionData.items,
      };
    },
  );
};

interface IntakeFormScreenProps {
  showParsingModal?: boolean; // Prop to control modal visibility
  projectId: string;
  showPlanReviewButton: boolean;
}

export function IntakeFormScreen(props: IntakeFormScreenProps) {
  const { projectId, showParsingModal } = props;
  const [isParsingModalOpen, setIsParsingModalOpen] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [currentParsingChunk, setCurrentParsingChunk] = useState(0);

  // Full dataset from import, aliased for clarity within this component
  const allQuestionsFromSource = initialQuestionsData;

  const [displayedQuestionsData, setDisplayedQuestionsData] = useState<
    QuestionData[]
  >(() => (showParsingModal ? [] : allQuestionsFromSource));

  // State for what to display in the middle panel
  const [activeDisplay, setActiveDisplay] = useState<ActiveDisplayType | null>(
    null,
  );

  // State to store all answers, keyed by questionId
  const [answersMap, setAnswersMap] = useState<Record<string, AnswerEntry>>({});

  // State to track which section's question list is expanded in the nav panel
  const [navExpandedSectionId, setNavExpandedSectionId] = useState<
    string | null
  >(null);

  const [submittalPacketData, setSubmittalPacketData] = useState<
    PacketSectionData[]
  >([]);

  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [isNavStructureReady, setIsNavStructureReady] = useState(false);

  // Effect to initialize/update answersMap based on displayedQuestionsData
  useEffect(() => {
    const newAnswers: Record<string, AnswerEntry> = {};
    displayedQuestionsData.forEach((q) => {
      let answerValue: string | string[] = "";
      let booleanValue: boolean | null = null;
      let otherSpecifyText = "";

      if (q.boolean_answer !== null && q.boolean_answer !== undefined) {
        booleanValue = q.boolean_answer;
        answerValue = q.boolean_answer ? "Yes" : "No";
      } else if (q.placeholder === "Select all that apply") {
        const parsedAnswersFromInitial: string[] = [];
        if (q.answer && typeof q.answer === "string") {
          let actualOtherOptionLabel: string | undefined;
          const qTextMatch = q.questionText.match(
            /\(check all that apply: ([^)]+)\)/i,
          );
          if (qTextMatch && qTextMatch[1]) {
            const allOptions = qTextMatch[1].split(",").map((opt) =>
              opt
                .trim()
                .replace(/\(specify\)/i, "")
                .trim(),
            );
            actualOtherOptionLabel = allOptions.find((opt) =>
              opt.toLowerCase().includes("other"),
            );
          }

          q.answer.split(",").forEach((ans) => {
            const trimmedAns = ans.trim();
            if (trimmedAns.toLowerCase().startsWith("other:")) {
              if (
                actualOtherOptionLabel &&
                !parsedAnswersFromInitial.includes(actualOtherOptionLabel)
              ) {
                parsedAnswersFromInitial.push(actualOtherOptionLabel);
              }
              otherSpecifyText = trimmedAns.substring("other:".length).trim();
            } else {
              parsedAnswersFromInitial.push(trimmedAns);
            }
          });
          answerValue = [...new Set(parsedAnswersFromInitial)];
        } else {
          answerValue = []; // Default to empty array if no answer string
        }
      } else if (q.answer !== null && q.answer !== undefined) {
        answerValue = q.answer;
      }
      newAnswers[q.id] = { answerValue, booleanValue, otherSpecifyText };
    });
    setAnswersMap(newAnswers);
  }, [displayedQuestionsData]);

  // Effect to initialize/update submittalPacketData based on displayedQuestionsData
  useEffect(() => {
    const processedIds = new Set(displayedQuestionsData.map((q) => q.id));
    const newPacketData = generateSubmittalPacketDataFromQuestions(
      allQuestionsFromSource,
      processedIds,
      showParsingModal ?? false, // Ensure boolean is passed
    );
    setSubmittalPacketData(newPacketData);

    if (showParsingModal) {
      if (newPacketData.length > 0 && !isNavStructureReady) {
        setIsNavStructureReady(true);
      }
      // If newPacketData is empty (e.g. allQuestionsFromSource is empty),
      // isNavStructureReady remains false, and skeleton (if shown) will persist.
    } else {
      // Not parsing, nav structure readiness depends on data existence
      setIsNavStructureReady(newPacketData.length > 0);
    }
  }, [
    displayedQuestionsData,
    showParsingModal,
    allQuestionsFromSource,
    isNavStructureReady,
  ]);

  // Effect to initialize/update activeDisplay
  const initialDefaultSet = React.useRef(false);

  useEffect(() => {
    // Reset the flag if the parsing modal is shown, indicating a fresh "initial load" scenario
    if (showParsingModal) {
      initialDefaultSet.current = false;
    }
  }, [showParsingModal]);

  useEffect(() => {
    if (displayedQuestionsData.length === 0) {
      setActiveDisplay(null);
      // If all data disappears during parsing, allow default logic to re-run if data reappears.
      if (showParsingModal) {
        initialDefaultSet.current = false;
      }
      return;
    }

    const firstQuestionId = displayedQuestionsData[0]?.id;
    const firstSectionId = submittalPacketData[0]?.id;

    const currentActiveDisplayIsValid =
      activeDisplay &&
      ((activeDisplay.type === "question" &&
        displayedQuestionsData.some((q) => q.id === activeDisplay.id)) ||
        (activeDisplay.type === "section" &&
          submittalPacketData.some((s) => s.id === activeDisplay.id)));

    if (!initialDefaultSet.current) {
      if (firstSectionId) {
        setActiveDisplay({
          type: "section",
          id: firstSectionId,
        });
        initialDefaultSet.current = true; // Preferred default is set
      } else if (firstQuestionId) {
        // Fallback to first question if section not yet available.
        // Do not set initialDefaultSet.current = true here, to allow upgrade later.
        setActiveDisplay({ type: "question", id: firstQuestionId });
      } else {
        // This case should be rare if displayedQuestionsData.length > 0
        setActiveDisplay(null);
      }
    } else if (!currentActiveDisplayIsValid) {
      // If a default was established, but the current display is no longer valid
      // (e.g., user navigated, then the item was removed by data changes),
      // reset to a sensible new default.
      if (firstSectionId) {
        setActiveDisplay({
          type: "section",
          id: firstSectionId,
        });
      } else if (firstQuestionId) {
        setActiveDisplay({ type: "question", id: firstQuestionId });
      } else {
        setActiveDisplay(null);
      }
    }
    // If initialDefaultSet.current is true AND currentActiveDisplayIsValid is true,
    // it implies the user has likely navigated, or the initial default is stable.
    // In this case, we do nothing to preserve the current activeDisplay.
  }, [displayedQuestionsData, submittalPacketData, showParsingModal]);
  // Note: `activeDisplay` is intentionally NOT in the dependency array here.

  // Effect to initialize/update openItemId
  useEffect(() => {
    if (submittalPacketData.length > 0) {
      const isOpenItemValid =
        openItemId && submittalPacketData.some((s) => s.id === openItemId);
      if (!isOpenItemValid) {
        setOpenItemId(submittalPacketData[0]?.id ?? null);
      }
    } else {
      setOpenItemId(null);
    }
  }, [submittalPacketData, openItemId]);

  const isQuestionAnswered = useCallback(
    (
      question: QuestionData,
      answer: string | string[],
      otherText: string,
    ): boolean => {
      if (!question) return false;
      if (
        question.boolean_answer !== null &&
        question.boolean_answer !== undefined
      ) {
        return answer === "Yes" || answer === "No";
      } else if (question.placeholder === "Select all that apply") {
        const answerArray = Array.isArray(answer) ? answer : [];
        if (answerArray.length === 0) return false;
        const otherOptionSelected = answerArray.some(
          (a) => typeof a === "string" && a.toLowerCase().includes("other"),
        );
        if (otherOptionSelected) {
          return otherText.trim() !== "";
        }
        return true;
      } else if (typeof answer === "string") {
        return answer.trim() !== "";
      } else if (Array.isArray(answer)) {
        // Should not happen for non-multi-select
        return answer.length > 0;
      }
      return false;
    },
    [],
  );

  useEffect(() => {
    if (showParsingModal) {
      setIsParsingModalOpen(true);
      setParsingProgress(0);
      setCurrentParsingChunk(0);
      setDisplayedQuestionsData([]); // Start with no "processed" questions
      setIsNavStructureReady(false); // Reset nav structure readiness

      const totalChunks = 12;
      const intervalDuration = 7000 / totalChunks; // Distribute total time over chunks
      let currentChunkNumInInterval = 0; // Local var for interval logic

      const progressInterval = setInterval(() => {
        currentChunkNumInInterval++;
        if (currentChunkNumInInterval > totalChunks) {
          clearInterval(progressInterval);
          // Final update to ensure all questions are processed with their actual answers
          setDisplayedQuestionsData(allQuestionsFromSource);
          setParsingProgress(100);
          setCurrentParsingChunk(totalChunks);
          return;
        }

        setCurrentParsingChunk(currentChunkNumInInterval);
        const newProgress = Math.round(
          (currentChunkNumInInterval / totalChunks) * 100,
        );
        setParsingProgress(newProgress);

        const questionsToShowCount = Math.ceil(
          (currentChunkNumInInterval / totalChunks) *
            allQuestionsFromSource.length,
        );
        // These are the questions whose answers are considered "processed"
        setDisplayedQuestionsData(
          allQuestionsFromSource.slice(0, questionsToShowCount),
        );
      }, intervalDuration);

      const modalCloseTimeout = setTimeout(
        () => {
          setIsParsingModalOpen(false);
          clearInterval(progressInterval); // Ensure interval is cleared
          // Ensure all data is loaded and processed with actual answers
          setDisplayedQuestionsData(allQuestionsFromSource);
          setParsingProgress(100); // Ensure progress is 100
          setCurrentParsingChunk(totalChunks); // Ensure chunk count is max
        },
        7000 + intervalDuration + 100,
      ); // Add a buffer for the last interval and state updates

      return () => {
        clearInterval(progressInterval);
        clearTimeout(modalCloseTimeout);
      };
    } else {
      // Not showing parsing modal, load all data immediately
      setDisplayedQuestionsData(allQuestionsFromSource);
      setIsParsingModalOpen(false);
    }
  }, [showParsingModal, allQuestionsFromSource]);

  useEffect(() => {
    if (!activeDisplay || activeDisplay.type !== "question") return;
    const currentQuestion = displayedQuestionsData.find(
      (q) => q.id === activeDisplay.id,
    );
    if (!currentQuestion) return;

    const currentAnswerEntry = answersMap[currentQuestion.id];
    if (!currentAnswerEntry) return;

    const answered = isQuestionAnswered(
      currentQuestion,
      currentAnswerEntry.answerValue,
      currentAnswerEntry.otherSpecifyText || "",
    );

    setSubmittalPacketData((prevData) => {
      let sectionFound = false;
      const newData = prevData.map((section) => {
        let questionFoundInSection = false;
        const newSectionItems = section.items.map((item) => {
          if (item.questionId === currentQuestion.id) {
            questionFoundInSection = true;
            sectionFound = true;
            return {
              ...item,
              status: answered
                ? ("completed" as SubItemStatus)
                : ("pending" as SubItemStatus),
            };
          }
          return item;
        });

        if (questionFoundInSection) {
          const totalQuestionsInSection = newSectionItems.length;
          const totalCompletedInSection = newSectionItems.filter(
            (i) => i.status === "completed",
          ).length;
          const sectionPercentage =
            totalQuestionsInSection > 0
              ? Number(
                  (
                    (totalCompletedInSection / totalQuestionsInSection) *
                    100
                  ).toFixed(0),
                )
              : 0;
          return {
            ...section,
            items: newSectionItems,
            percentage: sectionPercentage,
          };
        }
        return section;
      });

      if (!sectionFound) {
        console.warn(
          `Question ID ${currentQuestion.id} not found in submittal packet data.`,
        );
        return prevData;
      }
      return newData;
    });
  }, [answersMap, activeDisplay, isQuestionAnswered, displayedQuestionsData]);

  const handleTogglePacketItem = useCallback(
    (itemId: string, open: boolean) => {
      setOpenItemId((prevOpenId) => {
        const newOpenId = open ? itemId : null;
        if (open && itemId !== prevOpenId) {
          // If a new section is being opened
          const openedSection = submittalPacketData.find(
            (s) => s.id === newOpenId,
          );
          if (openedSection && openedSection.items.length > 0) {
            setActiveDisplay({ type: "section", id: openedSection.id });
            setNavExpandedSectionId(openedSection.id); // Also expand it in nav
          }
        }
        return newOpenId;
      });
    },
    [submittalPacketData],
  );

  const handleQuestionSelect = useCallback(
    (questionId: string) => {
      setActiveDisplay({ type: "question", id: questionId });
      const parentSection = submittalPacketData.find((section) =>
        section.items.some((item) => item.questionId === questionId),
      );
      if (parentSection && openItemId !== parentSection.id) {
        setOpenItemId(parentSection.id);
      }
      // Also ensure the parent section in Nav is expanded
      if (parentSection) {
        setNavExpandedSectionId(parentSection.id);
      }
    },
    [submittalPacketData, openItemId, setNavExpandedSectionId],
  );

  const handleSectionSelect = useCallback(
    (sectionId: string) => {
      setActiveDisplay({ type: "section", id: sectionId });
      const section = submittalPacketData.find((s) => s.id === sectionId);
      if (section && openItemId !== section.id) {
        setOpenItemId(section.id);
      }
      // When title is clicked, always ensure it's expanded in nav
      setNavExpandedSectionId(sectionId);
    },
    [submittalPacketData, openItemId, setNavExpandedSectionId],
  );

  // New handler for chevron clicks in nav
  const handleToggleNavExpansion = useCallback(
    (sectionId: string) => {
      setNavExpandedSectionId((prevId) =>
        prevId === sectionId ? null : sectionId,
      );
    },
    [setNavExpandedSectionId],
  );

  // Effect to synchronize navExpandedSectionId with activeDisplay
  useEffect(() => {
    if (!activeDisplay) {
      return;
    }

    let targetParentSectionId: string | null = null;

    if (activeDisplay.type === "question") {
      const questionId = activeDisplay.id;
      // Find the parent section for the active question
      const foundSection = submittalPacketData.find((section) =>
        section.items.some((item) => item.questionId === questionId),
      );
      if (foundSection) {
        targetParentSectionId = foundSection.id;
      }
    } else if (activeDisplay.type === "section") {
      targetParentSectionId = activeDisplay.id;
    }

    // Update openItemId (main section expansion) if needed
    if (targetParentSectionId && openItemId !== targetParentSectionId) {
      setOpenItemId(targetParentSectionId);
    }

    // Update navExpandedSectionId (section question list expansion) if needed
    if (
      targetParentSectionId &&
      navExpandedSectionId !== targetParentSectionId
    ) {
      setNavExpandedSectionId(targetParentSectionId);
    } else if (!targetParentSectionId && navExpandedSectionId) {
      // If activeDisplay doesn't map to a section (e.g., it became null or an invalid ID)
      // and a section is still marked as expanded in nav, collapse it.
      setNavExpandedSectionId(null);
    }
  }, [activeDisplay, submittalPacketData]);

  const handleNext = () => {
    if (activeDisplay?.type === "question") {
      const currentIndex = displayedQuestionsData.findIndex(
        (q) => q.id === activeDisplay.id,
      );
      if (currentIndex < displayedQuestionsData.length - 1) {
        const nextQuestion = displayedQuestionsData[currentIndex + 1];
        setActiveDisplay({ type: "question", id: nextQuestion.id });
        // Parent section expansion is handled by useEffect
      } else {
        console.log("End of questions");
      }
    } else if (activeDisplay?.type === "section") {
      const currentSectionIndex = submittalPacketData.findIndex(
        (section) => section.id === activeDisplay.id,
      );

      if (
        currentSectionIndex !== -1 &&
        currentSectionIndex < submittalPacketData.length - 1
      ) {
        const nextSection = submittalPacketData[currentSectionIndex + 1];
        setActiveDisplay({ type: "section", id: nextSection.id });

        // Ensure the next section is open
        if (openItemId !== nextSection.id) {
          setOpenItemId(nextSection.id);
        }
      } else {
        console.log("End of sections");
      }
    }
  };

  const handleSkip = () => {
    // Skip behaves like Next for now
    handleNext();
  };

  // Generic handler to update answersMap for any question
  const updateAnswerForQuestion = (
    questionId: string,
    newEntry: Partial<AnswerEntry>,
  ) => {
    setAnswersMap((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {
          answerValue: "",
          booleanValue: null,
          otherSpecifyText: "",
        }), // Ensure base object exists
        ...newEntry,
      },
    }));
  };

  // Determine if the "Next" button should be disabled
  let isNextDisabled = true; // Default to disabled
  if (activeDisplay && displayedQuestionsData.length > 0) {
    if (activeDisplay.type === "question") {
      const currentQuestion = displayedQuestionsData.find(
        (q) => q.id === activeDisplay.id,
      );
      if (currentQuestion) {
        const currentAnswerEntry = answersMap[currentQuestion.id] || {
          answerValue: "",
          booleanValue: null,
          otherSpecifyText: "",
        };
        isNextDisabled = !isQuestionAnswered(
          currentQuestion,
          currentAnswerEntry.answerValue,
          currentAnswerEntry.otherSpecifyText || "",
        );
      }
    } else if (activeDisplay.type === "section") {
      const currentSection = submittalPacketData.find(
        (section) => section.id === activeDisplay.id,
      );
      if (currentSection) {
        isNextDisabled = currentSection.percentage < 100;
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      {isParsingModalOpen && (
        <Dialog
          open={isParsingModalOpen}
          onOpenChange={setIsParsingModalOpen}
          modal={true}
        >
          <DialogContent
            className="max-w-[450px] h-fit"
            hideCloseButton
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Processing</DialogTitle>
            </DialogHeader>
            <div className="py-6 px-6 space-y-4">
              <div className="relative mx-auto h-32 w-32">
                <LoaderCircleIcon className="animate-spin stroke-1 w-full h-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-medium">{parsingProgress}%</p>
                </div>
              </div>
              <p className="mt-6 text-center text-lg font-medium">
                Parsing intake form...
              </p>
              <Progress value={parsingProgress} className="w-full" />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <PanelGroup direction="horizontal" className="flex-1 h-full">
        <SubmittalPacketPanel
          showParsingModal={showParsingModal}
          isNavStructureReady={isNavStructureReady}
          submittalPacketData={submittalPacketData}
          openItemId={openItemId}
          onTogglePacketItem={handleTogglePacketItem}
          onQuestionSelect={handleQuestionSelect}
          onSectionSelect={handleSectionSelect}
          activeQuestionId={
            activeDisplay?.type === "question" ? activeDisplay.id : undefined
          }
        />
        <PanelResizeHandle className="w-1 rounded-md cursor-col-resize opacity-0 hover:opacity-100 bg-gray-400 active:bg-muted-foreground transition-opacity duration-150" />
        <QuestionPanel
          projectId={projectId}
          showPlanReviewButton={props.showPlanReviewButton}
          activeDisplay={activeDisplay}
          displayedQuestionsData={displayedQuestionsData}
          submittalPacketData={submittalPacketData}
          answersMap={answersMap}
          updateAnswerForQuestion={updateAnswerForQuestion}
          handleSkip={handleSkip}
          handleNext={handleNext}
          isNextDisabled={isNextDisabled}
        />
      </PanelGroup>
    </div>
  );
}
