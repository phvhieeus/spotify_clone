// import React, { useContext } from "react";
// import Navbar from "./Navbar";
// import { useParams } from "react-router-dom";
// import { albumsData, assets, songsData } from "../assets/assets";
// import { PlayerContext } from "../context/PlayerContext";

// const DisplayAlbum = () => {
//   const { id } = useParams();
//   const albumData = albumsData[id];
//   const { playWithId } = useContext(PlayerContext);

//   return (
//     <>
//       <Navbar />
//       <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
//         <img className="w-48 rounded" src={albumData.image} alt="" />
//         <div className="flex flex-col">
//           <p>Playlist</p>
//           <h2 className="text-5xl font-bold mb-4 md:text-7xl">
//             {albumData.name}
//           </h2>
//           <h4>{albumData.desc}</h4>
//           <p className="mt-1">
//             <img
//               className="inline-block w-5"
//               src={assets.spotify_logo}
//               alt=""
//             />
//             <b> Spotify </b>• 121,057,923 likes • <b>50 songs</b>, about 2 hr 30
//             min
//           </p>
//         </div>
//       </div>
//       <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
//         <p>
//           <b className="mr-4">#</b>Title
//         </p>
//         <p>Album</p>
//         <p className="hidden sm:block">Date Added</p>
//         <img className="m-auto w-4" src={assets.clock_icon} alt="" />
//       </div>
//       <hr />
//       {songsData.map((item, index) => (
//         <div
//           onClick={() => playWithId(item.id)}
//           key={index}
//           className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
//         >
//           <p className="text-white">
//             <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
//             <img className="inline w-10 mr-5" src={item.image} alt="" />
//             {item.name}
//           </p>
//           <p className="text-[15px]">{albumData.name}</p>
//           <p className="text-[15px] hidden sm:block">5 days ago</p>
//           <p className="text-[15px] text-center">{item.duration}</p>
//         </div>
//       ))}
//     </>
//   );
// };

// export default DisplayAlbum;

import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { PlayerContext } from "../context/PlayerContext";
import spotifyService from "../services/spotify";

const DisplayAlbum = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playWithId } = useContext(PlayerContext);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        // Get album details
        const albumData = await spotifyService.getAlbum(id);
        setAlbum(albumData);

        // Tracks are included in album response
        setTracks(
          albumData.tracks.items.map((track) => ({
            ...track,
            album: {
              id: albumData.id,
              name: albumData.name,
              images: albumData.images,
            },
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching album:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchAlbum();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {album && (
        <div>
          <div className="flex items-center gap-6 mb-6">
            <img
              src={album.images[0].url}
              alt={album.name}
              className="w-48 h-48 rounded shadow-lg"
            />
            <div>
              <p className="text-sm text-gray-300">Album</p>
              <h1 className="text-3xl font-bold mb-2">{album.name}</h1>
              <div className="flex items-center text-sm text-gray-300">
                <p className="font-semibold text-white">
                  {album.artists.map((artist) => artist.name).join(", ")}
                </p>
                <span className="mx-1">•</span>
                <p>{album.release_date.substring(0, 4)}</p>
                <span className="mx-1">•</span>
                <p>{album.total_tracks} songs</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-2 w-12">#</th>
                  <th className="pb-2">Title</th>
                  <th className="pb-2 text-right">Duration</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((track, index) => (
                  <tr
                    key={track.id}
                    className="hover:bg-[#ffffff15] cursor-pointer"
                    onClick={() => playWithId(track.id, true)}
                  >
                    <td className="py-3">{index + 1}</td>
                    <td>
                      <p className="font-medium">{track.name}</p>
                      <p className="text-sm text-gray-400">
                        {track.artists.map((a) => a.name).join(", ")}
                      </p>
                    </td>
                    <td className="text-right text-gray-400">
                      {Math.floor(track.duration_ms / 60000)}:
                      {(Math.floor(track.duration_ms / 1000) % 60)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayAlbum;
