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
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
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
      </div>
      <p className="font-bold mt-2 mb-1 truncate">{name || "Unknown"}</p>
      <p className="text-slate-200 text-sm truncate">
        {desc || "Unknown Artist"}
      </p>
    </div>
  );
};

export default SongItem;
