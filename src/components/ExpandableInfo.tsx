"use client";

import { useState } from "react";

export default function ExpandableInfo({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`expandBox ${open ? "open" : ""}`}>
      <button className="expandButton" type="button" onClick={() => setOpen((value) => !value)}>
        {title}
        <span>{open ? "−" : "+"}</span>
      </button>
      <div className="expandContent">{children}</div>
    </div>
  );
}
