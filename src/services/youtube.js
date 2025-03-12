// src/services/youtube.js
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const searchYouTubeVideo = async (trackName, artistName) => {
  try {
    const query = encodeURIComponent(
      `${trackName} ${artistName} official audio`
    );
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&type=video&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    }
    return null;
  } catch (error) {
    console.error("YouTube search error:", error);
    return null;
  }
};

export default {
  searchYouTubeVideo,
};
