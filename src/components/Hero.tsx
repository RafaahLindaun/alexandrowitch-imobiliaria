import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero newHero">
      <div className="heroContent">
        <div className="eyebrow">São Paulo, São Roque e regiões</div>
        <h1>Imóveis selecionados com tradição, segurança e cuidado.</h1>
        <p>Compra, venda, locação, administração de imóveis e administração de condomínios com atendimento personalizado.</p>
        <div className="heroActions">
          <Link href="/comprar" className="btnPrimary">Comprar imóvel</Link>
          <Link href="/alugar" className="btnSecondary">Alugar imóvel</Link>
          <Link href="/anuncie" className="btnSecondary">Anunciar imóvel</Link>
        </div>
      </div>
    </section>
  );
}
