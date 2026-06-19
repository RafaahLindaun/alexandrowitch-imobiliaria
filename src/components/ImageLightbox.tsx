"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export default function ImageLightbox({
  images,
  classNamePrefix = "gallery",
}: {
  images: string[];
  classNamePrefix?: "gallery" | "floor";
}) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [desktopPointer, setDesktopPointer] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDesktopPointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const selected = selectedIndex === null ? null : safeImages[selectedIndex];

  function openAt(index: number) {
    setSelectedIndex(index);
    setZoomed(false);
    setZoomOrigin("50% 50%");
  }

  function close() {
    setSelectedIndex(null);
    setZoomed(false);
    setZoomOrigin("50% 50%");
  }

  function previous() {
    setSelectedIndex((value) => {
      if (value === null) return 0;
      return value === 0 ? safeImages.length - 1 : value - 1;
    });
    setZoomed(false);
    setZoomOrigin("50% 50%");
  }

  function next() {
    setSelectedIndex((value) => {
      if (value === null) return 0;
      return value === safeImages.length - 1 ? 0 : value + 1;
    });
    setZoomed(false);
    setZoomOrigin("50% 50%");
  }

  function handleMouseMove(event: React.MouseEvent<HTMLImageElement>) {
    if (!desktopPointer || !zoomed) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  }

  function handleImageClick() {
    if (!desktopPointer) return;
    setZoomed((value) => !value);
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
      window.open(window.location.href, "_blank");
    }
  }

  async function fullscreen() {
    const element = document.querySelector(".axGalleryOverlay") as HTMLElement | null;
    if (!element) return;

    if (!document.fullscreenElement) {
      await element.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  }

  useEffect(() => {
    if (selectedIndex === null) return;

    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyWidth = body.style.width;
    const previousTouchAction = body.style.touchAction;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "relative";
    body.style.width = "100%";
    body.style.touchAction = "none";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.width = previousBodyWidth;
      body.style.touchAction = previousTouchAction;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex, safeImages.length]);

  if (!safeImages.length) return null;

  const wrapperClass = classNamePrefix === "floor" ? "floorPlanGrid" : "gallery";
  const itemClass = classNamePrefix === "floor" ? "floorPlanItem" : "galleryItem";
  const previewImages = safeImages.slice(0, classNamePrefix === "floor" ? safeImages.length : 5);

  const lightbox =
    selected && selectedIndex !== null ? (
      <div className={`axGalleryOverlay ${desktopPointer ? "hasDesktopZoom" : ""}`} role="dialog" aria-modal="true">
        <header className="axGalleryTopbar">
          <button type="button" className="axGalleryClose" onClick={close} aria-label="Fechar">
            ×
          </button>

          <div className="axGalleryTitle">
            <span>Fotos do imóvel</span>
            <strong>{selectedIndex + 1} / {safeImages.length}</strong>
          </div>

          <div className="axGalleryTools">
            <button type="button" onClick={sharePage} aria-label="Compartilhar">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 16.1c-.8 0-1.5.3-2 .8L8.9 12.8c.1-.3.1-.5.1-.8s0-.5-.1-.8L16 7.1c.5.5 1.2.8 2 .8 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3c0 .3 0 .5.1.8L8 9.9c-.5-.5-1.2-.8-2-.8-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.1 4.2c-.1.2-.1.5-.1.7 0 1.6 1.3 2.9 3 2.9s3-1.3 3-3-1.3-3-3-3Z" fill="currentColor" />
              </svg>
            </button>

            <button type="button" onClick={fullscreen} aria-label="Tela cheia">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 5h6v2H7v4H5V5Zm12 2h-4V5h6v6h-2V7ZM7 13v4h4v2H5v-6h2Zm12 0v6h-6v-2h4v-4h2Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </header>

        <main className="axGalleryStageWrap">
          {safeImages.length > 1 && (
            <button type="button" className="axGalleryArrow axGalleryPrev" onClick={previous} aria-label="Imagem anterior">
              ‹
            </button>
          )}

          <div className={`axGalleryStage ${zoomed ? "zoomed" : ""}`}>
            {desktopPointer && <div className="desktopZoomHint">{zoomed ? "Mover mouse para explorar" : "Clique para usar a lupa"}</div>}

            <img
              src={selected}
              alt="Imagem ampliada do imóvel"
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
              style={{ transformOrigin: zoomOrigin }}
              draggable={false}
            />
            <img className="axGalleryWatermark" src="/logo-alexandrowitch.png" alt="" />
          </div>

          {safeImages.length > 1 && (
            <button type="button" className="axGalleryArrow axGalleryNext" onClick={next} aria-label="Próxima imagem">
              ›
            </button>
          )}
        </main>

        {safeImages.length > 1 && (
          <footer className="axGalleryThumbs">
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
    ) : null;

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

      {mounted && lightbox ? createPortal(lightbox, document.body) : null}
    </>
  );
}
