"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewPropertyForm() {
  const router = useRouter();
  const supabase = createClient();
  const [message, setMessage] = useState("");

  async function uploadFiles(files: FileList, slug: string) {
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("property-images")
        .upload(fileName, file);

      if (error) {
        throw new Error(error.message);
      }

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      urls.push(data.publicUrl);
    }

    return urls;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Salvando imóvel...");

    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const slug = `${createSlug(title)}-${Date.now()}`;
    const files = form.get("images") as File | null;
    const input = event.currentTarget.elements.namedItem("images") as HTMLInputElement;
    const fileList = input.files;

    let imageUrls: string[] = [];

    try {
      if (fileList && fileList.length > 0) {
        imageUrls = await uploadFiles(fileList, slug);
      }
    } catch (error) {
      setMessage("Erro ao enviar foto: " + (error as Error).message);
      return;
    }

    const payload = {
      title,
      slug,
      category: String(form.get("category") || "Casa"),
      operation: String(form.get("operation") || "Venda") as "Venda" | "Locação",
      city: String(form.get("city") || "São Roque"),
      neighborhood: String(form.get("neighborhood") || ""),
      price: String(form.get("price") || ""),
      area: String(form.get("area") || ""),
      bedrooms: Number(form.get("bedrooms") || 0),
      suites: Number(form.get("suites") || 0),
      bathrooms: Number(form.get("bathrooms") || 0),
      parking: Number(form.get("parking") || 0),
      description: String(form.get("description") || ""),
      featured: form.get("featured") === "on",
      cover_image: imageUrls[0] || null,
    };

    const { data: property, error } = await supabase
      .from("properties")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      setMessage("Erro ao salvar: " + error.message);
      return;
    }

    if (property && imageUrls.length > 0) {
      const imagesPayload = imageUrls.map((url) => ({
        property_id: property.id,
        image_url: url,
      }));

      const { error: imagesError } = await supabase
        .from("property_images")
        .insert(imagesPayload);

      if (imagesError) {
        setMessage("Imóvel salvo, mas houve erro ao salvar galeria: " + imagesError.message);
        return;
      }
    }

    setMessage("Imóvel salvo com sucesso!");
    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="formGrid" onSubmit={handleSubmit}>
      <input className="input" name="title" placeholder="Título do imóvel" required />

      <select className="select" name="operation" defaultValue="Venda">
        <option>Venda</option>
        <option>Locação</option>
      </select>

      <input className="input" name="category" placeholder="Categoria: Casa, Apartamento, Terreno..." />
      <input className="input" name="price" placeholder="Valor: R$ 1.200.000" required />
      <input className="input" name="city" placeholder="Cidade" defaultValue="São Roque" />
      <input className="input" name="neighborhood" placeholder="Bairro" />
      <input className="input" name="area" placeholder="Área: 300 m²" />
      <input className="input" name="bedrooms" type="number" placeholder="Dormitórios" />
      <input className="input" name="suites" type="number" placeholder="Suítes" />
      <input className="input" name="bathrooms" type="number" placeholder="Banheiros" />
      <input className="input" name="parking" type="number" placeholder="Vagas" />

      <label className="input full">
        Fotos do imóvel
        <br />
        <span className="formHint">
          Selecione várias fotos. A primeira será usada como capa.
        </span>
        <br />
        <input name="images" type="file" accept="image/*" multiple />
      </label>

      <label className="full">
        <input name="featured" type="checkbox" /> Imóvel em destaque
      </label>

      <textarea className="textarea" name="description" placeholder="Descrição do imóvel" />

      <button className="btnDark full" type="submit">Salvar imóvel</button>

      {message && <p className="full">{message}</p>}
    </form>
  );
}
