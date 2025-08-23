import { load } from 'cheerio';
import xvideos from 'xvideosx';
import fs from 'node:fs'
export async function getVideosFromXvideox() {
    const fresh = await xvideos.videos.fresh({page: 1})

    return fresh.videos
}

export async function getVideoInformationFromXvideox(url) {
    const detail = await xvideos.videos.details({ url })
    return detail
}

export async function getTheBestVideosFromXvideox() {
    const bestList = await xvideos.videos.best({ year: '2024', month: '02', page: 1 });

    return bestList?.videos
}

export async function fetchVideosFromXvideox(param) {

    const response = await fetch('https://www.xvideos.com/?k=' + String(param).toLocaleLowerCase().split('+'))
    const html = await response.text()

    // fs.writeFile('i.html', html, () => {

    // })
    const $ = load(html)

    const pattern = /^video_\w+$/;

    const videosContainer = $(' *[id]').filter((i, el) => {
        const id = $(el).attr('id')

        return id && pattern.test(id)
    }).map((i, el) => {
        const id = $(el).attr('data-id')
        const url = $(el).children().eq(1).find('.title').children().eq(0).attr('href') // FINALMENTE ISSO FUNCIOU
        const title = $(el).children().eq(1).find('.title').first().text()
        const thumbnail = $(el).children().eq(0).find('.thumb').children().eq(0).children().eq(0).attr('data-src')
        //
        const quality = $(el).children().eq(0).find('.thumb').children().eq(0).find('.video-hd-mark').text()
        
        return {
            url: 'https://xvideos.com' + url,
            path: url,
            id, // https://discord.gg/RH7EcBzKkH
            title,
            thumbnail,
            quality
        }
    }).get()


    return videosContainer[~~(Math.random() * videosContainer.length)]
  
}

//fetchVideosFromXvideox("stepsis").then(data => console.log(data))
