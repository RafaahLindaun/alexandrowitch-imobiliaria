"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import { Property } from "../types/property";

export default function EditPropertyForm({ property }: { property: Property }) {
  const router = useRouter();
  const supabase = createClient();
  const [message, setMessage] = useState("");

  async function uploadFiles(files: FileList) {
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${property.slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("property-images")
        .upload(fileName, file);

      if (error) throw new Error(error.message);

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      urls.push(data.publicUrl);
    }

    return urls;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Salvando alterações...");

    const form = new FormData(event.currentTarget);
    const input = event.currentTarget.elements.namedItem("images") as HTMLInputElement;
    const fileList = input.files;

    let newImageUrls: string[] = [];

    try {
      if (fileList && fileList.length > 0) {
        newImageUrls = await uploadFiles(fileList);
      }
    } catch (error) {
      setMessage("Erro ao enviar foto: " + (error as Error).message);
      return;
    }

    const payload = {
      title: String(form.get("title") || ""),
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
      cover_image: newImageUrls[0] || property.cover_image,
    };

    const { error } = await supabase
      .from("properties")
      .update(payload)
      .eq("id", property.id);

    if (error) {
      setMessage("Erro ao salvar: " + error.message);
      return;
    }

    if (newImageUrls.length > 0) {
      const imagesPayload = newImageUrls.map((url) => ({
        property_id: property.id,
        image_url: url,
      }));

      const { error: imagesError } = await supabase
        .from("property_images")
        .insert(imagesPayload);

      if (imagesError) {
        setMessage("Imóvel atualizado, mas houve erro na galeria: " + imagesError.message);
        return;
      }
    }

    setMessage("Imóvel atualizado!");
    router.push("/admin");
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm("Tem certeza que deseja excluir este imóvel?");
    if (!confirmed) return;

    const { error } = await supabase.from("properties").delete().eq("id", property.id);

    if (error) {
      setMessage("Erro ao excluir: " + error.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="formGrid" onSubmit={handleSubmit}>
      <input className="input" name="title" placeholder="Título" defaultValue={property.title} />

      <select className="select" name="operation" defaultValue={property.operation}>
        <option>Venda</option>
        <option>Locação</option>
      </select>

      <input className="input" name="category" placeholder="Categoria" defaultValue={property.category} />
      <input className="input" name="price" placeholder="Valor" defaultValue={property.price} />
      <input className="input" name="city" placeholder="Cidade" defaultValue={property.city} />
      <input className="input" name="neighborhood" placeholder="Bairro" defaultValue={property.neighborhood || ""} />
      <input className="input" name="area" placeholder="Área" defaultValue={property.area || ""} />
      <input className="input" name="bedrooms" type="number" placeholder="Dormitórios" defaultValue={property.bedrooms || 0} />
      <input className="input" name="suites" type="number" placeholder="Suítes" defaultValue={property.suites || 0} />
      <input className="input" name="bathrooms" type="number" placeholder="Banheiros" defaultValue={property.bathrooms || 0} />
      <input className="input" name="parking" type="number" placeholder="Vagas" defaultValue={property.parking || 0} />

      {property.cover_image && (
        <div className="full">
          <p>Foto atual:</p>
          <div className="currentImage" style={{ backgroundImage: `url(${property.cover_image})` }} />
        </div>
      )}

      <label className="input full">
        Adicionar mais fotos
        <br />
        <span className="formHint">As novas fotos serão adicionadas à galeria. A primeira nova vira capa.</span>
        <br />
        <input name="images" type="file" accept="image/*" multiple />
      </label>

      <label className="full">
        <input name="featured" type="checkbox" defaultChecked={!!property.featured} /> Imóvel em destaque
      </label>

      <textarea className="textarea" name="description" placeholder="Descrição" defaultValue={property.description || ""} />

      <button className="btnDark full" type="submit">Salvar alterações</button>
      <button className="btnDanger full" type="button" onClick={handleDelete}>Excluir imóvel</button>

      {message && <p className="full">{message}</p>}
    </form>
  );
}
