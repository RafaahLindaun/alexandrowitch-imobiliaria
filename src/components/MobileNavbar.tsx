"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNavbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="mobileMenuButton" onClick={() => setOpen((value) => !value)}>
        Menu
      </button>

      {open && (
        <div className="mobilePanel">
          {isAdmin && <Link href="/admin">Painel do Corretor</Link>}

          <Link href="/">Início</Link>
          <Link href="/imoveis">Todos os imóveis</Link>
          <Link href="/imoveis?tipo=Casa">Casas</Link>
          <Link href="/imoveis?tipo=Apartamento">Apartamentos</Link>
          <Link href="/imoveis?tipo=Chácara">Chácaras</Link>
          <Link href="/imoveis?tipo=Terreno">Terrenos</Link>
          <Link href="/imoveis?tipo=Comercial">Comerciais</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/contato">Contato</Link>

          {isAdmin ? (
            <>
              <Link href="/admin/novo">Novo imóvel</Link>
              <Link href="/admin/leads">Leads</Link>
              <Link href="/admin/vendidos">Vendidos</Link>
              <Link href="/admin/logout">Sair</Link>
            </>
          ) : (
            <Link href="/admin/login">Corretor</Link>
          )}

          <a href="https://wa.me/5511974005163" target="_blank">
            WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
