import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ContactSection from "../../components/ContactSection";
import { CONTACT_EMAIL, MARIA_EMAIL, CRECI_TEXT } from "../../constants/contact";

export default function ContactPage() {
  return (
    <main className="page">
      <Navbar />
      <section className="pageTop">
        <div className="container">
          <h1>Fale Conosco</h1>
          <p>Escolha a melhor forma de contato com a Alexandrowitch Imobiliária e Administradora. {CRECI_TEXT}.</p>
        </div>
      </section>
      <ContactSection />
      <section className="section">
        <div className="container">
          <div className="grid3">
            <div className="adminCard"><h3>M. Alexandrowitch</h3><p>(11) 99614-5011</p><p>{CRECI_TEXT}</p></div>
            <div className="adminCard"><h3>Corretor Alexandrowitch</h3><p>(11) 97400-5163</p></div>
            <div className="adminCard"><h3>E-mail</h3><p>{CONTACT_EMAIL}</p><p>{MARIA_EMAIL}</p></div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
