"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";
import { getPropertyCode } from "../lib/propertyCode";
import { Property } from "../types/property";
import PropertyImageCarousel from "./PropertyImageCarousel";

export default function PropertyCard({
  property,
  images = [],
}: {
  property: Property;
  images?: string[];
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsAdmin(!!data.user);
    });
  }, []);

  const safeImages = [property.cover_image, ...images].filter(Boolean) as string[];
  const sold = property.status === "Vendido" || property.status === "Alugado";
  const code = getPropertyCode(property.id);
  const href = `/imoveis/${property.slug}`;

  function openProperty() {
    window.open(href, "_blank", "noopener,noreferrer");
  }

  async function shareProperty(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const url = `${window.location.origin}${href}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${property.title} - Alexandrowitch`,
          text: `Veja este imóvel: ${property.title}`,
          url,
        });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(() => setShared(false), 1600);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  function stop(event: React.MouseEvent) {
    event.stopPropagation();
  }

  return (
    <article
      className="propertyCard airbnbPropertyCard clickablePropertyCard"
      onClick={openProperty}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") openProperty();
      }}
    >
      <div className="airbnbCardMedia">
        <button
          type="button"
          className={`propertyShareButton airbnbShare ${shared ? "copied" : ""}`}
          onClick={shareProperty}
          aria-label="Compartilhar imóvel"
        >
          {shared ? (
            <span>✓</span>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M18 16.1c-.8 0-1.5.3-2 .8L8.9 12.8c.1-.3.1-.5.1-.8s0-.5-.1-.8L16 7.1c.5.5 1.2.8 2 .8 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3c0 .3 0 .5.1.8L8 9.9c-.5-.5-1.2-.8-2-.8-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.1 4.2c-.1.2-.1.5-.1.7 0 1.6 1.3 2.9 3 2.9s3-1.3 3-3-1.3-3-3-3Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>

        <PropertyImageCarousel images={safeImages} title={property.title} compact />

        <div className={`airbnbMediaBadge ${sold ? "sold" : ""}`}>
          {property.status || property.operation}
        </div>
      </div>

      <div className="airbnbCardBody">
        <div className="airbnbCardTop">
          <h3>{property.title}</h3>
          <span>Cód. {code}</span>
        </div>

        <p className="airbnbLocation">
          {property.neighborhood || "Bairro não informado"} • {property.city}
        </p>

        <p className="airbnbSpecs">
          {property.category}
          {property.area ? ` • ${property.area}` : ""}
          {property.bedrooms ? ` • ${property.bedrooms} dorm.` : ""}
          {property.parking ? ` • ${property.parking} vagas` : ""}
        </p>

        <div className="airbnbPriceLine">
          <strong>{property.price}</strong>
          <span>{property.operation}</span>
        </div>

        <div className="airbnbCardActions" onClick={stop}>
          <Link href={href} target="_blank" rel="noopener noreferrer">
            Abrir anúncio
          </Link>

          {isAdmin && (
            <Link href={`/admin/editar/${property.id}`}>
              Editar
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
