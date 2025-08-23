import { createCanvas, loadImage } from "canvas";

const W = 960;
const H = 540;
const HALF_W = W / 2;
const HALF_H = H / 2;

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

const imageCache = new Map();

async function loadCachedImage(path) {
  if (!path) return null;
  if (imageCache.has(path)) return imageCache.get(path);

  try {
    const img = await loadImage(path);
    imageCache.set(path, img);
    return img;
  } catch {
    return null;
  }
}

export async function getImage(videos) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  const imagePaths = videos.filter(Boolean).slice(0, 4);

  const images = await Promise.all(imagePaths.map(loadCachedImage));

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (!img) continue;

    const x = (i & 1) * HALF_W;
    const y = (i >> 1) * HALF_H;

    ctx.drawImage(img, x, y, HALF_W, HALF_H);
  }

  return canvas.toBuffer();
}
