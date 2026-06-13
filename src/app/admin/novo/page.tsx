import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import NewPropertyForm from "../../../components/NewPropertyForm";
import { createClient } from "../../../lib/supabase/server";

export default async function NewPropertyPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/admin/login");

  return (
    <main className="page">
      <Navbar />
      <section className="pageTop adminPageTop">
        <div className="container">
          <div className="backLine"><Link href="/admin" className="btnLight">← Voltar ao painel</Link></div>
          <span className="adminPill">Modo Corretor</span>
          <h1>Novo Imóvel</h1>
          <p>Cadastre informações, características e várias fotos do imóvel.</p>
        </div>
      </section>
      <section className="section">
        <div className="container"><NewPropertyForm /></div>
      </section>
      <Footer />
    </main>
  );
}
