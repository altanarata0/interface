import { StateCreator } from "zustand";
import {
  Acknowledgment,
  FileStatus,
  Project,
  ProjectFile,
  Regulation,
} from "@/components/screens/projects-tracker/types";
import type { AppStore } from "./app-store";
import { dummyProjects } from "@/lib/dummy-data/projects";

export type DataSlice = {
  projects: Project[];

  /* selected IDs */
  selectedProjectId: string | null;
  selectedFileId: string | null;
  selectedRegulationId: string | null;

  /* mutators */
  addProject: (p: Project) => void;
  selectProject: (id: string) => void;
  selectFile: (id: string) => void;
  selectRegulation: (id: string) => void;
  setRegulationsForSelectedFile: (newRegulations: Regulation[]) => void;
  updateFileStatus: (fileId: string, status: FileStatus) => void;
  updateRegulationById: (
    regulationId: string,
    newData: Partial<Regulation>,
  ) => void;
  updateProjectAcknowledgments: (
    projectId: string,
    newAcknowledgments: Acknowledgment[],
  ) => void;

  /* look-ups (return the full object or undefined) */
  getProjectById: (id: string) => Project | undefined;
  getFileById: (id: string) => ProjectFile | undefined;
  getRegulationById: (id: string) => Regulation | undefined;
};

const first = dummyProjects[0];

export const createDataSlice: StateCreator<
  AppStore,
  [["zustand/devtools", never]],
  [],
  DataSlice
> = (set, get) => ({
  /* ---------- state ---------- */
  projects: dummyProjects,

  selectedProjectId: first?.id ?? null,
  selectedFileId: first?.files[0]?.id ?? null,
  selectedRegulationId: first?.files[0]?.regulations[0]?.id ?? null,

  /* ---------- actions ---------- */

  addProject: (project) =>
    set((state: DataSlice) => ({ projects: [...state.projects, project] })),

  selectProject: (projectId) => {
    const project = get().projects.find((p: Project) => p.id === projectId);
    if (!project) return;

    const file = project.files[0];
    const reg = file?.regulations[0];

    set({
      selectedProjectId: project.id,
      selectedFileId: file?.id ?? null,
      selectedRegulationId: reg?.id ?? null,
    });
  },

  selectFile: (fileId) => {
    const project = get().projects.find(
      (p: Project) => p.id === get().selectedProjectId,
    );
    const file = project?.files.find((f: ProjectFile) => f.id === fileId);
    if (!file) return;

    const reg = file.regulations[0];

    set({
      selectedFileId: file.id,
      selectedRegulationId: reg?.id ?? null,
    });
  },

  selectRegulation: (regId) => set({ selectedRegulationId: regId }),

  setRegulationsForSelectedFile: (newRegulations) => {
    if (!get().selectedProjectId || !get().selectedFileId) {
      return;
    }

    const newFileId = "32356";

    const newProjects = get().projects.map((project) => {
      if (project.id === get().selectedProjectId) {
        return {
          ...project,
          files: project.files.map((file) => {
            if (file.id === get().selectedFileId) {
              return {
                ...file,
                id: newFileId,
                regulations: newRegulations,
              };
            }
            return file;
          }),
        };
      }
      return project;
    });

    set({
      projects: newProjects,
      selectedRegulationId: newRegulations[0]?.id ?? null,
      selectedFileId: newFileId,
    });
  },

  updateFileStatus: (fileId, status) =>
    set((state) => {
      const { projects, selectedProjectId } = state;
      if (!selectedProjectId) {
        console.warn(
          "No project selected, cannot update file status directly. Consider selecting a project or modifying updateFileStatus to search all projects.",
        );
        return {};
      }

      return {
        projects: projects.map((project) => {
          if (project.id === selectedProjectId) {
            return {
              ...project,
              files: project.files.map((file) => {
                if (file.id === fileId) {
                  return { ...file, status: status };
                }
                return file;
              }),
            };
          }
          return project;
        }),
      };
    }),

  updateRegulationById: (regulationId, newData) =>
    set((state) => {
      const { projects, selectedProjectId, selectedFileId } = state;
      if (!selectedProjectId || !selectedFileId) {
        console.warn("No project or file selected, cannot update regulation.");
        return {};
      }

      return {
        projects: projects.map((project) => {
          if (project.id === selectedProjectId) {
            return {
              ...project,
              files: project.files.map((file) => {
                if (file.id === selectedFileId) {
                  return {
                    ...file,
                    regulations: file.regulations.map((regulation) => {
                      if (regulation.id === regulationId) {
                        return { ...regulation, ...newData };
                      }
                      return regulation;
                    }),
                  };
                }
                return file;
              }),
            };
          }
          return project;
        }),
      };
    }),

  updateProjectAcknowledgments: (projectId, newAcknowledgments) =>
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            reviewAndSubmitDetails: {
              ...(p.reviewAndSubmitDetails ?? {
                proposedWorkSummary: "",
                documents: [],
              }),
              acknowledgments: newAcknowledgments,
            },
          };
        }
        return p;
      }),
    })),

  /* ---------- look-ups ---------- */

  getProjectById: (projectId) => {
    return get().projects.find((p: Project) => p.id === projectId);
  },

  getFileById: (fileId) => {
    for (const project of get().projects) {
      const file = project.files.find((f: ProjectFile) => f.id === fileId);
      if (file) return file;
    }
    return undefined;
  },

  getRegulationById: (regId) => {
    for (const project of get().projects) {
      for (const file of project.files) {
        const reg = file.regulations.find((r: Regulation) => r.id === regId);
        if (reg) return reg;
      }
    }
    return undefined;
  },
});
