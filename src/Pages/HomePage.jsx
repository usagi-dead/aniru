import React from "react";
import AnimeList from "../Components/AnimeList.jsx";
import "../Styles/HomePage.css";

export default function App() {
  return (
    <>
      <div className="main-anime-container">
        <div className="image-container">
          <img
            src="/main-poster.jpg"
            alt="main-poster"
            className="main-anime blurred"
          />
          <img
            src="/main-poster.jpg"
            alt="main-poster"
            className="main-anime"
          />
        </div>

        <div className="content-container">
          <img
            src="/main-anime-logo.png"
            alt="main-anime-logo"
            className="main-anime-logo"
          />
        </div>
      </div>

      <AnimeList />
    </>
  );
}
