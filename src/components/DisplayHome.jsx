// src/components/DisplayHome.jsx
import React, { useContext } from "react";
import Navbar from "./Navbar";
import { albumsData, songsData } from "../assets/assets";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { PlayerContext } from "../context/PlayerContext";

const DisplayHome = () => {
  const { spotifyAlbums, spotifyTracks, loading, error } =
    useContext(PlayerContext);

  // Choose which data to display
  const hasSpotifyAlbums = spotifyAlbums && spotifyAlbums.length > 0;
  const hasSpotifyTracks = spotifyTracks && spotifyTracks.length > 0;

  // Use local data as fallback
  const albums = hasSpotifyAlbums ? spotifyAlbums : albumsData;
  const tracks = hasSpotifyTracks ? spotifyTracks : songsData;

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] pb-28 px-6 pt-4 overflow-auto">
      <Navbar />

      {/* Error message styled like Spotify's red banner */}
      {error && (
        <div className="bg-[#e91429] text-white p-3 mb-6 rounded text-sm font-medium">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1DB954]"></div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white my-5">Featured Albums</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
        <h1 className="text-2xl font-bold text-white my-5">
          Today's Biggest Hits
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
