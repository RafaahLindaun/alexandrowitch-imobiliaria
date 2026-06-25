import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ContactSection from "../../../components/ContactSection";
import ExpandableInfo from "../../../components/ExpandableInfo";
import ImageLightbox from "../../../components/ImageLightbox";
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
  const brokerPhone = property.broker_phone || "11974005163";
  const brokerName = property.broker_name || "Corretor Alexandrowitch";
  const brokerPhoto = property.broker_photo || "/logo-alexandrowitch.png";
  const code = getPropertyCode(property.id);

  return (
    <main className="page airbnbPropertyPage">
      <Navbar />

      <section className="airbnbPropertyTop">
        <div className="container">
          <Link href="/imoveis" className="airbnbBackLink">← Voltar aos imóveis</Link>

          <div className="airbnbDetailTitleRow">
            <div>
              <h1>{property.title}</h1>
              <p>{property.neighborhood || "Bairro não informado"} • {property.city}</p>
            </div>

            <div className="airbnbDetailActions">
              <a
                className="airbnbMiniAction"
                href={`https://wa.me/55${brokerPhone.replace(/\D/g, "")}?text=Olá, tenho interesse no imóvel de código ${code}: ${encodeURIComponent(property.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com corretor
              </a>
            </div>
          </div>

          <div className="airbnbPhotoMosaic">
            <ImageLightbox images={gallery} />
          </div>
        </div>
      </section>

      <section className="airbnbDetailBody">
        <div className="container airbnbDetailGrid">
          <div className="airbnbDetailMain">
            <div className="airbnbHostLine">
              <div>
                <h2>{property.category} em {property.neighborhood || property.city}</h2>
                <p>
                  {property.area ? `${property.area} • ` : ""}
                  {property.bedrooms || 0} dormitórios • {property.bathrooms || 0} banheiros • {property.parking || 0} vagas
                </p>
              </div>
              <img src="/logo-alexandrowitch.png" alt="" />
            </div>

            <div className="airbnbBadges">
              <span>{property.operation}</span>
              <span>Cód. {code}</span>
              <span>{property.status || "Disponível"}</span>
              {property.featured && <span>Destaque</span>}
            </div>

            <div className="airbnbFeatureList">
              <div>
                <strong>Atendimento Alexandrowitch</strong>
                <span>Contato direto com corretor responsável.</span>
              </div>
              <div>
                <strong>Fotos navegáveis</strong>
                <span>Clique para abrir galeria, compartilhar e usar lupa no PC.</span>
              </div>
              <div>
                <strong>Busca por código</strong>
                <span>Use {code} para encontrar este imóvel rapidamente.</span>
              </div>
            </div>

            <div className="airbnbDescription">
              <h3>Sobre este imóvel</h3>
              <p>{property.description || "Descrição em breve."}</p>
            </div>

            <div className="airbnbAmenities">
              <h3>O que este imóvel oferece</h3>
              <div>
                <span>Área: <strong>{property.area || "-"}</strong></span>
                <span>Dormitórios: <strong>{property.bedrooms || 0}</strong></span>
                <span>Suítes: <strong>{property.suites || 0}</strong></span>
                <span>Banheiros: <strong>{property.bathrooms || 0}</strong></span>
                <span>Vagas: <strong>{property.parking || 0}</strong></span>
                <span>Código: <strong>{code}</strong></span>
              </div>
            </div>

            <div className="airbnbAccordion">
              <ExpandableInfo title="Características principais">
                <p>
                  Imóvel localizado em {property.neighborhood || property.city}, cadastrado
                  pela Alexandrowitch Imobiliária e Administradora.
                </p>
              </ExpandableInfo>

              {floorPlans.length > 0 && (
                <div className="airbnbFloorPlans">
                  <h3>Plantas do imóvel</h3>
                  <ImageLightbox images={floorPlans} classNamePrefix="floor" />
                </div>
              )}
            </div>
          </div>

          <aside className="airbnbReserveCard">
            <div className="airbnbReserveTop">
              <strong>{property.price}</strong>
              <span>{property.operation}</span>
            </div>

            <div className="airbnbReserveBox">
              <div>
                <span>Status</span>
                <strong>{property.status || "Disponível"}</strong>
              </div>
              <div>
                <span>Código</span>
                <strong>{code}</strong>
              </div>
            </div>

            <div className="airbnbBrokerMini">
              <img src={brokerPhoto} alt="" />
              <div>
                <strong>{brokerName}</strong>
                <span>{brokerPhone}</span>
              </div>
            </div>

            <a
              className="airbnbPrimaryContact"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://wa.me/55${brokerPhone.replace(/\D/g, "")}?text=Olá, tenho interesse no imóvel de código ${code}: ${encodeURIComponent(property.title)}`}
            >
              Falar no WhatsApp
            </a>

            <a
              className="airbnbSecondaryContact"
              href={`mailto:alexandrowitch.imobiliaria@gmail.com?subject=${encodeURIComponent("Interesse no imóvel código " + code)}&body=${encodeURIComponent("Olá! Tenho interesse no imóvel de código " + code + " e gostaria de receber mais informações.")}`}
            >
              Enviar e-mail
            </a>

            <p className="airbnbNoCharge">Alexandrowitch Imobiliária • Creci 12.109-F</p>
          </aside>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </main>
  );
}
