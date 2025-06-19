import React, { useEffect, useRef } from "react";

import useViewHistoryStore from "../../stores/useViewHistoryStore";

const History = () => {
  const { movies, selectedMovie, setSelectedMovie } = useViewHistoryStore();
  // Ref to store the DOM nodes of the history buttons
  const historyItemRefs = useRef({});

  // Effect to scroll the selected movie into view
  useEffect(() => {
    if (selectedMovie) {
      const node = historyItemRefs.current[selectedMovie.imdbID];
      if (node) {
        node.scrollIntoView({
          behavior: "smooth",
          block: "center", // This centers the item in the scrollable area
        });
      }
    }
  }, [selectedMovie, movies]); // Rerun when selection or list changes

  return (
    // This container is a flex column whose height is constrained by App.jsx
    <aside className="hidden w-full max-w-sm shrink-0 flex-col border-l border-gray-200 bg-white p-6 lg:flex">
      {/* Title section - this does NOT scroll */}
      <h2 className="mb-4 shrink-0 text-center text-lg font-bold text-gray-800">
        View history
      </h2>
      {/* History list section - this part IS scrollable */}
      <div className="overflow-y-auto">
        <div className="flex flex-col gap-2">
          {movies.map(movie => {
            const isActive = movie.imdbID === selectedMovie?.imdbID;

            return (
              <button
                // Assign a ref to each button so we can scroll to it
                key={movie.imdbID}
                ref={el => (historyItemRefs.current[movie.imdbID] = el)}
                type="button"
                className={`w-full truncate rounded-lg p-3 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedMovie(movie)}
              >
                {movie.Title}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default History;
