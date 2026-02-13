import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimations() {
  useEffect(() => {
    // 🔹 درباره ما
    const aboutElems = document.querySelectorAll("#about .aboutimg, #about .contentbx");
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

    // 🔹 کارت های بازی
    const gameCards = document.querySelectorAll(".custom-card");
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

    const contactElems = document.querySelectorAll("#contact .contact-content > div");
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

    // 🔹 فوتر
    const footerElems = document.querySelectorAll("footer .ftcontent");
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
  }, []);

  return null;
}
