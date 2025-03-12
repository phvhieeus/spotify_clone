// src/components/DisplayHome.jsx
import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { albumsData, songsData } from "../assets/assets";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { PlayerContext } from "../context/PlayerContext";
import recommendationService from "../services/recommendationService";

const DisplayHome = () => {
  const { spotifyAlbums, spotifyTracks, loading, error } =
    useContext(PlayerContext);

  // State để lưu bài hát được đề xuất
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Choose which data to display
  const hasSpotifyAlbums = spotifyAlbums && spotifyAlbums.length > 0;
  const hasSpotifyTracks = spotifyTracks && spotifyTracks.length > 0;

  // Use local data as fallback
  const albums = hasSpotifyAlbums ? spotifyAlbums : albumsData;
  const tracks = hasSpotifyTracks ? spotifyTracks : songsData;

  // Function to load recommendations
  const loadRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const recommendations = await recommendationService.getMadeForYouTracks(
        8
      );
      setRecommendedTracks(recommendations);
    } catch (err) {
      console.error("Error loading recommendations:", err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Load recommendations khi component mount và khi lịch sử thay đổi
  useEffect(() => {
    loadRecommendations();

    // Thêm event listener để cập nhật khi lịch sử thay đổi
    const handleHistoryUpdate = () => {
      loadRecommendations();
    };

    window.addEventListener("historyUpdated", handleHistoryUpdate);

    // Cập nhật khi component hiển thị (người dùng quay lại trang Home)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadRecommendations();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener("historyUpdated", handleHistoryUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="px-6 py-4">
      <Navbar />

      {/* Display error message if any */}
      {error && (
        <div className="bg-[#e91429] p-3 my-4 rounded text-white text-sm font-medium">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1DB954]"></div>
        </div>
      )}

      {/* Made for You Section - Đặt ở đầu để nhấn mạnh */}
      <div className="mb-8">
        <h1 className="my-5 font-bold text-2xl">
          <span className="text-[#1DB954]">Made for You</span> • Dành cho bạn
        </h1>
        {loadingRecommendations ? (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1DB954]"></div>
          </div>
        ) : recommendedTracks && recommendedTracks.length > 0 ? (
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {recommendedTracks.map((item) => (
              <SongItem
                key={item.id}
                name={item.name}
                desc={item.artists.map((artist) => artist.name).join(", ")}
                id={item.id}
                image={
                  item.album?.images?.[0]?.url ||
                  "https://via.placeholder.com/300?text=No+Preview"
                }
                isSpotifyTrack={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-400">
            Nghe nhạc để nhận đề xuất tùy chỉnh cho bạn
          </div>
        )}
      </div>

      {/* Phần còn lại của trang */}
      <div className="mb-8">
        <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {albums.map((item, index) => (
            <AlbumItem
              key={item.id || index}
              name={item.name}
              desc={
                hasSpotifyAlbums && item.artists
                  ? item.artists.map((a) => a.name).join(", ")
                  : item.desc || ""
              }
              id={item.id || index}
              image={
                hasSpotifyAlbums && item.images && item.images.length > 0
                  ? item.images[0].url
                  : item.image
              }
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h1 className="my-5 font-bold text-2xl">Today's Biggest Hits</h1>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {tracks.map((item, index) => (
            <SongItem
              key={item.id || index}
              name={item.name}
              desc={
                hasSpotifyTracks && item.artists
                  ? item.artists.map((artist) => artist.name).join(", ")
                  : item.desc
              }
              id={hasSpotifyTracks ? item.id : index}
              image={
                hasSpotifyTracks &&
                item.album &&
                item.album.images &&
                item.album.images.length > 0
                  ? item.album.images[0].url
                  : item.image
              }
              isSpotifyTrack={hasSpotifyTracks}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayHome;
