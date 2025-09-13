import React from "react";
import { Panel } from "react-resizable-panels";
import {
  SectionCard,
  SectionCardContent,
  SectionCardHeader,
  SectionCardTitle,
} from "@/components/ui/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ActiveDisplayType,
  QuestionData,
  PacketSectionData,
  AnswerEntry,
} from "./types";

interface QuestionPanelProps {
  projectId: string;
  showPlanReviewButton: boolean;
  activeDisplay: ActiveDisplayType | null;
  displayedQuestionsData: QuestionData[];
  submittalPacketData: PacketSectionData[];
  answersMap: Record<string, AnswerEntry>;
  updateAnswerForQuestion: (id: string, updates: Partial<AnswerEntry>) => void;
  handleSkip: () => void;
  handleNext: () => void;
  isNextDisabled: boolean;
}

export function QuestionPanel(props: QuestionPanelProps) {
  const {
    projectId,
    showPlanReviewButton,
    activeDisplay,
    displayedQuestionsData,
    submittalPacketData,
    answersMap,
    updateAnswerForQuestion,
    handleSkip,
    handleNext,
    isNextDisabled,
  } = props;

  const currentSectionTitle =
    activeDisplay?.type === "section"
      ? submittalPacketData.find((s) => s.id === activeDisplay.id)?.title
      : activeDisplay?.type === "question"
        ? displayedQuestionsData.find((q) => q.id === activeDisplay.id)
            ?.sectionTitle
        : undefined;

  return (
    <Panel defaultSize={50} minSize={30} className="min-w-0 py-3 pr-3 h-full">
      <SectionCard className="flex flex-col h-full gap-0 shadow-xs">
        <SectionCardHeader className="flex-shrink-0">
          <div className="flex justify-between items-center">
            <SectionCardTitle>
              {currentSectionTitle || "Intake Form"}
            </SectionCardTitle>
            {showPlanReviewButton && (
              <Link
                to="/projects/$projectId/plan-review"
                params={{ projectId }}
                search={{ showParsingModal: true }}
              >
                <Button variant="outline">Go to Plan Review</Button>
              </Link>
            )}
          </div>
        </SectionCardHeader>
        <SectionCardContent className="flex flex-col justify-between px-6 overflow-y-auto flex-grow min-h-0">
          <div className="space-y-6">
            {(() => {
              if (!activeDisplay || displayedQuestionsData.length === 0) {
                return (
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`skeleton-card-${index}`}
                        className="space-y-4 p-6 border rounded-lg shadow-sm bg-card"
                      >
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-6 w-full" />
                        <div className="pt-2 space-y-3">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              if (activeDisplay.type === "question") {
                const currentQuestion = displayedQuestionsData.find(
                  (q) => q.id === activeDisplay.id,
                );
                if (!currentQuestion) return <p>Question not found.</p>;
                const currentAnswerEntry = answersMap[currentQuestion.id] || {
                  answerValue: "",
                  booleanValue: null,
                  otherSpecifyText: "",
                };

                return (
                  <div className="space-y-4 py-4">
                    <p className="font-medium">
                      {currentQuestion.questionText}
                    </p>
                    {currentQuestion.boolean_answer !== null &&
                    currentQuestion.boolean_answer !== undefined ? (
                      <div className="flex gap-2">
                        <Button
                          variant={
                            currentAnswerEntry.booleanValue === true
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            updateAnswerForQuestion(currentQuestion.id, {
                              booleanValue: true,
                              answerValue: "Yes",
                            })
                          }
                          className="w-auto"
                        >
                          Yes
                        </Button>
                        <Button
                          variant={
                            currentAnswerEntry.booleanValue === false
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            updateAnswerForQuestion(currentQuestion.id, {
                              booleanValue: false,
                              answerValue: "No",
                            })
                          }
                          className="w-auto"
                        >
                          No
                        </Button>
                      </div>
                    ) : currentQuestion.placeholder ===
                      "Select all that apply" ? (
                      (() => {
                        const questionText = currentQuestion.questionText;
                        const match = questionText.match(
                          /\(check all that apply: ([^)]+)\)/i,
                        );
                        let options: string[] = [];
                        if (match && match[1]) {
                          options = match[1].split(",").map((opt) =>
                            opt
                              .trim()
                              .replace(/\(specify\)/i, "")
                              .trim(),
                          );
                        }
                        const otherOptionInDefinition = options.find((opt) =>
                          opt.toLowerCase().includes("other"),
                        );
                        const currentSelectedOptions = Array.isArray(
                          currentAnswerEntry.answerValue,
                        )
                          ? currentAnswerEntry.answerValue
                          : [];

                        const handleCheckboxChangeInternal = (
                          option: string,
                          checked: boolean,
                        ) => {
                          const isOther = option
                            .toLowerCase()
                            .includes("other");
                          let newSelectedOptions = [...currentSelectedOptions];
                          let newOtherText =
                            currentAnswerEntry.otherSpecifyText || "";
                          if (checked) {
                            newSelectedOptions = [
                              ...new Set([...newSelectedOptions, option]),
                            ];
                          } else {
                            if (isOther) newOtherText = "";
                            newSelectedOptions = newSelectedOptions.filter(
                              (item) => item !== option,
                            );
                          }
                          updateAnswerForQuestion(currentQuestion.id, {
                            answerValue: newSelectedOptions,
                            otherSpecifyText: newOtherText,
                          });
                        };

                        const handleOtherSpecifyBlurInternal = () => {
                          if (
                            (
                              currentAnswerEntry.otherSpecifyText || ""
                            ).trim() === "" &&
                            otherOptionInDefinition &&
                            currentSelectedOptions.includes(
                              otherOptionInDefinition,
                            )
                          ) {
                            const newSelectedOptions =
                              currentSelectedOptions.filter(
                                (item) => item !== otherOptionInDefinition,
                              );
                            updateAnswerForQuestion(currentQuestion.id, {
                              answerValue: newSelectedOptions,
                            });
                          }
                        };

                        return (
                          <div className="space-y-2">
                            {options.map((option) => (
                              <div
                                key={option}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${currentQuestion.id}-${option.replace(/\W/g, "-")}`}
                                  checked={currentSelectedOptions.includes(
                                    option,
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChangeInternal(
                                      option,
                                      !!checked,
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`${currentQuestion.id}-${option.replace(/\W/g, "-")}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {option}
                                </label>
                              </div>
                            ))}
                            {otherOptionInDefinition &&
                              currentSelectedOptions.includes(
                                otherOptionInDefinition,
                              ) && (
                                <div className="pl-6 pt-1">
                                  <Input
                                    type="text"
                                    placeholder={`Specify for "${otherOptionInDefinition}"`}
                                    value={
                                      currentAnswerEntry.otherSpecifyText || ""
                                    }
                                    onChange={(e) =>
                                      updateAnswerForQuestion(
                                        currentQuestion.id,
                                        {
                                          otherSpecifyText: e.target.value,
                                        },
                                      )
                                    }
                                    onBlur={handleOtherSpecifyBlurInternal}
                                    className="text-sm"
                                  />
                                </div>
                              )}
                          </div>
                        );
                      })()
                    ) : (currentQuestion.id === "Q13" &&
                        currentQuestion.placeholder ===
                          "Choose Owner, Applicant, or Other") ||
                      (currentQuestion.id === "Q14" &&
                        currentQuestion.placeholder ===
                          "Choose Owner, Applicant, or Billing Contact") ||
                      (currentQuestion.id === "Q21" &&
                        currentQuestion.placeholder === null &&
                        currentQuestion.questionText.includes("SB-1214")) ||
                      (currentQuestion.id === "Q63" &&
                        currentQuestion.placeholder ===
                          "Choose Major, Minor, Certificate, or None") ||
                      (currentQuestion.id === "Q71" &&
                        currentQuestion.placeholder ===
                          "Select Yes, No, or N/A") ||
                      (currentQuestion.id === "Q75" &&
                        currentQuestion.placeholder ===
                          "Select Yes, No, or N/A") ? (
                      (() => {
                        let options: string[] = [];
                        if (currentQuestion.id === "Q13")
                          options = ["Owner", "Applicant", "Other"];
                        else if (currentQuestion.id === "Q14")
                          options = ["Owner", "Applicant", "Billing Contact"];
                        else if (currentQuestion.id === "Q21")
                          options = ["Yes, all public", "No, reduced set"];
                        else if (currentQuestion.id === "Q63")
                          options = ["Major", "Minor", "Certificate", "None"];
                        else if (
                          currentQuestion.id === "Q71" ||
                          currentQuestion.id === "Q75"
                        )
                          options = ["Yes", "No", "N/A"];
                        return (
                          <div className="flex flex-wrap gap-2">
                            {options.map((option) => (
                              <Button
                                key={option}
                                variant={
                                  currentAnswerEntry.answerValue === option
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  updateAnswerForQuestion(currentQuestion.id, {
                                    answerValue: option,
                                  })
                                }
                                className={cn(
                                  "w-auto",
                                  currentAnswerEntry.answerValue === option &&
                                    "bg-black text-white hover:bg-gray-700",
                                )}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        );
                      })()
                    ) : (
                      <Input
                        type="text"
                        placeholder={currentQuestion.placeholder ?? ""}
                        value={
                          typeof currentAnswerEntry.answerValue === "string"
                            ? currentAnswerEntry.answerValue
                            : ""
                        }
                        onChange={(e) =>
                          updateAnswerForQuestion(currentQuestion.id, {
                            answerValue: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                );
              } else if (activeDisplay.type === "section") {
                const sectionId = activeDisplay.id;
                const currentSection = submittalPacketData.find(
                  (s) => s.id === sectionId,
                );

                if (!currentSection) {
                  return <p>Section not found.</p>;
                }

                const questionsInSection = displayedQuestionsData.filter((q) =>
                  currentSection.items.some((item) => item.questionId === q.id),
                );

                if (questionsInSection.length === 0) {
                  return (
                    <p>No questions in this section or section not found.</p>
                  );
                }

                return (
                  <div className="-mx-6 divide-y divide-border">
                    {questionsInSection.map((q) => {
                      const currentAnswerEntry = answersMap[q.id] || {
                        answerValue: "",
                        booleanValue: null,
                        otherSpecifyText: "",
                      };
                      return (
                        <div key={q.id} className="px-6 py-8">
                          <p className="font-medium mb-4">{q.questionText}</p>
                          {q.boolean_answer !== null &&
                          q.boolean_answer !== undefined ? (
                            <div className="flex gap-2">
                              <Button
                                variant={
                                  currentAnswerEntry.booleanValue === true
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  updateAnswerForQuestion(q.id, {
                                    booleanValue: true,
                                    answerValue: "Yes",
                                  })
                                }
                              >
                                Yes
                              </Button>
                              <Button
                                variant={
                                  currentAnswerEntry.booleanValue === false
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  updateAnswerForQuestion(q.id, {
                                    booleanValue: false,
                                    answerValue: "No",
                                  })
                                }
                              >
                                No
                              </Button>
                            </div>
                          ) : q.placeholder === "Select all that apply" ? (
                            <p className="text-sm text-muted-foreground">
                              (Checkbox group for: {q.shortName || q.id})
                            </p>
                          ) : (
                            <Input
                              placeholder={q.placeholder ?? "Enter answer..."}
                              value={
                                typeof currentAnswerEntry.answerValue ===
                                "string"
                                  ? currentAnswerEntry.answerValue
                                  : ""
                              }
                              onChange={(e) =>
                                updateAnswerForQuestion(q.id, {
                                  answerValue: e.target.value,
                                })
                              }
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </SectionCardContent>
        <div className="flex-shrink-0 border-t p-4 flex justify-end gap-3">
          <Button variant="outline" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button onClick={handleNext} disabled={isNextDisabled}>
            Next
          </Button>
        </div>
      </SectionCard>
    </Panel>
  );
}
