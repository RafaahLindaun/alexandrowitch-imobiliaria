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

  return (
    <main className="page">
      <Navbar />

      <section className="pageTop">
        <div className="container adminHeader">
          <div>
            <h1>Painel do Corretor</h1>
            <p>Cadastre, edite e acompanhe os imóveis publicados no site.</p>
          </div>
          <div className="adminActions">
            <Link href="/admin/novo" className="btnPrimary">Novo imóvel</Link>
            <a href="/admin/logout" className="btnSecondary">Sair</a>
          </div>
        </div>
      </section>

      <section className="section sectionLight">
        <div className="container">
          {!properties?.length && <p className="sectionText">Nenhum imóvel cadastrado ainda.</p>}

          <div className="grid3">
            {(properties || []).map((property) => (
              <div className="adminCard" key={property.id}>
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
