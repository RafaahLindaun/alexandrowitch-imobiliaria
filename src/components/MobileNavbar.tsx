"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CRECI_TEXT } from "../constants/contact";

export default function MobileNavbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        className={`mobileMenuButton ${open ? "active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menu"
        aria-expanded={open}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="mobileNavOverlay" onClick={close}>
          <aside
            className="mobilePanel mobilePanelOpen"
            onClick={(e) => e.stopPropagation()}
            aria-label="Menu mobile"
          >
            <div className="mobilePanelTop">
              <div className="mobilePanelBrand">
                <div className="mobilePanelLogo">
                  <img src="/logo-alexandrowitch.jpeg" alt="Logo Alexandrowitch" />
                </div>
                <div className="mobilePanelBrandText">
                  <strong>Alexandrowitch</strong>
                  <small>{isAdmin ? "Painel do Corretor" : "Imobiliária e Administradora"}</small>
                  <span>{CRECI_TEXT}</span>
                </div>
              </div>

              <button className="mobilePanelClose" onClick={close} type="button" aria-label="Fechar menu">
                ×
              </button>
            </div>

            <div className="mobileQuickGrid">
              <Link onClick={close} href="/comprar">Comprar</Link>
              <Link onClick={close} href="/alugar">Alugar</Link>
              <Link onClick={close} href="/imoveis">Buscar</Link>
              <Link onClick={close} href="/anuncie">Anunciar</Link>
            </div>

            <div className="mobileMenuList">
              <Link onClick={close} href="/">Início</Link>
              <Link onClick={close} href="/imoveis">Encontrar imóvel</Link>
              <Link onClick={close} href="/servicos">Serviços</Link>
              <Link onClick={close} href="/sobre">Sobre</Link>
              <Link onClick={close} href="/contato">Contato</Link>
              {isAdmin ? (
                <>
                  <Link onClick={close} href="/admin">Painel do Corretor</Link>
                  <Link onClick={close} href="/admin/novo">Novo imóvel</Link>
                  <Link onClick={close} href="/admin/vendidos">Vendidos</Link>
                  <Link onClick={close} href="/admin/logout">Sair</Link>
                </>
              ) : (
                <Link onClick={close} href="/admin/login">Corretor</Link>
              )}
            </div>

            <div className="mobilePanelFooter">
              <a href="https://wa.me/5511996145011" target="_blank" rel="noopener noreferrer" onClick={close}>
                WhatsApp M. Alexandrowitch
              </a>
              <a href="/contato" onClick={close}>
                Ver contato completo
              </a>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
