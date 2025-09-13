import { Details } from "./right-panel/details";
import { Project } from "@/components/screens/projects-tracker/types";

export const RightPanel = ({ project }: { project: Project }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full w-full border-gray-300 border flex flex-col">
      <Details project={project} />
    </div>
  );
};
