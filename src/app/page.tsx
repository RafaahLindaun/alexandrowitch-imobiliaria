import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedProperties from "../components/FeaturedProperties";
import Services from "../components/Services";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

export default function Home() {
  return (
    <main className="page">
      <Navbar />
      <Hero />

      <Reveal>
        <FeaturedProperties />
      </Reveal>

      <Reveal>
        <Services />
      </Reveal>

      <Reveal>
        <section className="section">
          <div className="container aboutBand">
            <div className="aboutImage" />
            <div>
              <div className="eyebrow">Sobre a Alexandrowitch Imobiliária e Administradora</div>
              <h2 className="sectionTitle">Tradição familiar no mercado imobiliário desde 1964.</h2>
              <p className="sectionText">
                Somos de família tradicional no ramo imobiliário de São Paulo que atua na área desde 1964,
                uma das precursoras na atividade. Somos especializadas na compra, venda e locação de imóveis,
                principalmente em administração destas locações, sempre com transparência, honestidade e segurança.
              </p>
              <a href="/sobre" className="btnDark">Conheça nossa história</a>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <ContactSection />
      </Reveal>

      <Footer />
    </main>
  );
}
