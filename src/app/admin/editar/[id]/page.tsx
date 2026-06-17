import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import EditPropertyForm from "../../../../components/EditPropertyForm";
import { createClient } from "../../../../lib/supabase/server";
import { getPropertyCode } from "../../../../lib/propertyCode";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/admin/login");
  }

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (!property) {
    redirect("/admin");
  }

  const { data: galleryImages } = await supabase
    .from("property_images")
    .select("id,image_url")
    .eq("property_id", property.id)
    .order("created_at", { ascending: true });

  return (
    <main className="page adminEditPage">
      <Navbar />

      <section className="pageTop adminPageTop editorHero">
        <div className="container">
          <div className="backLine">
            <Link href="/admin" className="btnLight">← Voltar ao painel</Link>
            <Link href={`/imoveis/${property.slug}`} className="btnLight" target="_blank">Ver anúncio</Link>
          </div>

          <span className="adminPill">Modo Corretor</span>
          <h1>Editar anúncio</h1>
          <p>
            Código {getPropertyCode(property.id)}. Atualize o imóvel olhando a prévia ao vivo,
            escolha a capa e salve já vendo como ficará para o cliente.
          </p>
        </div>
      </section>

      <section className="section sectionLight editorSectionWrap">
        <div className="container">
          <EditPropertyForm property={property} galleryImages={(galleryImages || []) as any} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
