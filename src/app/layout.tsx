import "./globals.css";
import FloatingContact from "../components/FloatingContact";
import PageTransition from "../components/PageTransition";
import CookieConsent from "../components/CookieConsent";
import GlobalInteractions from "../components/GlobalInteractions";
export const metadata = {
  title: "Alexandrowitch Imobiliária e Administradora",
  description: "Imóveis em São Paulo, São Roque e regiões.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><GlobalInteractions /><PageTransition />{children}<FloatingContact /><CookieConsent /></body></html>;
}
