import { useEffect, useState } from "react";
import { useSettingsStore } from "../../store/settingsStore";
import { readFile } from "../../services/fileService";

const STYLE_ELEMENT_ID = "mrkdwn-custom-css";

export function useCustomCss(): string {
  const customCssPath = useSettingsStore((s) => s.customCssPath);
  const [css, setCss] = useState("");

  useEffect(() => {
    if (!customCssPath) {
      setCss("");
      return;
    }
    readFile(customCssPath).then(setCss).catch(() => setCss(""));
  }, [customCssPath]);

  return css;
}

export function CustomCssLoader() {
  const css = useCustomCss();

  useEffect(() => {
    let styleEl = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ELEMENT_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
  }, [css]);

  return null;
}
