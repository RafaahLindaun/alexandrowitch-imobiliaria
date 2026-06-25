import { CONTACT_EMAIL, MARIA_EMAIL, MAIN_WHATSAPP, MARIA_WHATSAPP, CRECI_TEXT, EMAIL_LINK, whatsappLink } from "../constants/contact";

export default function ContactSection() {
  return (
    <section className="section sectionDark">
      <div className="container">
        <div className="sectionHeader">
          <div>
            <div className="eyebrow">Fale conosco</div>
            <h2 className="sectionTitle">Escolha a melhor forma de contato</h2>
          </div>
          <p className="sectionText">
            Atendimento para compra, venda, locação, administração de imóveis, condomínios e dúvidas sobre oportunidades em São Paulo, São Roque e regiões. {CRECI_TEXT}.
          </p>
        </div>

        <div className="contactGrid contactGrid3">
          <a href={whatsappLink(MARIA_WHATSAPP, "Olá, gostaria de falar com M. Alexandrowitch.")} target="_blank" className="contactCard">
            <h3>M. Alexandrowitch</h3>
            <p>WhatsApp: (11) 99614-5011.</p>
            <p className="miniCreci">{CRECI_TEXT}</p>
          </a>

          <a href={whatsappLink(MAIN_WHATSAPP, "Olá, gostaria de falar com o Corretor Alexandrowitch.")} target="_blank" className="contactCard">
            <h3>Corretor Alexandrowitch</h3>
            <p>WhatsApp: (11) 97400-5163.</p>
          </a>

          <a className="contactCard" href={EMAIL_LINK}>
            <h3>E-mail</h3>
            <p>{CONTACT_EMAIL}</p>
            <p>{MARIA_EMAIL}</p>
            <p>Clique para abrir um rascunho pronto e cordial.</p>
          </a>
        </div>
      </div>
    </section>
  );
}
