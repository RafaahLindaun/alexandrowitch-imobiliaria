import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PropertyCard from "../../components/PropertyCard";
import { createClient } from "../../lib/supabase/server";

export default async function PropertiesPage() {
  const supabase = await createClient();

  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="page">
      <Navbar />

      <section className="pageTop">
        <div className="container">
          <h1>Imóveis</h1>
          <p>Confira oportunidades cadastradas pela Alexandrowitch Imobiliária e Administradora.</p>
        </div>
      </section>

      <section className="section sectionLight">
        <div className="container">
          {error && <p className="sectionText">Erro ao carregar imóveis: {error.message}</p>}
          {!error && properties?.length === 0 && <p className="sectionText">Nenhum imóvel cadastrado ainda.</p>}

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
