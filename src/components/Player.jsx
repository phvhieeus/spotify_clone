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
  } = useContext(PlayerContext);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-[#181818] border-t border-[#282828] flex justify-between items-center text-white px-4 z-50">
      {/* Left section - Song info */}
      <div className="flex items-center gap-3 w-[30%] min-w-[180px]">
        {track?.image && (
          <img
            className="w-14 h-14 object-cover shadow-lg"
            src={track.image}
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/56?text=Music";
            }}
          />
        )}
        <div className="overflow-hidden">
          <p className="font-medium text-sm truncate">
            {track?.name || "Select a track"}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {track?.desc?.slice(0, 30) || "Artist"}
          </p>
        </div>
      </div>

      {/* Middle section - Player controls */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-[45%]">
        <div className="flex items-center gap-5">
          <img
            className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100"
            src={assets.shuffle_icon}
            alt="shuffle"
          />
          <img
            onClick={previous}
            className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100"
            src={assets.prev_icon}
            alt="previous"
          />
          {playStatus ? (
            <div className="bg-white rounded-full p-2 cursor-pointer hover:scale-105 transition-transform">
              <img
                onClick={pause}
                className="w-5 h-5 cursor-pointer"
                src={assets.pause_icon}
                alt="pause"
              />
            </div>
          ) : (
            <div className="bg-white rounded-full p-2 cursor-pointer hover:scale-105 transition-transform">
              <img
                onClick={play}
                className="w-5 h-5 cursor-pointer"
                src={assets.play_icon}
                alt="play"
              />
            </div>
          )}
          <img
            onClick={next}
            className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100"
            src={assets.next_icon}
            alt="next"
          />
          <img
            className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100"
            src={assets.loop_icon}
            alt="loop"
          />
        </div>
        <div className="flex items-center gap-3 w-full">
          <p className="text-xs text-gray-400 min-w-[40px] text-right">
            {time.currentTime.minute}:{time.currentTime.second}
          </p>
          <div
            ref={seekBg}
            onClick={seekSong}
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer group relative"
          >
            <hr
              ref={seekBar}
              className="h-1 border-none w-0 bg-white rounded-full absolute left-0 top-0 group-hover:bg-green-500"
            />
            <div className="h-1 w-full absolute top-0 left-0 group-hover:h-2 transition-all rounded-full"></div>
          </div>
          <p className="text-xs text-gray-400 min-w-[40px]">
            {time.totalTime.minute}:{time.totalTime.second}
          </p>
        </div>
      </div>

      {/* Right section - Volume controls */}
      <div className="hidden md:flex items-center gap-3 justify-end w-[30%] min-w-[180px]">
        <img
          className="w-4 opacity-70 hover:opacity-100 cursor-pointer"
          src={assets.plays_icon}
          alt=""
        />
        <img
          className="w-4 opacity-70 hover:opacity-100 cursor-pointer"
          src={assets.mic_icon}
          alt=""
        />
        <img
          className="w-4 opacity-70 hover:opacity-100 cursor-pointer"
          src={assets.queue_icon}
          alt=""
        />
        <img
          className="w-4 opacity-70 hover:opacity-100 cursor-pointer"
          src={assets.speaker_icon}
          alt=""
        />
        <div className="flex items-center gap-2">
          <img
            className="w-4 opacity-70 hover:opacity-100 cursor-pointer"
            src={assets.volume_icon}
            alt=""
          />
          <div className="w-24 bg-gray-600 h-1 rounded-full cursor-pointer group relative">
            <div className="h-1 w-3/4 bg-white rounded-full group-hover:bg-green-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
