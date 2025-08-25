import fs from "fs";
import { load } from "cheerio";

export const CATEGORY_ID = '1216755110189727824';

export async function fetchEromeMedia(url) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);

  const results = [];


  $("div.video-lg").each((_, el) => {
    const video = $(el).find("video");
    const poster = video.attr("poster");

    const sources = [];
    video.find("source").each((_, src) => {
      sources.push({
        src: $(src).attr("src"),
        type: $(src).attr("type"),
        res: $(src).attr("res"),
        label: $(src).attr("label"),
      });
    });

    results.push({
      type: "video",
      id: $(el).attr("id"),
      poster,
      sources,
    });
  });


  $("div.media-group div.img").each((_, el) => {
    results.push({
      type: "image",
      src: $(el).attr("data-src"),
      alt: $(el).find("img").attr("alt"),
    });
  });


  //fs.writeFileSync("parsed.json", JSON.stringify(results, null, 2));

  return results;
}
