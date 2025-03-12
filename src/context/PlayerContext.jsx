// src/context/PlayerContext.jsx
import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";
import spotifyService from "../services/spotify";

export const PlayerContext = createContext();
const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: "00", minute: 0 },
    totalTime: { second: "00", minute: 0 },
  });

  // States for Spotify data
  const [spotifyTracks, setSpotifyTracks] = useState([]);
  const [spotifyAlbums, setSpotifyAlbums] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading state
  const [error, setError] = useState(null);

  // Auto-hide error message after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Load Spotify data on mount
  useEffect(() => {
    loadSpotifyData();
  }, []);

  const loadSpotifyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load new releases
      const newReleases = await spotifyService.getNewReleases();
      if (newReleases?.albums?.items) {
        setSpotifyAlbums(newReleases.albums.items);
      }

      // Use search for popular tracks instead of playlist (works with client credentials)
      const popTracks = await spotifyService.getPopularGenreTracks("pop");
      if (popTracks?.tracks?.items) {
        setSpotifyTracks(popTracks.tracks.items);
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to load Spotify data:", err);
      setError("Failed to load Spotify data. Using local data instead.");
      // Reset to empty arrays to trigger fallback to local data
      setSpotifyAlbums([]);
      setSpotifyTracks([]);
      setLoading(false);
    }
  };

  const play = () => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayStatus(true);
          })
          .catch((error) => {
            console.error("Playback error:", error);
          });
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  const playWithId = async (id, isSpotifyTrack = false) => {
    try {
      if (isSpotifyTrack) {
        setLoading(true);
        setError(null);

        // Get full track details
        const trackData = await spotifyService.getTrack(id);

        // Set track data always
        const trackInfo = {
          ...trackData,
          id: trackData.id,
          name: trackData.name,
          desc: trackData.artists.map((artist) => artist.name).join(", "),
          image:
            trackData.album?.images?.[0]?.url ||
            "https://via.placeholder.com/300?text=No+Preview",
        };

        // Check if preview URL exists
        if (!trackData.preview_url) {
          setTrack(trackInfo);
          setLoading(false);
          setError("No preview available for this track");
          setPlayStatus(false);
          return;
        }

        // Add audio source to track info
        trackInfo.audioSrc = trackData.preview_url;
        setTrack(trackInfo);

        setLoading(false);

        // Play after a short delay
        setTimeout(() => {
          if (audioRef.current) {
            const playPromise = audioRef.current.play();

            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setPlayStatus(true);
                })
                .catch((error) => {
                  console.error("Playback error:", error);
                  setError("Could not play this track");
                });
            }
          }
        }, 100);
      } else {
        // Play local track
        setTrack(songsData[id]);
        setTimeout(() => {
          audioRef.current
            .play()
            .then(() => setPlayStatus(true))
            .catch((error) => {
              console.error("Local playback error:", error);
            });
        }, 100);
      }
    } catch (error) {
      console.error("Error playing track:", error);
      setError("Could not play this track");
      setLoading(false);
    }
  };

  const previous = () => {
    if (track.id > 0) {
      setTrack(songsData[track.id - 1]);
      play();
    }
  };

  const next = () => {
    if (track.id < songsData.length - 1) {
      setTrack(songsData[track.id + 1]);
      play();
    }
  };

  const seekSong = (e) => {
    if (audioRef.current && seekBg.current) {
      audioRef.current.currentTime =
        (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
        audioRef.current.duration;
    }
  };

  // Use cleanup for event listeners
  useEffect(() => {
    const timeUpdateHandler = () => {
      if (audioRef.current && seekBar.current && audioRef.current.duration) {
        const percentage =
          (audioRef.current.currentTime / audioRef.current.duration) * 100;
        seekBar.current.style.width = `${Math.floor(percentage)}%`;

        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60)
              .toString()
              .padStart(2, "0"),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60)
              .toString()
              .padStart(2, "0"),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      }
    };

    const current = audioRef.current;
    if (current) {
      current.addEventListener("timeupdate", timeUpdateHandler);
    }

    return () => {
      if (current) {
        current.removeEventListener("timeupdate", timeUpdateHandler);
      }
    };
  }, []);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    // Spotify-related values
    spotifyTracks,
    spotifyAlbums,
    loading,
    error,
    loadSpotifyData,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
      <audio
        ref={audioRef}
        src={track.audioSrc || track.preview_url}
        onEnded={() => setPlayStatus(false)}
      />
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
