import React from "react";
import { Routes, Route } from "react-router-dom"; // Remove BrowserRouter from here
import DisplayHome from "./components/DisplayHome";
import DisplayAlbum from "./components/DisplayAlbum";
import Player from "./components/Player";
import SideBar from "./components/SideBar";
import PlayerContextProvider from "./context/PlayerContext";

function App() {
  return (
    <PlayerContextProvider>
      <div className="App bg-[#121212] h-screen text-white p-2 pb-24 overflow-hidden flex">
        <SideBar />
        <div className="h-full w-full lg:w-[75%] p-2 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DisplayHome />} />
            <Route path="/album/:id" element={<DisplayAlbum />} />
          </Routes>
        </div>
        <Player />
      </div>
    </PlayerContextProvider>
  );
}

export default App;
