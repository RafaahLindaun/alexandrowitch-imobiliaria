const services = [
  {
    title: "Compra e Venda",
    text: "Atendimento consultivo para encontrar ou vender imóveis com estratégia, segurança e valorização.",
  },
  {
    title: "Locação",
    text: "Intermediação de locações residenciais, comerciais e de temporada com análise e suporte completo.",
  },
  {
    title: "Administração de Imóveis",
    text: "Gestão de imóveis para proprietários que buscam tranquilidade, organização e acompanhamento profissional.",
  },
  {
    title: "Administração de Condomínios",
    text: "Apoio administrativo, organização de rotinas, comunicação e gestão para condomínios com padrão profissional.",
  },
  {
    title: "Assessoria Documental",
    text: "Apoio nas etapas burocráticas, contratos, documentação e condução segura das negociações.",
  },
];

export default function Services() {
  return (
    <section className="section sectionLight">
      <div className="container">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Serviços imobiliários completos</h2>

          <p className="sectionText">
            Uma atuação pensada para proprietários, compradores, locatários, condomínios
            e investidores em São Roque e região.
          </p>
        </div>

        <div className="servicesScroller">
          {services.map((service) => (
            <article className="serviceCard" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
