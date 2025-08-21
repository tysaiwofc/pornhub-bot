import { createCanvas, loadImage } from 'canvas';

export default async function generateImage(string, text) {
    const prompt = string.replace(/ /g, '%20') //%2C%20cinematic%20shot%2C%20dynamic%20lighting%2C%2075mm%2C%20Technicolor%2C%20Panavision%2C%20cinemascope%2C%20sharp%20focus%2C%20fine%20details%2C%208k%2C%20HDR%2C%20realism%2C%20realistic%2C%20key%20visual%2C%20film%20still%2C%20cinematic%20color%20grading%2C%20depth%20of%20field&seed=-1&resolution=512x768&guidanceScale=7&negativePrompt=%2C%20bad%20lighting%2C%20low-quality%2C%20deformed%2C%20text%2C%20poorly%20drawn%2C%20holding%20camera%2C%20bad%20art%2C%20bad%20angle%2C%20boring%2C%20low-resolution%2C%20worst%20quality%2C%20bad%20composition%2C%20disfigured

    const url = `https://image-generation.perchance.org/api/generate?prompt=${prompt}&channel=ai-photo-generator&subChannel=public&userKey=e1c2bb3c1f1a26c5d9725e22857142d46c3c4ec8dbadbb3dc15c2966fde7b09c&adAccessCode=868e4b61772be488e0979d99b8d552d0cd9c9f16f10f18353723648e71ce7b8b&requestId=0.5279772564207899&__cacheBust=0.5146088533010342`

    const response = await fetch(url).catch((er) => { console.log(er)})
    if(!response) return undefined
    const data = await response.json()
    const id = data.imageId
    const imageUrl = `https://image-generation.perchance.org/api/downloadTemporaryImage?imageId=${id}`

    const imageBuffer = await getImage(imageUrl, text)
    return imageBuffer
}

export async function getImage(url, text) {
    const canvas = createCanvas(512, 768);
    const ctx = canvas.getContext('2d');

    const image = await loadImage(url);

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); 
    
    ctx.fillStyle = 'black';

    // Calcula a posição do retângulo
    const x1 = 0;
    const y1 = canvas.height - 50; // 10 pixels acima do fundo do canvas
    const width = canvas.width;
    const height = 50; // Altura de 10 pixels

    // Desenha um retângulo com cantos arredondados na parte inferior
    roundRect(ctx, x1, y1, width, height, 0);

    // Preenche o retângulo com cantos arredondados
    ctx.fill();

    ctx.fillStyle = 'rgb(255, 0, 0)'; // Vermelho

    // Define a fonte do texto
    ctx.font = '24px serif';

    // Escreve o texto no canto inferior esquerdo
    const x = 10;
    const y = canvas.height - 20; // Mais alto para dar espaço para o texto
    ctx.fillText(String(text).toLocaleUpperCase(), x, y);

    const buffer = canvas.toBuffer();
    return buffer;
}

// Função para desenhar um retângulo com cantos arredondados
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
}
