import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { createUiSlice, UiSlice } from "./ui-slice";
import { createDataSlice, DataSlice } from "./data-slice";

export type AppStore = UiSlice & DataSlice;

export const createAppStore = () => {
  return create<AppStore>()(
    devtools(
      (...args) => ({
        ...createUiSlice(...args),
        ...createDataSlice(...args),
      }),
      {
        name: "AppStore",
        enabled: process.env.NODE_ENV !== "production",
      },
    ),
  );
};
