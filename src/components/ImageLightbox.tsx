"use client";

import { useEffect, useMemo, useState } from "react";

export default function ImageLightbox({
  images,
  classNamePrefix = "gallery",
}: {
  images: string[];
  classNamePrefix?: "gallery" | "floor";
}) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const selected = selectedIndex === null ? null : safeImages[selectedIndex];

  function openAt(index: number) {
    setSelectedIndex(index);
    setZoomed(false);
  }

  function close() {
    setSelectedIndex(null);
    setZoomed(false);
  }

  function previous() {
    setSelectedIndex((value) => {
      if (value === null) return 0;
      return value === 0 ? safeImages.length - 1 : value - 1;
    });
    setZoomed(false);
  }

  function next() {
    setSelectedIndex((value) => {
      if (value === null) return 0;
      return value === safeImages.length - 1 ? 0 : value + 1;
    });
    setZoomed(false);
  }

  async function sharePage() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Imóvel Alexandrowitch",
          text: "Veja este imóvel da Alexandrowitch Imobiliária.",
          url: window.location.href,
        });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado.");
    } catch {
      // ignora
    }
  }

  async function fullscreen() {
    const element = document.querySelector(".srGalleryOverlay") as HTMLElement | null;
    if (!element) return;

    if (!document.fullscreenElement) {
      await element.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  }

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex, safeImages.length]);

  if (!safeImages.length) return null;

  const wrapperClass = classNamePrefix === "floor" ? "floorPlanGrid" : "gallery";
  const itemClass = classNamePrefix === "floor" ? "floorPlanItem" : "galleryItem";
  const previewImages = safeImages.slice(0, classNamePrefix === "floor" ? safeImages.length : 5);

  return (
    <>
      <div className={wrapperClass}>
        {previewImages.map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            className={`${itemClass} imageMotionButton`}
            style={{ backgroundImage: `url(${image})` }}
            onClick={() => openAt(index)}
            aria-label={`Ampliar imagem ${index + 1}`}
          >
            {index === 0 && <span className="galleryMainLabel">Ver fotos</span>}
            {index === 4 && safeImages.length > 5 && (
              <span className="galleryMoreOverlay">+{safeImages.length - 5} fotos</span>
            )}
          </button>
        ))}
      </div>

      {selected && selectedIndex !== null && (
        <div className="srGalleryOverlay" role="dialog" aria-modal="true">
          <header className="srGalleryHeader">
            <button type="button" className="srGalleryClose" onClick={close} aria-label="Fechar">
              ×
            </button>

            <div className="srGalleryCounter">
              <span>Fotos do imóvel</span>
              <strong>{selectedIndex + 1} / {safeImages.length}</strong>
            </div>

            <div className="srGalleryTools">
              <button type="button" onClick={sharePage} aria-label="Compartilhar">
                <svg viewBox="0 0 24 24"><path d="M18 16.1c-.8 0-1.5.3-2 .8L8.9 12.8c.1-.3.1-.5.1-.8s0-.5-.1-.8L16 7.1c.5.5 1.2.8 2 .8 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3c0 .3 0 .5.1.8L8 9.9c-.5-.5-1.2-.8-2-.8-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.1 4.2c-.1.2-.1.5-.1.7 0 1.6 1.3 2.9 3 2.9s3-1.3 3-3-1.3-3-3-3Z" fill="currentColor"/></svg>
                <span>Compartilhar</span>
              </button>
              <button type="button" onClick={fullscreen} aria-label="Tela cheia">
                <svg viewBox="0 0 24 24"><path d="M5 5h6v2H7v4H5V5Zm12 2h-4V5h6v6h-2V7ZM7 13v4h4v2H5v-6h2Zm12 0v6h-6v-2h4v-4h2Z" fill="currentColor"/></svg>
                <span>Tela cheia</span>
              </button>
            </div>
          </header>

          <main className="srGalleryMain">
            {safeImages.length > 1 && (
              <button type="button" className="srGalleryArrow srPrev" onClick={previous} aria-label="Imagem anterior">
                ‹
              </button>
            )}

            <div className={`srGalleryImageStage ${zoomed ? "zoomed" : ""}`}>
              <img src={selected} alt="Imagem ampliada do imóvel" onClick={() => setZoomed((value) => !value)} draggable={false} />
              <img className="srGalleryWatermark" src="/logo-alexandrowitch.png" alt="" />
            </div>

            {safeImages.length > 1 && (
              <button type="button" className="srGalleryArrow srNext" onClick={next} aria-label="Próxima imagem">
                ›
              </button>
            )}
          </main>

          <footer className="srGalleryThumbs">
            {safeImages.map((image, index) => (
              <button
                type="button"
                key={`${image}-thumb-${index}`}
                className={index === selectedIndex ? "activeThumb" : ""}
                onClick={() => openAt(index)}
                aria-label={`Abrir miniatura ${index + 1}`}
              >
                <img src={image} alt="" draggable={false} />
              </button>
            ))}
          </footer>
        </div>
      )}
    </>
  );
}
