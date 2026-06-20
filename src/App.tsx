import { useEffect } from "react";
import { AppShell } from "./components/layout/AppShell";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { CustomCssLoader } from "./components/theme/CustomCssLoader";
import { useSettingsStore } from "./store/settingsStore";
import { loadSettings } from "./services/settingsService";
import { getRecentFiles } from "./services/recentFilesService";
import { registerFileOpenListener } from "./services/fileOpenEventService";

function App() {
  useEffect(() => {
    loadSettings().then((settings) => {
      if (settings.theme) useSettingsStore.getState().setTheme(settings.theme);
      if (settings.customCssPath) useSettingsStore.getState().setCustomCssPath(settings.customCssPath);
      if (settings.rootFolderPath) useSettingsStore.getState().setRootFolderPath(settings.rootFolderPath);
    });
    getRecentFiles().then(useSettingsStore.getState().setRecentFiles);
    return registerFileOpenListener();
  }, []);

  return (
    <ThemeProvider>
      <CustomCssLoader />
      <AppShell />
    </ThemeProvider>
  );
}

export default App;
