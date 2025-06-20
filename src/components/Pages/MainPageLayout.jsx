import React from "react";

import History from "./History";

import MovieSearch from "../Movie/MovieSearch";

const MainPageLayout = () => (
  <div className="flex h-screen bg-gray-50">
    <main className="flex-1 flex-col overflow-hidden">
      <MovieSearch />
    </main>
    <History />
  </div>
);

export default MainPageLayout;
