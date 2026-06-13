import Link from "next/link";
import PropertyCard from "./PropertyCard";
import { createClient } from "../lib/supabase/server";

export default async function FeaturedProperties() {
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <section className="section">
      <div className="container">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Imóveis em destaque</h2>
          <p className="sectionText">Imóveis cadastrados diretamente pelo painel do corretor.</p>
        </div>

        {!properties?.length && (
          <p className="sectionText">Nenhum imóvel em destaque ainda.</p>
        )}

        <div className="grid3">
          {(properties || []).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div style={{ marginTop: 38 }}>
          <Link href="/imoveis" className="btnDark">Ver todos os imóveis</Link>
        </div>
      </div>
    </section>
  );
}
