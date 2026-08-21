"use client";
import { useEffect, useState } from "react";
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { if (!localStorage.getItem("alexandrowitch-cookies-ok")) setTimeout(() => setVisible(true), 900); }, []);
  if (!visible) return null;
  return (
    <div className="cookieBanner">
      <div><strong>Cookies</strong><p>Usamos cookies para melhorar sua experiência de navegação e lembrar preferências básicas do site.</p></div>
      <div className="cookieActions">
        <button type="button" className="btnLight compactBtn" onClick={() => setVisible(false)}>Agora não</button>
        <button type="button" className="btnPrimary compactBtn" onClick={() => { localStorage.setItem("alexandrowitch-cookies-ok", "1"); setVisible(false); }}>Concordo</button>
      </div>
    </div>
  );
}
