import React from "react";

// Assuming you have these components in your project
import History from "./History";

import Header from "../layout/Header";
import MovieSearch from "../Movie/MovieSearch";

const MainPageLayout = () => (
  <div className="flex h-screen bg-gray-50">
    {/* This main tag is the key. It needs to be a flex-col container. */}
    <main className="flex flex-1 flex-col overflow-hidden">
      <Header />
      {/* 
        Because the parent <main> is a flex container, and we use flex-grow 
        inside MovieSearch, the content will now correctly fill the space, 
        and the pagination will be visible.
      */}
      <MovieSearch />
    </main>
    {/* The History component remains on the side as before. */}
    <History />
  </div>
);

export default MainPageLayout;
