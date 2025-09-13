import { StateCreator } from "zustand";
import { PclMode, Tab } from "@/components/screens/plan-review/types";
import { AppStore } from "./app-store";

export type UiSlice = {
  tab: Tab;
  sidebarWidth: number;
  pclMode: PclMode;
  parseIntakeForm: string[];
  parseBlueprints: string[];
  newRegulations: string[];
  setTab: (t: Tab) => void;
  setPclMode: (m: PclMode) => void;
  addProjectToIntakeFormParseList: (projectId: string) => void;
  removeProjectFromIntakeFormParseList: (projectId: string) => void;
  addProjectToBlueprintsParseList: (projectId: string) => void;
  removeProjectFromBlueprintsParseList: (projectId: string) => void;
  addProjectToNewRegulationsList: (projectId: string) => void;
  removeProjectFromNewRegulationsList: (projectId: string) => void;
};

export const createUiSlice: StateCreator<
  AppStore,
  [["zustand/devtools", never]],
  [],
  UiSlice
> = (set): UiSlice => ({
  tab: "code-review",
  sidebarWidth: 300,
  pclMode: "view",
  parseIntakeForm: [],
  parseBlueprints: [],
  newRegulations: [],
  setTab: (tab) => set({ tab }),
  setPclMode: (mode) => set({ pclMode: mode }),
  addProjectToIntakeFormParseList: (projectId) =>
    set((state) => ({
      parseIntakeForm: state.parseIntakeForm.includes(projectId)
        ? state.parseIntakeForm
        : [...state.parseIntakeForm, projectId],
    })),
  removeProjectFromIntakeFormParseList: (projectId) =>
    set((state) => ({
      parseIntakeForm: state.parseIntakeForm.filter((id) => id !== projectId),
    })),
  addProjectToBlueprintsParseList: (projectId) =>
    set((state) => ({
      parseBlueprints: state.parseBlueprints.includes(projectId)
        ? state.parseBlueprints
        : [...state.parseBlueprints, projectId],
    })),
  removeProjectFromBlueprintsParseList: (projectId) =>
    set((state) => ({
      parseBlueprints: state.parseBlueprints.filter((id) => id !== projectId),
    })),
  addProjectToNewRegulationsList: (projectId) =>
    set((state) => ({
      newRegulations: state.newRegulations.includes(projectId)
        ? state.newRegulations
        : [...state.newRegulations, projectId],
    })),
  removeProjectFromNewRegulationsList: (projectId) =>
    set((state) => ({
      newRegulations: state.newRegulations.filter((id) => id !== projectId),
    })),
});
