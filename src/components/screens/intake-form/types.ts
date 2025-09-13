import { SubItem } from "./collapsible-progress-item";
import { QuestionTemplateType } from "../projects-tracker/types";

export interface PacketSectionData {
  id: string;
  title: string;
  percentage: number;
  items: SubItem[];
}

export interface QuestionData {
  id: string;
  sectionTitle: string;
  category: string;
  shortName?: string;
  questionText: string;
  questionType: QuestionTemplateType;
  placeholder?: string | null;
  answer?: string | null;
  boolean_answer?: boolean | null;
}

export type ActiveDisplayType =
  | { type: "question"; id: string }
  | { type: "section"; id: string };

export interface AnswerEntry {
  answerValue: string | string[];
  booleanValue?: boolean | null;
  otherSpecifyText?: string;
}
