import "./globals.css";
import FloatingContact from "../components/FloatingContact";
import PageTransition from "../components/PageTransition";
import CookieConsent from "../components/CookieConsent";
import GlobalInteractions from "../components/GlobalInteractions";
export const metadata = {
  title: "Alexandrowitch Imobiliária e Administradora",
  description: "Imóveis em São Paulo, São Roque e regiões.",
  manifest: "/site.webmanifest",
  themeColor: "#0D1B3E",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" }
    ],
    shortcut: "/shortcut-icon.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" }
    ],
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0D1B3E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><GlobalInteractions /><PageTransition />{children}<FloatingContact /><CookieConsent /></body></html>;
}
