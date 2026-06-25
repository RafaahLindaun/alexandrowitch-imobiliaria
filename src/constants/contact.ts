export const CONTACT_EMAIL = "alexandrowitch.imobiliaria@gmail.com";
export const MARIA_EMAIL = "m.alexandrowitch@hotmail.com";
export const MAIN_WHATSAPP = "5511974005163";
export const MARIA_WHATSAPP = "5511996145011";
export const MAIN_BROKER_NAME = "Corretor Alexandrowitch";
export const MARIA_BROKER_NAME = "M. Alexandrowitch";
export const CRECI_TEXT = "Creci 12.109-F";
export const INSTAGRAM_URL = "https://www.instagram.com/alexandrowitch.imobiliaria";
export const FACEBOOK_URL = "https://www.facebook.com/alexandrowitch.imobiliaria";
export const EMAIL_SUBJECT = "Interesse em imóveis em São Roque";
export const EMAIL_BODY =
  "Olá! Tudo bem?%0D%0A%0D%0ATenho interesse em saber mais sobre possíveis imóveis em São Paulo, São Roque e região.%0D%0AGostaria de receber informações sobre opções disponíveis para compra, venda, locação ou administração de imóveis.%0D%0A%0D%0APeço, por gentileza, que entrem em contato o mais rápido possível.%0D%0A%0D%0AObrigado(a).";
export const EMAIL_LINK = `mailto:${CONTACT_EMAIL},${MARIA_EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${EMAIL_BODY}`;
export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
