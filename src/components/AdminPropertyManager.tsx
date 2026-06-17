"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { getPropertyCode, normalizeSearchCode } from "../lib/propertyCode";

type AdminProperty = {
  id: string;
  slug: string;
  title: string;
  operation: string | null;
  price: string | null;
  city: string | null;
  neighborhood: string | null;
  status: string | null;
  featured?: boolean | null;
  cover_image?: string | null;
  category?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parking?: number | null;
  area?: string | null;
};

function normalize(value: string | null | undefined) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isSold(property: AdminProperty) {
  return property.status === "Vendido" || property.status === "Alugado";
}

export default function AdminPropertyManager({
  initialProperties,
}: {
  initialProperties: AdminProperty[];
}) {
  const [properties, setProperties] = useState<AdminProperty[]>(initialProperties || []);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const [operation, setOperation] = useState("todos");
  const [city, setCity] = useState("todos");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(properties.map((item) => item.city).filter(Boolean))) as string[];
    return unique.sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [properties]);

  const filtered = useMemo(() => {
    const text = normalize(query);
    const code = normalizeSearchCode(query);

    return properties.filter((property) => {
      const propertyCode = getPropertyCode(property.id);
      const rawId = normalizeSearchCode(property.id);

      if (status === "disponiveis" && isSold(property)) return false;
      if (status === "vendidos" && !isSold(property)) return false;
      if (status === "destaque" && !property.featured) return false;

      if (operation !== "todos" && property.operation !== operation) return false;
      if (city !== "todos" && property.city !== city) return false;

      if (!query.trim()) return true;

      return (
        propertyCode.includes(code) ||
        rawId.includes(code) ||
        normalize(property.title).includes(text) ||
        normalize(property.city).includes(text) ||
        normalize(property.neighborhood).includes(text) ||
        normalize(property.category).includes(text) ||
        normalize(property.price).includes(text)
      );
    });
  }, [properties, query, status, operation, city]);

  async function updateStatus(property: AdminProperty, nextStatus: string) {
    setLoadingId(property.id);

    const previous = properties;
    setProperties((items) =>
      items.map((item) =>
        item.id === property.id ? { ...item, status: nextStatus } : item
      )
    );

    const supabase = createClient();
    const { error } = await supabase
      .from("properties")
      .update({ status: nextStatus })
      .eq("id", property.id);

    if (error) {
      setProperties(previous);
      alert("Não foi possível atualizar o imóvel. Tente novamente.");
    }

    setLoadingId(null);
  }

  function clearFilters() {
    setQuery("");
    setStatus("todos");
    setOperation("todos");
    setCity("todos");
  }

  const total = properties.length;
  const sold = properties.filter(isSold).length;
  const available = total - sold;
  const featured = properties.filter((item) => item.featured).length;

  return (
    <div className="adminWorkspace">
      <aside className="adminSearchPanel">
        <div className="adminSearchCard">
          <span className="eyebrow">Busca do corretor</span>
          <h3>Encontre rápido</h3>
          <p>Código, palavra-chave, bairro, cidade, preço ou tipo de imóvel.</p>

          <label className="adminSearchField">
            <span>Busca principal</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex: 366790D1, chácara, Centro"
            />
          </label>

          <label className="adminSearchField">
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="todos">Todos</option>
              <option value="disponiveis">Disponíveis</option>
              <option value="vendidos">Vendidos/Alugados</option>
              <option value="destaque">Em destaque</option>
            </select>
          </label>

          <label className="adminSearchField">
            <span>Pretensão</span>
            <select value={operation} onChange={(event) => setOperation(event.target.value)}>
              <option value="todos">Todas</option>
              <option value="Venda">Venda</option>
              <option value="Locação">Locação</option>
            </select>
          </label>

          <label className="adminSearchField">
            <span>Cidade</span>
            <select value={city} onChange={(event) => setCity(event.target.value)}>
              <option value="todos">Todas</option>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <button type="button" className="btnLight adminFullButton" onClick={clearFilters}>
            Limpar filtros
          </button>
        </div>

        <div className="adminMiniStats">
          <div><strong>{total}</strong><span>Total</span></div>
          <div><strong>{available}</strong><span>Disponíveis</span></div>
          <div><strong>{sold}</strong><span>Vendidos</span></div>
          <div><strong>{featured}</strong><span>Destaques</span></div>
        </div>
      </aside>

      <section className="adminResultsPanel">
        <div className="adminResultsTop">
          <div>
            <span className="eyebrow">Imóveis cadastrados</span>
            <h2>{filtered.length} resultado{filtered.length === 1 ? "" : "s"}</h2>
          </div>

          <Link href="/admin/novo" className="btnPrimary">
            Novo imóvel
          </Link>
        </div>

        {!filtered.length && (
          <div className="adminEmptyState">
            <h3>Nenhum imóvel encontrado.</h3>
            <p>Limpe os filtros ou tente pelo código, bairro ou palavra principal do anúncio.</p>
            <button type="button" className="btnDark" onClick={clearFilters}>
              Limpar busca
            </button>
          </div>
        )}

        <div className="adminPropertyGrid">
          {filtered.map((property) => {
            const soldItem = isSold(property);
            const code = getPropertyCode(property.id);
            const image =
              property.cover_image ||
              "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop";

            return (
              <article className={`adminPropertyCard ${soldItem ? "isSold" : ""}`} key={property.id}>
                <div className="adminPropertyImage" style={{ backgroundImage: `url(${image})` }}>
                  <span className={`statusBadge ${soldItem ? "sold" : ""}`}>
                    {property.status || "Disponível"}
                  </span>
                  <span className="adminCodeBadge">Cód. {code}</span>
                </div>

                <div className="adminPropertyInfo">
                  <h3>{property.title}</h3>

                  <p>
                    {property.operation} • {property.price}
                    <br />
                    {property.city} - {property.neighborhood || "Sem bairro"}
                  </p>

                  <div className="adminCardMetrics">
                    {property.area && <span>{property.area}</span>}
                    {!!property.bedrooms && <span>{property.bedrooms} dorm.</span>}
                    {!!property.bathrooms && <span>{property.bathrooms} banh.</span>}
                    {!!property.parking && <span>{property.parking} vagas</span>}
                  </div>

                  <div className="adminPropertyActions">
                    <Link href={`/imoveis/${property.slug}`} className="btnDark" target="_blank">
                      Ver
                    </Link>

                    <Link href={`/admin/editar/${property.id}`} className="btnPrimary">
                      Editar
                    </Link>

                    {!soldItem ? (
                      <button
                        type="button"
                        className="btnSold"
                        disabled={loadingId === property.id}
                        onClick={() => updateStatus(property, "Vendido")}
                      >
                        {loadingId === property.id ? "Salvando..." : "Marcar vendido"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btnUnsold"
                        disabled={loadingId === property.id}
                        onClick={() => updateStatus(property, "Disponível")}
                      >
                        {loadingId === property.id ? "Salvando..." : "Voltar disponível"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
