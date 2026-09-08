"use client";

import { useEffect } from "react";

export default function ThemeGlobalSync() {
  useEffect(() => {
    const syncTheme = (explicitTheme?: string) => {
      try {
        const saved = explicitTheme ?? localStorage.getItem("theme");
        const isLight = saved === "light";
        document.body.classList.toggle("light-mode", isLight);
        document.documentElement.classList.toggle("light-mode", isLight);
      } catch {
        // ignore
      }
    };

    syncTheme();

    const handleThemeChange = (e: Event) => {
      const customEv = e as CustomEvent<{ theme?: string }>;
      syncTheme(customEv?.detail?.theme);
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme") syncTheme();
    };

    window.addEventListener("theme-change", handleThemeChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return null;
}
