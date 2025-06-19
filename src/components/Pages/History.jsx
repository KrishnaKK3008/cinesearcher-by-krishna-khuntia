import React from "react";

import useViewHistoryStore from "../../stores/useViewHistoryStore";

const History = () => {
  const { movies, selectedMovie, setSelectedMovie } = useViewHistoryStore();

  return (
    <aside className="hidden w-full max-w-sm shrink-0 border-l border-gray-200 bg-white p-6 lg:block">
      <h2 className="mb-4 text-center text-lg font-bold text-gray-800">
        View history
      </h2>
      <div className="flex flex-col gap-2">
        {movies.map(movie => {
          const isActive = movie.imdbID === selectedMovie?.imdbID;

          return (
            <button
              key={movie.imdbID}
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
    </aside>
  );
};

export default History;
