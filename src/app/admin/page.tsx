import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { properties } from "../../data/properties";

export default function AdminPage() {
  return (
    <main className="page">
      <Navbar />
      <section className="pageTop">
        <div className="container adminHeader">
          <div>
            <h1>Painel Administrativo</h1>
            <p>Área inicial para organizar os imóveis. Na próxima etapa ligamos isso ao Supabase para salvar de verdade.</p>
          </div>
          <Link href="/admin/novo" className="btnPrimary">Novo Imóvel</Link>
        </div>
      </section>
      <section className="section sectionLight">
        <div className="container">
          <div className="grid3">
            {properties.map((property) => (
              <div className="adminCard" key={property.id}>
                <h3>{property.title}</h3>
                <p>{property.operation} • {property.price}<br />{property.city} - {property.neighborhood}</p>
                <Link href={`/imoveis/${property.id}`} className="btnDark">Ver no site</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
