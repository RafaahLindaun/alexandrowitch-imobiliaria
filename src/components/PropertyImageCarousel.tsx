"use client";
import { useMemo, useState } from "react";
export default function PropertyImageCarousel({ images, title, compact = false }: { images: string[]; title: string; compact?: boolean; }) {
  const safeImages = useMemo(() => images.filter(Boolean).length ? images.filter(Boolean) : ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop"], [images]);
  const [index, setIndex] = useState(0);
  function previous(event?: React.MouseEvent<HTMLButtonElement>) { event?.preventDefault(); event?.stopPropagation(); setIndex(v => v === 0 ? safeImages.length - 1 : v - 1); }
  function next(event?: React.MouseEvent<HTMLButtonElement>) { event?.preventDefault(); event?.stopPropagation(); setIndex(v => v === safeImages.length - 1 ? 0 : v + 1); }
  return (
    <div className={`propertyCarousel ${compact ? "compactCarousel" : ""}`}>
      <img src={safeImages[index]} alt={title} draggable={false} />
      {safeImages.length > 1 && <>
        <button type="button" className="carouselArrow carouselArrowLeft" onClick={previous} aria-label="Foto anterior">‹</button>
        <button type="button" className="carouselArrow carouselArrowRight" onClick={next} aria-label="Próxima foto">›</button>
        <div className="carouselDots">{safeImages.map((_, i) => <button type="button" key={i} className={i === index ? "activeDot" : ""} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIndex(i); }} aria-label={`Ver foto ${i + 1}`} />)}</div>
      </>}
      <div className="carouselWatermark">Alexandrowitch</div>
    </div>
  );
}
