// src/services/recommendationService.js
import spotifyService from "./spotify";
import listenHistoryService from "./listenHistoryService";

class RecommendationService {
  async getMadeForYouTracks(limit = 10) {
    try {
      const topArtists = listenHistoryService.getTopArtists(3);

      // Nếu không có lịch sử nghe, trả về bài hát phổ biến
      if (topArtists.length === 0) {
        const popularTracks = await spotifyService.getPopularGenreTracks(
          "pop",
          limit
        );
        return popularTracks.tracks.items;
      }

      let tracks = [];

      // Thử lấy bài hát từ mỗi nghệ sĩ yêu thích
      for (const artist of topArtists) {
        if (tracks.length >= limit) break;

        const artistName = artist.name;
        const searchResults = await spotifyService.searchTracks(
          `artist:${artistName}`,
          Math.ceil((limit - tracks.length) / topArtists.length)
        );

        // Thêm vào danh sách kết quả
        if (searchResults.tracks && searchResults.tracks.items) {
          tracks = [...tracks, ...searchResults.tracks.items];
        }
      }

      // Loại bỏ các bài hát trùng lặp
      const uniqueTracks = tracks.filter(
        (track, index, self) =>
          index === self.findIndex((t) => t.id === track.id)
      );

      // Sắp xếp ngẫu nhiên để đa dạng kết quả
      uniqueTracks.sort(() => Math.random() - 0.5);

      return uniqueTracks.slice(0, limit);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return [];
    }
  }
}

const recommendationService = new RecommendationService();
export default recommendationService;
