"use client";

import { useMemo, useRef, useState } from "react";

export default function PropertyImageCarousel({
  images,
  title,
  compact = false,
}: {
  images: string[];
  title: string;
  compact?: boolean;
}) {
  const safeImages = useMemo(
    () =>
      images.filter(Boolean).length
        ? images.filter(Boolean)
        : [
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
          ],
    [images]
  );

  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  function previous(event?: React.MouseEvent<HTMLButtonElement>) {
    event?.preventDefault();
    event?.stopPropagation();
    setIndex((value) => (value === 0 ? safeImages.length - 1 : value - 1));
  }

  function next(event?: React.MouseEvent<HTMLButtonElement>) {
    event?.preventDefault();
    event?.stopPropagation();
    setIndex((value) => (value === safeImages.length - 1 ? 0 : value + 1));
  }

  function goTo(event: React.MouseEvent<HTMLButtonElement>, nextIndex: number) {
    event.preventDefault();
    event.stopPropagation();
    setIndex(nextIndex);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    startX.current = event.touches[0].clientX;
    startY.current = event.touches[0].clientY;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (startX.current === null || startY.current === null) return;

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const deltaX = endX - startX.current;
    const deltaY = endY - startY.current;

    startX.current = null;
    startY.current = null;

    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < 0) {
      setIndex((value) => (value === safeImages.length - 1 ? 0 : value + 1));
    } else {
      setIndex((value) => (value === 0 ? safeImages.length - 1 : value - 1));
    }
  }

  return (
    <div
      className={`propertyCarousel ${compact ? "compactCarousel" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img key={safeImages[index]} src={safeImages[index]} alt={title} draggable={false} />

      {safeImages.length > 1 && (
        <>
          <button
            type="button"
            className="carouselArrow carouselArrowLeft"
            onClick={previous}
            aria-label="Foto anterior"
          >
            ‹
          </button>

          <button
            type="button"
            className="carouselArrow carouselArrowRight"
            onClick={next}
            aria-label="Próxima foto"
          >
            ›
          </button>

          <div className="carouselDots">
            {safeImages.map((_, imageIndex) => (
              <button
                type="button"
                key={imageIndex}
                className={imageIndex === index ? "activeDot" : ""}
                onClick={(event) => goTo(event, imageIndex)}
                aria-label={`Ver foto ${imageIndex + 1}`}
              />
            ))}
          </div>

          <div className="swipeHint">Arraste</div>
        </>
      )}

      <div className="carouselWatermark">Alexandrowitch</div>
    </div>
  );
}
