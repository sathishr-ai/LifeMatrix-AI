export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // Needed to avoid cross-origin issues
    image.src = url;
  });

/**
 * This function was adapted from the one in the react-easy-crop README
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Set width and height to the cropped dimensions
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Add professional-grade rendering smoothness
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw the image using pixelCrop coords
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Optional: For perfect circle aesthetic, we don't strictly need to clip the canvas itself
  // since the UI container CSS (rounded-full) clips it automatically.
  // Plus returning a square JPEG saves bytes compared to an alpha PNG.

  // Downscale if too large (keep max size for profile picture performance)
  const MAX_SIZE = 450;
  if (canvas.width > MAX_SIZE || canvas.height > MAX_SIZE) {
    const scaleCanvas = document.createElement('canvas');
    const scaleCtx = scaleCanvas.getContext('2d');
    if (scaleCtx) {
      scaleCanvas.width = MAX_SIZE;
      scaleCanvas.height = MAX_SIZE;
      scaleCtx.imageSmoothingEnabled = true;
      scaleCtx.imageSmoothingQuality = 'high';
      scaleCtx.drawImage(canvas, 0, 0, MAX_SIZE, MAX_SIZE);
      return scaleCanvas.toDataURL('image/jpeg', 0.92);
    }
  }

  // As Base64 string
  return canvas.toDataURL('image/jpeg', 0.92);
}
