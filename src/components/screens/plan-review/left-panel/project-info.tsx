import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "@/components/screens/projects-tracker/types";

export const ProjectInfo = ({ project }: { project: Project }) => {
  return (
    <ScrollArea className="-mx-4 sm:-mx-6 lg:-mx-8 h-full px-2">
      <div className="w-full align-middle sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold mb-4">Project Specifications</h2>
        <table className="min-w-full ">
          <tbody className="divide-y divide-gray-200">
            {Object.entries(project)
              .filter(([key]) => key !== "id" && key !== "files")
              .map(([key, value]) => (
                <tr key={key}>
                  <td className="py-2 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                    {/* TODO: Low: of shouldn't be capitalized */}
                    {key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600">
                    <p>{value.toString()}</p>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="mt-2 space-y-2">
          <p className="font-bold">Files</p>
          {project.files.map((file) => (
            <button key={file.name} className="text-sm">
              {file.name}
            </button>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};
