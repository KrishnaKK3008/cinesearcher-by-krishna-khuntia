import React from "react";

import MovieSearch from "./components/Movie/MovieSearch"; // Adjust path as needed
import History from "./components/Pages/History"; // Adjust path as needed

const App = () => (
  // This root container uses Flexbox and takes up the full screen height.
  // This prevents the entire page from scrolling.
  <div className="flex h-screen bg-gray-50">
    {/* 1. The Main Content Area */}
    <main className="flex-1 flex-col overflow-hidden">
      <MovieSearch />
    </main>
    {/* 2. The History Sidebar */}
    <History />
  </div>
);

export default App;
