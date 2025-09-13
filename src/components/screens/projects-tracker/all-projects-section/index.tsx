import * as React from "react";
import { DataTable } from "@/components/ui/data-table";
import { StatsCard } from "@/components/ui/stats-card";
import { ColumnDef } from "@tanstack/react-table";
import { Project } from "@/components/screens/projects-tracker/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateProjectDialogContent } from "./create-project-dialog-content";

interface AllProjectsSectionProps {
  projects: Project[];
  columns: ColumnDef<Project, any>[];
  statsItems: { description: string; title: string }[];
  onRowSelect: (selectedRow: Project | null) => void;
  selectedProject: Project | null;
  transloaditApiKey: string;
  transloaditTemplateId: string;
  addProject: () => void;
}

export const AllProjectsSection: React.FC<AllProjectsSectionProps> = ({
  projects,
  columns,
  statsItems,
  onRowSelect,
  selectedProject,
  transloaditApiKey,
  transloaditTemplateId,
  addProject,
}) => {
  return (
    <div className="w-1/3 max-w-1/3 flex-shrink-0 h-full">
      <div className="p-2 pt-1 pb-2 h-full bg-white rounded-lg shadow overflow-hidden border border-gray-300 flex flex-col">
        <div className="flex justify-between items-center pb-1.5 pt-0.5 mb-2 border-b -mx-2 px-2">
          <h3 className="text-base font-semibold leading-none text-gray-700 pl-1">
            All Projects
          </h3>
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
                transloaditApiKey={transloaditApiKey}
                transloaditTemplateId={transloaditTemplateId}
                addProject={addProject}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex-grow space-y-2 flex flex-col overflow-auto">
          <StatsCard items={statsItems} />
          <DataTable
            columns={columns}
            data={projects}
            filters={{
              query: { placeholder: "Filter addresses...", column: "address" },
              column: { columns: [] },
            }}
            visibility={false}
            onRowSelect={onRowSelect}
            selectedRowId={selectedProject?.id ?? null}
          />
        </div>
      </div>
    </div>
  );
};
