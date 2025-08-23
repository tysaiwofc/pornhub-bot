import fs from 'node:fs';
import { load } from 'cheerio';
import { getImage } from './PornImagesExecute.js';
import db from './cache.js';

export async function fetchModel(url, id) {
        const cacheData = await db.get(url + '-' + id).catch(() => {})
        if(cacheData) return JSON.parse(cacheData)


        
        const response = await fetch('https://www.pornhub.com/pornstars/search?search=' + String(url).toLowerCase().replace(/\s/g, '+'));
        const html = await response.text();
        const $ = load(html);
        const element = $('#pornstarListResults').first()
        const e = element.children()
        const performerCard = e.first()
        //console.log(performerCard.html())

        const views = performerCard.find('.views').text()
        const videos = performerCard.find('.videos').text()
        const title = performerCard.find('.title').text()
        const link = performerCard.find('.pornstarLink').attr('href')
        const image = performerCard.find('.pornstarThumb').attr('src')

       
        const modelInfos = await getModelById(link.replace('/pornstar/', ''))
        const sample = modelInfos.videos.map(video => video.src)[0] || 'https://cdni.pornpics.com/1280/7/625/56844000/56844000_035_2034.jpg'
        
        db.set(url + '-' + id, JSON.stringify({
            id: link.replace('/pornstar/', ''),
        url: 'https://www.pornhub.com' + link,
        name: title.trim(),
        viewsCount: stringParaNumeroVisualizacoes(views.replace(/\s/g, '')),
        videosCount: stringParaNumeroVisualizacoes(videos.replace(/\s/g, '')),
        avatar: image,
        sample: sample,
        ...modelInfos
        }))

        return {
            id: link.replace('/pornstar/', ''),
            url: 'https://www.pornhub.com' + link,
            name: title.trim(),
            viewsCount: stringParaNumeroVisualizacoes(views.replace(/\s/g, '')),
            videosCount: stringParaNumeroVisualizacoes(videos.replace(/\s/g, '')),
            avatar: image,
            sample: sample,
            ...modelInfos
        }
    
 
}

export function stringParaNumeroVisualizacoes(params) {
    const string = params
    // Remova todos os caracteres que não são números ou ponto
    const numeroString = string.replace(/[^\d.]/g, '');
    console.log(numeroString)
    // Converta a string para um número
    let numero = parseFloat(numeroString);

    // Verifique se há "M" para multiplicar o número por 1 milhão

    if (string.toLowerCase().includes('b')) {
        numero *= 10000000;
    }
    if (string.toLowerCase().includes('m')) {
        numero *= 1000000;
    }

    if(string.toLowerCase().includes("k")) {
        numero *= 100000
    }

    return numero.toLocaleString('en-US');
}

export async function getModelById(id) {

    const response = await fetch('https://www.pornhub.com/pornstar/' + id);
    //console.log(response.ok)
    const html = await response.text();
    // fs.writeFile('i.html', html, () => {

    // })

    const $ = load(html);
    const element = $('.profileInfoShortBlock').first()
    const e = element.children()
    const performerCard = e.first()

    const pornstarInfo = {};

    performerCard.children().each((index, element) => {
        // Obter o texto do elemento filho atual
        const text = $(element).text().trim();
    
        // Separar a chave e o valor usando o ':'
        const [key, value] = text.split(':');
    
        // Remover espaços extras do valor
        const trimmedValue = value.trim();
    
        // Adicionar a chave e o valor ao objeto pornstarInfo
        pornstarInfo[key.toLowerCase()] = trimmedValue;
    });

    const videosContainer = $('.videoWrapper')
    const videosAll = videosContainer.map((index, element) => {
        // Encontrar o elemento .info dentro de cada .videoWrapper e obter seu texto
        const src = $(element).find('.videoThumb').attr('src');
        const title = $(element).find('.videoThumb').attr('alt')
        const views = $(element).find('.views').text()
        const hrefElement =  $(element).find('.title')
        const href = hrefElement.find('a').attr('href');

        //console.log(views)
        return {
            src,
            title,
            views: stringParaNumeroVisualizacoes(views.replace(/\s/g, '')),
            href: 'https://www.pornhub.com' + href
        };
    }).get(); 

    return {
        ...pornstarInfo,
        videos: videosAll
    }

}


export async function getRandomVideo() {
    const response = await getVideosFromWebPage()
    const randomVideo = response[~~(Math.random() * response.length)]
    return randomVideo
}

export async function getVideosFromWebPage() {
    const response = await fetch("https://pornhub.com/")
    const html = await response.text();
    fs.writeFile('i.html', html, () => {

    })

    const $ = load(html);

    const elementContainer = $('.videoList')
    const videoContainer = elementContainer.children()
    const obj = videoContainer.map((index, element) => {
        const views = $(element).find('.videoViews').text()
        const rating = $(element).find('.rating').text()
        const uploaderLink = $(element).find('.uploaderLink').attr('href')
        const uploaderName = $(element).find('.uploaderLink').text()
        const title = $(element).find('.thumbnailTitle').text()
        const url = $(element).find('.thumbnailTitle').attr('href')
        const thumbnail = $(element).find('.videoThumb').attr('src')
        const duration = $(element).find('.time').text()

        return {
            views: stringParaNumeroVisualizacoes(views),
            rating,
            duration: duration.trim(),
            thumbnail,
            title: title.trim(),
            url: 'https://pornhub.com' + url,
            uploader: {
                url: 'https://pornhub.com' + uploaderLink,
                name: uploaderName
            } 
        }
    }).get()
    return [...obj]
}

//getVideosFromWebPage().then(data => console.log(data))
// Tests
//  fetchModel('Riley Reid').then(data => console.log(data))