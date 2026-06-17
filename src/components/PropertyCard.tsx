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

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsAdmin(!!data.user);
    });
  }, []);

  const safeImages = [property.cover_image, ...images].filter(Boolean) as string[];
  const sold = property.status === "Vendido" || property.status === "Alugado";
  const code = getPropertyCode(property.id);

  return (
    <article className="propertyCard luxuriousPropertyCard">
      <PropertyImageCarousel images={safeImages} title={property.title} compact />

      <div className="propertyBody">
        <div className="cardTopLine">
          <span className={`statusBadge ${sold ? "sold" : ""}`}>
            {property.status || property.operation}
          </span>
          <span className="propertyCode">Cód. {code}</span>
        </div>

        <h3>{property.title}</h3>

        <div className="propertyMeta">
          {property.neighborhood || "Bairro não informado"} • {property.city}
        </div>

        <div className="propertyPrice">{property.price}</div>

        <div className="metricGrid">
          {property.area && (
            <div>
              <strong>{property.area}</strong>
              <span>Área</span>
            </div>
          )}

          <div>
            <strong>{property.bedrooms || 0}</strong>
            <span>Quartos</span>
          </div>

          <div>
            <strong>{property.bathrooms || 0}</strong>
            <span>Banheiros</span>
          </div>

          <div>
            <strong>{property.parking || 0}</strong>
            <span>Vagas</span>
          </div>
        </div>

        <div className="cardActions">
          <Link
            href={`/imoveis/${property.slug}`}
            className="btnDark"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver imóvel
          </Link>

          {isAdmin && (
            <Link href={`/admin/editar/${property.id}`} className="btnPrimary">
              Editar
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
