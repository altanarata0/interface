import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/providers/app-store-provider";
import { Check, X, UserPlus, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Project } from "@/components/screens/projects-tracker/types";
import Chatbot from "@/components/chatbot/index";

type Status = "In-Review" | "Approved" | "Revision Needed";
export const Details = ({ project }: { project: Project }) => {
  const { selectedRegulationId, getRegulationById, updateRegulationById } =
    useAppStore((state) => state);

  const selectedRegulation = useMemo(
    () => getRegulationById(selectedRegulationId ?? ""),
    [selectedRegulationId, getRegulationById],
  );

  const [currentStatus, setCurrentStatus] = useState<Status>(
    (selectedRegulation?.status as Status) || "In-Review",
  );

  const [assignedPerson, setAssignedPerson] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  useEffect(() => {
    setCurrentStatus((selectedRegulation?.status as Status) || "In-Review");
    setAssignedPerson(selectedRegulation?.assignedTo || null);
  }, [selectedRegulation]);

  const teamMembers = [
    {
      id: "1",
      name: "John Doe",
      avatar: "/avatars/1.png",
      initials: "JD",
      profession: "Project Manager",
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "/avatars/2.jpg",
      initials: "JS",
      profession: "Architect",
    },
    {
      id: "3",
      name: "Mike Johnson",
      avatar: "/avatars/3.png",
      initials: "MJ",
      profession: "Building Inspector",
    },
    // {
    //   id: "4",
    //   name: "Sarah Williams",
    //   avatar: "/avatars/04.png",
    //   initials: "SW",
    //   profession: "Permit Expediter",
    // },
  ];

  const handleAssign = (personId: string) => {
    const person = teamMembers.find((member) => member.id === personId);

    if (person) {
      selectedRegulation &&
        updateRegulationById(selectedRegulation.id, {
          assignedTo: personId,
          assignedToName: person.name,
        });

      setAssignedPerson(personId);
      toast.success(`Assigned to ${person.name}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <Check className="w-4 h-4 text-emerald-500" />;
      case "In-Review":
        return <Eye className="w-4 h-4 text-slate-500" />;
      case "Revision Needed":
        return <X className="w-4 h-4 text-rose-500" />;
      default:
        return <Eye className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleStatusUpdate = (status: Status, regulationId: string) => {
    updateRegulationById(regulationId, {
      status: status,
    });

    setCurrentStatus(status);
    toast.success(`Regulation ${status.toLowerCase()}`);
    setStatusDropdownOpen(false);
  };

  // Get the currently assigned person
  const getAssignedPerson = () => {
    if (!assignedPerson) return null;
    return teamMembers.find((member) => member.id === assignedPerson);
  };

  const assignedTo = getAssignedPerson();

  if (!selectedRegulation) return <div></div>;

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-end items-center border-b border-gray-200 py-2 px-2">
        <div className="flex gap-2 w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-sm flex-1"
              >
                {assignedTo ? (
                  <>
                    <Avatar className="h-4 w-4 flex-shrink-0">
                      <AvatarImage src={assignedTo.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {assignedTo.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{assignedTo.name}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 flex-shrink-0 text-slate-500" />
                    <span className="truncate">Assign</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              {teamMembers.map((member) => (
                <DropdownMenuItem
                  key={member.id}
                  onClick={() => handleAssign(member.id)}
                  className="cursor-pointer"
                >
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-[10px]">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  {member.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu
            open={statusDropdownOpen}
            onOpenChange={setStatusDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-sm flex-1"
              >
                {getStatusIcon(currentStatus)}
                <span className="truncate">{currentStatus}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <DropdownMenuItem
                onClick={() =>
                  handleStatusUpdate("In-Review", selectedRegulation.id)
                }
                className="cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-500 mr-2" />
                In-Review
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleStatusUpdate("Approved", selectedRegulation.id)
                }
                className="cursor-pointer"
              >
                <Check className="w-4 h-4 text-sky-500 mr-2" />
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleStatusUpdate("Revision Needed", selectedRegulation.id)
                }
                className="cursor-pointer"
              >
                <X className="w-4 h-4 text-violet-500 mr-2" />
                Revision Needed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            to="/projects/$projectId/review-and-submit"
            params={{ projectId: project.id }}
            className="flex-1"
          >
            <Button variant="default" size="sm" className="h-8 w-full text-sm">
              Next
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-grow p-2">
        <div className="border rounded-sm overflow-hidden h-full">
          <Chatbot />
        </div>
      </div>
      {/* <div className=" space-y-4 text-sm px-2"> */}
      {/*   <div className="rounded-lg border border-gray-300 overflow-hidden"> */}
      {/*     <div className="flex items-center justify-between gap-2 border-b border-gray-300 p-2 bg-[#f8f8f8]"> */}
      {/*       <Link */}
      {/*         to={ */}
      {/*           LINKS.find( */}
      {/*             (link) => */}
      {/*               link.code === selectedRegulation.code.code && */}
      {/*               link.section === selectedRegulation.code.section, */}
      {/*           )?.link || "" */}
      {/*         } */}
      {/*         target="_blank" */}
      {/*         className="flex items-center gap-2" */}
      {/*       > */}
      {/*         <p className="text-sm text-gray-500 font-bold"> */}
      {/*           Building Code {selectedRegulation.code.section} */}
      {/*         </p> */}
      {/*         <ExternalLink className="w-4 h-4 text-gray-500" /> */}
      {/*       </Link> */}
      {/*       <div */}
      {/*         className={cn( */}
      {/*           "flex items-center gap-2 rounded-lg pl-1 pr-2 py-1", */}
      {/*           selectedRegulation.isCompliant */}
      {/*             ? "bg-green-600/20" */}
      {/*             : "bg-red-600/20", */}
      {/*         )} */}
      {/*       > */}
      {/*         {selectedRegulation.isCompliant ? ( */}
      {/*           <img */}
      {/*             src="/pass_circle_logo.png" */}
      {/*             alt="Pass Circle" */}
      {/*             height={18} */}
      {/*             width={18} */}
      {/*           /> */}
      {/*         ) : ( */}
      {/*           <img */}
      {/*             src="/fail_circle_logo.png" */}
      {/*             alt="Fail Circle" */}
      {/*             height={18} */}
      {/*             width={18} */}
      {/*           /> */}
      {/*         )} */}
      {/*         <p */}
      {/*           className={cn( */}
      {/*             "text-xs", */}
      {/*             selectedRegulation.isCompliant */}
      {/*               ? "text-green-700" */}
      {/*               : "text-red-700", */}
      {/*           )} */}
      {/*         > */}
      {/*           {selectedRegulation.isCompliant */}
      {/*             ? "Compliant" */}
      {/*             : selectedRegulation.severity} */}
      {/*         </p> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*     <p className="text-sm details-container text-gray-500 p-2"> */}
      {/*       {selectedRegulation.description} */}
      {/*     </p> */}
      {/*   </div> */}
      {/*   {selectedRegulation.calculations.length > 0 && ( */}
      {/*     <div className="rounded-lg border border-gray-300 overflow-hidden"> */}
      {/*       <div className="bg-[#f8f8f8] p-2 border-b border-gray-300"> */}
      {/*         <p className="text-sm text-gray-500 font-bold">Calculations</p> */}
      {/*       </div> */}
      {/**/}
      {/*       <p className="details-container text-sm text-gray-500 p-2"> */}
      {/*         {selectedRegulation.calculations} */}
      {/*       </p> */}
      {/*     </div> */}
      {/*   )} */}
      {/*   {selectedRegulation.nextSteps.length > 0 && ( */}
      {/*     <div className="rounded-lg border border-gray-300 overflow-hidden"> */}
      {/*       <div className="bg-[#f8f8f8] p-2 border-b border-gray-300"> */}
      {/*         <p className="text-sm text-gray-500 font-bold">Recommendations</p> */}
      {/*       </div> */}
      {/*       <p className="details-container text-sm text-gray-500 p-2"> */}
      {/*         {selectedRegulation.nextSteps[0]} */}
      {/*       </p> */}
      {/*     </div> */}
      {/*   )} */}
    </div>
  );
};
