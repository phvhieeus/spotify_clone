import React from "react";
import { Routes, Route } from "react-router-dom";
import DisplayHome from "./components/DisplayHome";
import DisplayAlbum from "./components/DisplayAlbum";
import Player from "./components/Player";
import SideBar from "./components/SideBar";
import PlayerContextProvider from "./context/PlayerContext";

function App() {
  return (
    <PlayerContextProvider>
      <div className="App bg-gradient-to-b from-[#1e1e1e] to-[#121212] h-screen text-white overflow-hidden flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          <SideBar />
          <div className="h-full w-full lg:w-[75%] overflow-y-auto pb-24">
            <Routes>
              <Route path="/" element={<DisplayHome />} />
              <Route path="/album/:id" element={<DisplayAlbum />} />
            </Routes>
          </div>
        </div>
        <Player />
      </div>
    </PlayerContextProvider>
  );
}

export default App;
