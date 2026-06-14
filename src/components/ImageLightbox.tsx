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
    if (selectedIndex === null) return;
    setSelectedIndex((value) => {
      if (value === null) return 0;
      return value === 0 ? safeImages.length - 1 : value - 1;
    });
    setZoomed(false);
    setOrigin("50% 50%");
  }

  function next() {
    if (selectedIndex === null) return;
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

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    const previousPosition = document.body.style.position;
    const previousWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.position = "relative";
    document.body.style.width = "100%";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      document.body.style.position = previousPosition;
      document.body.style.width = previousWidth;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex, safeImages.length]);

  if (!safeImages.length) return null;

  const wrapperClass = classNamePrefix === "floor" ? "floorPlanGrid" : "gallery";
  const itemClass = classNamePrefix === "floor" ? "floorPlanItem" : "galleryItem";

  return (
    <>
      <div className={wrapperClass}>
        {safeImages.slice(0, classNamePrefix === "floor" ? safeImages.length : 7).map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            className={`${itemClass} imageMotionButton`}
            style={{ backgroundImage: `url(${image})` }}
            onClick={() => openAt(index)}
            aria-label={`Ampliar imagem ${index + 1}`}
          />
        ))}
      </div>

      {selected && selectedIndex !== null && (
        <div className="premiumLightbox" role="dialog" aria-modal="true">
          <button className="premiumLightboxBackdrop" type="button" onClick={close} aria-label="Fechar galeria" />

          <div className="premiumLightboxChrome">
            <div className="premiumLightboxTop">
              <div>
                <span>Galeria do imóvel</span>
                <strong>
                  {selectedIndex + 1} / {safeImages.length}
                </strong>
              </div>

              <button className="premiumLightboxClose" type="button" onClick={close}>
                Fechar
              </button>
            </div>

            <div className="premiumLightboxBody">
              {safeImages.length > 1 && (
                <button className="premiumGalleryArrow premiumGalleryPrev" type="button" onClick={previous} aria-label="Imagem anterior">
                  ‹
                </button>
              )}

              <div className="premiumImageStage">
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
              </div>

              {safeImages.length > 1 && (
                <button className="premiumGalleryArrow premiumGalleryNext" type="button" onClick={next} aria-label="Próxima imagem">
                  ›
                </button>
              )}

              {safeImages.length > 1 && (
                <aside className="premiumThumbRail">
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
                </aside>
              )}
            </div>

            <div className="premiumLightboxHint">
              No computador, clique na imagem para aproximar. Use as setas para trocar.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
