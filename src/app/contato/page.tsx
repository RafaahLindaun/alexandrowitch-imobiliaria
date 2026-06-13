import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ContactSection from "../../components/ContactSection";
import { CONTACT_EMAIL } from "../../constants/contact";

export default function ContactPage() {
  return (
    <main className="page">
      <Navbar />
      <section className="pageTop">
        <div className="container">
          <h1>Fale Conosco</h1>
          <p>Escolha a melhor forma de contato com a Alexandrowitch Imobiliária e Administradora.</p>
        </div>
      </section>

      <ContactSection />

      <section className="section">
        <div className="container">
          <div className="grid3">
            <div className="adminCard"><h3>WhatsApp</h3><p>(11) 97400-5163</p></div>
            <div className="adminCard"><h3>E-mail</h3><p>{CONTACT_EMAIL}</p></div>
            <div className="adminCard"><h3>Localização</h3><p>São Roque - SP</p></div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
