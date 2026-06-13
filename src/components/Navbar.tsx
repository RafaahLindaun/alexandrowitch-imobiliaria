import Link from "next/link";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link href="/" className="navbarBrand">
        <div className="logoBox">
          <img src="/logo-alexandrowitch.jpeg" alt="Logo Alexandrowitch" />
        </div>
        <div>
          <div className="brandName">Alexandrowitch</div>
          <div className="brandSub">Imobiliária e Administradora</div>
        </div>
      </Link>

      <nav className="navLinks">
        <Link href="/">Início</Link>
        <Link href="/imoveis">Imóveis</Link>
        <Link href="/sobre">Sobre</Link>
        <Link href="/contato">Contato</Link>
        <Link href="/admin/login">Corretor</Link>
        <a className="navCta" href="https://wa.me/5511974005163" target="_blank">
          Fale Conosco
        </a>
      </nav>
    </header>
  );
}
