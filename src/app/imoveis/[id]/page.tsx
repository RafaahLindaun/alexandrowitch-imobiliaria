import type { Metadata } from "next";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ContactSection from "../../../components/ContactSection";
import ExpandableInfo from "../../../components/ExpandableInfo";
import ImageLightbox from "../../../components/ImageLightbox";
import { createClient } from "../../../lib/supabase/server";
import { getPropertyCode } from "../../../lib/propertyCode";
import Link from "next/link";

type PropertyRouteProps = {
  params: Promise<{ id: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://alexandrowitch.vercel.app";

function absoluteUrl(value?: string | null) {
  if (!value) return new URL("/logo-alexandrowitch.png", SITE_URL).toString();

  try {
    return new URL(value, SITE_URL).toString();
  } catch {
    return new URL("/logo-alexandrowitch.png", SITE_URL).toString();
  }
}

function cleanText(value?: string | null) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function limitText(value: string, max = 155) {
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + "…";
}

function propertyDescription(property: any) {
  const description = cleanText(property?.description);

  if (description) return limitText(description);

  const location = [property?.neighborhood, property?.city].filter(Boolean).join(", ");
  const details = [
    property?.category,
    property?.operation,
    property?.price,
    location,
  ].filter(Boolean).join(" • ");

  return limitText(`${details}. Imóvel cadastrado pela Alexandrowitch Imobiliária e Administradora.`);
}

function priceToNumber(value?: string | null) {
  const numeric = String(value || "").replace(/\D/g, "");
  return numeric ? Number(numeric) : undefined;
}

function areaToNumber(value?: string | null) {
  const normalized = String(value || "")
    .replace(/m²|m2/gi, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

async function getPropertyBySlug(slug: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  return data;
}

async function getPropertyGallery(propertyId: string, coverImage?: string | null) {
  const supabase = await createClient();

  const { data: images } = await supabase
    .from("property_images")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: true });

  return [
    coverImage,
    ...((images || []).map((image) => image.image_url)),
  ].filter(Boolean) as string[];
}

export async function generateMetadata({ params }: PropertyRouteProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyBySlug(id);

  if (!property) {
    return {
      title: "Imóvel não encontrado | Alexandrowitch Imobiliária",
      description: "O imóvel solicitado não foi encontrado.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `${property.title} | Alexandrowitch Imobiliária`;
  const description = propertyDescription(property);
  const image = absoluteUrl(property.cover_image);
  const url = new URL(`/imoveis/${property.slug}`, SITE_URL).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Alexandrowitch Imobiliária e Administradora",
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

function buildJsonLd(property: any, gallery: string[], code: string) {
  const description = propertyDescription(property);
  const listingUrl = new URL(`/imoveis/${property.slug}`, SITE_URL).toString();
  const price = priceToNumber(property.price);
  const floorSize = areaToNumber(property.area);

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description,
    url: listingUrl,
    identifier: code,
    image: gallery.length ? gallery.map((image) => absoluteUrl(image)) : [absoluteUrl(property.cover_image)],
    address: {
      "@type": "PostalAddress",
      streetAddress: property.neighborhood || property.city || "São Paulo",
      addressLocality: property.city || "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      ...(price ? { price } : {}),
      availability: property.status === "Vendido" || property.status === "Alugado"
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      url: listingUrl,
    },
    ...(property.category ? { accommodationCategory: property.category } : {}),
    ...(floorSize ? { floorSize: { "@type": "QuantitativeValue", value: floorSize, unitCode: "MTK" } } : {}),
    ...(property.bedrooms ? { numberOfRooms: property.bedrooms } : {}),
    amenityFeature: [
      property.suites ? { "@type": "LocationFeatureSpecification", name: "Suítes", value: property.suites } : null,
      property.bathrooms ? { "@type": "LocationFeatureSpecification", name: "Banheiros", value: property.bathrooms } : null,
      property.parking ? { "@type": "LocationFeatureSpecification", name: "Vagas", value: property.parking } : null,
      property.furnished ? { "@type": "LocationFeatureSpecification", name: "Mobiliado", value: property.furnished } : null,
      property.condominium_fee ? { "@type": "LocationFeatureSpecification", name: "Condomínio", value: property.condominium_fee } : null,
      property.iptu ? { "@type": "LocationFeatureSpecification", name: "IPTU", value: property.iptu } : null,
    ].filter(Boolean),
  };
}

export default async function PropertyDetailPage({ params }: PropertyRouteProps) {
  const { id } = await params;
  const property = await getPropertyBySlug(id);

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

  const gallery = await getPropertyGallery(property.id, property.cover_image);
  const floorPlans = (property.floor_plan_images || []).filter(Boolean) as string[];
  const brokerPhone = property.broker_phone || "11974005163";
  const brokerName = property.broker_name || "Alexandrowitch";
  const brokerPhoto = property.broker_photo || "/logo-alexandrowitch.png";
  const code = getPropertyCode(property.id);
  const jsonLd = buildJsonLd(property, gallery, code);

  return (
    <main className="page airbnbPropertyPage">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Navbar />

      <section className="airbnbPropertyTop">
        <div className="container">
          <Link href="/imoveis" className="airbnbBackLink">← Voltar aos imóveis</Link>

          <div className="airbnbDetailTitleRow">
            <div>
              <h1>{property.title}</h1>
              <p>{property.neighborhood || "Bairro não informado"} • {property.city}</p>
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
              {property.furnished && property.furnished !== "" && <span>{property.furnished === "Sim" ? "Mobiliado" : "Não mobiliado"}</span>}
            </div>

            {(property.condominium_fee || property.iptu) && (
              <div className="airbnbCostHighlights">
                {property.condominium_fee && (
                  <span><strong>Condomínio:</strong> {property.condominium_fee}</span>
                )}
                {property.iptu && (
                  <span><strong>IPTU:</strong> {property.iptu}</span>
                )}
              </div>
            )}

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
                {property.furnished && <span>Mobiliado: <strong>{property.furnished}</strong></span>}
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

            {(property.condominium_fee || property.iptu) && (
              <div className="airbnbReserveCosts">
                {property.condominium_fee && (
                  <div>
                    <span>Condomínio</span>
                    <strong>{property.condominium_fee}</strong>
                  </div>
                )}
                {property.iptu && (
                  <div>
                    <span>IPTU</span>
                    <strong>{property.iptu}</strong>
                  </div>
                )}
              </div>
            )}

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
              href={`https://wa.me/55${brokerPhone.replace(/\D/g, "")}?text=Olá, gostaria de falar com ${encodeURIComponent(brokerName)} sobre o imóvel de código ${code}: ${encodeURIComponent(property.title)}`}
            >
              {`WhatsApp ${brokerName}`}
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
