"use client";

import { useState } from "react";
import { EMAIL_LINK, MAIN_WHATSAPP, MARIA_WHATSAPP, whatsappLink } from "../constants/contact";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="whatsappSvg">
      <path fill="currentColor" d="M16.02 3.2C8.95 3.2 3.2 8.94 3.2 16c0 2.27.6 4.47 1.74 6.42L3.1 29l6.76-1.78A12.7 12.7 0 0 0 16.02 28.8c7.06 0 12.8-5.74 12.8-12.8S23.08 3.2 16.02 3.2Zm0 23.42c-1.98 0-3.9-.55-5.57-1.6l-.4-.25-4.01 1.05 1.07-3.9-.26-.4A10.55 10.55 0 0 1 5.4 16c0-5.86 4.76-10.62 10.62-10.62S26.64 10.14 26.64 16 21.88 26.62 16.02 26.62Zm5.82-7.95c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.27-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.58-1.6-.95-.85-1.6-1.91-1.79-2.23-.19-.32-.02-.5.14-.66.15-.15.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.55-.73-.56h-.62c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64s1.14 3.07 1.3 3.28c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`floatingContact ${open ? "contactOpen" : ""}`}>
      {open && (
        <div className="floatPanel premiumFloatPanel">
          <div className="floatPanelGlow" />
          <div className="floatPanelHeader"><span className="floatHeaderIcon"><WhatsAppIcon /></span><div><h3>Fale conosco</h3><p>Escolha a melhor forma de contato</p></div></div>
          <div className="floatActions premiumFloatActions">
            <a className="floatContactOption primaryOption" href={whatsappLink(MARIA_WHATSAPP, "Olá, gostaria de falar com M Alexandrowitch sobre imóveis em São Paulo, São Roque e regiões.")} target="_blank" rel="noopener noreferrer"><span className="optionIcon"><WhatsAppIcon /></span><span><strong>M Alexandrowitch</strong><small>(11) 99614-5011</small></span></a>
            <a className="floatContactOption" href={whatsappLink(MAIN_WHATSAPP, "Olá, gostaria de falar com o Corretor Alexandrowitch sobre imóveis.")} target="_blank" rel="noopener noreferrer"><span className="optionIcon"><WhatsAppIcon /></span><span><strong>Corretor Alexandrowitch</strong><small>(11) 97400-5163</small></span></a>
            <a className="floatContactOption emailOption" href={EMAIL_LINK}><span className="optionIcon emailIcon">@</span><span><strong>E-mail</strong><small>rascunho pronto</small></span></a>
          </div>
        </div>
      )}
      <button className={`floatMainButton premiumWhatsButton ${open ? "isOpen" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Fechar contato" : "Abrir contato pelo WhatsApp"}>{open ? <span className="floatCloseIcon">×</span> : <WhatsAppIcon />}</button>
    </div>
  );
}
