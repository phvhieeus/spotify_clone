// src/components/SongItem.jsx
import React, { useContext, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";

const SongItem = ({ name, image, desc, id, isSpotifyTrack = false }) => {
  const { playWithId } = useContext(PlayerContext);
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = (e) => {
    if (e) {
      e.stopPropagation();
    }
    playWithId(id, isSpotifyTrack);
  };

  return (
    <div
      onClick={handlePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="min-w-[180px] max-w-[180px] flex-shrink-0 bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-all duration-200 cursor-pointer group"
    >
      <div className="relative mb-4">
        <div className="aspect-square shadow-xl rounded-md overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={image}
            alt={name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300?text=Music";
            }}
          />
        </div>
        <div
          className={`absolute bottom-2 right-2 opacity-0 shadow-2xl transform translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300`}
        >
          <button
            className="bg-[#1DB954] rounded-full p-3 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="text-black"
              viewBox="0 0 16 16"
            >
              <path d="M5.26 12.466V3.534a.5.5 0 0 1 .764-.424l6.726 4.466a.5.5 0 0 1 0 .848L6.026 12.89a.5.5 0 0 1-.764-.424z" />
            </svg>
          </button>
        </div>
      </div>
      <h3 className="font-bold text-base mb-1 truncate text-white">
        {name || "Unknown"}
      </h3>
      <p className="text-[#b3b3b3] text-sm line-clamp-2">
        {desc || "Unknown Artist"}
      </p>
    </div>
  );
};

export default SongItem;
