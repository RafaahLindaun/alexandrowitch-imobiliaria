import Link from "next/link";

const groups = [
  {
    eyebrow: "Tipo",
    title: "Tipo de Imóvel",
    text: "Escolha rapidamente o perfil de imóvel que deseja visualizar.",
    links: [
      ["Apartamentos", "/imoveis?tipo=Apartamento"],
      ["Casas", "/imoveis?tipo=Casa"],
      ["Chácaras", "/imoveis?tipo=Chácara"],
      ["Terrenos", "/imoveis?tipo=Terreno"],
    ],
  },
  {
    eyebrow: "Valor",
    title: "Faixa de Preço",
    text: "Atalhos por preço para acelerar a busca.",
    links: [
      ["Até R$ 400 mil", "/imoveis?valorMax=400000"],
      ["R$ 400 mil a R$ 900 mil", "/imoveis?valorMin=400000&valorMax=900000"],
      ["Alto padrão", "/imoveis?valorMin=900000"],
    ],
  },
  {
    eyebrow: "Região",
    title: "Localização",
    text: "Veja imóveis por cidade e principais regiões de atuação.",
    links: [
      ["São Paulo", "/imoveis?cidade=São%20Paulo"],
      ["São Roque", "/imoveis?cidade=São%20Roque"],
      ["Mairinque", "/imoveis?cidade=Mairinque"],
      ["Alumínio", "/imoveis?cidade=Alumínio"],
    ],
  },
  {
    eyebrow: "Perfil",
    title: "Características",
    text: "Filtros rápidos por comodidades importantes.",
    links: [
      ["3+ quartos", "/imoveis?quartos=3"],
      ["2+ vagas", "/imoveis?vagas=2"],
      ["Casa em condomínio", "/imoveis?tipo=Casa%20em%20Condomínio"],
    ],
  },
];

export default function QuickBrowse() {
  return (
    <section className="section quickBrowseSection refinedQuickBrowseSection">
      <div className="container">
        <div className="sectionHeader refinedQuickHeader">
          <div>
            <span className="eyebrow">Encontre por perfil</span>
            <h2 className="sectionTitle">Navegue do jeito que procura</h2>
          </div>
          <p className="sectionText">
            Caminhos rápidos para compra, locação, tipos de imóveis e principais filtros.
          </p>
        </div>

        <div className="refinedQuickGrid">
          {groups.map((group) => (
            <article key={group.title} className="refinedQuickCard">
              <span className="quickEyebrow">{group.eyebrow}</span>
              <h3>{group.title}</h3>
              <p>{group.text}</p>

              <div className="quickChipList">
                {group.links.map(([label, href]) => (
                  <Link key={label} href={href}>
                    {label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
