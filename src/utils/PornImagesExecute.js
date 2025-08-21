import { createCanvas, loadImage } from 'canvas';
const canvasWidth = 960; // (480x2)
const canvasHeight = 540; // (270x2)

export async function getImage(videos) {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black'; // Define a cor de preenchimento como preto
    ctx.roundRect(0, 0, canvasWidth, canvasHeight, 20);
    ctx.fill(); // Preenche o retângulo com cantos arredondados

    // Array para armazenar as promessas de carregamento das imagens
    const loadImagePromises = [];

    const imagePaths = videos
    
    // Carregar as imagens
    imagePaths.forEach((path) => {
        const promise = loadImage(path);
        loadImagePromises.push(promise);
    });
    
    // Esperar até que todas as imagens estejam carregadas e desenhar no canvas
    await Promise.all(loadImagePromises).then((images) => {
        // Desenhar as imagens no canvas
        ctx.drawImage(images[0], 0, 0, canvasWidth / 2, canvasHeight / 2); // imagem1 no canto superior esquerdo
        ctx.drawImage(images[1], canvasWidth / 2, 0, canvasWidth / 2, canvasHeight / 2); // imagem2 no canto superior direito
        ctx.drawImage(images[2], 0, canvasHeight / 2, canvasWidth / 2, canvasHeight / 2); // imagem3 no canto inferior esquerdo
        ctx.drawImage(images[3], canvasWidth / 2, canvasHeight / 2, canvasWidth / 2, canvasHeight / 2); // imagem4 no canto inferior direito
    }).catch(() => {});

    
    // Salvar a imagem depois que todas as imagens estiverem desenhadas no canvas
    const buffer = canvas.toBuffer()
    return buffer;
}


