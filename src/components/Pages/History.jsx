import React, { useEffect, useRef } from "react";

import useViewHistoryStore from "../../stores/useViewHistoryStore";

const History = () => {
  // Destructure the new clearHistory action
  const { movies, selectedMovie, setSelectedMovie, removeMovie, clearHistory } =
    useViewHistoryStore();
  const historyItemRefs = useRef({});

  useEffect(() => {
    if (selectedMovie) {
      const node = historyItemRefs.current[selectedMovie.imdbID];
      if (node) {
        node.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [selectedMovie, movies]);

  const handleRemove = (e, imdbID) => {
    e.stopPropagation();
    removeMovie(imdbID);
  };

  return (
    <aside className="hidden w-full max-w-sm shrink-0 flex-col border-l border-gray-200 bg-white p-6 lg:flex">
      {/* Updated header for the history panel */}
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">View history</h2>
        {/* Conditionally render the "Clear all" button */}
        {movies.length > 0 && (
          <button
            className="text-sm font-medium text-red-500 hover:text-red-700"
            type="button"
            onClick={clearHistory}
          >
            Clear all
          </button>
        )}
      </div>
      <div className="overflow-y-auto">
        <div className="flex flex-col gap-2">
          {movies.map(movie => {
            const isActive = movie.imdbID === selectedMovie?.imdbID;

            return (
              <div
                key={movie.imdbID}
                ref={el => (historyItemRefs.current[movie.imdbID] = el)}
                className={`flex w-full items-center justify-between rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-indigo-100 text-gray-700"
                }`}
              >
                <button
                  type="button"
                  className={`flex-grow truncate rounded-l-lg p-3 text-left text-sm font-medium transition-colors ${
                    !isActive ? "hover:bg-indigo-200" : ""
                  }`}
                  onClick={() => setSelectedMovie(movie)}
                >
                  {movie.Title}
                </button>
                <button
                  aria-label={`Remove ${movie.Title} from history`}
                  type="button"
                  className={`flex-shrink-0 rounded-r-lg p-2 transition-colors ${
                    isActive
                      ? "hover:bg-indigo-700"
                      : "hover:bg-red-200 hover:text-red-800"
                  }`}
                  onClick={e => handleRemove(e, movie.imdbID)}
                >
                  {/* Trash Can Icon to match the screenshot */}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default History;
