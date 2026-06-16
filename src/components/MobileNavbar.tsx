"use client";
import { useState } from "react";
import Link from "next/link";
export default function MobileNavbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false); const close=()=>setOpen(false);
  return <>
    <button className={`mobileMenuButton ${open ? "active" : ""}`} onClick={()=>setOpen(v=>!v)} aria-label="Abrir menu"><span/><span/><span/></button>
    {open && <div className="mobilePanel">
      <div className="mobilePanelHead"><strong>Menu</strong>{isAdmin && <span>Modo corretor</span>}</div>
      <div className="mobileQuickGrid"><Link onClick={close} href="/comprar">Comprar</Link><Link onClick={close} href="/alugar">Alugar</Link><Link onClick={close} href="/imoveis">Buscar</Link><Link onClick={close} href="/anuncie">Anunciar</Link></div>
      <Link onClick={close} href="/">Início</Link><Link onClick={close} href="/imoveis">Encontrar imóvel</Link><Link onClick={close} href="/servicos">Serviços</Link><Link onClick={close} href="/sobre">Sobre</Link><Link onClick={close} href="/solicite">Solicite seu imóvel</Link><Link onClick={close} href="/contato">Contato</Link>
      {isAdmin ? <><Link onClick={close} href="/admin">Painel do Corretor</Link><Link onClick={close} href="/admin/novo">Novo imóvel</Link><Link onClick={close} href="/admin/vendidos">Vendidos</Link><Link onClick={close} href="/admin/logout">Sair</Link></> : <Link onClick={close} href="/admin/login">Corretor</Link>}
      <a href="https://wa.me/5511996145011" target="_blank">WhatsApp M Alexandrowitch</a>
    </div>}
  </>;
}
