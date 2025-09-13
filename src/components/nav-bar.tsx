import {
  Link,
  linkOptions,
  useRouterState,
  type LinkProps,
} from "@tanstack/react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  FileTextIcon,
  ClipboardCheckIcon,
  UserIcon,
  SettingsIcon,
  FoldersIcon,
  FileSearch2Icon,
  LayoutDashboard,
} from "lucide-react";

type IconType = React.ElementType;

interface Meta {
  id: string;
  label: string;
  icon: IconType;
}

/* -------------------------------------------------- */
/* 1️⃣  Build the router-aware link objects           */
/* -------------------------------------------------- */
//BUG: When id differs, the icon is not highlighted
const baseLinks = linkOptions([
  { to: "/dashboard" },
  { to: "/projects" }, // 0
  // { to: "/projects/$projectId", params: { projectId: "5392" } }, // 1
  {
    to: "/projects/$projectId/intake-form",
    params: { projectId: "DHgZCREVu" },
  }, // 2
  {
    to: "/projects/$projectId/plan-review",
    params: { projectId: "DHgZCREVu" },
  }, // 3
]);

/* -------------------------------------------------- */
/* 2️⃣  Attach UI-only metadata (label, icon, id)      */
/* -------------------------------------------------- */
const meta: Meta[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "allProjects", label: "All Projects", icon: FoldersIcon },
  // {
  //   id: "projectDashboard",
  //   label: "Project Dashboard",
  //   icon: LayoutDashboardIcon,
  // },
  { id: "intakeForm", label: "Intake Form", icon: FileTextIcon },
  { id: "planReview", label: "Plan Review", icon: FileSearch2Icon },
];

/* Combine the two arrays  ──> one object per nav item */
const navItems = baseLinks.map((link, i) => ({
  ...link,
  ...meta[i],
})) as (LinkProps & Meta)[];

/* -------------------------------------------------- */
/* 3️⃣  Helper to know when the dashboard is "active"  */
/*     (covers sub-routes except the two special ones) */
/* -------------------------------------------------- */
function isProjectDashboardActive(pathname: string) {
  const parts = pathname.split("/").filter(Boolean); // ['projects','123', ...]
  if (parts.length < 2 || parts[0] !== "projects") return false;

  // /projects/123  ➜ active
  if (parts.length === 2) return true;

  // /projects/123/<subroute> –> active unless subroute is one we break out
  const sub = parts[2];
  return sub !== "intake-form" && sub !== "plan-review";
}

/* -------------------------------------------------- */
/* 4️⃣  NavBar component                               */
/* -------------------------------------------------- */
export function NavBar() {
  const { location } = useRouterState();
  const currentPath = location.pathname;

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex flex-col items-center gap-4 bg-neutral-900 text-white h-screen w-fit min-w-fit py-2 px-0">
        <div>
          <Link to="/">
            <img
              src="/logos/mark_white.png"
              alt="Rescope Mark"
              className="h-8 w-5 mb-3 ml-3 mr-3" // Adjust size and margin as needed
            />
          </Link>
          {navItems.map((item) => {
            /* Work out our own active flag so only ONE is active */
            const active =
              item.id === "projectDashboard"
                ? isProjectDashboardActive(currentPath)
                : currentPath ===
                  // build the concrete path for comparison
                  item.to?.replace(
                    "$projectId",
                    (item as any).params?.projectId ?? "",
                  );

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    {...item} /* all router props */
                    className={cn(
                      "flex h-10  items-center justify-center text-muted-foreground transition-colors hover:text-white hover:bg-gray-700",
                      active &&
                        "bg-gray-500 text-bg-gray-300 w-full hover:bg-gray-500 hover:text-bg-gray-300",
                    )}
                    activeOptions={{ exact: true }} /* router active calc */
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col w-full items-center gap-2">
          {/* Container for bottom icons */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "cursor-pointer w-full flex h-10  items-center justify-center text-muted-foreground transition-colors hover:text-white hover:bg-gray-700",
                )}
              >
                <SettingsIcon className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Settings
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex h-10 w-full items-center justify-center rounded-none text-muted-foreground transition-colors hover:text-white hover:bg-gray-700 cursor-pointer",
                )}
              >
                <UserIcon className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Account
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );
}
