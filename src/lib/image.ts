const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_QUALITY = 0.82;
const TARGET_MAX_BYTES = 1_200_000;

export interface OptimizedImage {
  dataUrl: string;
  originalBytes: number;
  optimizedBytes: number;
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read optimized image."));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`無法讀取圖片「${file.name}」，請改用 JPEG、PNG 或 WebP。`));
    };
    image.src = objectUrl;
  });
}

function renderImage(
  image: HTMLImageElement,
  maxDimension: number,
  quality: number,
): Promise<Blob> {
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("瀏覽器無法建立圖片壓縮畫布。");

  context.drawImage(image, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("圖片壓縮失敗。"));
      },
      "image/webp",
      quality,
    );
  });
}

export async function optimizeImageForUpload(file: File): Promise<OptimizedImage> {
  const hasImageExtension = /\.(avif|bmp|gif|heic|heif|jpe?g|png|webp)$/i.test(file.name);
  if (!file.type.startsWith("image/") && !hasImageExtension) {
    throw new Error(`「${file.name}」不是圖片檔。`);
  }

  const image = await loadImage(file);
  let optimizedBlob = await renderImage(image, DEFAULT_MAX_DIMENSION, DEFAULT_QUALITY);

  if (optimizedBlob.size > TARGET_MAX_BYTES) {
    optimizedBlob = await renderImage(image, 1280, 0.74);
  }

  const useOriginal = file.size < optimizedBlob.size && file.type !== "image/heic";
  const outputBlob = useOriginal ? file : optimizedBlob;

  return {
    dataUrl: await readBlobAsDataUrl(outputBlob),
    originalBytes: file.size,
    optimizedBytes: outputBlob.size,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
