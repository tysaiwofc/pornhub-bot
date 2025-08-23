import { createCanvas, loadImage, CanvasRenderingContext2D } from "canvas";


const W = 800;
const H = 450;


const cardCache = new Map();

export async function generateCard({ 
  modelName, 
  subs, 
  age, 
  country, 
  avatarPath, 
  videos 
}) {
  const cacheKey = JSON.stringify({ modelName, subs, age, country, avatarPath, videos });
  if (cardCache.has(cacheKey)) return cardCache.get(cacheKey);

  const canvasHeight = Math.max(H, 170 + videos.length * 50);
  const canvas = createCanvas(W, canvasHeight);
  const ctx = canvas.getContext("2d");


  ctx.fillStyle = "#1a1a1a";
  ctx.roundRect(0, 0, W, canvasHeight, 30);
  ctx.fill();


  if (avatarPath) {
    try {
      const avatar = await loadImage(avatarPath);
      const r = 60, x = 80, y = 90;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatar, x - r, y - r, r * 2, r * 2);
      ctx.restore();
    } catch(e) {}
  }

  ctx.fillStyle = "#2596be"; 
  ctx.font = "bold 28px Arial";
  ctx.fillText(modelName, 160, 70);

  ctx.fillStyle = "#2596be";
  ctx.font = "20px Arial";
  ctx.fillText(`${subs} views`, 160, 100);

  ctx.fillStyle = "#ccc";
  ctx.font = "16px Arial";
  ctx.fillText(`🎂 ${age || "N/A"}  🌍 ${country || "N/A"}`, 160, 130);


  function fillTextWithLimit(ctx, text, x, y, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) return ctx.fillText(text, x, y);
    let left = 0, right = text.length, truncated = "";
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const substr = text.slice(0, mid);
      if (ctx.measureText(substr + "...").width <= maxWidth) {
        truncated = substr;
        left = mid + 1;
      } else right = mid;
    }
    ctx.fillText(truncated + "...", x, y);
  }


  ctx.font = "16px Arial";
  videos.forEach((video, i) => {
    const y = 170 + i * 50;


    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 4;
    ctx.fillStyle = "#222";
    ctx.roundRect(40, y, W - 80, 40, 8);
    ctx.fill();
    ctx.restore();


    ctx.fillStyle = "#2596be";
    ctx.font = "bold 18px Arial";
    ctx.fillText(String(i + 1), 55, y + 26);

    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    fillTextWithLimit(ctx, video.name, 100, y + 26, W - 160);
  });

  const buffer = canvas.toBuffer("image/png");
  cardCache.set(cacheKey, buffer);
  return buffer;
}


CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2*r) r = w/2;
  if (h < 2*r) r = h/2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y, x+w, y+h, r);
  this.arcTo(x+w, y+h, x, y+h, r);
  this.arcTo(x, y+h, x, y, r);
  this.arcTo(x, y, x+w, y, r);
  this.closePath();
  return this;
};
