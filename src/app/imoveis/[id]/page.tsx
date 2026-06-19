import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ContactSection from "../../../components/ContactSection";
import ExpandableInfo from "../../../components/ExpandableInfo";
import ImageLightbox from "../../../components/ImageLightbox";
import PropertyHeroCarousel from "../../../components/PropertyHeroCarousel";
import { createClient } from "../../../lib/supabase/server";
import { getPropertyCode } from "../../../lib/propertyCode";
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
  const heroImage =
    property.cover_image ||
    gallery[0] ||
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop";

  const brokerPhone = property.broker_phone || "11974005163";
  const brokerName = property.broker_name || "Corretor Alexandrowitch";
  const brokerPhoto = property.broker_photo || "/logo-alexandrowitch.png";
  const code = getPropertyCode(property.id);

  return (
    <main className="page propertyDetailPage">
      <Navbar />

      <PropertyHeroCarousel
        property={{
          title: property.title,
          operation: property.operation,
          status: property.status,
          neighborhood: property.neighborhood,
          city: property.city,
        }}
        images={gallery.length ? gallery : [heroImage]}
        code={code}
      />

      <div className="mobilePropertyBadgesBelow">
        <span>{property.operation}</span>
        <span>Cód. {code}</span>
        <span>{property.status || "Disponível"}</span>
      </div>

      <section className="propertyMainPremium">
        <div className="container">
          <div className="propertySummaryCard srSummaryCard">
            <div>
              <span className="eyebrow">Imóvel selecionado</span>
              <h2>{property.price}</h2>
              <p>{property.category} • {property.neighborhood || property.city}</p>
            </div>

            <div className="propertyMetricBar">
              {property.area && <div><strong>{property.area}</strong><span>Área</span></div>}
              {!!property.bedrooms && property.bedrooms > 0 && <div><strong>{property.bedrooms}</strong><span>Dormitórios</span></div>}
              {!!property.suites && property.suites > 0 && <div><strong>{property.suites}</strong><span>Suítes</span></div>}
              {!!property.bathrooms && property.bathrooms > 0 && <div><strong>{property.bathrooms}</strong><span>Banheiros</span></div>}
              {!!property.parking && property.parking > 0 && <div><strong>{property.parking}</strong><span>Vagas</span></div>}
            </div>
          </div>

          <div className="propertyContentPremium srDetailLayout">
            <div className="propertyLeftColumn">
              {gallery.length > 0 && (
                <section className="propertyGalleryPremium srGalleryCard">
                  <div className="premiumSectionHead">
                    <div>
                      <span className="eyebrow">Galeria</span>
                      <h3>Fotos do imóvel</h3>
                    </div>
                    <p>Clique nas fotos para abrir a galeria completa, trocar pelas setas, compartilhar e ver em tela cheia.</p>
                  </div>

                  <ImageLightbox images={gallery} />
                </section>
              )}

              <section className="propertyInfoPremium srInfoCard">
                <div className="srInfoHeader">
                  <span className="eyebrow">Sobre este imóvel</span>
                  <h3>Detalhes e características</h3>
                </div>

                <ExpandableInfo title="Descrição do imóvel" defaultOpen>
                  <p>{property.description || "Descrição em breve."}</p>
                </ExpandableInfo>

                <div className="srAmenityGrid">
                  <div><strong>{property.area || "-"}</strong><span>Área</span></div>
                  <div><strong>{property.bedrooms || 0}</strong><span>Dormitórios</span></div>
                  <div><strong>{property.suites || 0}</strong><span>Suítes</span></div>
                  <div><strong>{property.bathrooms || 0}</strong><span>Banheiros</span></div>
                  <div><strong>{property.parking || 0}</strong><span>Vagas</span></div>
                  <div><strong>{code}</strong><span>Código</span></div>
                </div>

                <ExpandableInfo title="Características principais">
                  <p>
                    Imóvel localizado em {property.neighborhood || property.city}, com foco em conforto,
                    localização e segurança.
                  </p>
                </ExpandableInfo>

                {floorPlans.length > 0 && (
                  <div className="floorPlanBlockRefined">
                    <div className="premiumSectionHead">
                      <div>
                        <span className="eyebrow">Plantas</span>
                        <h3>Plantas do imóvel</h3>
                      </div>
                    </div>
                    <ImageLightbox images={floorPlans} classNamePrefix="floor" />
                  </div>
                )}
              </section>
            </div>

            <aside className="propertyBrokerSticky">
              <div className="brokerCardPremium srBrokerBox">
                <span className="eyebrow">Atendimento</span>
                <h3>Gostou deste imóvel?</h3>

                <div className="brokerTop">
                  <div className="brokerPhoto" style={{ backgroundImage: `url(${brokerPhoto})` }} />
                  <div>
                    <strong>{brokerName}</strong>
                    <p>{brokerPhone}</p>
                  </div>
                </div>

                <a
                  className="btnPrimary"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://wa.me/55${brokerPhone.replace(/\D/g, "")}?text=Olá, tenho interesse no imóvel de código ${code}: ${encodeURIComponent(property.title)}`}
                >
                  Chamar no WhatsApp
                </a>

                <a
                  className="btnLight"
                  href={`mailto:alexandrowitch.imobiliaria@gmail.com?subject=${encodeURIComponent("Interesse no imóvel código " + code)}&body=${encodeURIComponent("Olá! Tenho interesse no imóvel de código " + code + " e gostaria de receber mais informações.")}`}
                >
                  Enviar e-mail
                </a>

                <div className="brokerMiniInfo">
                  <span>Código do imóvel</span>
                  <strong>{code}</strong>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </main>
  );
}
