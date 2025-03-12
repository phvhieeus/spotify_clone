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
    <>
      <Navbar />

      {/* Display error message if any */}
      {error && (
        <div className="bg-red-900 bg-opacity-60 p-3 mt-2 mb-4 rounded-md text-white text-sm">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
        <div className="flex overflow-auto">
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

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Today's Biggest Hits</h1>
        <div className="flex overflow-auto">
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
    </>
  );
};

export default DisplayHome;
