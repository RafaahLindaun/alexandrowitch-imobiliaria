import Link from "next/link";
import { Property } from "../types/property";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="propertyCard">
      <div className="propertyImage" style={{ backgroundImage: `url(${property.image})` }} />
      <div className="propertyBody">
        <span className="tag">{property.operation}</span>
        <h3>{property.title}</h3>
        <div className="propertyMeta">{property.neighborhood} • {property.city}</div>
        <div className="propertyPrice">{property.price}</div>
        <div className="features">
          <span>{property.category}</span>
          <span>{property.area}</span>
          {property.bedrooms > 0 && <span>{property.bedrooms} dorm.</span>}
          {property.parking > 0 && <span>{property.parking} vagas</span>}
        </div>
        <Link href={`/imoveis/${property.id}`} className="btnDark">Ver detalhes</Link>
      </div>
    </article>
  );
}
