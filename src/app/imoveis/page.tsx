import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PropertyCard from "../../components/PropertyCard";
import { createClient } from "../../lib/supabase/server";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams?: Promise<{ tipo?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const tipo = params?.tipo;

  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (tipo) {
    query = query.eq("category", tipo);
  }

  const { data: properties, error } = await query;

  const categories = ["Casa", "Apartamento", "Chácara", "Terreno", "Comercial"];

  return (
    <main className="page">
      <Navbar />

      <section className="pageTop">
        <div className="container">
          <h1>{tipo ? tipo : "Imóveis"}</h1>
          <p>Confira oportunidades cadastradas pela Alexandrowitch Imobiliária e Administradora.</p>
          <br />
          <div className="adminActions">
            <Link href="/imoveis" className={!tipo ? "btnPrimary" : "btnSecondary"}>Todos</Link>
            {categories.map((item) => (
              <Link
                key={item}
                href={`/imoveis?tipo=${encodeURIComponent(item)}`}
                className={tipo === item ? "btnPrimary" : "btnSecondary"}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section sectionLight">
        <div className="container">
          {error && <p className="sectionText">Erro ao carregar imóveis: {error.message}</p>}
          {!error && properties?.length === 0 && <p className="sectionText">Nenhum imóvel encontrado.</p>}

          <div className="grid3">
            {(properties || []).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
