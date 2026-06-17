"use client";

type PreviewData = {
  title: string;
  operation: string;
  status: string;
  category: string;
  price: string;
  city: string;
  neighborhood: string;
  area: string;
  bedrooms: string;
  suites: string;
  bathrooms: string;
  parking: string;
  description: string;
  broker_name: string;
  broker_phone: string;
  featured: boolean;
};

export default function AdminListingPreview({
  data,
  coverImage,
  code,
}: {
  data: PreviewData;
  coverImage: string;
  code?: string;
}) {
  const hero =
    coverImage ||
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop";

  return (
    <aside className="editorPreviewCard">
      <div className="editorPreviewTop">
        <span className="eyebrow">Prévia do anúncio</span>
        <strong>{data.featured ? "Destaque no site" : "Visualização"}</strong>
      </div>

      <div className="previewHero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="previewHeroOverlay" />
        <div className="previewHeroContent">
          <div className="previewBadges">
            <span>{data.status || "Disponível"}</span>
            {code && <span>Cód. {code}</span>}
          </div>
          <h3>{data.title || "Título do imóvel"}</h3>
          <p>
            {data.neighborhood || "Bairro"} • {data.city || "Cidade"}
          </p>
        </div>
      </div>

      <div className="previewBody">
        <div className="previewPrice">{data.price || "R$ 0"}</div>
        <div className="previewMeta">
          {data.operation || "Venda"} • {data.category || "Tipo do imóvel"}
        </div>

        <div className="previewMetrics">
          <div><strong>{data.area || "-"}</strong><span>Área</span></div>
          <div><strong>{data.bedrooms || "0"}</strong><span>Dorm.</span></div>
          <div><strong>{data.suites || "0"}</strong><span>Suítes</span></div>
          <div><strong>{data.bathrooms || "0"}</strong><span>Ban.</span></div>
          <div><strong>{data.parking || "0"}</strong><span>Vagas</span></div>
        </div>

        <p className="previewDescription">
          {data.description || "A descrição aparecerá aqui conforme você digitar."}
        </p>

        <div className="previewBroker">
          <img src="/logo-alexandrowitch.png" alt="" />
          <div>
            <strong>{data.broker_name || "Corretor Alexandrowitch"}</strong>
            <span>{data.broker_phone || "WhatsApp do corretor"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
