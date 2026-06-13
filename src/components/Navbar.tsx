import Link from "next/link";
import { createClient } from "../lib/supabase/server";
import MobileNavbar from "./MobileNavbar";

export default async function Navbar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isAdmin = !!data.user;

  return (
    <header className={`navbar ${isAdmin ? "adminMode" : ""}`}>
      <Link href="/" className="navbarBrand">
        <div className="logoBox">
          <img src="/logo-alexandrowitch.jpeg" alt="Logo Alexandrowitch" />
        </div>
        <div>
          <div className="brandName">Alexandrowitch</div>
          <div className="brandSub">
            {isAdmin ? "Painel do Corretor" : "Imobiliária e Administradora"}
          </div>
        </div>
      </Link>

      <nav className="navLinks">
        {isAdmin && <span className="adminPill">Modo Corretor</span>}

        <Link href="/">Início</Link>

        <div className="navDropdown">
          <button className="navDropButton" type="button">
            Imóveis ▾
          </button>

          <div className="navDropMenu">
            <Link href="/imoveis">Todos</Link>
            <Link href="/imoveis?tipo=Casa">Casas</Link>
            <Link href="/imoveis?tipo=Apartamento">Apartamentos</Link>
            <Link href="/imoveis?tipo=Chácara">Chácaras</Link>
            <Link href="/imoveis?tipo=Terreno">Terrenos</Link>
            <Link href="/imoveis?tipo=Comercial">Comerciais</Link>
          </div>
        </div>

        <Link href="/sobre">Sobre</Link>
        <Link href="/contato">Contato</Link>

        {isAdmin ? (
          <>
            <Link href="/admin">Painel</Link>
            <Link href="/admin/novo">Novo imóvel</Link>
          </>
        ) : (
          <Link href="/admin/login">Corretor</Link>
        )}

        <a className="navCta" href="https://wa.me/5511974005163" target="_blank">
          Fale Conosco
        </a>
      </nav>

      <MobileNavbar isAdmin={isAdmin} />
    </header>
  );
}
