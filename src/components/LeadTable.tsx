"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client";
import { Lead } from "../types/property";

export default function LeadTable({ leads }: { leads: Lead[] }) {
  const supabase = createClient();
  const [items, setItems] = useState(leads);

  async function toggleLead(id: string, checked: boolean) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, checked } : item))
    );

    await supabase.from("leads").update({ checked }).eq("id", id);
  }

  return (
    <div>
      <div className="leadRow leadHeader">
        <strong></strong>
        <strong>Nome</strong>
        <strong>Telefone</strong>
        <strong>E-mail</strong>
        <strong>Status</strong>
      </div>

      {items.map((lead) => (
        <div className={`leadRow ${lead.checked ? "checked" : ""}`} key={lead.id}>
          <input
            type="checkbox"
            checked={!!lead.checked}
            onChange={(event) => toggleLead(lead.id, event.target.checked)}
          />
          <span>{lead.name}</span>
          <span>{lead.phone || "-"}</span>
          <span>{lead.email || "-"}</span>
          <span>{lead.checked ? "Conferido" : lead.status || "Novo"}</span>
        </div>
      ))}
    </div>
  );
}
