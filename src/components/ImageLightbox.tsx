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
  const [origin, setOrigin] = useState("50% 50%");

  const selected = selectedIndex === null ? null : safeImages[selectedIndex];

  function openAt(index: number) {
    setSelectedIndex(index);
    setZoomed(false);
    setOrigin("50% 50%");
  }

  function close() {
    setSelectedIndex(null);
    setZoomed(false);
    setOrigin("50% 50%");
  }

  function previous() {
    setSelectedIndex((value) => {
      if (value === null) return 0;
      return value === 0 ? safeImages.length - 1 : value - 1;
    });
    setZoomed(false);
    setOrigin("50% 50%");
  }

  function next() {
    setSelectedIndex((value) => {
      if (value === null) return 0;
      return value === safeImages.length - 1 ? 0 : value + 1;
    });
    setZoomed(false);
    setOrigin("50% 50%");
  }

  function handleMouseMove(event: React.MouseEvent<HTMLImageElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  async function shareImage() {
    const shareUrl = selected || window.location.href;

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
      window.open(shareUrl, "_blank");
    }
  }

  async function toggleFullScreen() {
    const element = document.querySelector(".premiumLightbox") as HTMLElement | null;
    if (!element) return;

    if (!document.fullscreenElement) {
      await element.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  }

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex, safeImages.length]);

  if (!safeImages.length) return null;

  const wrapperClass = classNamePrefix === "floor" ? "floorPlanGrid" : "gallery";
  const itemClass = classNamePrefix === "floor" ? "floorPlanItem" : "galleryItem";

  return (
    <>
      <div className={wrapperClass}>
        {safeImages.slice(0, classNamePrefix === "floor" ? safeImages.length : 5).map((image, index) => (
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
        <div className="premiumLightbox" role="dialog" aria-modal="true">
          <div className="premiumLightboxSurface">
            <header className="googleGalleryTopbar">
              <button type="button" className="googleIconButton" onClick={close} aria-label="Fechar">
                ×
              </button>

              <div className="googleGalleryTitle">
                <span>Alexandrowitch Imobiliária</span>
                <strong>{selectedIndex + 1} de {safeImages.length}</strong>
              </div>

              <div className="googleGalleryActions">
                <button type="button" className="googleActionButton" onClick={shareImage} aria-label="Compartilhar">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16.1c-.8 0-1.5.3-2 .8L8.9 12.8c.1-.3.1-.5.1-.8s0-.5-.1-.8L16 7.1c.5.5 1.2.8 2 .8 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3c0 .3 0 .5.1.8L8 9.9c-.5-.5-1.2-.8-2-.8-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.1 4.2c-.1.2-.1.5-.1.7 0 1.6 1.3 2.9 3 2.9s3-1.3 3-3-1.3-3-3-3Z" fill="currentColor"/></svg>
                  <span>Compartilhar</span>
                </button>

                <button type="button" className="googleActionButton" onClick={toggleFullScreen} aria-label="Tela cheia">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h6v2H7v4H5V5Zm12 2h-4V5h6v6h-2V7ZM7 13v4h4v2H5v-6h2Zm12 0v6h-6v-2h4v-4h2Z" fill="currentColor"/></svg>
                  <span>Tela cheia</span>
                </button>
              </div>
            </header>

            <main className="googleGalleryBody">
              {safeImages.length > 1 && (
                <button className="googleGalleryArrow galleryPrev" type="button" onClick={previous} aria-label="Imagem anterior">
                  ‹
                </button>
              )}

              <section className="googleImageStage">
                <img
                  src={selected}
                  alt="Imagem ampliada do imóvel"
                  className={zoomed ? "isZoomed" : ""}
                  style={{ transformOrigin: origin }}
                  onMouseMove={handleMouseMove}
                  onClick={() => setZoomed((value) => !value)}
                  draggable={false}
                />

                <img className="premiumWatermarkLogo" src="/logo-alexandrowitch.png" alt="" />
              </section>

              {safeImages.length > 1 && (
                <button className="googleGalleryArrow galleryNext" type="button" onClick={next} aria-label="Próxima imagem">
                  ›
                </button>
              )}
            </main>

            {safeImages.length > 1 && (
              <footer className="googleThumbStrip">
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
            )}
          </div>
        </div>
      )}
    </>
  );
}
