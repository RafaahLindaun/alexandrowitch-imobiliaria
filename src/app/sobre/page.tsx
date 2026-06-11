import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ContactSection from "../../components/ContactSection";

export default function AboutPage() {
  return (
    <main className="page">
      <Navbar />
      <section className="pageTop">
        <div className="container">
          <h1>Sobre a Alexandrowitch</h1>
          <p>Imobiliária e administradora com atuação em São Roque e região, oferecendo atendimento próximo, seguro e personalizado.</p>
        </div>
      </section>
      <section className="section">
        <div className="container aboutBand">
          <div>
            <div className="eyebrow">Nossa essência</div>
            <h2 className="sectionTitle">Relações imobiliárias feitas com confiança.</h2>
            <p className="sectionText">Nosso objetivo é conduzir cada negociação com clareza, discrição e responsabilidade. Atuamos em compra, venda, locação e administração de imóveis, sempre buscando unir boas oportunidades às necessidades de cada cliente.</p>
          </div>
          <div className="aboutImage" />
        </div>
      </section>
      <ContactSection />
      <Footer />
    </main>
  );
}
