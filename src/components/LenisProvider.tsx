"use client";

import { useEffect } from "react";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    const setupSmoothScroll = async () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const touchDevice = window.matchMedia("(pointer: coarse)").matches;
      const navWithConnection = navigator as Navigator & {
        connection?: { saveData?: boolean };
      };
      const hasLowPowerDevice =
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        navWithConnection.connection?.saveData;

      if (reducedMotion || touchDevice || hasLowPowerDevice) return;

      const init = () => {
        if (disposed) return;

        Promise.all([
          import("@studio-freight/lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]).then(([{ default: Lenis }, { default: gsap }, { default: ScrollTrigger }]) => {
          if (disposed) return;

          gsap.registerPlugin(ScrollTrigger);

          const lenis = new Lenis({
            duration: 1.1,
            smoothWheel: true,
            syncTouch: false,
            autoResize: true,
            easing: (progress: number) =>
              1 - Math.pow(1 - progress, 3),
          } as any);

          const updateScrollTrigger = () => ScrollTrigger.update();
          const refreshScrollTrigger = () => {
            lenis.resize();
            ScrollTrigger.refresh();
          };
          const tickerCallback = (time: number) => {
            lenis.raf(time * 1000);
          };

          lenis.on("scroll", updateScrollTrigger);
          window.addEventListener("load", refreshScrollTrigger, { once: true });
          window.addEventListener("resize", refreshScrollTrigger, {
            passive: true,
          });
          gsap.ticker.add(tickerCallback);
          gsap.ticker.lagSmoothing(500, 33);
          refreshScrollTrigger();

          cleanup = () => {
            window.removeEventListener("load", refreshScrollTrigger);
            window.removeEventListener("resize", refreshScrollTrigger);
            lenis.off("scroll", updateScrollTrigger);
            gsap.ticker.remove(tickerCallback);
            lenis.destroy();
          };
        });
      };

      const schedule =
        "requestIdleCallback" in window
          ? window.requestIdleCallback(init)
          : setTimeout(init, 150);

      return () => {
        if ("cancelIdleCallback" in window) {
          window.cancelIdleCallback(schedule as number);
        } else {
          clearTimeout(schedule as number);
        }
      };
    };

    const stop = setupSmoothScroll();
    return () => {
      disposed = true;
      stop?.then?.((cleanupFn) => cleanupFn?.());
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
