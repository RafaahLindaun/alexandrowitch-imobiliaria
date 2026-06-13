import { redirect } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import EditPropertyForm from "../../../../components/EditPropertyForm";
import { createClient } from "../../../../lib/supabase/server";

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

  return (
    <main className="page">
      <Navbar />
      <section className="pageTop">
        <div className="container">
          <h1>Editar Imóvel</h1>
          <p>Atualize informações e adicione novas fotos à galeria.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <EditPropertyForm property={property} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
