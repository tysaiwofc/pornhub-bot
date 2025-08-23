
const videoMap = new Map();
let nextId = 1; 

function saveVideos(videos) {
    const ids = [];

    videos.forEach(video => {
        const id = nextId++;
        videoMap.set(id, { id, title: video.title, href: video.href, url: video.url, views: video.views, thumbnail: video.thumb || null });
        ids.push(id);
    });

    return ids; 
}

function getVideo(id) {
    return videoMap.get(id) || null;
}

function getAllVideos() {
    return Array.from(videoMap.values());
}

export { saveVideos, getVideo, getAllVideos };
