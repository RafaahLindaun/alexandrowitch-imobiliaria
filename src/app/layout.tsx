import "./globals.css";
import FloatingContact from "../components/FloatingContact";
import PageTransition from "../components/PageTransition";
import CookieConsent from "../components/CookieConsent";
import GlobalInteractions from "../components/GlobalInteractions";
export const metadata = {
  title: "Alexandrowitch Imobiliária e Administradora",
  description: "Imóveis em São Paulo, São Roque e regiões.",
  manifest: "/site.webmanifest",
  themeColor: "#08152F",
  icons: {
    icon: [
      { url: "/favicon.ico?v=41", sizes: "any" },
      { url: "/favicon-32.png?v=41", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png?v=41", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/favicon.ico?v=41",
    apple: [
      { url: "/apple-touch-icon.png?v=41", sizes: "180x180", type: "image/png" }
    ]
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#08152F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><GlobalInteractions /><PageTransition />{children}<FloatingContact /><CookieConsent /></body></html>;
}
