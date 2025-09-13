import {
  FileText,
  ChevronRight,
  ChevronDown,
  List,
  Grid,
  Search,
} from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/providers/app-store-provider";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileItem {
  id: string;
  name: string;
  type: "pdf";
  path?: string;
}

interface FolderItem {
  id: string;
  name: string;
  files: FileItem[];
}

export const FileSystemNav = () => {
  const { selectFile } = useAppStore((state) => state);
  const [viewMode, setViewMode] = useState<"list" | "icons">("icons");
  const [openFolderId, setOpenFolderId] = useState<string | null>(
    "architectural",
  ); // Default open folder
  const [searchQuery, setSearchQuery] = useState("");

  // Create folder structure with files
  const [folders] = useState<FolderItem[]>([
    {
      id: "architectural",
      name: "Architectural",
      files: [
        {
          id: "building-permit",
          name: "permit-center.pdf",
          type: "pdf",
          path: "/blueprint-center.pdf",
        },
        {
          id: "floor-plan",
          name: "Carbon Dioxide - Certificate.pdf",
          type: "pdf",
          path: "/carbondioxide.pdf",
        },
        {
          id: "elevations",
          name: "Request for Address.pdf",
          type: "pdf",
          path: "/requestforaddress.pdf",
        },
        {
          id: "sections",
          name: "Roofing Certification.pdf",
          type: "pdf",
          path: "/roofingcertification.pdf",
        },
        {
          id: "details",
          name: "Smoke and CO2 Alarm.pdf",
          type: "pdf",
          path: "/smokeandco2alarm.pdf",
        },
        {
          id: "interior",
          name: "Interior Elevations.pdf",
          type: "pdf",
          path: "/buildingpermit.pdf",
        },
        {
          id: "reflected-ceiling",
          name: "Reflected Ceiling Plan.pdf",
          type: "pdf",
          path: "/buildingpermit.pdf",
        },
        {
          id: "door-schedule",
          name: "Door & Window Schedule.pdf",
          type: "pdf",
          path: "/buildingpermit.pdf",
        },
        {
          id: "finish-schedule",
          name: "Finish Schedule.pdf",
          type: "pdf",
          path: "/buildingpermit.pdf",
        },
        {
          id: "renderings",
          name: "3D Renderings.pdf",
          type: "pdf",
          path: "/plan-check-letter-rescope.pdf",
        },
      ],
    },
    {
      id: "site",
      name: "Site & Civil",
      files: [
        {
          id: "site-plan",
          name: "Site Plan.pdf",
          type: "pdf",
          path: "/plan-check-letter-rescope.pdf",
        },
      ],
    },
    {
      id: "engineering",
      name: "Engineering",
      files: [
        {
          id: "electrical",
          name: "Electrical Plan.pdf",
          type: "pdf",
          path: "/plan-check-letter-rescope.pdf",
        },
        {
          id: "structural",
          name: "Structural Calculations.pdf",
          type: "pdf",
          path: "/plan-check-letter-rescope.pdf",
        },
      ],
    },
  ]);

  const handleFileClick = useCallback(
    (fileId: string) => {
      selectFile(fileId);
    },
    [selectFile],
  );

  const toggleFolder = (folderId: string) => {
    setOpenFolderId((currentOpenId) =>
      currentOpenId === folderId ? null : folderId,
    );
  };

  const isFolderOpen = (folderId: string) => openFolderId === folderId;

  const filterFiles = (files: FileItem[]) => {
    if (!searchQuery) return files;
    return files.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  return (
    <div
      className="h-full overflow-y-auto"
      style={{
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      <div className="mb-2 border border-gray-300 rounded-md overflow-hidden">
        <div className="bg-gray-100 px-3 py-2 font-medium text-gray-700 border-b border-gray-300">
          Project Information
        </div>
        <div className="p-0">
          <Table className="[&_td]:py-2">
            <TableBody>
              <TableRow>
                <TableCell className="py-1 font-medium border-r border-gray-200">
                  Owner:
                </TableCell>
                <TableCell className="py-1">John Finegan</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-1 font-medium border-r border-gray-200">
                  Address:
                </TableCell>
                <TableCell className="py-1">
                  4300 17th Street, Apt. A<br />
                  San Francisco, CA
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-1 font-medium border-r border-gray-200">
                  Project Address:
                </TableCell>
                <TableCell className="py-1">11th Bennington St.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-1 font-medium border-r border-gray-200">
                  Assessor&apos;s Block/Lot:
                </TableCell>
                <TableCell className="py-1">2626/014A</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-1 font-medium border-r border-gray-200">
                  Zoning District:
                </TableCell>
                <TableCell className="py-1">RH-2/40-X</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-1 font-medium border-r border-gray-200">
                  Special Use District:
                </TableCell>
                <TableCell className="py-1">
                  Bernal Heights Accessory Dwelling Unit
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-1 font-medium border-r border-gray-200">
                  Building Permit Number:
                </TableCell>
                <TableCell className="py-1">
                  2019.1218.9888, 2019.1231.1087 and 2019.1231.1092
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-1 font-medium border-r border-gray-200">
                  Planning Record Number:
                </TableCell>
                <TableCell className="py-1">2019-013808PRJ</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-1 font-medium border-r border-gray-200">
                  Project Manager:
                </TableCell>
                <TableCell className="py-1">
                  Jeff Khorn, Senior Planner
                  <br />
                  jeff.khorn@fourleaf.com
                  <br />
                  (415) 575-6925
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-1 font-medium border-r border-gray-200">
                  Environmental Planner:
                </TableCell>
                <TableCell className="py-1">
                  Kristina Song, Env. Planner
                  <br />
                  kristina.song@fourleaf.com
                  <br />
                  (415) 558-6373
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mb-2 px-3 flex justify-between items-center">
        <span className="font-medium text-gray-700">Project Files</span>

        <div className="flex items-center gap-2">
          {/* Search bar with lighter focus border */}
          <div className="relative w-56">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-sm h-7 border border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-300 focus-visible:ring-offset-0 focus-visible:ring-0"
              style={{ outline: "none" }}
            />
            <Search className="h-4 w-4 absolute left-2.5 top-1.5 text-gray-400" />
          </div>

          {/* View mode toggle */}
          <div className="flex border-gray-300 border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0 rounded-none",
                viewMode === "list" ? "bg-gray-100" : "",
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0 rounded-none",
                viewMode === "icons" ? "bg-gray-100" : "",
              )}
              onClick={() => setViewMode("icons")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        // List View
        <div className="px-2">
          {folders.map((folder) => (
            <div key={folder.id} className="mb-2">
              <div
                className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                onClick={() => toggleFolder(folder.id)}
              >
                {isFolderOpen(folder.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <div className="relative w-4 h-4 flex-shrink-0">
                  <img
                    src={
                      isFolderOpen(folder.id)
                        ? "/open-folder.png"
                        : "/closed-folder.png"
                    }
                    alt="Folder"
                    className="w-full h-full object-contain"
                    width={16}
                    height={16}
                  />
                </div>
                <span className="font-medium">{folder.name}</span>
              </div>

              {isFolderOpen(folder.id) && (
                <div className="ml-6">
                  {filterFiles(folder.files).map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                      onClick={() => handleFileClick(file.id)}
                    >
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Icon View
        <div className="px-2 grid grid-cols-3 gap-2">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="flex flex-col items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleFolder(folder.id)}
            >
              <div className="relative w-12 h-12 mb-1">
                <img
                  src={
                    isFolderOpen(folder.id)
                      ? "/open-folder.png"
                      : "/closed-folder.png"
                  }
                  alt="Folder"
                  className="w-full h-full object-contain"
                  width={48}
                  height={48}
                />
              </div>
              <span className="text-xs text-center font-medium text-gray-700">
                {folder.name}
              </span>
            </div>
          ))}

          {openFolderId &&
            filterFiles(
              folders.find((folder) => folder.id === openFolderId)?.files || [],
            ).map((file) => (
              <div
                key={file.id}
                className="flex flex-col items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() => handleFileClick(file.id)}
              >
                <div className="relative w-12 h-12 mb-1">
                  <img
                    src="/file_gray.png"
                    alt="File"
                    className="w-full h-full object-contain"
                    width={48}
                    height={48}
                  />
                </div>
                <span className="text-xs text-center text-gray-700">
                  {file.name}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
