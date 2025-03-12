// src/components/SongItem.jsx
import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

const SongItem = ({ name, image, desc, id, isSpotifyTrack = false }) => {
  const { playWithId } = useContext(PlayerContext);

  const handlePlay = () => {
    playWithId(id, isSpotifyTrack);
  };

  return (
    <div
      onClick={handlePlay}
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] transition-colors relative group"
    >
      <div className="relative pb-[100%] rounded overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover rounded"
          src={image}
          alt={name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300?text=Music";
          }}
        />
        {/* Play button overlay */}
        <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-green-500 rounded-full p-2 shadow-lg hover:scale-105 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-black"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
      </div>
      <p className="font-bold mt-2 mb-1 truncate">{name || "Unknown"}</p>
      <p className="text-slate-300 text-sm truncate">
        {desc || "Unknown Artist"}
      </p>
    </div>
  );
};

export default SongItem;
