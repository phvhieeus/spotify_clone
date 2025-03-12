// src/context/PlayerContext.jsx
import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";
import spotifyService from "../services/spotify";
import { searchYouTubeVideo } from "../services/youtube"; // Import YouTube service
// Thêm import listenHistoryService
import listenHistoryService from "../services/listenHistoryService";

export const PlayerContext = createContext();
const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  // Add YouTube player refs
  const youtubePlayerRef = useRef(null);

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: "00", minute: 0 },
    totalTime: { second: "00", minute: 0 },
  });

  // Add YouTube states
  const [youtubeVideoId, setYoutubeVideoId] = useState(null);
  const [usingYouTube, setUsingYouTube] = useState(false);
  const [youtubeAPIReady, setYoutubeAPIReady] = useState(false);

  // States for Spotify data
  const [spotifyTracks, setSpotifyTracks] = useState([]);
  const [spotifyAlbums, setSpotifyAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load YouTube API
  useEffect(() => {
    // Add YouTube iframe API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setYoutubeAPIReady(true);
    };

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  // Initialize YouTube player
  useEffect(() => {
    if (youtubeAPIReady && !youtubePlayerRef.current && window.YT) {
      youtubePlayerRef.current = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        playerVars: {
          autoplay: 0,
          controls: 0,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setPlayStatus(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setPlayStatus(false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setPlayStatus(false);
              // Thêm gọi onPlaybackCompleted khi video kết thúc
              onPlaybackCompleted();
            }
          },
        },
      });
    }
  }, [youtubeAPIReady]);

  // Load video when ID changes
  useEffect(() => {
    if (
      youtubeVideoId &&
      youtubePlayerRef.current &&
      youtubePlayerRef.current.loadVideoById
    ) {
      youtubePlayerRef.current.loadVideoById(youtubeVideoId);
      if (playStatus) {
        youtubePlayerRef.current.playVideo();
      }
    }
  }, [youtubeVideoId]);

  // Update YouTube playback status
  useEffect(() => {
    if (usingYouTube && youtubePlayerRef.current) {
      if (playStatus) {
        youtubePlayerRef.current.playVideo();
      } else {
        youtubePlayerRef.current.pauseVideo();
      }
    }
  }, [playStatus, usingYouTube]);

  // Update seekbar for YouTube
  useEffect(() => {
    let intervalId;

    if (usingYouTube && youtubePlayerRef.current && playStatus) {
      intervalId = setInterval(() => {
        if (
          youtubePlayerRef.current &&
          youtubePlayerRef.current.getCurrentTime &&
          seekBar.current
        ) {
          try {
            const currentTime = youtubePlayerRef.current.getCurrentTime() || 0;
            const duration = youtubePlayerRef.current.getDuration() || 0;

            if (duration > 0) {
              const percentage = (currentTime / duration) * 100;
              seekBar.current.style.width = `${Math.floor(percentage)}%`;

              setTime({
                currentTime: {
                  second: Math.floor(currentTime % 60)
                    .toString()
                    .padStart(2, "0"),
                  minute: Math.floor(currentTime / 60),
                },
                totalTime: {
                  second: Math.floor(duration % 60)
                    .toString()
                    .padStart(2, "0"),
                  minute: Math.floor(duration / 60),
                },
              });
            }
          } catch (err) {
            // Handle YouTube API errors silently
          }
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [usingYouTube, playStatus]);

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

  // Try YouTube for full playback
  const tryYouTube = async () => {
    try {
      setError("Đang tìm bài hát trên YouTube...");

      const videoId = await searchYouTubeVideo(
        track.name,
        track.desc ||
          (track.artists ? track.artists.map((a) => a.name).join(", ") : "")
      );

      if (videoId) {
        setYoutubeVideoId(videoId);
        setUsingYouTube(true);
        setError(null);
        setPlayStatus(true);
      } else {
        setError("Không tìm thấy bài hát trên YouTube");
      }
    } catch (err) {
      console.error("YouTube error:", err);
      setError("Không thể phát nhạc từ YouTube");
    }
  };

  const play = () => {
    if (usingYouTube) {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.playVideo();
        setPlayStatus(true);
      }
    } else if (audioRef.current) {
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayStatus(true);
          })
          .catch((error) => {
            console.error("Playback error:", error);
            // Try YouTube if Spotify preview fails
            tryYouTube();
          });
      }
    }
  };

  const pause = () => {
    if (usingYouTube) {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.pauseVideo();
        setPlayStatus(false);
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  // Thêm hàm xử lý khi hoàn thành bài hát
  const onPlaybackCompleted = () => {
    if (track && track.id) {
      // Đảm bảo bài hát hiện tại được lưu vào lịch sử
      if (track.artists) {
        listenHistoryService.addToHistory(track);
      }

      // Thông báo lịch sử đã được cập nhật
      window.dispatchEvent(new CustomEvent("historyUpdated"));
    }
  };

  const playWithId = async (id, isSpotifyTrack = false) => {
    try {
      if (isSpotifyTrack) {
        setLoading(true);
        setError(null);
        setUsingYouTube(false); // Reset YouTube state

        // Get track details from Spotify
        const trackData = await spotifyService.getTrack(id);

        // Set track data
        const trackInfo = {
          ...trackData,
          id: trackData.id,
          name: trackData.name,
          desc: trackData.artists.map((artist) => artist.name).join(", "),
          image:
            trackData.album?.images?.[0]?.url ||
            "https://via.placeholder.com/300?text=No+Preview",
        };

        setTrack(trackInfo);

        // Thêm bài hát vào lịch sử nghe ở đây
        listenHistoryService.addToHistory(trackData);

        // Check if preview URL exists
        if (trackData.preview_url) {
          trackInfo.audioSrc = trackData.preview_url;
          setTrack(trackInfo);

          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current
                .play()
                .then(() => {
                  setPlayStatus(true);
                })
                .catch((error) => {
                  console.error("Spotify preview error:", error);
                  // Try YouTube if Spotify preview fails
                  tryYouTube();
                });
            }
          }, 100);
        } else {
          // No preview URL, try YouTube directly
          tryYouTube();
        }

        setLoading(false);
      } else {
        // Play local track
        setUsingYouTube(false);
        setTrack(songsData[id]);
        setTimeout(() => {
          audioRef.current
            .play()
            .then(() => setPlayStatus(true))
            .catch((error) => {
              console.error("Local playback error:", error);
              tryYouTube();
            });
        }, 100);
      }
    } catch (error) {
      console.error("Error playing track:", error);
      setError("Không thể phát bài hát này");
      setLoading(false);
      tryYouTube();
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
    if (usingYouTube && youtubePlayerRef.current) {
      try {
        const duration = youtubePlayerRef.current.getDuration();
        const newTime =
          (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * duration;
        youtubePlayerRef.current.seekTo(newTime);
      } catch (err) {
        console.error("Lỗi khi tua video YouTube:", err);
      }
    } else if (audioRef.current && seekBg.current) {
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
    // Add YouTube-related values
    usingYouTube,
    tryYouTube,
    error,
    // Spotify-related values
    spotifyTracks,
    spotifyAlbums,
    loading,
    loadSpotifyData,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
      <div id="youtube-player" style={{ display: "none" }}></div>
      <audio
        ref={audioRef}
        src={track.audioSrc || track.preview_url}
        onEnded={() => {
          // When Spotify preview ends (30 sec), try YouTube for full song
          if (audioRef.current && audioRef.current.duration <= 31) {
            tryYouTube();
          } else {
            setPlayStatus(false);
            // Thêm gọi onPlaybackCompleted khi audio kết thúc
            onPlaybackCompleted();
          }
        }}
      />
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
