import { useSettingsStore } from "../../store/settingsStore";
import { saveSetting } from "../../services/settingsService";
import { pickCssFile } from "../../services/fileService";

export function CustomCssPicker() {
  const customCssPath = useSettingsStore((s) => s.customCssPath);
  const setCustomCssPath = useSettingsStore((s) => s.setCustomCssPath);

  async function handlePick() {
    const path = await pickCssFile();
    if (!path) return;
    setCustomCssPath(path);
    await saveSetting("customCssPath", path);
  }

  async function handleClear() {
    setCustomCssPath(null);
    await saveSetting("customCssPath", null);
  }

  return (
    <button
      type="button"
      onClick={customCssPath ? handleClear : handlePick}
      className="rounded px-2 py-1 text-xs hover:bg-white/10"
      title={customCssPath ?? "Load a custom CSS stylesheet"}
    >
      {customCssPath ? "Clear CSS" : "Custom CSS"}
    </button>
  );
}
