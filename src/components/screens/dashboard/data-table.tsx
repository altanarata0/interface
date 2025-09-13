import * as React from "react";
import { useState, useCallback } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateProjectDialogContent } from "../projects-tracker/all-projects-section/create-project-dialog-content";
import { Project } from "../projects-tracker/types";
import { StarIcon, ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const projectStatusStyles = {
  "On Track": "bg-green-100 border-green-500",
  "At Risk": "bg-yellow-100 border-yellow-500",
  Delayed: "bg-red-100 border-red-500",
  Completed: "bg-blue-100 border-blue-500",
} as const;

interface ProjectsTrackerConfig {
  mapboxAccessToken: string;
  transloaditApiKey: string;
  transloaditTemplateId: string;
}

interface DataTableProps {
  projects: Project[];
  config: ProjectsTrackerConfig;
  addProject: () => void;
}

const statusDisplayMap: Record<string, string> = {
  on_track: "On Track",
  at_risk: "At Risk",
  delayed: "Delayed",
  completed: "Completed",
  canceled: "Canceled",
};

function getDisplayStatus(status?: string) {
  return status ? statusDisplayMap[status] || status : "-";
}

function StatusBadge({ status }: { status?: string }) {
  const displayStatus = getDisplayStatus(status);
  const style =
    (projectStatusStyles as Record<string, string>)[displayStatus] ||
    "border-gray-400 bg-white";
  return (
    <Badge variant="outline" className="text-muted-foreground px-1.5">
      <span
        className={`inline-block w-3 h-3 rounded-full border-1 ${style}`}
        aria-hidden="true"
      />
      {displayStatus}
    </Badge>
  );
}

export function DataTable({ projects, config, addProject }: DataTableProps) {
  const safeProjects = React.useMemo(
    () => projects.filter(Boolean) as NonNullable<Project>[],
    [projects],
  );
  const [data, setData] = React.useState(() => safeProjects);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [activeTab, setActiveTab] = React.useState("ontrack");
  const [starredProjects, setStarredProjects] = useState<Set<string>>(
    new Set(),
  );

  const handleToggleStar = useCallback((projectId: string) => {
    setStarredProjects((prevStarred) => {
      const newStarred = new Set(prevStarred);
      if (newStarred.has(projectId)) {
        newStarred.delete(projectId);
      } else {
        newStarred.add(projectId);
      }
      return newStarred;
    });
  }, []);

  React.useEffect(() => {
    setData(safeProjects);
  }, [safeProjects]);

  const statusMap = {
    ontrack: "On Track",
    atrisk: "At Risk",
    delayed: "Delayed",
    completed: "Completed",
  } as const;

  const filteredData = React.useMemo(() => {
    if (activeTab === "all") return data;
    const mappedStatus = statusMap[activeTab as keyof typeof statusMap];
    return data.filter(
      (project) => getDisplayStatus(project.status) === mappedStatus,
    );
  }, [data, activeTab]);

  const columns: ColumnDef<NonNullable<Project>>[] = [
    {
      accessorKey: "address",
      header: "Project Name",
      cell: ({ row }) => {
        const address = String(row.getValue("address"));
        return (
          <div>
            <span className="font-medium whitespace-normal break-words">
              {address}
            </span>
            <div className="text-sm pt-1 font-medium text-gray-500">
              {row.original.customerName}
            </div>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "lastUpdate",
      header: "Last Update",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.lastUpdate
            ? new Date(row.original.lastUpdate).toLocaleDateString()
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "isStarred",
      header: "Starred",
      cell: ({ row, getValue }) => {
        const projectId = row.original.id;
        const isStarred = getValue();

        const handleStarClick = (event: React.MouseEvent) => {
          event.stopPropagation(); // Prevent row selection when clicking the star
          setData((prevData) =>
            prevData.map((project) =>
              project.id === projectId
                ? { ...project, isStarred: !isStarred }
                : project,
            ),
          );
        };

        return (
          <div onClick={handleStarClick} className="cursor-pointer p-1">
            <StarIcon
              className={cn(
                "w-4 h-4 ml-3 text-muted-foreground transition-colors",
                isStarred
                  ? "fill-yellow-400 text-yellow-600"
                  : "hover:fill-yellow-400/50 hover:text-yellow-600",
              )}
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              variant="destructive"
              onClick={(event) => {
                const projectId = row.original.id;
                event.stopPropagation();
                console.log("Deleting project with ID:", projectId); //might have to handle this
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const statusCounts = React.useMemo(() => {
    return {
      ontrack: data.filter((p) => getDisplayStatus(p.status) === "On Track")
        .length,
      atrisk: data.filter((p) => getDisplayStatus(p.status) === "At Risk")
        .length,
      delayed: data.filter((p) => getDisplayStatus(p.status) === "Delayed")
        .length,
      completed: data.filter((p) => getDisplayStatus(p.status) === "Completed")
        .length,
    };
  }, [data]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="">
      <div className="flex items-center justify-between">
        <label htmlFor="view-selector" className="sr-only">
          View
        </label>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="flex w-fit sm:hidden" size="sm">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ontrack">On Track</SelectItem>
            <SelectItem value="atrisk">At Risk</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 sm:flex">
          <TabsTrigger value="ontrack">
            On Track <Badge variant="secondary">{statusCounts.ontrack}</Badge>
          </TabsTrigger>
          <TabsTrigger value="atrisk">
            At Risk <Badge variant="secondary">{statusCounts.atrisk}</Badge>
          </TabsTrigger>
          <TabsTrigger value="delayed">
            Delayed <Badge variant="secondary">{statusCounts.delayed}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed{" "}
            <Badge variant="secondary">{statusCounts.completed}</Badge>
          </TabsTrigger>
        </TabsList>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="cursor-pointer border"
            >
              + New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[50vw] sm:max-w-[750px] h-fit">
            <CreateProjectDialogContent
              transloaditApiKey={config.transloaditApiKey}
              transloaditTemplateId={config.transloaditTemplateId}
              addProject={addProject}
            />
          </DialogContent>
        </Dialog>
      </div>

      {(["ontrack", "atrisk", "delayed", "completed"] as const).map(
        (status) => (
          <TabsContent
            key={status}
            value={status}
            className="relative flex flex-col gap-4"
          >
            <div className="overflow-x-auto overflow-y-hidden rounded-lg border min-w-0">
              <Table className="w-full">
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <div
                              className={cn(
                                "flex items-center gap-2",
                                header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                              title={
                                header.column.getCanSort()
                                  ? header.column.getNextSortingOrder() ===
                                    "asc"
                                    ? "Sort ascending"
                                    : header.column.getNextSortingOrder() ===
                                        "desc"
                                      ? "Sort descending"
                                      : "Clear sort"
                                  : undefined
                              }
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {header.column.getCanSort() &&
                                ({
                                  asc: <ArrowUp className="ml-2 h-4 w-4" />,
                                  desc: <ArrowDown className="ml-2 h-4 w-4" />,
                                }[header.column.getIsSorted() as string] ?? (
                                  <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                                ))}
                            </div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No projects found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-4">
              <div className="flex w-full items-center gap-8 lg:w-fit">
                <div className="hidden items-center gap-2 lg:flex">
                  <Label
                    htmlFor="rows-per-page"
                    className="text-sm font-medium"
                  >
                    Rows per page
                  </Label>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => table.setPageSize(Number(value))}
                  >
                    <SelectTrigger
                      size="sm"
                      className="w-20"
                      id="rows-per-page"
                    >
                      <SelectValue
                        placeholder={table.getState().pagination.pageSize}
                      />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-fit items-center justify-center text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </div>
                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to first page</span>
                    <IconChevronsLeft />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <IconChevronLeft />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <IconChevronRight />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden size-8 lg:flex"
                    size="icon"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to last page</span>
                    <IconChevronsRight />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        ),
      )}
    </Tabs>
  );
}
