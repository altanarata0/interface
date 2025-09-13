export type Code = {
  jurisdiction: string;
  code: string;
  section: string;
};

export type Severity = "Minor" | "Moderate" | "Critical" | "NA";

export type Status =
  | "In-Review"
  | "Approved"
  | "Revision Needed"
  | "Pending"
  | "Needs Clarification"
  | "Change"
  | "compliant"
  | "non-compliant"
  | "pending";

export type Regulation = {
  id: string;
  isCompliant: boolean;
  regulation: string;
  code: Code;
  status: Status;
  severity: Severity;
  description: string;
  calculations: string;
  nextSteps: string[];
  xfdfString: string;
  title?: string;
  notes?: string;
  assignedTo?: string;
  assignedToName?: string;
};

export enum ProjectStatus {
  OnTrack = "On Track",
  AtRisk = "At Risk",
  Delayed = "Delayed",
  Completed = "Completed",
  Canceled = "Canceled",
}

export enum Step {
  UploadFiles = "Upload Files",
  ReviewViolations = "Review Violations",
  ValidateDocuments = "Validate Documents",
  SubmitApplication = "Submit Application",
  ApplicationReview = "Application Review",
  AddressFeedback = "Address Feedback",
  ApprovalProcess = "Approval Process",
  FeePayment = "Fee Payment",
  PermitIssuance = "Permit Issuance",
  ComplianceMonitoring = "Compliance Monitoring",
  FillMissingItems = "Provide missing items",
}

export enum Phase {
  PreApplication = "Pre-Application",
  Submitted = "Submitted",
  Accepted = "Accepted",
  PlanReview = "Plan Review",
  Corrections = "Corrections",
  Approved = "Approved",
  Issued = "Issued",
}

export interface Progress {
  percentComplete: number;
  phase: Phase;
  completionDate: Date;
  daysElapsed: number;
}

export interface Property {
  // TODO: remove any
  geojson: Record<any, any>;
  parcel: string;
  legalDescription: string;
  streetAddress: string;
  jurisdiction: string;
  zoningDesignation: string;
  lotSize: string;
  buildingArea: string;
  maxFAR: string;
  yearBuilt: number;
  owner: string;
  ownerContact: string;
  propertyManager: string;
  landValue: number;
}

export interface ActivityLogItem {
  title: string;
  message: string;
  author: string;
  date: Date;
}

export type FileStatus =
  | "In-Review"
  | "Compliant"
  | "Non-Compliant"
  | "Pending"
  | "Needs Clarification";

export interface ProjectFile {
  id: string;
  name: string;
  url: string;
  type?: string;
  path?: string;
  status: FileStatus;
  regulations: Regulation[];
}

export interface Project {
  id: string;
  address: string;
  status: ProjectStatus;
  lastUpdate: Date;
  ballInCourt: string;
  apn?: string;
  zoningDistrict?: string;
  existingUse?: string;
  property: Property;
  feature: any;
  activityLog: ActivityLogItem[];
  progress: Progress;
  nextSteps: Step[];
  files: ProjectFile[];
  customerName: string;
  reviewAndSubmitDetails?: ReviewAndSubmitDetails; // Consolidated review and submit data
  projectTimeline: Timeline[];
}

export interface ReviewAndSubmitDetails {
  proposedWorkSummary: string;
  documents: UploadedDocument[];
  fees?: FeeItem[];
  billing?: BillingInformationData;
  acknowledgments?: Acknowledgment[];
}

export interface UploadedDocument {
  id: string;
  title: string;
  status: "✔️" | "Not Required"; // "✔️" indicates present and checked
}

export interface FeeItem {
  id: string;
  type: string;
  amount: number;
  isApplicable: boolean;
}

export interface BillingInformationData {
  cardholderName: string;
  cardType: string;
  last4Digits: string;
  billingAddressLines: string[];
}

export interface Acknowledgment {
  id: string;
  text: string;
  isChecked: boolean;
}

export type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export enum TimelineStatus {
  NotStarted = "Not Started",
  Pending = "Pending",
  Completed = "Completed",
  AskCorrections = "Ask Corrections",
}

export type Timeline = {
  id: string;
  projectId: string;
  name: string;
  status: TimelineStatus;
  createdAt: Date;
  updatedAt: Date;
};

export enum QuestionTemplateType {
  Boolean = "Boolean",
  Input = "Input",
  Checkbox = "Checkbox",
  SelectOne = "Select One",
  TextField = "Text Field",
}

export enum FileStatusEnum {
  InReview = "in_review",
  Compliant = "compliant",
  NonCompliant = "non_compliant",
  Pending = "pending",
  NeedsClarification = "needs_clarification",
  PendingUpload = "pending_upload",
}

export enum QuestionType {
  Boolean = "boolean",
  Input = "input",
  Checkbox = "checkbox",
  SelectOne = "select_one",
  TextField = "text_field",
}

export enum TaskType {
  MissingInfo = "missing_info",
  MissingFile = "missing_file",
  IntakeForm = "intake_form",
}

export enum ActionItemStatus {
  Pending = "pending",
  Completed = "completed",
  Skipped = "skipped",
}

export interface ActionItem {
  id: string;
  projectId: string;
  taskType: TaskType;
  status: ActionItemStatus;
  assignedTo?: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  deletedAt: Date | null;
  isUrgent: boolean;
  dueDate: Date | null;
}

export const TaskTypeLabel: Record<TaskType, string> = {
  [TaskType.MissingInfo]: "Provide missing information",
  [TaskType.MissingFile]: "Provide missing files",
  [TaskType.IntakeForm]: "Complete intake form",
};
