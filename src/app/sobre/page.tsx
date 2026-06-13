import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ContactSection from "../../components/ContactSection";

export default function AboutPage() {
  return (
    <main className="page">
      <Navbar />

      <section className="pageTop">
        <div className="container">
          <h1>Sobre a Alexandrowitch Imobiliária e Administradora</h1>
          <p>Tradição, transparência e atendimento personalizado no mercado imobiliário.</p>
        </div>
      </section>

      <section className="section">
        <div className="container aboutBand">
          <div>
            <div className="eyebrow">Nossa história</div>
            <h2 className="sectionTitle">Uma trajetória familiar no mercado imobiliário desde 1964.</h2>
          </div>

          <div className="aboutTextBlock">
            <p>Somos de família tradicional no ramo imobiliário de São Paulo que atua na área desde 1964, uma das precursoras na atividade.</p>
            <p>O que propiciou a Maria Cristina Alexandrowitch uma vivência forte na área em que atua, desde muito nova.</p>
            <p>Sua filha, Cristiane Alexandrowitch do Amaral, seguiu os mesmos passos, e juntas, possuem um trabalho diferenciado.</p>
            <p>Somos especializadas na compra, venda e locação de imóveis, principalmente em administração destas locações, prestamos toda assessoria necessária à realização de uma transação segura e tranquila, com acompanhamento jurídico e operacional de qualidade, com a máxima transparência e honestidade.</p>
            <p>Nossos valores são a ética profissional e a transparência no mercado imobiliário.</p>
            <p>Oferecemos aos nossos clientes um atendimento personalizado, resultando em segurança e satisfação a todos os negócios realizados.</p>
            <p>Somos profissionais capacitadas e diferenciadas para uma total eficiência e garantia nas intermediações imobiliárias.</p>
            <p>Entre em contato, teremos o prazer em ajudá-lo a realizar o sonho de adquirir a casa própria ou alugar o seu imóvel com a maior segurança de recebimento e cuidado com o seu patrimônio.</p>
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </main>
  );
}
