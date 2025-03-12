import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const Player = () => {
  const {
    seekBar,
    seekBg,
    playStatus,
    play,
    pause,
    track,
    time,
    previous,
    next,
    seekSong,
    usingYouTube,
    error,
  } = useContext(PlayerContext);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-[#181818] border-t border-[#282828] flex justify-between items-center px-4 z-50">
      {/* Left section - Song info */}
      <div className="flex items-center gap-4 w-[30%]">
        {track?.image ? (
          <img
            className="h-14 w-14 object-cover"
            src={track.image}
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/56?text=Music";
            }}
          />
        ) : (
          <div className="h-14 w-14 bg-[#282828] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="text-[#b3b3b3]"
            >
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
        )}

        <div>
          <p className="text-sm text-white font-medium hover:underline cursor-pointer">
            {track?.name || "Select a track"}
          </p>
          <p className="text-xs text-[#b3b3b3] hover:text-white hover:underline cursor-pointer">
            {track?.desc || "Artist"}
          </p>

          {/* Add YouTube indicator */}
          {usingYouTube && (
            <p className="text-[#1DB954] text-xs flex items-center mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="currentColor"
                viewBox="0 0 576 512"
              >
                <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64s-170.8 0-213.4 11.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
              </svg>
              Đang phát từ YouTube
            </p>
          )}

          {/* Display error message */}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="ml-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="text-[#b3b3b3] hover:text-white cursor-pointer"
            viewBox="0 0 16 16"
          >
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
          </svg>
        </div>
      </div>

      {/* Middle section - Player controls */}
      <div className="flex flex-col items-center gap-2 max-w-[45%] w-full">
        <div className="flex items-center gap-5 mb-1">
          <button className="text-[#b3b3b3] hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 3c-1.832 0-3.333.53-4.5 1.273v-1.5c0-.133-.058-.318-.226-.55C3.123 2.01 2.957 2 2.93 2H2.75c-.206 0-.278.045-.297.055-.024.013-.08.04-.08.123v3.294C2.106 5.595 2 5.822 2 6c0 .178.106.405.373.517v3.294c0 .083.056.11.08.123.019.01.09.055.297.055h.18c.027 0 .193-.01.345-.224.168-.232.226-.417.226-.55v-1.5C4.667 8.47 6.167 9 8 9 11.512 9 14 7.57 14 5.5S11.512 2 8 2zm0 1c2.903 0 5 1.188 5 2.5S10.903 8 8 8 3 6.813 3 5.5 5.097 4 8 4z" />
            </svg>
          </button>
          <button
            className="text-[#b3b3b3] hover:text-white"
            onClick={previous}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0V4z" />
            </svg>
          </button>
          {playStatus ? (
            <button
              onClick={pause}
              className="bg-white rounded-full p-2 text-black hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5 3.5h2v9H5v-9zm4 0h2v9H9v-9z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={play}
              className="bg-white rounded-full p-2 text-black hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.26 12.466V3.534a.5.5 0 0 1 .764-.424l6.726 4.466a.5.5 0 0 1 0 .848L6.026 12.89a.5.5 0 0 1-.764-.424z" />
              </svg>
            </button>
          )}
          <button onClick={next} className="text-[#b3b3b3] hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z" />
            </svg>
          </button>
          <button className="text-[#b3b3b3] hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 3a5 5 0 0 0-5 5v6a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-6a2 2 0 0 1 4 0v6a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-6a5 5 0 0 0-5-5z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-[#a7a7a7] w-10 text-right">
            {time.currentTime.minute}:{time.currentTime.second}
          </span>
          <div
            ref={seekBg}
            onClick={seekSong}
            className="w-full h-1 bg-[#5e5e5e] rounded-full cursor-pointer group relative"
          >
            <div
              ref={seekBar}
              className="h-1 bg-white rounded-full absolute left-0 top-0 group-hover:bg-[#1DB954]"
            >
              <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-[-4px] opacity-0 group-hover:opacity-100"></div>
            </div>
          </div>
          <span className="text-xs text-[#a7a7a7] w-10">
            {time.totalTime.minute}:{time.totalTime.second}
          </span>
        </div>
      </div>

      {/* Right section - Volume controls */}
      <div className="hidden md:flex items-center justify-end gap-3 w-[30%]">
        <button className="text-[#b3b3b3] hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M3 1a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3.6a1 1 0 0 1 1 1v8.8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8.8a1 1 0 0 1 1-1zm9 1H4v12h8z" />
            <path d="M5 5h6v1H5zm0 3h6v1H5zm0 3h6v1H5z" />
          </svg>
        </button>
        <button className="text-[#b3b3b3] hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
          </svg>
        </button>
        <div className="flex items-center gap-2 ml-1">
          <button className="text-[#b3b3b3] hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
              <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
              <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7.5 4v8a.5.5 0 0 1-.783.412l-4-2.5a.5.5 0 0 1 0-.824l4-2.5z" />
            </svg>
          </button>
          <div className="w-[93px] group">
            <div className="h-1 bg-[#5e5e5e] rounded-full cursor-pointer relative">
              <div className="h-1 bg-white rounded-full absolute left-0 top-0 w-[70%] group-hover:bg-[#1DB954]">
                <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-[-4px] opacity-0 group-hover:opacity-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
