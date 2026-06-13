import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ContactSection from "../../../components/ContactSection";
import ExpandableInfo from "../../../components/ExpandableInfo";
import ImageLightbox from "../../../components/ImageLightbox";
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

  const floorPlans = (property.floor_plan_images || []).filter(Boolean) as string[];

  const heroImage = property.cover_image || gallery[0] || "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop";
  const brokerPhone = property.broker_phone || "11974005163";
  const brokerName = property.broker_name || "Corretor Alexandrowitch";
  const brokerPhoto = property.broker_photo || "/logo-alexandrowitch.jpeg";

  return (
    <main className="page">
      <Navbar />

      <section className="detailHero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="detailHeroContent">
          <span className="statusBadge">{property.operation}</span>
          <h1>{property.title}</h1>
          <p>{property.neighborhood || "São Roque"} • {property.city}</p>
        </div>
      </section>

      <section className="section">
        <div className="container detailLayout">
          <div>
            <h2 className="sectionTitle">{property.price}</h2>

            <div className="features">
              <span>{property.status || "Disponível"}</span>
              <span>{property.category}</span>
              {property.area && <span>{property.area}</span>}
              {!!property.bedrooms && property.bedrooms > 0 && <span>{property.bedrooms} dormitórios</span>}
              {!!property.suites && property.suites > 0 && <span>{property.suites} suítes</span>}
              {!!property.bathrooms && property.bathrooms > 0 && <span>{property.bathrooms} banheiros</span>}
              {!!property.parking && property.parking > 0 && <span>{property.parking} vagas</span>}
            </div>

            <ExpandableInfo title="Descrição do imóvel" defaultOpen>
              <p>{property.description || "Descrição em breve."}</p>
            </ExpandableInfo>

            <ExpandableInfo title="Características principais">
              <p>Imóvel localizado em {property.neighborhood || "São Roque"}, com foco em conforto, localização e segurança.</p>
            </ExpandableInfo>

            {gallery.length > 0 && (
              <>
                <h3>Galeria</h3>
                <ImageLightbox images={gallery} />
              </>
            )}

            {floorPlans.length > 0 && (
              <div>
                <h3>Plantas do imóvel</h3>
                <p className="sectionText">Clique para ampliar as plantas disponíveis.</p>
                <ImageLightbox images={floorPlans} classNamePrefix="floor" />
              </div>
            )}
          </div>

          <aside className="sidebarBox">
            <h3>Corretor responsável</h3>

            <div className="brokerCard">
              <div className="brokerTop">
                <div className="brokerPhoto" style={{ backgroundImage: `url(${brokerPhoto})` }} />
                <div>
                  <h3>{brokerName}</h3>
                  <p>{brokerPhone}</p>
                </div>
              </div>

              <a
                className="btnPrimary"
                target="_blank"
                href={`https://wa.me/55${brokerPhone.replace(/\D/g, "")}?text=Olá, tenho interesse no imóvel: ${encodeURIComponent(property.title)}`}
              >
                Falar no WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </main>
  );
}
