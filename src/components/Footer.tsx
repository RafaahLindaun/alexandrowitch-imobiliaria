import Link from "next/link";
import { CONTACT_EMAIL, FACEBOOK_URL, INSTAGRAM_URL, MAIN_WHATSAPP, MARIA_WHATSAPP } from "../constants/contact";

function SocialIcon({ type }: { type: "instagram" | "facebook" }) {
  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.9" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.6 20.5v-7h2.4l.6-2.8h-3v-1.9c0-.9.3-1.5 1.6-1.5h1.7V4.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v1.8H8v2.8h2.4v7h3.2Z" fill="currentColor"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer premiumFooter">
      <div className="footerInner premiumFooterInner">
        <div>
          <div className="footerLogoLockup">
            <img src="/logo-alexandrowitch.png" alt="Alexandrowitch" />
            <div>
              <div className="brandName">Alexandrowitch</div>
              <div className="brandSub">Imobiliária e Administradora</div>
            </div>
          </div>

          <p className="footerLead">
            Construímos relações de confiança com soluções imobiliárias de qualidade,
            tradição e atendimento personalizado.
          </p>

          <div className="socialTitle">Redes sociais</div>
          <div className="socialLinks socialLinksRich">
            <a href={INSTAGRAM_URL} target="_blank" className="socialChip" aria-label="Instagram">
              <span className="socialSvg"><SocialIcon type="instagram" /></span>
              <span>Instagram</span>
            </a>
            <a href={FACEBOOK_URL} target="_blank" className="socialChip" aria-label="Facebook">
              <span className="socialSvg"><SocialIcon type="facebook" /></span>
              <span>Facebook</span>
            </a>
          </div>
        </div>

        <div>
          <h4>Mapa do site</h4>
          <Link href="/imoveis">Encontrar imóvel</Link>
          <Link href="/comprar">Comprar</Link>
          <Link href="/alugar">Alugar</Link>
          <Link href="/sobre">Quem somos</Link>
          <Link href="/anuncie">Anuncie seu imóvel</Link>
          <Link href="/solicite">Solicite seu imóvel</Link>
          <Link href="/contato">Contato</Link>
        </div>

        <div>
          <h4>Venda</h4>
          <Link href="/imoveis?operacao=Venda&tipo=Apartamento">Apartamentos</Link>
          <Link href="/imoveis?operacao=Venda&tipo=Casa">Casas</Link>
          <Link href="/imoveis?operacao=Venda&tipo=Chácara">Chácaras</Link>
          <Link href="/imoveis?operacao=Venda&tipo=Terreno">Terrenos</Link>

          <h4 className="footerSubTitle">Locação</h4>
          <Link href="/imoveis?operacao=Locação&tipo=Apartamento">Apartamentos</Link>
          <Link href="/imoveis?operacao=Locação&tipo=Casa">Casas</Link>
          <Link href="/imoveis?operacao=Locação&tipo=Sala%20Comercial">Salas</Link>
        </div>

        <div>
          <h4>Fale conosco</h4>
          <p>São Roque - SP</p>
          <p>M Alexandrowitch<br />(11) 99614-5011</p>
          <p>Corretor Alexandrowitch<br />(11) 97400-5163</p>
          <p>{CONTACT_EMAIL}</p>
          <a href={`https://wa.me/${MARIA_WHATSAPP}`} target="_blank">WhatsApp M Alexandrowitch</a>
          <a href={`https://wa.me/${MAIN_WHATSAPP}`} target="_blank">WhatsApp Corretor</a>
        </div>
      </div>

      <div className="footerBottom">
        © 2026 Alexandrowitch Imobiliária e Administradora. Todos os direitos reservados.
      </div>
    </footer>
  );
}
