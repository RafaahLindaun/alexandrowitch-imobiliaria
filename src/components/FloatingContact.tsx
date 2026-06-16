"use client";
import { useState } from "react";
import { EMAIL_LINK, MAIN_WHATSAPP, MARIA_WHATSAPP, whatsappLink } from "../constants/contact";
export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  return <div className="floatingContact">
    {open && <div className="floatPanel"><h3>Fale conosco</h3><p>Escolha a melhor forma de contato</p><div className="floatActions">
      <a className="btnDark" href={whatsappLink(MARIA_WHATSAPP,"Olá, gostaria de falar com M Alexandrowitch sobre imóveis em São Roque e região.")} target="_blank" rel="noopener noreferrer">M Alexandrowitch<small>(11) 99614-5011</small></a>
      <a className="btnDark" href={whatsappLink(MAIN_WHATSAPP,"Olá, gostaria de falar com o Corretor Alexandrowitch sobre imóveis.")} target="_blank" rel="noopener noreferrer">Corretor Alexandrowitch<small>(11) 97400-5163</small></a>
      <a className="btnPrimary" href={EMAIL_LINK}>E-mail<small>rascunho pronto</small></a>
    </div></div>}
    <button className={`floatMainButton ${open ? "isOpen" : ""}`} type="button" onClick={()=>setOpen(v=>!v)} aria-label={open?"Fechar contato":"Abrir contato"}>{open ? <span className="floatCloseIcon">×</span> : <span className="floatWhatsIcon">W</span>}</button>
  </div>;
}
