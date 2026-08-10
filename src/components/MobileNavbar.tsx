"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CRECI_TEXT } from "../constants/contact";

export default function MobileNavbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        className={`mobileMenuButton ${open ? "active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="mobileNavOverlay" onClick={close}>
          <div className="mobileNavSheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobileNavHeader">
              <div>
                <div className="mobileNavTitle">Menu</div>
                <div className="mobileNavCreci">{CRECI_TEXT}</div>
              </div>
              <button className="mobilePanelClose" type="button" onClick={close} aria-label="Fechar menu">
                ×
              </button>
            </div>

            <div className="mobileQuickGrid">
              <Link onClick={close} href="/comprar">Comprar</Link>
              <Link onClick={close} href="/alugar">Alugar</Link>
              <Link onClick={close} href="/imoveis">Buscar</Link>
              <Link onClick={close} href="/anuncie">Anunciar</Link>
            </div>

            <nav className="mobileMenuList">
              <Link onClick={close} href="/">Início</Link>
              <Link onClick={close} href="/imoveis">Encontrar imóvel</Link>
              <Link onClick={close} href="/servicos">Serviços</Link>
              <Link onClick={close} href="/sobre">Sobre</Link>
              <Link onClick={close} href="/contato">Contato</Link>
              {isAdmin ? (
                <>
                  <Link onClick={close} href="/admin">Painel do corretor</Link>
                  <Link onClick={close} href="/admin/novo">Novo imóvel</Link>
                  <Link onClick={close} href="/admin/vendidos">Vendidos</Link>
                  <Link onClick={close} href="/admin/logout">Sair</Link>
                </>
              ) : (
                <Link onClick={close} href="/admin/login">Corretor</Link>
              )}
            </nav>

            <div className="mobileMenuFooter">
              <a href="https://wa.me/5511996145011" target="_blank" rel="noopener noreferrer" onClick={close}>
                WhatsApp M. Alexandrowitch
              </a>
              <Link onClick={close} href="/contato">Contato completo</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
