import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added Avatar imports
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Added Tooltip imports
import { SearchIcon, BellIcon, ChevronDownIcon } from "lucide-react"; // Added ChevronDownIcon
import { cn } from "@/lib/utils"; // Assuming this path is correct for packages/ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notifications } from "@/components/ui/notifications"; // Added Notifications import
import { Project } from "./screens/projects-tracker/types";

interface TopBarProps {
  project?: Project; // Made project prop optional
  projects?: Project[];
  className?: string;
  onProjectSelect: (projectId: string) => void;
}

// random comment
export function TopBar({
  project,
  projects,
  className,
  onProjectSelect,
}: TopBarProps) {
  const [openCommand, setOpenCommand] = React.useState(false);

  // Sample team members data
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

  React.useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenCommand((o) => !o);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <div
      className={cn(
        "relative flex items-center justify-between border-b bg-white px-6 h-[44px]",
        className,
      )}
    >
      {/* Left Section: Breadcrumbs */}
      <div className="flex-shrink-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {/* TODO: This uses a standard href; for in-app TanStack Router navigation,
                  BreadcrumbLink would need to support 'asChild' with a Router <Link> */}
              {project ? (
                <BreadcrumbLink href="/projects">
                  All Permit Applications
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>All Permit Applications</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {project && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {project &&
                  projects &&
                  projects.length > 0 &&
                  onProjectSelect ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1 rounded-sm px-1 py-0.5 text-sm font-normal text-foreground hover:bg-accent focus:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        <span>{project.address}</span>
                        <ChevronDownIcon className="h-3 w-3 text-muted-foreground" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {projects.map((p) => (
                          <DropdownMenuItem
                            key={p.id}
                            onSelect={() => {
                              if (p.id !== project.id) {
                                onProjectSelect(p.id);
                              }
                            }}
                            disabled={p.id === project.id}
                          >
                            {p.address}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : project ? (
                    <BreadcrumbPage>{project.address}</BreadcrumbPage>
                  ) : null}
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Middle Section: Command Search Trigger */}
      <div className="fixed top-[6px] left-1/2 transform -translate-x-1/2 flex justify-center px-4 z-10">
        <button
          type="button"
          onClick={() => setOpenCommand(true)}
          className={cn(
            "flex h-8 w-full max-w-md items-center gap-2 rounded-md border border-input bg-[#F5F5F5] px-3 py-2 text-sm text-muted-foreground ring-offset-background hover:bg-[#FFFFFF] active:bg-[#EAEAEA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "text-left justify-start",
          )}
        >
          <SearchIcon className="size-4 shrink-0" />
          <span>Search projects, files, or people...</span>
          <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 md:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
        <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
          <div className="p-4">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>Dashboard</CommandItem>
                <CommandItem>Project Settings</CommandItem>
                <CommandItem>My Tasks</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Projects">
                {project && (
                  <CommandItem>Project Alpha (ID: {project.id})</CommandItem>
                )}
                <CommandItem>Project Beta</CommandItem>
                {/* Add more generic project commands or a message if no project context */}
              </CommandGroup>
            </CommandList>
          </div>
        </CommandDialog>
      </div>

      {/* Right Section: Avatars & Notification */}
      <div className="flex flex-shrink-0 items-center gap-4">
        <TooltipProvider delayDuration={0}>
          <div className="flex gap-1">
            {teamMembers.map((member) => (
              <Tooltip key={member.id}>
                <TooltipTrigger asChild>
                  <Avatar className="size-8 border ">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.profession}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
        <Notifications />
      </div>
    </div>
  );
}
