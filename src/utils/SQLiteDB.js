// Map em memória para armazenar vídeos
const videoMap = new Map();
let nextId = 1; // simula o ID auto-increment

function saveVideos(videos) {
    const ids = [];

    videos.forEach(video => {
        const id = nextId++;
        videoMap.set(id, { id, title: video.title, href: video.href, url: video.url, views: video.views, thumbnail: video.thumb || null });
        ids.push(id);
    });

    return ids; // retorna um array com os IDs
}

function getVideo(id) {
    return videoMap.get(id) || null;
}

function getAllVideos() {
    return Array.from(videoMap.values());
}

export { saveVideos, getVideo, getAllVideos };
