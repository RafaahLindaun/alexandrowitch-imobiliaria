const WATERMARK_SRC = "/logo-alexandrowitch.png";

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality = 0.92) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Não foi possível processar a marca d'água."));
        return;
      }

      resolve(blob);
    }, type, quality);
  });
}

function extensionForType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

function fileNameWithExtension(name: string, extension: string) {
  const cleanName = name.replace(/\.[a-z0-9]+$/i, "");
  return `${cleanName}-alexandrowitch.${extension}`;
}

export async function addWatermarkToImage(file: File) {
  if (!file.type.startsWith("image/")) return file;

  try {
    const [photoSrc, watermark] = await Promise.all([
      readFileAsDataUrl(file),
      loadImage(WATERMARK_SRC),
    ]);

    const photo = await loadImage(photoSrc);
    const width = photo.naturalWidth || photo.width;
    const height = photo.naturalHeight || photo.height;

    if (!width || !height) return file;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(photo, 0, 0, width, height);

    const watermarkNaturalWidth = watermark.naturalWidth || watermark.width;
    const watermarkNaturalHeight = watermark.naturalHeight || watermark.height;

    if (!watermarkNaturalWidth || !watermarkNaturalHeight) return file;

    const desiredWidth = Math.min(
      Math.max(width * 0.26, 150),
      Math.min(width * 0.40, 360)
    );
    const desiredHeight = desiredWidth * (watermarkNaturalHeight / watermarkNaturalWidth);

    const x = (width - desiredWidth) / 2;
    const y = (height - desiredHeight) / 2;

    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.drawImage(watermark, x, y, desiredWidth, desiredHeight);
    ctx.restore();

    const outputType =
      file.type === "image/png" || file.type === "image/webp"
        ? file.type
        : "image/jpeg";

    const blob = await canvasToBlob(canvas, outputType, 0.92);
    const extension = extensionForType(outputType);

    return new File([blob], fileNameWithExtension(file.name, extension), {
      type: outputType,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}
