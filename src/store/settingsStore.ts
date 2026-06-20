import { create } from "zustand";

export type ThemeMode = "light" | "dark";

export interface RecentFile {
  path: string;
  lastOpened: number;
}

interface SettingsState {
  theme: ThemeMode;
  customCssPath: string | null;
  rootFolderPath: string | null;
  recentFiles: RecentFile[];
  setTheme: (theme: ThemeMode) => void;
  setCustomCssPath: (path: string | null) => void;
  setRootFolderPath: (path: string | null) => void;
  setRecentFiles: (files: RecentFile[]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: "light",
  customCssPath: null,
  rootFolderPath: null,
  recentFiles: [],
  setTheme: (theme) => set({ theme }),
  setCustomCssPath: (customCssPath) => set({ customCssPath }),
  setRootFolderPath: (rootFolderPath) => set({ rootFolderPath }),
  setRecentFiles: (recentFiles) => set({ recentFiles }),
}));
