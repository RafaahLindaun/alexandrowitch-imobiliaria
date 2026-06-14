"use client";
import { useEffect, useState } from "react";
export default function PageTransition() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.origin !== location.origin) return;
      if (link.href.startsWith("mailto:") || link.href.includes("wa.me") || link.href.includes("waze.com") || link.href.includes("google.com/maps")) return;
      setActive(true); window.setTimeout(() => setActive(false), 850);
    };
    addEventListener("click", click); return () => removeEventListener("click", click);
  }, []);
  return <div className={`pageTransition ${active ? "active" : ""}`} />;
}
