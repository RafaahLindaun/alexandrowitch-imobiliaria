import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
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

  const total = properties?.length || 0;
  const sold = properties?.filter((item) => item.status === "Vendido" || item.status === "Alugado").length || 0;
  const available = total - sold;
  const featured = properties?.filter((item) => item.featured).length || 0;

  return (
    <main className="page">
      <Navbar />

      <section className="pageTop adminPageTop">
        <div className="container">
          <span className="adminPill">Você está logado como corretor</span>
          <h1>Painel do Corretor</h1>
          <p>Cadastre, edite, marque vendidos e acompanhe leads.</p>
          <br />
          <div className="adminActions">
            <Link href="/" className="btnLight">Ver site</Link>
            <Link href="/admin/novo" className="btnPrimary">Novo imóvel</Link>
            <Link href="/admin/leads" className="btnDark">Leads</Link>
            <Link href="/admin/vendidos" className="btnSecondary">Vendidos</Link>
            <a href="/admin/logout" className="btnSecondary">Sair</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid4">
          <div className="adminCard"><h3>{total}</h3><p>Total de imóveis</p></div>
          <div className="adminCard"><h3>{available}</h3><p>Disponíveis</p></div>
          <div className="adminCard"><h3>{sold}</h3><p>Vendidos/Alugados</p></div>
          <div className="adminCard"><h3>{featured}</h3><p>Em destaque</p></div>
        </div>
      </section>

      <section className="section sectionLight">
        <div className="container">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Imóveis cadastrados</h2>
          </div>

          {!properties?.length && <p className="sectionText">Nenhum imóvel cadastrado ainda.</p>}

          <div className="grid3">
            {(properties || []).map((property) => (
              <div className="adminCard" key={property.id}>
                <span className={`statusBadge ${property.status === "Vendido" || property.status === "Alugado" ? "sold" : ""}`}>
                  {property.status || "Disponível"}
                </span>
                <h3>{property.title}</h3>
                <p>{property.operation} • {property.price}<br />{property.city} - {property.neighborhood || "Sem bairro"}</p>
                <div className="adminActions">
                  <Link href={`/imoveis/${property.slug}`} className="btnDark">Ver</Link>
                  <Link href={`/admin/editar/${property.id}`} className="btnPrimary">Editar</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
