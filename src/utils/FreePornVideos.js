import fs from "fs";
import { load } from "cheerio";

function parseViews(viewsStr) {
  if (!viewsStr) return 0;
  viewsStr = viewsStr.replace(/,/g, "").trim().toUpperCase();

  const lastChar = viewsStr.slice(-1);
  const num = parseFloat(viewsStr);

  if (lastChar === "K") return Math.round(num * 1_000);
  if (lastChar === "M") return Math.round(num * 1_000_000);
  if (lastChar === "B") return Math.round(num * 1_000_000_000);
  return parseInt(viewsStr) || 0;
}

export async function fetchVideos(url = "https://www.freepornvideos.xxx/") {
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);

  //fs.writeFileSync("i.html", html);

  const results = [];

  $(".item").each((_, el) => {
    const anchor = $(el).find("> a").first();

    const href = anchor.attr("href") || "";
    const title = anchor.attr("title") || "";
    const strongTitle = $(el).find("strong.title").text().trim();

    const src =
      $(el).find("img").attr("data-src") ||
      $(el).find("img").attr("src") ||
      "";

    const duration = $(el).find(".duration").text().trim() || null;

    const rating = $(el).find(".rating").text().trim() || null;
    const views = $(el).find(".views").text().trim() || null;

    const models = [];
    $(el)
      .find(".models__item")
      .each((_, modelEl) => {
        models.push($(modelEl).text().trim());
      });

    results.push({
      href,
      title: strongTitle || title,
      src,
      duration,
      rating,
      views: parseViews(views),
      models,
    });
  });

  return results;
}

function formatDuration(iso) {
  if (!iso) return null;

  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return iso;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  let result = "";
  if (hours) result += `${hours}h `;
  if (minutes) result += `${minutes}m `;
  if (seconds) result += `${seconds}s`;

  return result.trim();
}

export async function getVideoInfo(url) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);

  //fs.writeFileSync("i.html", html);

  let data = null;

  $("script").each((_, el) => {
    const content = $(el).html();
    if (!content) return;

    if (content.includes("thumbnailUrl") && content.includes("duration")) {
      try {
        data = JSON.parse(content);


        delete data.interactionStatistic;
        delete data["@context"];
        delete data["@type"];

        data.duration = formatDuration(data.duration);

      } catch (err) {

      }
    }
  });

  if (!data) {
    console.log("Nenhum script com os dados do vídeo encontrado");
    return null;
  }

  return data;
}


export async function getModelInfo(name) {
  const url = `https://www.freepornvideos.xxx/models/${name}/`;
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);

  //fs.writeFileSync("i.html", html);

  const modelEl = $(".block-model");
  const modelName = $(".block-model__title").text().trim();
  const modelId = modelEl.attr("data-id");
  const imgSrc = modelEl.find(".img img").attr("src") || null;
  const totalViews = parseViews(modelEl.find(".views").text());

  const tags = [];
  $(".tags-related .tags__item").each((_, el) => {
    tags.push({
      title: $(el).attr("title"),
      href: $(el).attr("href")
    });
  });

  // Lista de vídeos
  const videos = [];
  $("#list_videos_common_videos_list_items .item").each((_, el) => {
    const videoEl = $(el);
    const href = videoEl.find("a.thumb_img").attr("href");
    const title = videoEl.find(".title").text().trim();
    const thumbnail = videoEl.find(".img img").attr("src") || null;
    const duration = formatDuration(videoEl.find(".duration").text());
    const rating = videoEl.find(".rating").text().trim();
    const views = parseViews(videoEl.find(".views").text());
    const modelsList = [];
    videoEl.find(".models__item").each((_, me) => {
      modelsList.push($(me).text().trim());
    });

    videos.push({ href, title, thumbnail, duration, rating, views, models: modelsList });
  });

  const data = {
    modelName,
    url,
    modelId: Number(modelId),
    imgSrc,
    totalViews,
    tags,
    videos

  };

  return data;
}

