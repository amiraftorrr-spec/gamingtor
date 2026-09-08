"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    const setupAnimations = async () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      if (reducedMotion) {
        ScrollTrigger.refresh();
        return;
      }

    // 🔹 درباره ما
    const animationContext = gsap.context(() => {
      const aboutElems = document.querySelectorAll(
      "#about .aboutimg, #about .contentbx"
      );
      if (aboutElems.length) {
      gsap.set(aboutElems, { opacity: 0, y: 80 });
      gsap.to(aboutElems, {
        scrollTrigger: {
          trigger: "#about",
          start: "top 70%",
          toggleActions: "play none none none",
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.4,
        ease: "power3.out",
      });
      }

    // 🔹 کارت های بازی
      const gameCards = document.querySelectorAll(".custom-card");
      if (gameCards.length) {
      gsap.set(gameCards, { opacity: 0, y: 100, scale: 0.9 });
      gsap.to(gameCards, {
        scrollTrigger: {
          trigger: "#games",
          start: "top 75%",
          toggleActions: "play none none none",
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.4,
        ease: "back.out(1.5)",
      });
      }

      const serverWrapper = document.querySelector(".gameup-inner");
      if (serverWrapper) {
      gsap.set(serverWrapper, { opacity: 0, y: 80 });
      gsap.to(serverWrapper, {
        scrollTrigger: {
          trigger: ".gameup-wrapper",
          start: "top 75%",
          toggleActions: "play none none none",
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      });
      }

      const contactElems = document.querySelectorAll(
      "#contact .contact-content > div"
      );
      if (contactElems.length) {
      gsap.set(contactElems, { opacity: 0, y: 120, rotationX: -90 });
      gsap.to(contactElems, {
        scrollTrigger: {
          trigger: "#contact",
          start: "top 70%",
          toggleActions: "play none none none",
        },
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.5,
        stagger: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
      }

    // 🔹 فوتر
      const footerElems = document.querySelectorAll("footer .ftcontent");
      if (footerElems.length) {
      gsap.set(footerElems, { opacity: 0, y: 60 });
      gsap.to(footerElems, {
        scrollTrigger: {
          trigger: "footer",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
      });
      }
    });

      const refreshAnimations = () => ScrollTrigger.refresh();
      window.addEventListener("load", refreshAnimations, { once: true });
      window.addEventListener("resize", refreshAnimations, { passive: true });
      requestAnimationFrame(refreshAnimations);

      cleanup = () => {
        window.removeEventListener("load", refreshAnimations);
        window.removeEventListener("resize", refreshAnimations);
        animationContext.revert();
      };
    };

    void setupAnimations();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return null;
}
