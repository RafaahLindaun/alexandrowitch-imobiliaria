import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { createClient } from "../../../lib/supabase/server";
export default async function LeadsPage() {
  const supabase = await createClient(); const { data: userData } = await supabase.auth.getUser(); if (!userData.user) redirect("/admin/login");
  return <main className="page"><Navbar /><section className="pageTop adminPageTop"><div className="container"><div className="backLine"><Link href="/admin" className="btnLight">← Voltar ao painel</Link></div><span className="adminPill">Modo Corretor</span><h1>Clientes</h1><p>Área temporariamente simplificada para evitar erro. Vamos reativar a importação por Excel depois da parte visual ficar estável.</p></div></section><section className="section sectionLight"><div className="container"><div className="adminCard"><h3>Captação de clientes</h3><p>Esta área ficou reservada para o CRM. Por enquanto, os contatos principais entram pelo WhatsApp e e-mail do site.</p><Link href="/admin" className="btnDark">Voltar ao painel</Link></div></div></section><Footer /></main>;
}
