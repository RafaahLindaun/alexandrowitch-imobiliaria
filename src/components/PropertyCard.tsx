import Link from "next/link";
import { Property } from "../types/property";

export default function PropertyCard({ property }: { property: Property }) {
  const image =
    property.cover_image ||
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop";

  return (
    <article className="propertyCard">
      <div className="propertyImage" style={{ backgroundImage: `url(${image})` }} />

      <div className="propertyBody">
        <span className="tag">{property.operation}</span>
        <h3>{property.title}</h3>
        <div className="propertyMeta">{property.neighborhood || "São Roque"} • {property.city}</div>
        <div className="propertyPrice">{property.price}</div>

        <div className="features">
          <span>{property.category}</span>
          {property.area && <span>{property.area}</span>}
          {!!property.bedrooms && property.bedrooms > 0 && <span>{property.bedrooms} dorm.</span>}
          {!!property.parking && property.parking > 0 && <span>{property.parking} vagas</span>}
        </div>

        <Link href={`/imoveis/${property.slug}`} className="btnDark">Ver detalhes</Link>
      </div>
    </article>
  );
}
