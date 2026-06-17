"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import LocationFields from "./LocationFields";
import { PROPERTY_TYPES } from "../data/locationOptions";
import AdminListingPreview from "./AdminListingPreview";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fileListToArray(files: FileList | null | undefined) {
  return files ? Array.from(files) : [];
}

export default function NewPropertyForm() {
  const router = useRouter();
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [draft, setDraft] = useState({
    title: "",
    category: "Casa",
    operation: "Venda",
    status: "Disponível",
    city: "São Roque",
    neighborhood: "",
    price: "",
    area: "",
    bedrooms: "0",
    suites: "0",
    bathrooms: "0",
    parking: "0",
    description: "",
    broker_name: "",
    broker_phone: "11974005163",
    featured: false,
  });

  function updateDraft(field: keyof typeof draft, value: string | boolean) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleImages(files: FileList | null) {
    const selected = fileListToArray(files);
    setImageFiles(selected);
    setImagePreviews((previous) => {
      previous.forEach((url) => URL.revokeObjectURL(url));
      return selected.map((file) => URL.createObjectURL(file));
    });
    setSelectedCoverIndex(0);
  }

  async function uploadFiles(files: File[], folder: string) {
    const urls: string[] = [];

    for (const file of files) {
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
    setSaving(true);
    setMessage("Salvando imóvel...");

    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const slug = `${createSlug(title)}-${Date.now()}`;

    const floorInput = event.currentTarget.elements.namedItem("floor_plans") as HTMLInputElement;
    const brokerInput = event.currentTarget.elements.namedItem("broker_photo") as HTMLInputElement;

    let imageUrls: string[] = [];
    let floorPlanUrls: string[] = [];
    let brokerPhotoUrl: string | null = null;

    try {
      if (imageFiles.length > 0) {
        imageUrls = await uploadFiles(imageFiles, `${slug}/fotos`);
      }

      if (floorInput.files && floorInput.files.length > 0) {
        floorPlanUrls = await uploadFiles(fileListToArray(floorInput.files), `${slug}/plantas`);
      }

      if (brokerInput.files && brokerInput.files[0]) {
        const [url] = await uploadFiles(fileListToArray(brokerInput.files), `${slug}/corretor`);
        brokerPhotoUrl = url || null;
      }
    } catch (error) {
      setMessage("Erro ao enviar arquivo: " + (error as Error).message);
      setSaving(false);
      return;
    }

    const payload = {
      title,
      slug,
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
      cover_image: imageUrls[selectedCoverIndex] || imageUrls[0] || null,
      floor_plan_images: floorPlanUrls,
      broker_name: String(form.get("broker_name") || ""),
      broker_phone: String(form.get("broker_phone") || "11974005163"),
      broker_photo: brokerPhotoUrl,
    };

    const { data: property, error } = await supabase
      .from("properties")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      setMessage("Erro ao salvar: " + error.message);
      setSaving(false);
      return;
    }

    if (property && imageUrls.length > 0) {
      const imagesPayload = imageUrls.map((url) => ({
        property_id: property.id,
        image_url: url,
      }));

      await supabase.from("property_images").insert(imagesPayload);
    }

    router.push(property?.slug ? `/imoveis/${property.slug}` : "/admin");
    router.refresh();
  }

  return (
    <div className="propertyEditorWorkspace">
      <form className="smartEditorForm" onSubmit={handleSubmit}>
        <div className="editorStatusBar">
          <div>
            <span className="eyebrow">Novo anúncio</span>
            <h2>{draft.title || "Adicionar imóvel"}</h2>
            <p>Preencha olhando a prévia ao lado. A primeira imagem selecionada vira capa.</p>
          </div>
        </div>

        <section className="editorSection">
          <div className="editorSectionTitle">
            <span>01</span>
            <div>
              <h3>Informações principais</h3>
              <p>Comece pelo que o cliente mais vai notar.</p>
            </div>
          </div>

          <div className="editorGrid">
            <label className="editorField editorFieldWide">
              <span>Título do anúncio</span>
              <input name="title" value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} placeholder="Título do imóvel" required />
            </label>

            <label className="editorField">
              <span>Venda ou locação</span>
              <select name="operation" value={draft.operation} onChange={(event) => updateDraft("operation", event.target.value)}>
                <option>Venda</option>
                <option>Locação</option>
              </select>
            </label>

            <label className="editorField">
              <span>Status</span>
              <select name="status" value={draft.status} onChange={(event) => updateDraft("status", event.target.value)}>
                <option>Disponível</option>
                <option>Reservado</option>
                <option>Vendido</option>
                <option>Alugado</option>
              </select>
            </label>

            <label className="editorField">
              <span>Tipo</span>
              <select name="category" value={draft.category} onChange={(event) => updateDraft("category", event.target.value)}>
                {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>

            <label className="editorField">
              <span>Valor</span>
              <input name="price" value={draft.price} onChange={(event) => updateDraft("price", event.target.value)} placeholder="R$ 980.000" required />
            </label>
          </div>
        </section>

        <section className="editorSection">
          <div className="editorSectionTitle">
            <span>02</span>
            <div>
              <h3>Localização e medidas</h3>
              <p>Campos usados também na busca do cliente.</p>
            </div>
          </div>

          <div className="editorGrid">
            <div className="editorField editorLocationField">
              <span>Cidade e bairro</span>
              <LocationFields defaultCity="São Roque" />
            </div>

            <label className="editorField"><span>Área</span><input name="area" value={draft.area} onChange={(event) => updateDraft("area", event.target.value)} placeholder="420 m²" /></label>
            <label className="editorField"><span>Dormitórios</span><input name="bedrooms" type="number" value={draft.bedrooms} onChange={(event) => updateDraft("bedrooms", event.target.value)} /></label>
            <label className="editorField"><span>Suítes</span><input name="suites" type="number" value={draft.suites} onChange={(event) => updateDraft("suites", event.target.value)} /></label>
            <label className="editorField"><span>Banheiros</span><input name="bathrooms" type="number" value={draft.bathrooms} onChange={(event) => updateDraft("bathrooms", event.target.value)} /></label>
            <label className="editorField"><span>Vagas</span><input name="parking" type="number" value={draft.parking} onChange={(event) => updateDraft("parking", event.target.value)} /></label>
          </div>
        </section>

        <section className="editorSection">
          <div className="editorSectionTitle">
            <span>03</span>
            <div>
              <h3>Fotos e capa</h3>
              <p>Escolha as fotos e clique na miniatura que será a capa.</p>
            </div>
          </div>

          <label className="editorUploadBox">
            <strong>Fotos do imóvel</strong>
            <span>Selecione várias fotos. Depois clique na melhor capa.</span>
            <input name="images" type="file" accept="image/*" multiple onChange={(event) => handleImages(event.target.files)} />
          </label>

          {imagePreviews.length > 0 && (
            <div className="coverManager coverManagerNew">
              <div className="coverPreviewLarge" style={{ backgroundImage: `url(${imagePreviews[selectedCoverIndex]})` }}>
                <strong>Capa do anúncio</strong>
              </div>

              <div className="coverThumbArea">
                <h4>Fotos selecionadas</h4>
                <div className="coverThumbGrid">
                  {imagePreviews.map((url, index) => (
                    <button
                      type="button"
                      key={url}
                      className={selectedCoverIndex === index ? "selectedCover" : ""}
                      style={{ backgroundImage: `url(${url})` }}
                      onClick={() => setSelectedCoverIndex(index)}
                    >
                      <span>{selectedCoverIndex === index ? "Capa" : "Usar"}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="editorSection">
          <div className="editorSectionTitle">
            <span>04</span>
            <div>
              <h3>Descrição e corretor</h3>
              <p>Texto e contato do anúncio.</p>
            </div>
          </div>

          <label className="editorField editorFieldWide">
            <span>Descrição</span>
            <textarea name="description" value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} placeholder="Descrição do imóvel" />
          </label>

          <div className="editorGrid">
            <label className="editorField"><span>Nome do corretor</span><input name="broker_name" value={draft.broker_name} onChange={(event) => updateDraft("broker_name", event.target.value)} /></label>
            <label className="editorField"><span>WhatsApp</span><input name="broker_phone" value={draft.broker_phone} onChange={(event) => updateDraft("broker_phone", event.target.value)} /></label>
          </div>

          <label className="editorUploadBox"><strong>Foto do corretor</strong><input name="broker_photo" type="file" accept="image/*" /></label>
          <label className="editorUploadBox"><strong>Plantas do imóvel</strong><input name="floor_plans" type="file" accept="image/*" multiple /></label>

          <label className="editorCheck">
            <input name="featured" type="checkbox" checked={draft.featured} onChange={(event) => updateDraft("featured", event.target.checked)} />
            <span>Imóvel em destaque</span>
          </label>
        </section>

        <div className="editorBottomActions">
          <button className="btnDark" type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar e visualizar anúncio"}
          </button>
        </div>

        {message && <p className="editorMessage">{message}</p>}
      </form>

      <div className="editorPreviewSticky">
        <AdminListingPreview data={draft} coverImage={imagePreviews[selectedCoverIndex] || ""} />
      </div>
    </div>
  );
}
