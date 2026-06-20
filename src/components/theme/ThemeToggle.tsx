import { useSettingsStore } from "../../store/settingsStore";

export function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded px-2 py-1 text-xs hover:bg-white/10"
      title="Toggle light/dark theme"
    >
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
