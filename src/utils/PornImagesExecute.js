import { createCanvas, loadImage } from 'canvas';
const canvasWidth = 960;
const canvasHeight = 540;

export async function getImage(videos) {

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // fundo preto
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // carregar imagens válidas
    const imagePaths = videos.filter(Boolean).slice(0, 4);
    const images = await Promise.allSettled(imagePaths.map(p => loadImage(p)));

    // desenhar imagens nos quadrantes
    images.forEach((res, i) => {
        if (res.status !== "fulfilled") return;
        const img = res.value;
        const x = (i % 2) * (canvasWidth / 2);
        const y = Math.floor(i / 2) * (canvasHeight / 2);
        ctx.drawImage(img, x, y, canvasWidth / 2, canvasHeight / 2);
    });

    return canvas.toBuffer();
}
