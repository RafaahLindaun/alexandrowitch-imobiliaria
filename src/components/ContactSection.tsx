import { CONTACT_EMAIL, EMAIL_LINK, MAIN_WHATSAPP } from "../constants/contact";

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
            Atendimento para compra, venda, locação, administração de imóveis e
            dúvidas sobre oportunidades em São Roque.
          </p>
        </div>

        <div className="contactGrid">
          <a
            href={`https://wa.me/${MAIN_WHATSAPP}`}
            target="_blank"
            className="contactCard"
          >
            <h3>Fale com o Corretor Alexandrowitch</h3>
            <p>Atendimento rápido pelo WhatsApp: (11) 97400-5163.</p>
          </a>

          <a className="contactCard" href={EMAIL_LINK}>
            <h3>E-mail</h3>
            <p>{CONTACT_EMAIL}</p>
            <p>Clique para abrir um rascunho pronto e cordial.</p>
          </a>
        </div>
      </div>
    </section>
  );
}
