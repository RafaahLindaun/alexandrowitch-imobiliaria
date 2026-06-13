"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import { Property } from "../types/property";

export default function EditPropertyForm({ property }: { property: Property }) {
  const router = useRouter();
  const supabase = createClient();
  const [message, setMessage] = useState("");

  async function uploadFiles(files: FileList, folder: string) {
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;

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
    const imageInput = event.currentTarget.elements.namedItem("images") as HTMLInputElement;
    const floorInput = event.currentTarget.elements.namedItem("floor_plans") as HTMLInputElement;
    const brokerInput = event.currentTarget.elements.namedItem("broker_photo") as HTMLInputElement;

    let newImageUrls: string[] = [];
    let newFloorUrls: string[] = [];
    let brokerPhoto = property.broker_photo;

    try {
      if (imageInput.files && imageInput.files.length > 0) {
        newImageUrls = await uploadFiles(imageInput.files, `${property.slug}/fotos`);
      }

      if (floorInput.files && floorInput.files.length > 0) {
        newFloorUrls = await uploadFiles(floorInput.files, `${property.slug}/plantas`);
      }

      if (brokerInput.files && brokerInput.files[0]) {
        const [url] = await uploadFiles(brokerInput.files, `${property.slug}/corretor`);
        brokerPhoto = url || brokerPhoto;
      }
    } catch (error) {
      setMessage("Erro ao enviar arquivo: " + (error as Error).message);
      return;
    }

    const floorPlanImages = [
      ...((property.floor_plan_images || []) as string[]),
      ...newFloorUrls,
    ];

    const payload = {
      title: String(form.get("title") || ""),
      category: String(form.get("category") || "Casa"),
      operation: String(form.get("operation") || "Venda") as "Venda" | "Locação",
      status: String(form.get("status") || "Disponível"),
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
      broker_name: String(form.get("broker_name") || ""),
      broker_phone: String(form.get("broker_phone") || "11974005163"),
      broker_photo: brokerPhoto,
      floor_plan_images: floorPlanImages,
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

      await supabase.from("property_images").insert(imagesPayload);
    }

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
      <input className="input" name="title" defaultValue={property.title} />

      <select className="select" name="operation" defaultValue={property.operation}>
        <option>Venda</option>
        <option>Locação</option>
      </select>

      <select className="select" name="status" defaultValue={property.status || "Disponível"}>
        <option>Disponível</option>
        <option>Reservado</option>
        <option>Vendido</option>
        <option>Alugado</option>
      </select>

      <input className="input" name="category" defaultValue={property.category} />
      <input className="input" name="price" defaultValue={property.price} />
      <input className="input" name="city" defaultValue={property.city} />
      <input className="input" name="neighborhood" defaultValue={property.neighborhood || ""} />
      <input className="input" name="area" defaultValue={property.area || ""} />
      <input className="input" name="bedrooms" type="number" defaultValue={property.bedrooms || 0} />
      <input className="input" name="suites" type="number" defaultValue={property.suites || 0} />
      <input className="input" name="bathrooms" type="number" defaultValue={property.bathrooms || 0} />
      <input className="input" name="parking" type="number" defaultValue={property.parking || 0} />

      <input className="input" name="broker_name" placeholder="Nome do corretor" defaultValue={property.broker_name || ""} />
      <input className="input" name="broker_phone" placeholder="WhatsApp do corretor" defaultValue={property.broker_phone || "11974005163"} />

      <label className="input full">
        Trocar/adicionar foto do corretor
        <br />
        <input name="broker_photo" type="file" accept="image/*" />
      </label>

      <label className="input full">
        Adicionar novas fotos do imóvel
        <br />
        <input name="images" type="file" accept="image/*" multiple />
      </label>

      <label className="input full">
        Adicionar plantas do imóvel
        <br />
        <input name="floor_plans" type="file" accept="image/*" multiple />
      </label>

      <label className="full">
        <input name="featured" type="checkbox" defaultChecked={!!property.featured} /> Imóvel em destaque
      </label>

      <textarea className="textarea" name="description" defaultValue={property.description || ""} />

      <button className="btnDark full" type="submit">
        Salvar alterações
      </button>

      <button className="btnDanger full" type="button" onClick={handleDelete}>
        Excluir imóvel
      </button>

      {message && <p className="full">{message}</p>}
    </form>
  );
}
