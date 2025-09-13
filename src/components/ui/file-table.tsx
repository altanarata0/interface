import { Badge } from "./badge";

export type FileStatus =
  | "In-Review"
  | "Compliant"
  | "Non-Compliant"
  | "Pending"
  | "Needs Clarification";

enum FileStatusEnum {
  InReview = "In-Review",
  Compliant = "Compliant",
  NonCompliant = "Non-Compliant",
  Pending = "Pending",
  NeedsClarification = "Needs Clarification",
}

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

type Regulation = {
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

export interface ProjectFile {
  id: string;
  name: string;
  url: string;
  type?: string;
  path?: string;
  status: FileStatus;
  regulations: Regulation[];
}

interface FileTableProps {
  files: ProjectFile[];
}

export function FileTable({ files }: FileTableProps) {
  if (!files || files.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
    );
  }

  return (
    <div className="overflow-auto rounded-md border text-sm">
      <table className="min-w-full text-left">
        <thead className="bg-muted border-b">
          <tr className="text-xs text-muted-foreground">
            <th className="px-4 py-2 font-medium">File Name</th>
            <th className="px-4 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.id}
              className="border-b last:border-0 hover:bg-muted/50"
            >
              <td className="px-4 py-2">{file.name}</td>
              <td className="px-4 py-2">
                <Badge
                  variant={
                    file.status === FileStatusEnum.InReview
                      ? "default"
                      : file.status === FileStatusEnum.Compliant
                        ? "secondary"
                        : file.status === FileStatusEnum.NonCompliant
                          ? "destructive"
                          : "outline"
                  }
                >
                  {file.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
