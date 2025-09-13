import { ProjectStatus } from "./types";

export const projectStatusStyles: Record<ProjectStatus, string> = {
  [ProjectStatus.OnTrack]: "bg-green-100 border-green-500",
  [ProjectStatus.AtRisk]: "bg-yellow-100 border-yellow-500",
  [ProjectStatus.Delayed]: "bg-red-100 border-red-500",
  [ProjectStatus.Completed]: "bg-blue-100 border-blue-500",
  [ProjectStatus.Canceled]: "bg-gray-100 border-gray-500",
};
