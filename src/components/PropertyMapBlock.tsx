import { Property } from "../types/property";

export default function PropertyMapBlock({ property }: { property: Property }) {
  const address = [property.neighborhood, property.city, "SP", "Brasil"].filter(Boolean).join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;

  return (
    <section className="mapBlock">
      <div>
        <span className="eyebrow">Localização</span>
        <h3>Veja a região do imóvel</h3>
        <p>A localização exata pode ser enviada pelo corretor. Por enquanto, o botão abre a região aproximada do imóvel.</p>
      </div>

      <div className="mapPlaceholder">
        <div className="mapGridOverlay" />
        <div className="mapPin">⌖</div>
      </div>

      <div className="adminActions">
        <a className="btnDark" href={mapsUrl} target="_blank">Abrir no Google Maps</a>
        <a className="btnPrimary" href={wazeUrl} target="_blank">Abrir no Waze</a>
      </div>
    </section>
  );
}
