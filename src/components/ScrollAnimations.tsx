"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const sectionTargets = [
      "#about .aboutimg",
      "#about .contentbx",
      ".custom-card",
      ".gameup-inner",
      "#contact .contact-content > div",
      "footer .ftcontent",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            entry.target.dispatchEvent(new CustomEvent("animate-in"));
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    sectionTargets.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        const item = element as HTMLElement;
        item.style.opacity = "0";
        item.style.transform = "translateY(60px)";
        if (selector === ".custom-card") {
          item.style.transform = "translateY(80px) scale(0.96)";
        }
        if (selector === "#contact .contact-content > div") {
          item.style.transform = "translateY(120px) rotateX(-12deg)";
        }
        item.addEventListener("animate-in", () => {
          item.style.transition =
            "opacity 420ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1)";
          item.style.opacity = "1";
          item.style.transform = "translateY(0) scale(1) rotateX(0deg)";
        });
        observer.observe(item);
      });
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
