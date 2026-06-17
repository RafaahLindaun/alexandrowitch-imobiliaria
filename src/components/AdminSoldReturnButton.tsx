"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client";

export default function AdminSoldReturnButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function markAvailable() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("properties")
      .update({ status: "Disponível" })
      .eq("id", id);

    if (error) {
      alert("Não foi possível atualizar.");
    } else {
      setDone(true);
    }

    setLoading(false);
  }

  if (done) {
    return <span className="soldReturnedText">Voltará para disponíveis ao atualizar.</span>;
  }

  return (
    <button type="button" className="btnUnsold" onClick={markAvailable} disabled={loading}>
      {loading ? "Salvando..." : "Voltar disponível"}
    </button>
  );
}
