import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedProperties from "../components/FeaturedProperties";
import Services from "../components/Services";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="page">
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <Services />
      <section className="section">
        <div className="container aboutBand">
          <div className="aboutImage" />
          <div>
            <div className="eyebrow">Sobre a empresa</div>
            <h2 className="sectionTitle">Atendimento imobiliário com presença, confiança e sofisticação.</h2>
            <p className="sectionText">
              A Alexandrowitch Imobiliária e Administradora atua em São Roque e região conectando pessoas às melhores oportunidades imobiliárias,
              com transparência, segurança e acompanhamento próximo em cada etapa.
            </p>
          </div>
        </div>
      </section>
      <ContactSection />
      <Footer />
    </main>
  );
}
