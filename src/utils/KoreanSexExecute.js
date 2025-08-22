import { load } from 'cheerio';
import { stringParaNumeroVisualizacoes } from './PornModelExecute.js'

export async function getVideosKorean(page) {
  const baseUrl = 'https://www.pornhub.com/video/search?search=korean&filter_category=103';
  const url = page > 0 ? `${baseUrl}&page=${page}` : baseUrl;
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);

  const elementContainer = $('.videoList');
  const videoContainer = elementContainer.children();

  const obj = videoContainer.map((index, element) => {
    const views = $(element).find('.views').text();
    const rating = $(element).find('.rating').text();
    const uploaderLink = $(element).find('.uploaderLink').attr('href');
    const uploaderName = $(element).find('.uploaderLink').text();
    const title = $(element).find('.title').text();
    const url = $(element).find('.title').children().attr('href');
    const thumbnail = $(element).find('.videoThumb').attr('src');
    const duration = $(element).find('.time').text();

    return {
      views: 0, //stringParaNumeroVisualizacoes(views),
      rating,
      duration: duration.trim(),
      thumbnail,
      title: title.trim(),
      url: 'https://pornhub.com' + url,
      uploader: {
        url: 'https://pornhub.com' + uploaderLink,
        name: uploaderName
      }
    };
  }).get();

  return obj;
}
