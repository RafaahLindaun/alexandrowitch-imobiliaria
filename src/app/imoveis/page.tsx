import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PropertyCard from "../../components/PropertyCard";
import SearchPanel from "../../components/SearchPanel";
import { createClient } from "../../lib/supabase/server";
import { Property } from "../../types/property";

function onlyNumbers(value?: string) {
  return Number(String(value || "").replace(/\D/g, "")) || 0;
}

function priceToNumber(price?: string | null) {
  if (!price) return 0;
  return Number(String(price).replace(/\D/g, "")) || 0;
}

function textIncludes(value: string | null | undefined, search: string) {
  return String(value || "").toLowerCase().includes(search.toLowerCase());
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
    valorMin?: string;
    valorMax?: string;
    codigo?: string;
  }>;
}) {
  const params = searchParams ? await searchParams : {};
  const supabase = await createClient();

  let query = supabase.from("properties").select("*").order("created_at", { ascending: false });

  if (params?.operacao) query = query.eq("operation", params.operacao);
  if (params?.tipo) query = query.eq("category", params.tipo);
  if (params?.cidade) query = query.eq("city", params.cidade);
  if (params?.bairro) query = query.eq("neighborhood", params.bairro);
  if (params?.quartos) query = query.gte("bedrooms", Number(params.quartos));

  const { data, error } = await query;

  const valorMin = onlyNumbers(params?.valorMin);
  const valorMax = onlyNumbers(params?.valorMax);
  const codigo = String(params?.codigo || "").trim();

  const properties = ((data || []) as Property[]).filter((property) => {
    const price = priceToNumber(property.price);
    if (valorMin && price < valorMin) return false;
    if (valorMax && price > valorMax) return false;
    if (codigo) {
      const match =
        textIncludes(property.slug, codigo) ||
        textIncludes(property.id, codigo) ||
        textIncludes(property.title, codigo);
      if (!match) return false;
    }
    return true;
  });

  const hasFilter = Boolean(
    params?.operacao || params?.tipo || params?.cidade || params?.bairro ||
    params?.quartos || params?.valorMin || params?.valorMax || params?.codigo
  );

  return (
    <main className="page">
      <Navbar />

      <section className="pageTop propertiesTop">
        <div className="container">
          <h1>{params?.tipo ? params.tipo : "Imóveis"}</h1>
          <p>Confira oportunidades cadastradas pela Alexandrowitch Imobiliária e Administradora.</p>
          <SearchPanel initial={params || {}} />
        </div>
      </section>

      <section className="section sectionLight pageResultsSection">
        <div className="container">
          <div className="resultsHeader">
            <div>
              <span className="eyebrow">Resultado da busca</span>
              <h2>{properties.length} imóvel{properties.length === 1 ? "" : "is"} encontrado{properties.length === 1 ? "" : "s"}</h2>
            </div>
            {hasFilter && <a className="btnLight" href="/imoveis">Limpar pesquisa</a>}
          </div>

          {error && <p className="sectionText">Erro ao carregar imóveis: {error.message}</p>}
          {!error && properties.length === 0 && (
            <div className="emptyLuxury">
              <h3>Nenhum imóvel encontrado com esses filtros.</h3>
              <p>Altere cidade, bairro, valor ou tipo de imóvel para ampliar a busca.</p>
            </div>
          )}

          <div className="grid3 resultGrid">
            {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
