export const CONTACT_EMAIL = "alexandrowitch.imobiliaria@gmail.com";
export const MAIN_WHATSAPP = "5511974005163";
export const INSTAGRAM_URL = "https://www.instagram.com/alexandrowitch.imobiliaria";
export const FACEBOOK_URL = "https://www.facebook.com/alexandrowitch.imobiliaria";

export const EMAIL_SUBJECT = "Interesse em imóveis em São Roque";

export const EMAIL_BODY =
  "Olá! Tudo bem?%0D%0A%0D%0ATenho interesse em saber mais sobre possíveis imóveis em São Roque e região.%0D%0AGostaria de receber informações sobre opções disponíveis para compra, venda, locação ou administração de imóveis.%0D%0A%0D%0APeço, por gentileza, que entrem em contato o mais rápido possível.%0D%0A%0D%0AObrigado(a).";

export const EMAIL_LINK = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  EMAIL_SUBJECT
)}&body=${EMAIL_BODY}`;
