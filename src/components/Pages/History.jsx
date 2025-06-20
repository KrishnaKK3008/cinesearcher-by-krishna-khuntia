import React, { useEffect, useRef } from "react";

import useViewHistoryStore from "../../stores/useViewHistoryStore";

const History = () => {
  const { movies, selectedMovie, setSelectedMovie } = useViewHistoryStore();
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

  return (
    <aside className="hidden w-full max-w-sm shrink-0 flex-col border-l border-gray-200 bg-white p-6 lg:flex">
      <h2 className="mb-4 shrink-0 text-center text-lg font-bold text-gray-800">
        View history
      </h2>
      <div className="overflow-y-auto">
        <div className="flex flex-col gap-2 text-center">
          {movies.map(movie => {
            const isActive = movie.imdbID === selectedMovie?.imdbID;

            return (
              <button
                key={movie.imdbID}
                ref={el => (historyItemRefs.current[movie.imdbID] = el)}
                type="button"
                className={`w-full truncate rounded-lg p-3 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-100 text-gray-700 hover:bg-gray-200"
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
