import { FACEBOOK_URL, INSTAGRAM_URL } from "../constants/contact";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <div>
          <div className="brandName">Alexandrowitch</div>
          <div className="brandSub">Imobiliária e Administradora</div>
          <br />
          <small>
            Compra • Venda • Locação • Administração
            <br />© 2026 Todos os direitos reservados.
          </small>
        </div>

        <div>
          <p>São Roque - SP</p>
          <small>Atendimento personalizado com segurança, transparência e tradição.</small>
        </div>

        <div>
          <div className="socialTitle">Redes sociais</div>
          <div className="socialLinks">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              className="socialIcon"
              aria-label="Instagram"
            >
              ◎
            </a>

            <a
              href={FACEBOOK_URL}
              target="_blank"
              className="socialIcon"
              aria-label="Facebook"
            >
              f
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
