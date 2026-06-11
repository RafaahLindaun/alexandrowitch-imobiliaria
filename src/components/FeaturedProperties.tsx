import Link from "next/link";
import { properties } from "../data/properties";
import PropertyCard from "./PropertyCard";

export default function FeaturedProperties() {
  const featured = properties.filter((property) => property.featured);
  return (
    <section className="section">
      <div className="container">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Imóveis em destaque</h2>
          <p className="sectionText">Uma seleção inicial de imóveis para venda e locação. Depois, esses dados poderão vir do painel administrativo.</p>
        </div>
        <div className="grid3">
          {featured.map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
        <div style={{ marginTop: 38 }}>
          <Link href="/imoveis" className="btnDark">Ver todos os imóveis</Link>
        </div>
      </div>
    </section>
  );
}
