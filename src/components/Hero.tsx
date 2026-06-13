import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="heroContent">
        <div className="eyebrow">São Roque e região</div>

        <h1>Alexandrowitch Imobiliária e Administradora</h1>

        <p>
          Compra, venda, locação e administração de imóveis com atendimento
          personalizado, segurança e uma experiência de alto padrão.
        </p>

        <div className="heroActions">
          <Link href="/imoveis" className="btnPrimary">
            Ver imóveis
          </Link>

          <a
            href="https://wa.me/5511974005163"
            target="_blank"
            className="btnSecondary"
          >
            Falar com corretor
          </a>
        </div>
      </div>
    </section>
  );
}
