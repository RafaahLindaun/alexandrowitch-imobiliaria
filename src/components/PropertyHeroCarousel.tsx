"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type HeroProperty = {
  title: string;
  operation?: string | null;
  status?: string | null;
  neighborhood?: string | null;
  city?: string | null;
};

export default function PropertyHeroCarousel({
  property,
  images,
  code,
}: {
  property: HeroProperty;
  images: string[];
  code: string;
}) {
  const safeImages = useMemo(() => {
    const filtered = images.filter(Boolean);
    return filtered.length
      ? filtered
      : [
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1800&auto=format&fit=crop",
        ];
  }, [images]);

  const [index, setIndex] = useState(0);
  const [galleryMode, setGalleryMode] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  function goTo(nextIndex: number, nextDirection: "next" | "prev" = "next") {
    setDirection(nextDirection);
    setIndex((nextIndex + safeImages.length) % safeImages.length);
    setGalleryMode(true);
  }

  function previous() {
    goTo(index - 1, "prev");
  }

  function next() {
    goTo(index + 1, "next");
  }

  return (
    <section
      className={`propertyHeroPremium heroGalleryCarousel ${galleryMode ? "isGalleryMode" : ""} heroDirection-${direction}`}
    >
      <div
        key={safeImages[index]}
        className="heroGalleryImage"
        style={{ backgroundImage: `url(${safeImages[index]})` }}
      />

      <div className="propertyHeroOverlay heroGalleryOverlay" />

      {safeImages.length > 1 && (
        <>
          <button
            type="button"
            className="heroSideArrow heroSideArrowLeft"
            onClick={previous}
            aria-label="Imagem anterior"
          >
            ‹
          </button>

          <button
            type="button"
            className="heroSideArrow heroSideArrowRight"
            onClick={next}
            aria-label="Próxima imagem"
          >
            ›
          </button>
        </>
      )}

      <div className="container propertyHeroInner heroGalleryInner">
        <div className="heroTextBlock">
          <Link href="/imoveis" className="backToResults">← Voltar aos imóveis</Link>

          <div className="heroPropertyBadges">
            <span>{property.operation || "Imóvel"}</span>
            <span>Cód. {code}</span>
            <span>{property.status || "Disponível"}</span>
          </div>

          <h1>{property.title}</h1>
          <p>{property.neighborhood || "Bairro não informado"} • {property.city}</p>
        </div>

        <div className="heroGalleryDock">
          <div>
            <span>Galeria do imóvel</span>
            <strong>{index + 1} / {safeImages.length}</strong>
          </div>

          <div className="heroThumbs">
            {safeImages.slice(0, 6).map((image, thumbIndex) => (
              <button
                key={`${image}-${thumbIndex}`}
                type="button"
                className={thumbIndex === index ? "activeHeroThumb" : ""}
                style={{ backgroundImage: `url(${image})` }}
                onClick={() => goTo(thumbIndex, thumbIndex > index ? "next" : "prev")}
                aria-label={`Ver foto ${thumbIndex + 1}`}
              />
            ))}
          </div>

          {safeImages.length > 6 && (
            <span className="heroMorePhotos">+{safeImages.length - 6} fotos</span>
          )}
        </div>
      </div>

      <button
        type="button"
        className="heroGalleryHint"
        onClick={() => setGalleryMode((value) => !value)}
      >
        {galleryMode ? "Mostrar informações" : "Navegar pelas fotos"}
      </button>
    </section>
  );
}
