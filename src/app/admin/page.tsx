import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminPropertyManager from "../../components/AdminPropertyManager";
import { createClient } from "../../lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/admin/login");
  }

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="page adminDashboardPage">
      <Navbar />

      <section className="pageTop adminPageTop adminHeroRefined">
        <div className="container">
          <span className="adminPill">Você está logado como corretor</span>
          <h1>Painel do Corretor</h1>
          <p>
            Pesquise por código, palavra-chave, bairro ou preço. Edite imóveis e marque como vendido em poucos cliques.
          </p>

          <div className="adminActions adminHeroActions">
            <Link href="/" className="btnLight">Ver site</Link>
            <Link href="/imoveis" className="btnLight">Ver imóveis no site</Link>
            <Link href="/admin/novo" className="btnPrimary">Novo imóvel</Link>
            <Link href="/admin/vendidos" className="btnSecondary">Vendidos</Link>
            <a href="/admin/logout" className="btnSecondary">Sair</a>
          </div>
        </div>
      </section>

      <section className="section sectionLight adminManagerSection">
        <div className="container">
          <AdminPropertyManager initialProperties={(properties || []) as any} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
