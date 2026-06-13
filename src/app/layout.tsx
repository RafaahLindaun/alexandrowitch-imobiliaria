import "./globals.css";
import FloatingContact from "../components/FloatingContact";

export const metadata = {
  title: "Alexandrowitch Imobiliária e Administradora",
  description: "Compra, venda, locação e administração de imóveis em São Roque e região.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
