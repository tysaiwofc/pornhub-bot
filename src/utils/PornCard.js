import { createCanvas, loadImage, CanvasRenderingContext2D } from "canvas";
import fs from "fs";

const W = 800;
const H = 450;

// --- Cache em memória ---
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
  if (cardCache.has(cacheKey)) {
    return cardCache.get(cacheKey);
  }

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // --- Fundo com gradiente suave ---
  const gradient = ctx.createLinearGradient(0, 0, W, H);
  gradient.addColorStop(0, "#181818");
  gradient.addColorStop(1, "#222222");
  ctx.fillStyle = gradient;
  ctx.roundRect(0, 0, W, H, 30);
  ctx.fill();

  // --- Carregar avatar ---
  const [avatarRes] = await Promise.allSettled([
    avatarPath ? loadImage(avatarPath) : null,
  ]);

  if (avatarRes.status === "fulfilled" && avatarRes.value) {
    const avatar = avatarRes.value;
    const r = 60;
    const x = 80;
    const y = 90;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, x - r, y - r, r * 2, r * 2);
    ctx.restore();
  }

  // --- Nome da modelo ---
  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px Arial";
  ctx.fillText(modelName, 160, 70);

  // --- Subs ---
  ctx.fillStyle = "#FF6600";
  ctx.font = "20px Arial";
  ctx.fillText(`${subs} views`, 160, 100);

  // --- Idade e país ---
  ctx.fillStyle = "#ccc";
  ctx.font = "16px Arial";
  ctx.fillText(`🎂 ${age}  🌍 ${country}`, 160, 130);
function fillTextWithLimit(ctx, text, x, y, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) {
    ctx.fillText(text, x, y);
    return;
  }

  let left = 0;
  let right = text.length;
  let truncated = "";

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const substr = text.slice(0, mid);
    if (ctx.measureText(substr + "...").width <= maxWidth) {
      truncated = substr;
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  ctx.fillText(truncated + "...", x, y);
}

  // --- Lista de vídeos ---
  ctx.font = "16px Arial";
  videos.slice(0, 6).forEach((video, i) => {
    const y = 170 + i * 45;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 4;
    ctx.fillStyle = "#333";
    ctx.roundRect(40, y, W - 80, 35, 8);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#FF6600";
    ctx.font = "bold 18px Arial";
    ctx.fillText(String(i + 1), 55, y + 24);

    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    fillTextWithLimit(ctx, video.name, 100, y + 24, W - 160);

  });

  const buffer = canvas.toBuffer("image/png");
  cardCache.set(cacheKey, buffer);
  return buffer;
}

// --- Helper para cantos arredondados ---
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

// // --- Exemplo de uso ---
// (async () => {
//   const buffer = await generateCard({
//     modelName: "Jane Doe",
//     subs: "12.3k",
//     age: 25,
//     country: "USA",
//     avatarPath: "./avatar.png",
//     videos: [
//       { name: "Video A" },
//       { name: "Video B" },
//       { name: "Video C" },
//       { name: "Video D" },
//       { name: "Video E" },
//       { name: "Video F" },
//     ],
//   });

//   fs.writeFileSync("card.png", buffer);
//   console.log("✅ card.png gerado com informações adicionais!");
// })();


