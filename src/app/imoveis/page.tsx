import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PropertyCard from "../../components/PropertyCard";
import SearchPanel from "../../components/SearchPanel";
import { createClient } from "../../lib/supabase/server";
import { Property } from "../../types/property";
import { buildAvailableLocations } from "../../lib/availableLocations";
import { getPropertyCode, normalizeSearchCode } from "../../lib/propertyCode";

function onlyNumbers(value?: string) {
  return Number(String(value || "").replace(/\D/g, "")) || 0;
}

function priceToNumber(price?: string | null) {
  return Number(String(price || "").replace(/\D/g, "")) || 0;
}

function normalize(value?: string | null) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function textIncludes(value: string | null | undefined, search: string) {
  return normalize(value).includes(normalize(search));
}

function buildPageHref(
  params: Record<string, string | undefined>,
  page: number
) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!value || key === "page") return;
    search.set(key, value);
  });

  if (page > 1) {
    search.set("page", String(page));
  }

  const query = search.toString();
  return `/imoveis${query ? `?${query}` : ""}`;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    operacao?: string;
    tipo?: string;
    cidade?: string;
    bairro?: string;
    quartos?: string;
    banheiros?: string;
    vagas?: string;
    valorMin?: string;
    valorMax?: string;
    codigo?: string;
    page?: string;
  }>;
}) {
  const params = searchParams ? await searchParams : {};
  const supabase = await createClient();

  const { data: locationRows } = await supabase
    .from("properties")
    .select("city,neighborhood");

  const availableLocations = buildAvailableLocations(locationRows);

  let query = supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (params?.operacao) query = query.eq("operation", params.operacao);
  if (params?.tipo) query = query.eq("category", params.tipo);
  if (params?.cidade) query = query.eq("city", params.cidade);
  if (params?.bairro) query = query.eq("neighborhood", params.bairro);
  if (params?.quartos) query = query.gte("bedrooms", Number(params.quartos));
  if (params?.banheiros) query = query.gte("bathrooms", Number(params.banheiros));
  if (params?.vagas) query = query.gte("parking", Number(params.vagas));

  const { data, error } = await query;

  const valorMin = onlyNumbers(params?.valorMin);
  const valorMax = onlyNumbers(params?.valorMax);
  const codigo = String(params?.codigo || "").trim();
  const cleanCode = normalizeSearchCode(codigo);

  const properties = ((data || []) as Property[]).filter((property) => {
    const price = priceToNumber(property.price);

    if (valorMin && price < valorMin) return false;
    if (valorMax && price > valorMax) return false;

    if (codigo) {
      const match =
        textIncludes(property.slug, codigo) ||
        (cleanCode && getPropertyCode(property.id).includes(cleanCode)) ||
        (cleanCode && normalizeSearchCode(property.id).includes(cleanCode)) ||
        textIncludes(property.title, codigo) ||
        textIncludes(property.neighborhood, codigo) ||
        textIncludes(property.city, codigo) ||
        textIncludes(property.category, codigo);

      if (!match) return false;
    }

    return true;
  });

  const { data: allImages } = await supabase
    .from("property_images")
    .select("property_id,image_url");

  const imagesByProperty = new Map<string, string[]>();

  (allImages || []).forEach((image) => {
    const current = imagesByProperty.get(image.property_id) || [];
    current.push(image.image_url);
    imagesByProperty.set(image.property_id, current);
  });

  const hasFilter = Boolean(
    params?.operacao ||
    params?.tipo ||
    params?.cidade ||
    params?.bairro ||
    params?.quartos ||
    params?.banheiros ||
    params?.vagas ||
    params?.valorMin ||
    params?.valorMax ||
    params?.codigo
  );

  const perPage = 10;
  const requestedPage = Math.max(1, Number(params?.page || 1) || 1);
  const totalPages = Math.max(1, Math.ceil(properties.length / perPage));
  const currentPage = Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * perPage;
  const paginatedProperties = properties.slice(start, start + perPage);
  const firstShown = properties.length ? start + 1 : 0;
  const lastShown = Math.min(start + perPage, properties.length);

  return (
    <main className="page">
      <Navbar />

      <section className="pageTop propertiesTop">
        <div className="container">
          <h1>{params?.tipo ? params.tipo : "Imóveis"}</h1>
          <p>
            Confira oportunidades cadastradas pela Alexandrowitch Imobiliária e Administradora
            em São Paulo, São Roque e regiões.
          </p>

          <SearchPanel initial={params || {}} availableLocations={availableLocations} />
        </div>
      </section>

      <section className="section sectionLight pageResultsSection">
        <div className="container">
          <div className="resultsHeader">
            <div>
              <span className="eyebrow">Resultado da busca</span>
              <h2>
                {properties.length} imóvel{properties.length === 1 ? "" : "is"} encontrado
                {properties.length === 1 ? "" : "s"}
              </h2>
              {properties.length > 0 && (
                <p className="resultsCounter">
                  Mostrando {firstShown} a {lastShown} de {properties.length}
                </p>
              )}
            </div>

            {hasFilter && (
              <a className="btnLight" href="/imoveis">
                Limpar pesquisa
              </a>
            )}
          </div>

          {error && <p className="sectionText">Erro ao carregar imóveis: {error.message}</p>}

          {!error && properties.length === 0 && (
            <div className="emptyLuxury">
              <h3>Nenhum imóvel encontrado com esses filtros.</h3>
              <p>Altere cidade, bairro, valor ou tipo de imóvel para ampliar a busca.</p>
            </div>
          )}

          <div className="grid3 resultGrid mobileTwoByTenGrid">
            {paginatedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                images={imagesByProperty.get(property.id) || []}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="propertiesPagination" aria-label="Paginação de imóveis">
              <a
                className={currentPage <= 1 ? "disabledPage" : ""}
                href={currentPage <= 1 ? "#" : buildPageHref(params || {}, currentPage - 1)}
              >
                Anterior
              </a>

              <div>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  return (
                    <a
                      key={page}
                      className={page === currentPage ? "activePage" : ""}
                      href={buildPageHref(params || {}, page)}
                    >
                      {page}
                    </a>
                  );
                })}
              </div>

              <a
                className={currentPage >= totalPages ? "disabledPage" : ""}
                href={currentPage >= totalPages ? "#" : buildPageHref(params || {}, currentPage + 1)}
              >
                Próxima
              </a>
            </nav>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
