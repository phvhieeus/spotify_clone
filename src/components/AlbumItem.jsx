// src/components/AlbumItem.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AlbumItem = ({ image, name, desc, id }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Only navigate if we have a valid ID
    if (id) {
      navigate(`/album/${id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <div className="relative pb-[100%] rounded overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover rounded"
          src={image}
          alt={name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300?text=Album";
          }}
        />
      </div>
      <p className="font-bold mt-2 mb-1 truncate">{name || "Unknown"}</p>
      <p className="text-slate-200 text-sm truncate">
        {desc || "Various Artists"}
      </p>
    </div>
  );
};

export default AlbumItem;
