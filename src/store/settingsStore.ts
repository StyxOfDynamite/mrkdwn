import { create } from "zustand";

export type ThemeMode = "light" | "dark";

export interface RecentFile {
  path: string;
  lastOpened: number;
}

interface SettingsState {
  theme: ThemeMode;
  rootFolderPath: string | null;
  recentFiles: RecentFile[];
  setTheme: (theme: ThemeMode) => void;
  setRootFolderPath: (path: string | null) => void;
  setRecentFiles: (files: RecentFile[]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: "light",
  rootFolderPath: null,
  recentFiles: [],
  setTheme: (theme) => set({ theme }),
  setRootFolderPath: (rootFolderPath) => set({ rootFolderPath }),
  setRecentFiles: (recentFiles) => set({ recentFiles }),
}));
