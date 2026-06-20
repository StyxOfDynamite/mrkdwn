import { useEffect, type ReactNode } from "react";
import { useSettingsStore } from "../../store/settingsStore";
import { saveSetting } from "../../services/settingsService";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    saveSetting("theme", theme);
  }, [theme]);

  return children;
}
