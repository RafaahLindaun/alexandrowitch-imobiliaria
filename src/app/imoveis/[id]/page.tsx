import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ContactSection from "../../../components/ContactSection";
import { createClient } from "../../../lib/supabase/server";
import Link from "next/link";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", id)
    .single();

  if (!property) {
    return (
      <main className="page">
        <Navbar />
        <section className="pageTop">
          <div className="container">
            <h1>Imóvel não encontrado</h1>
            <p>Volte para a lista de imóveis e escolha outra opção.</p>
            <br />
            <Link href="/imoveis" className="btnPrimary">Voltar para imóveis</Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const { data: images } = await supabase
    .from("property_images")
    .select("*")
    .eq("property_id", property.id)
    .order("created_at", { ascending: true });

  const gallery = [
    property.cover_image,
    ...((images || []).map((image) => image.image_url)),
  ].filter(Boolean) as string[];

  const heroImage =
    property.cover_image ||
    gallery[0] ||
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop";

  return (
    <main className="page">
      <Navbar />

      <section className="detailHero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="detailHeroContent">
          <span className="tag">{property.operation}</span>
          <h1>{property.title}</h1>
          <p>{property.neighborhood || "São Roque"} • {property.city}</p>
        </div>
      </section>

      <section className="section">
        <div className="container detailLayout">
          <div>
            <h2 className="sectionTitle">{property.price}</h2>
            <p className="sectionText">{property.description}</p>

            <div className="features">
              <span>{property.category}</span>
              {property.area && <span>{property.area}</span>}
              {!!property.bedrooms && property.bedrooms > 0 && <span>{property.bedrooms} dormitórios</span>}
              {!!property.suites && property.suites > 0 && <span>{property.suites} suítes</span>}
              {!!property.bathrooms && property.bathrooms > 0 && <span>{property.bathrooms} banheiros</span>}
              {!!property.parking && property.parking > 0 && <span>{property.parking} vagas</span>}
            </div>

            {gallery.length > 0 && (
              <>
                <h3>Galeria</h3>
                <div className="gallery">
                  {gallery.slice(0, 7).map((image, index) => (
                    <div key={`${image}-${index}`} className="galleryItem" style={{ backgroundImage: `url(${image})` }} />
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="sidebarBox">
            <h3>Tenho interesse</h3>
            <p>Fale com um corretor para receber mais informações sobre este imóvel.</p>

            <a
              className="btnPrimary"
              target="_blank"
              href={`https://wa.me/5511974005163?text=Olá, tenho interesse no imóvel: ${encodeURIComponent(property.title)}`}
            >
              Falar no WhatsApp
            </a>
          </aside>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </main>
  );
}
