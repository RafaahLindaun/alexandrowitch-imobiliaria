"use client";

import { useEffect } from "react";

export default function GlobalInteractions() {
  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (supportsFinePointer && !reducedMotion) {
      const move = (event: MouseEvent) => {
        document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
      };

      window.addEventListener("mousemove", move);
      return () => window.removeEventListener("mousemove", move);
    }
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const click = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a, button, .propertyCard, .adminPropertyCard, .homeActionCard, .refinedQuickCard") as HTMLElement | null;

      if (!interactive) return;

      const ripple = document.createElement("span");
      ripple.className = "clickRipple";

      const rect = interactive.getBoundingClientRect();
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;

      interactive.appendChild(ripple);

      window.setTimeout(() => ripple.remove(), 620);
    };

    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const items = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".section, .propertyCard, .adminPropertyCard, .homeActionCard, .refinedQuickCard, .propertyGalleryPremium, .propertyInfoPremium"
      )
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("inView");
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((item) => {
      item.classList.add("motionReady");
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return <div className="cursorGlow" aria-hidden="true" />;
}
