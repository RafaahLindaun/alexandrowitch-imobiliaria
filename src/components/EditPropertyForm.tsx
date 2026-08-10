"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import LocationFields from "./LocationFields";
import { PROPERTY_TYPES } from "../data/locationOptions";
import { getPropertyCode } from "../lib/propertyCode";
import { Property } from "../types/property";
import AdminListingPreview from "./AdminListingPreview";

type GalleryImage = {
  id?: string;
  image_url: string;
};

function fileListToArray(files: FileList | null | undefined) {
  return files ? Array.from(files) : [];
}

function uniqueUrls(urls: string[]) {
  return Array.from(new Set(urls.filter(Boolean)));
}

export default function EditPropertyForm({
  property,
  galleryImages = [],
}: {
  property: Property;
  galleryImages?: GalleryImage[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const code = getPropertyCode(property.id);

  const existingImages = useMemo(
    () => uniqueUrls([
      property.cover_image || "",
      ...galleryImages.map((image) => image.image_url),
    ]),
    [property.cover_image, galleryImages]
  );

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [coverMode, setCoverMode] = useState<"existing" | "new">("existing");
  const [selectedExistingCover, setSelectedExistingCover] = useState(
    property.cover_image || existingImages[0] || ""
  );
  const [selectedNewCoverIndex, setSelectedNewCoverIndex] = useState(0);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [draft, setDraft] = useState({
    title: property.title || "",
    category: property.category || "Casa",
    operation: property.operation || "Venda",
    status: property.status || "Disponível",
    city: property.city || "São Roque",
    neighborhood: property.neighborhood || "",
    price: property.price || "",
    area: property.area || "",
    bedrooms: String(property.bedrooms || 0),
    suites: String(property.suites || 0),
    bathrooms: String(property.bathrooms || 0),
    parking: String(property.parking || 0),
    description: property.description || "",
    broker_name: property.broker_name || "",
    broker_phone: property.broker_phone || "11974005163",
    featured: !!property.featured,
  });

  const coverPreview =
    coverMode === "new"
      ? newPreviews[selectedNewCoverIndex] || selectedExistingCover
      : selectedExistingCover || newPreviews[0] || property.cover_image || "";

  function updateDraft(field: keyof typeof draft, value: string | boolean) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleNewImages(files: FileList | null) {
    const selected = fileListToArray(files);
    setNewFiles(selected);
    setNewPreviews((previous) => {
      previous.forEach((url) => URL.revokeObjectURL(url));
      return selected.map((file) => URL.createObjectURL(file));
    });

    if (selected.length > 0) {
      setCoverMode("new");
      setSelectedNewCoverIndex(0);
    }
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
    setMessage("Salvando alterações...");

    const form = new FormData(event.currentTarget);
    const floorInput = event.currentTarget.elements.namedItem("floor_plans") as HTMLInputElement;
    const brokerInput = event.currentTarget.elements.namedItem("broker_photo") as HTMLInputElement;

    let newImageUrls: string[] = [];
    let newFloorUrls: string[] = [];
    let brokerPhoto = property.broker_photo;

    try {
      if (newFiles.length > 0) {
        newImageUrls = await uploadFiles(newFiles, `${property.slug}/fotos`);
      }

      if (floorInput.files && floorInput.files.length > 0) {
        newFloorUrls = await uploadFiles(fileListToArray(floorInput.files), `${property.slug}/plantas`);
      }

      if (brokerInput.files && brokerInput.files[0]) {
        const [url] = await uploadFiles(fileListToArray(brokerInput.files), `${property.slug}/corretor`);
        brokerPhoto = url || brokerPhoto;
      }
    } catch (error) {
      setMessage("Erro ao enviar arquivo: " + (error as Error).message);
      setSaving(false);
      return;
    }

    const chosenCover =
      coverMode === "new"
        ? newImageUrls[selectedNewCoverIndex] || newImageUrls[0] || selectedExistingCover || property.cover_image
        : selectedExistingCover || property.cover_image || newImageUrls[0] || null;

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
      cover_image: chosenCover,
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
      setSaving(false);
      return;
    }

    if (newImageUrls.length > 0) {
      const imagesPayload = newImageUrls.map((url) => ({
        property_id: property.id,
        image_url: url,
      }));

      await supabase.from("property_images").insert(imagesPayload);
    }

    setMessage("Imóvel salvo com sucesso.");
    router.push(`/imoveis/${property.slug}`);
    router.refresh();
  }

  async function quickStatus(nextStatus: string) {
    setSaving(true);
    setMessage(`Atualizando para ${nextStatus}...`);

    const { error } = await supabase
      .from("properties")
      .update({ status: nextStatus })
      .eq("id", property.id);

    if (error) {
      setMessage("Erro ao atualizar status: " + error.message);
      setSaving(false);
      return;
    }

    updateDraft("status", nextStatus);
    setMessage(`Status alterado para ${nextStatus}.`);
    setSaving(false);
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
    <div className="propertyEditorWorkspace">
      <form className="smartEditorForm" onSubmit={handleSubmit}>
        <div className="editorStatusBar">
          <div>
            <span className="eyebrow">Editor inteligente</span>
            <h2>{draft.title || "Editar imóvel"}</h2>
            <p>Código do anúncio: <strong>{code}</strong></p>
          </div>

          <div className="editorQuickActions">
            <button type="button" className="btnLight" onClick={() => quickStatus("Disponível")}>
              Disponível
            </button>
            <button type="button" className="btnLight" onClick={() => quickStatus("Reservado")}>
              Reservado
            </button>
            <button type="button" className="btnSold" onClick={() => quickStatus("Vendido")}>
              Vendido
            </button>
          </div>
        </div>

        <section className="editorSection">
          <div className="editorSectionTitle">
            <span>01</span>
            <div>
              <h3>Informações principais</h3>
              <p>O que aparece primeiro para o cliente no anúncio.</p>
            </div>
          </div>

          <div className="editorGrid">
            <label className="editorField editorFieldWide">
              <span>Título do anúncio</span>
              <input
                name="title"
                value={draft.title}
                onChange={(event) => updateDraft("title", event.target.value)}
                placeholder="Ex: Chácara com área verde e vista privilegiada"
                required
              />
            </label>

            <label className="editorField">
              <span>Venda ou locação</span>
              <select
                name="operation"
                value={draft.operation}
                onChange={(event) => updateDraft("operation", event.target.value)}
              >
                <option>Venda</option>
                <option>Locação</option>
              </select>
            </label>

            <label className="editorField">
              <span>Status</span>
              <select
                name="status"
                value={draft.status}
                onChange={(event) => updateDraft("status", event.target.value)}
              >
                <option>Disponível</option>
                <option>Reservado</option>
                <option>Vendido</option>
                <option>Alugado</option>
              </select>
            </label>

            <label className="editorField">
              <span>Tipo do imóvel</span>
              <select
                name="category"
                value={draft.category}
                onChange={(event) => updateDraft("category", event.target.value)}
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="editorField">
              <span>Valor</span>
              <input
                name="price"
                value={draft.price}
                onChange={(event) => updateDraft("price", event.target.value)}
                placeholder="Ex: R$ 980.000"
                required
              />
            </label>
          </div>
        </section>

        <section className="editorSection">
          <div className="editorSectionTitle">
            <span>02</span>
            <div>
              <h3>Localização e medidas</h3>
              <p>Esses campos conectam cadastro, busca e página pública.</p>
            </div>
          </div>

          <div className="editorGrid">
            <div className="editorField editorLocationField">
              <span>Cidade e bairro</span>
              <LocationFields defaultCity={property.city} defaultNeighborhood={property.neighborhood || ""} />
            </div>

            <label className="editorField">
              <span>Área</span>
              <input name="area" value={draft.area} onChange={(event) => updateDraft("area", event.target.value)} placeholder="Ex: 420 m²" />
            </label>

            <label className="editorField">
              <span>Dormitórios</span>
              <input name="bedrooms" type="number" value={draft.bedrooms} onChange={(event) => updateDraft("bedrooms", event.target.value)} />
            </label>

            <label className="editorField">
              <span>Suítes</span>
              <input name="suites" type="number" value={draft.suites} onChange={(event) => updateDraft("suites", event.target.value)} />
            </label>

            <label className="editorField">
              <span>Banheiros</span>
              <input name="bathrooms" type="number" value={draft.bathrooms} onChange={(event) => updateDraft("bathrooms", event.target.value)} />
            </label>

            <label className="editorField">
              <span>Vagas</span>
              <input name="parking" type="number" value={draft.parking} onChange={(event) => updateDraft("parking", event.target.value)} />
            </label>
          </div>
        </section>

        <section className="editorSection">
          <div className="editorSectionTitle">
            <span>03</span>
            <div>
              <h3>Fotos e imagem de capa</h3>
              <p>Escolha a capa que vai aparecer nos cards, no hero e na página do imóvel.</p>
            </div>
          </div>

          <div className="coverManager">
            <div className="coverPreviewLarge" style={{ backgroundImage: `url(${coverPreview || ""})` }}>
              {!coverPreview && <span>Escolha ou envie uma foto de capa</span>}
              <strong>Capa do anúncio</strong>
            </div>

            <div className="coverThumbArea">
              {existingImages.length > 0 && (
                <>
                  <h4>Fotos atuais</h4>
                  <div className="coverThumbGrid">
                    {existingImages.map((url) => (
                      <button
                        type="button"
                        key={url}
                        className={coverMode === "existing" && selectedExistingCover === url ? "selectedCover" : ""}
                        style={{ backgroundImage: `url(${url})` }}
                        onClick={() => {
                          setCoverMode("existing");
                          setSelectedExistingCover(url);
                        }}
                      >
                        <span>{coverMode === "existing" && selectedExistingCover === url ? "Capa" : "Usar"}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <label className="editorUploadBox">
                <strong>Adicionar novas fotos</strong>
                <span>Selecione várias imagens. Clique na miniatura para escolher a capa.</span>
                <input
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => handleNewImages(event.target.files)}
                />
              </label>

              {newPreviews.length > 0 && (
                <>
                  <h4>Novas fotos selecionadas</h4>
                  <div className="coverThumbGrid">
                    {newPreviews.map((url, index) => (
                      <button
                        type="button"
                        key={url}
                        className={coverMode === "new" && selectedNewCoverIndex === index ? "selectedCover" : ""}
                        style={{ backgroundImage: `url(${url})` }}
                        onClick={() => {
                          setCoverMode("new");
                          setSelectedNewCoverIndex(index);
                        }}
                      >
                        <span>{coverMode === "new" && selectedNewCoverIndex === index ? "Capa" : "Usar"}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="editorSection">
          <div className="editorSectionTitle">
            <span>04</span>
            <div>
              <h3>Descrição e corretor</h3>
              <p>Texto de venda e contato que aparece para o cliente.</p>
            </div>
          </div>

          <label className="editorField editorFieldWide">
            <span>Descrição do imóvel</span>
            <textarea
              name="description"
              value={draft.description}
              onChange={(event) => updateDraft("description", event.target.value)}
              placeholder="Descreva o imóvel, localização, diferenciais, lazer, acesso e perfil ideal do cliente."
            />
          </label>

          <div className="editorGrid">
            <label className="editorField">
              <span>Nome do corretor</span>
              <input
                name="broker_name"
                value={draft.broker_name}
                onChange={(event) => updateDraft("broker_name", event.target.value)}
                placeholder="Nome do corretor"
              />
            </label>

            <label className="editorField">
              <span>WhatsApp do corretor</span>
              <input
                name="broker_phone"
                value={draft.broker_phone}
                onChange={(event) => updateDraft("broker_phone", event.target.value)}
                placeholder="11974005163"
              />
            </label>
          </div>

          <label className="editorUploadBox">
            <strong>Trocar foto do corretor</strong>
            <span>Opcional. Se não enviar, mantém a foto atual.</span>
            <input name="broker_photo" type="file" accept="image/*" />
          </label>

          <label className="editorUploadBox">
            <strong>Adicionar plantas do imóvel</strong>
            <span>Opcional. Use para plantas, croquis ou imagens técnicas.</span>
            <input name="floor_plans" type="file" accept="image/*" multiple />
          </label>

          <label className="editorCheck">
            <input
              name="featured"
              type="checkbox"
              checked={draft.featured}
              onChange={(event) => updateDraft("featured", event.target.checked)}
            />
            <span>Imóvel em destaque na página inicial</span>
          </label>
        </section>

        <div className="editorBottomActions">
          <button className="btnDark" type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar e visualizar anúncio"}
          </button>

          <a className="btnLight" href={`/imoveis/${property.slug}`} target="_blank">
            Ver anúncio atual
          </a>

          <button className="btnDanger" type="button" onClick={handleDelete}>
            Excluir imóvel
          </button>
        </div>

        {message && <p className="editorMessage">{message}</p>}
      </form>

      <div className="editorPreviewSticky">
        <AdminListingPreview data={draft} coverImage={coverPreview} code={code} />
      </div>
    </div>
  );
}
