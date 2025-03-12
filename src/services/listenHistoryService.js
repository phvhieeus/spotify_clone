// src/services/listenHistoryService.js
const HISTORY_KEY = "spotify_listen_history";
const MAX_HISTORY_ITEMS = 100; // Giới hạn số lượng bài hát lưu trong lịch sử

class ListenHistoryService {
  constructor() {
    this.history = this.getHistory();
  }

  // Lấy lịch sử từ localStorage
  getHistory() {
    try {
      const history = localStorage.getItem(HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error("Error loading listen history:", error);
      return [];
    }
  }

  // Lưu lịch sử vào localStorage
  saveHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
    } catch (error) {
      console.error("Error saving listen history:", error);
    }
  }

  // Thêm một bài hát vào lịch sử
  addToHistory(track) {
    if (!track || !track.id) return;

    // Tạo đối tượng để lưu
    const historyItem = {
      id: track.id,
      name: track.name,
      artists: Array.isArray(track.artists)
        ? track.artists.map((a) => ({ id: a.id, name: a.name }))
        : [{ id: "unknown", name: track.desc || "Unknown" }],
      timestamp: Date.now(),
      // Lưu thêm thông tin về album để hiển thị ảnh
      album: track.album
        ? {
            id: track.album.id,
            name: track.album.name,
            images: track.album.images,
          }
        : null,
    };

    // Xóa bài hát này nếu đã tồn tại trong lịch sử (để thêm lại vào đầu)
    this.history = this.history.filter((item) => item.id !== track.id);

    // Thêm vào đầu mảng
    this.history.unshift(historyItem);

    // Giới hạn kích thước lịch sử
    if (this.history.length > MAX_HISTORY_ITEMS) {
      this.history = this.history.slice(0, MAX_HISTORY_ITEMS);
    }

    this.saveHistory();

    // Thêm dòng này để tự động kích hoạt sự kiện "lịch sử thay đổi"
    window.dispatchEvent(new CustomEvent("historyUpdated"));
  }

  // Phân tích nghệ sĩ được nghe nhiều nhất
  getTopArtists(limit = 5) {
    const artistCount = {};
    const recentWeight = 0.8; // Trọng số cho các bài hát gần đây

    // Đếm số lần xuất hiện của mỗi nghệ sĩ, với trọng số giảm dần theo thời gian
    this.history.forEach((item, index) => {
      const weight = 1 - (index / this.history.length) * recentWeight;

      if (item.artists && Array.isArray(item.artists)) {
        item.artists.forEach((artist) => {
          if (!artistCount[artist.name]) {
            artistCount[artist.name] = { count: 0, id: artist.id };
          }
          artistCount[artist.name].count += weight;
        });
      }
    });

    // Sắp xếp theo số lần nghe
    const sortedArtists = Object.entries(artistCount)
      .map(([name, data]) => ({ name, id: data.id, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return sortedArtists;
  }

  // Xóa lịch sử
  clearHistory() {
    this.history = [];
    localStorage.removeItem(HISTORY_KEY);
  }
}

const listenHistoryService = new ListenHistoryService();
export default listenHistoryService;
