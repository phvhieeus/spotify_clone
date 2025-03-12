// src/components/SearchComponent.jsx
import React, { useState } from "react";
import spotifyService from "../services/spotify";
import SongItem from "./SongItem";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      setSearching(true);
      setSearchError("");
      setResults([]);

      const response = await spotifyService.searchTracks(query);

      if (response?.tracks?.items?.length > 0) {
        setResults(response.tracks.items);
      } else {
        setSearchError("No results found");
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="my-3">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs..."
          className="w-full p-2 pl-10 pr-4 bg-black bg-opacity-60 rounded-full text-white focus:outline-none border border-gray-700"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          disabled={searching}
        >
          🔍
        </button>
      </form>

      {searching && (
        <div className="flex justify-center my-3">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {searchError && (
        <div className="text-red-400 mt-2 text-sm text-center">
          {searchError}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="font-bold text-xl mb-2">Search Results</h2>
          <div className="flex overflow-auto">
            {results.map((track) => (
              <SongItem
                key={track.id}
                name={track.name}
                desc={track.artists?.map((a) => a.name).join(", ")}
                image={track.album?.images?.[0]?.url}
                id={track.id}
                isSpotifyTrack={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
