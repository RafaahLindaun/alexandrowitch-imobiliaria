export default function ContactSection() {
  return (
    <section className="section sectionDark">
      <div className="container">
        <div className="sectionHeader">
          <div>
            <div className="eyebrow">Fale conosco</div>
            <h2 className="sectionTitle">Escolha a melhor forma de contato</h2>
          </div>
          <p className="sectionText">Atendimento para compra, venda, locação, administração de imóveis e dúvidas sobre oportunidades em São Roque.</p>
        </div>
        <div className="contactGrid">
          <a href="https://wa.me/5511974005163" target="_blank" className="contactCard">
            <h3>Fale com o Corretor</h3>
            <p>Atendimento rápido pelo WhatsApp: (11) 97400-5163.</p>
          </a>
          <div className="contactCard">
            <h3>E-mail</h3>
            <p>O e-mail será adicionado assim que você enviar o endereço oficial.</p>
          </div>
          <div className="contactCard">
            <h3>Central de Relacionamento</h3>
            <p>Suporte para clientes, proprietários e interessados em imóveis.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
