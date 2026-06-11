import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ContactSection from "../../../components/ContactSection";
import { properties } from "../../../data/properties";
import Link from "next/link";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = properties.find((item) => item.id === id);

  if (!property) {
    return (
      <main className="page">
        <Navbar />
        <section className="pageTop">
          <div className="container">
            <h1>Imóvel não encontrado</h1>
            <p>Volte para a lista de imóveis e escolha outra opção.</p>
            <br />
            <Link href="/imoveis" className="btnPrimary">Voltar para imóveis</Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="page">
      <Navbar />
      <section className="detailHero" style={{ backgroundImage: `url(${property.image})` }}>
        <div className="detailHeroContent">
          <span className="tag">{property.operation}</span>
          <h1>{property.title}</h1>
          <p>{property.neighborhood} • {property.city}</p>
        </div>
      </section>
      <section className="section">
        <div className="container detailLayout">
          <div>
            <h2 className="sectionTitle">{property.price}</h2>
            <p className="sectionText">{property.description}</p>
            <div className="features">
              <span>{property.category}</span><span>{property.area}</span>
              {property.bedrooms > 0 && <span>{property.bedrooms} dormitórios</span>}
              {property.suites > 0 && <span>{property.suites} suítes</span>}
              {property.bathrooms > 0 && <span>{property.bathrooms} banheiros</span>}
              {property.parking > 0 && <span>{property.parking} vagas</span>}
            </div>
            <h3>Destaques</h3>
            <div className="features">
              {property.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}
            </div>
          </div>
          <aside className="sidebarBox">
            <h3>Tenho interesse</h3>
            <p>Fale com um corretor para receber mais informações sobre este imóvel.</p>
            <a className="btnPrimary" target="_blank" href={`https://wa.me/5511974005163?text=Olá, tenho interesse no imóvel: ${encodeURIComponent(property.title)}`}>Falar no WhatsApp</a>
          </aside>
        </div>
      </section>
      <ContactSection />
      <Footer />
    </main>
  );
}
