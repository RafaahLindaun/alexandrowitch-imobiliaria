"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";
import MobileNavbar from "./MobileNavbar";
import { CRECI_TEXT } from "../constants/contact";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsAdmin(!!data.user));
  }, []);

  return (
    <header className={`navbar ${isAdmin ? "adminMode" : ""}`}>
      <Link href="/" className="navbarBrand premiumBrandLockup">
        <div className="logoBox premiumLogoBox">
          <img src="/logo-alexandrowitch.jpeg" alt="Logo Alexandrowitch" />
        </div>

        <div className="brandTextWrap">
          <div className="brandName">Alexandrowitch</div>
          <div className="brandSub">{isAdmin ? "Painel do Corretor" : "Imobiliária e Administradora"}</div>
          <div className="brandCreci">{CRECI_TEXT}</div>
        </div>
      </Link>

      <nav className="navLinks">
        {isAdmin && <span className="adminPill">Modo Corretor</span>}
        <Link href="/">Início</Link>

        <div className="navDropdown">
          <button className="navDropButton" type="button">Imóveis ▾</button>
          <div className="navDropMenu">
            <Link href="/imoveis">Encontrar imóvel</Link>
            <Link href="/comprar">Comprar</Link>
            <Link href="/alugar">Alugar</Link>
            <Link href="/imoveis?tipo=Casa">Casas</Link>
            <Link href="/imoveis?tipo=Apartamento">Apartamentos</Link>
            <Link href="/imoveis?tipo=Chácara">Chácaras</Link>
            <Link href="/imoveis?tipo=Terreno">Terrenos</Link>
          </div>
        </div>

        <Link href="/servicos">Serviços</Link>
        <Link href="/sobre">Sobre</Link>
        <Link href="/anuncie">Anuncie seu imóvel</Link>
        <Link href="/contato">Contato</Link>

        {isAdmin ? (
          <>
            <Link href="/admin">Painel</Link>
            <Link href="/admin/novo">Novo imóvel</Link>
          </>
        ) : (
          <Link href="/admin/login">Corretor</Link>
        )}

        <a className="navCta" href="https://wa.me/5511996145011" target="_blank" rel="noopener noreferrer">
          Fale Conosco
        </a>
      </nav>

      <MobileNavbar isAdmin={isAdmin} />
    </header>
  );
}
