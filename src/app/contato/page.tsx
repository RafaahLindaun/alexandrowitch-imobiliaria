import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  CONTACT_EMAIL,
  MARIA_EMAIL,
  MAIN_WHATSAPP,
  MARIA_WHATSAPP,
  CRECI_TEXT,
  EMAIL_LINK,
  whatsappLink,
} from "../../constants/contact";

export default function ContactPage() {
  return (
    <main className="page contactPageRefined">
      <Navbar />

      <section className="contactHeroRefined">
        <div className="container contactHeroGrid">
          <div>
            <span className="eyebrow">Fale conosco</span>
            <h1>Como podemos ajudar?</h1>
            <p>
              Escolha o canal ideal para compra, venda, locação, administração de imóveis
              ou administração de condomínios.
            </p>
            <div className="contactCreciPill">{CRECI_TEXT}</div>
          </div>

          <div className="contactHeroCard">
            <strong>Atendimento Alexandrowitch</strong>
            <span>São Paulo, São Roque e regiões</span>
            <p>Resposta rápida por WhatsApp ou e-mail com atendimento personalizado.</p>
          </div>
        </div>
      </section>

      <section className="contactOptionsSection">
        <div className="container">
          <div className="contactOptionsGrid">
            <a
              className="contactOptionLarge primaryContactOption"
              href={whatsappLink(MARIA_WHATSAPP, "Olá, gostaria de falar com M. Alexandrowitch sobre imóveis.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contactOptionIcon">☎</span>
              <div>
                <small>WhatsApp direto</small>
                <h2>M. Alexandrowitch</h2>
                <p>(11) 99614-5011</p>
              </div>
            </a>

            <a
              className="contactOptionLarge"
              href={whatsappLink(MAIN_WHATSAPP, "Olá, gostaria de falar com o Rafael Alexandrowitch sobre imóveis.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contactOptionIcon">☎</span>
              <div>
                <small>Corretor responsável</small>
                <h2>Rafael Alexandrowitch</h2>
                <p>(11) 97400-5163</p>
              </div>
            </a>

            <a className="contactOptionLarge emailContactOption" href={EMAIL_LINK}>
              <span className="contactOptionIcon">@</span>
              <div>
                <small>Rascunho pronto</small>
                <h2>E-mail</h2>
                <p>{CONTACT_EMAIL}</p>
                <p>{MARIA_EMAIL}</p>
              </div>
            </a>
          </div>

          <div className="contactInfoStrip">
            <div>
              <strong>Compra e venda</strong>
              <span>Envie o perfil desejado para separarmos opções.</span>
            </div>
            <div>
              <strong>Locação</strong>
              <span>Atendimento para locador e locatário.</span>
            </div>
            <div>
              <strong>Administração</strong>
              <span>Imóveis, locações e condomínios.</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
