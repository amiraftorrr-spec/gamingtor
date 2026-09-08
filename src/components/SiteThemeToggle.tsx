"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SiteThemeToggleProps {
  showBackHome?: boolean;
  backText?: string;
  showToggle?: boolean;
  className?: string;
}

export default function SiteThemeToggle({
  showBackHome = false,
  backText = "بازگشت به صفحه اصلی",
  showToggle = true,
  className = "",
}: SiteThemeToggleProps) {
  const [isLight, setIsLight] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("theme");
      setIsLight(saved === "light");
    } catch {
      // ignore
    }

    const handleThemeChange = (e: Event) => {
      try {
        const customEv = e as CustomEvent<{ theme?: string }>;
        const nextTheme =
          customEv?.detail?.theme ?? localStorage.getItem("theme");
        const nextLight = nextTheme === "light";
        setIsLight((prev) => (prev !== nextLight ? nextLight : prev));
      } catch {
        // ignore
      }
    };

    window.addEventListener("theme-change", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextState = !isLight;
    setIsLight(nextState);
    try {
      localStorage.setItem("theme", nextState ? "light" : "dark");
      document.body.classList.toggle("light-mode", nextState);
      document.documentElement.classList.toggle("light-mode", nextState);
      window.dispatchEvent(
        new CustomEvent("theme-change", {
          detail: { theme: nextState ? "light" : "dark" },
        })
      );
    } catch {
      // ignore
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`site-theme-nav-bar ${className}`}>
      {showBackHome && (
        <Link href="/" className="site-back-btn">
          <i className="bi bi-arrow-right"></i>
          <span>{backText}</span>
        </Link>
      )}

      {showToggle && (
        <div className="button-borderss theme-switch-container site-toggle-wrap">
          <label
            className="switch"
            htmlFor="site-theme-toggle"
            title={isLight ? "تغییر به تم تاریک" : "تغییر به تم روشن"}
          >
            <input
              id="site-theme-toggle"
              type="checkbox"
              aria-label="تغییر تم تاریک و روشن"
              checked={!isLight}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
            <i className="bi bi-sun-fill off"></i>
            <i className="bi bi-moon-fill on"></i>
          </label>
        </div>
      )}
    </div>
  );
}
