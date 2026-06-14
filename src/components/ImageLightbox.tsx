"use client";

import { useState } from "react";

export default function ImageLightbox({
  images,
  classNamePrefix = "gallery",
}: {
  images: string[];
  classNamePrefix?: "gallery" | "floor";
}) {
  const [selected, setSelected] = useState<string | null>(null);

  if (!images.length) return null;

  const wrapperClass = classNamePrefix === "floor" ? "floorPlanGrid" : "gallery";
  const itemClass = classNamePrefix === "floor" ? "floorPlanItem" : "galleryItem";

  return (
    <>
      <div className={wrapperClass}>
        {images.slice(0, classNamePrefix === "floor" ? images.length : 7).map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            className={`${itemClass} imageMotionButton`}
            style={{ backgroundImage: `url(${image})` }}
            onClick={() => setSelected(image)}
            aria-label="Ampliar imagem"
          />
        ))}
      </div>

      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <button className="lightboxClose" type="button">Fechar</button>
          <div className="lightboxFrame" onClick={(event) => event.stopPropagation()}>
            <img className="lightboxImage" src={selected} alt="Imagem ampliada" />
            <div className="imageWatermark">Alexandrowitch Imobiliária</div>
          </div>
        </div>
      )}
    </>
  );
}
