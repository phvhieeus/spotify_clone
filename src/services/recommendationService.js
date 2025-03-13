// src/services/recommendationService.js
import spotifyService from "./spotify";
import listenHistoryService from "./listenHistoryService";

class RecommendationService {
  async getMadeForYouTracks(limit = 10) {
    try {
      // Lấy thông tin nghệ sĩ gần đây nhất từ lịch sử nghe
      const recentHistory = listenHistoryService.getHistory();

      // Nếu có lịch sử nghe, lấy nghệ sĩ gần nhất
      if (recentHistory.length > 0) {
        const latestTrack = recentHistory[0];

        // Kiểm tra xem bài hát có nghệ sĩ không
        if (latestTrack.artists && latestTrack.artists.length > 0) {
          const currentArtist = latestTrack.artists[0];

          // Tìm bài hát của nghệ sĩ đó
          return await this.getArtistRecommendations(currentArtist, limit);
        }
      }

      // Nếu không có lịch sử hoặc không tìm thấy nghệ sĩ, sử dụng nghệ sĩ được nghe nhiều nhất
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

      // Thử lấy bài hát từ nghệ sĩ yêu thích
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

  // Thêm hàm mới để lấy bài hát theo nghệ sĩ cụ thể
  async getArtistRecommendations(artist, limit = 10) {
    try {
      // Tìm kiếm bài hát từ nghệ sĩ cụ thể
      const searchResults = await spotifyService.searchTracks(
        `artist:"${artist.name}"`,
        limit
      );

      if (
        searchResults.tracks &&
        searchResults.tracks.items &&
        searchResults.tracks.items.length > 0
      ) {
        return searchResults.tracks.items;
      }

      // Nếu không tìm thấy đủ bài hát, thử tìm kiếm theo ID nghệ sĩ
      if (artist.id) {
        const artistTracks = await spotifyService.getArtistTopTracks(artist.id);
        if (artistTracks && artistTracks.tracks) {
          return artistTracks.tracks;
        }
      }

      // Nếu không tìm thấy, trả về mảng rỗng
      return [];
    } catch (error) {
      console.error(
        `Error getting artist recommendations for ${artist.name}:`,
        error
      );
      return [];
    }
  }

  // Thêm hàm để lấy tên nghệ sĩ hiện tại đang nghe
  getCurrentArtistName() {
    const recentHistory = listenHistoryService.getHistory();
    if (
      recentHistory.length > 0 &&
      recentHistory[0].artists &&
      recentHistory[0].artists.length > 0
    ) {
      return recentHistory[0].artists[0].name;
    }
    return null;
  }
}

const recommendationService = new RecommendationService();
export default recommendationService;
