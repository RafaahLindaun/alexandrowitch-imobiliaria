"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client";

function parseCSV(text: string) {
  const rows = text
    .split(new RegExp("\\r?\\n"))
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) =>
      row.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))
    );

  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => header.toLowerCase());

  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};

    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });

    return {
      name: obj.nome || obj.name || obj.cliente || "Sem nome",
      phone: obj.telefone || obj.whatsapp || obj.numero || obj.phone || "",
      email: obj.email || obj["e-mail"] || "",
      source: "Importação por link",
      status: "Novo",
      checked: false,
    };
  });
}

function normalizeGoogleSheetsUrl(url: string) {
  if (
    url.includes("docs.google.com/spreadsheets") &&
    !url.includes("output=csv")
  ) {
    return url.replace("/edit", "/export?format=csv").replace(/#gid=/, "&gid=");
  }

  return url;
}

export default function LeadImportForm() {
  const supabase = createClient();
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  async function handleImport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Importando leads...");

    try {
      const csvUrl = normalizeGoogleSheetsUrl(url);
      const response = await fetch(csvUrl);

      if (!response.ok) {
        setMessage(
          "Não consegui acessar o link. Use um link público em CSV ou Google Sheets publicado."
        );
        return;
      }

      const text = await response.text();
      const leads = parseCSV(text);

      if (!leads.length) {
        setMessage(
          "Nenhum lead encontrado. A planilha precisa ter cabeçalhos: nome, telefone, email."
        );
        return;
      }

      const { error } = await supabase.from("leads").insert(leads);

      if (error) {
        setMessage("Erro ao salvar leads: " + error.message);
        return;
      }

      setMessage(`${leads.length} leads importados com sucesso.`);
      setUrl("");
    } catch (error) {
      setMessage("Erro na importação: " + (error as Error).message);
    }
  }

  return (
    <form className="formGrid" onSubmit={handleImport}>
      <input
        className="input full"
        placeholder="Cole aqui o link público da planilha CSV ou Google Sheets"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        required
      />

      <button className="btnDark full" type="submit">
        Importar leads
      </button>

      <p className="formHint full">
        A planilha deve ter colunas como: nome, telefone, email. Para Google
        Sheets, deixe o compartilhamento público ou publique como CSV.
      </p>

      {message && <p className="full">{message}</p>}
    </form>
  );
}
