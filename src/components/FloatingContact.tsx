"use client";

import { useState } from "react";
import { EMAIL_LINK, MAIN_WHATSAPP } from "../constants/contact";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="floatingContact">
      {open && (
        <div className="floatPanel">
          <h3>Fale conosco</h3>
          <p>Escolha a melhor forma de contato</p>

          <div className="floatActions">
            <a
              className="btnDark"
              href={`https://wa.me/${MAIN_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Fale com o Corretor Alexandrowitch
            </a>

            <a className="btnPrimary" href={EMAIL_LINK}>
              E-mail
            </a>
          </div>
        </div>
      )}

      <button
        className={`floatMainButton ${open ? "isOpen" : ""}`}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Fechar contato" : "Abrir contato"}
      >
        {open ? (
          <span className="floatCloseIcon">×</span>
        ) : (
          <span className="floatWhatsIcon">W</span>
        )}
      </button>
    </div>
  );
}
