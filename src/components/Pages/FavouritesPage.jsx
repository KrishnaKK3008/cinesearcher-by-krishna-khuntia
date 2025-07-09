import React from "react";

import { useHistory } from "react-router-dom";

import useFavouritesStore from "../../stores/useFavouritesStore";
import Header from "../layout/Header";

const FavouritesPage = () => {
  const { favourites } = useFavouritesStore();
  const history = useHistory();

  return (
    <div className="flex h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            My Favourites
          </h1>
          {favourites.length > 0 ? (
            <div className="flex flex-col gap-4">
              {favourites.map(movie => (
                <div
                  className="flex items-center justify-between rounded-lg bg-gray-100 p-4"
                  key={movie.imdbID}
                >
                  <span className="font-bold text-gray-800">{movie.Title}</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Rating: </span>
                    <span className="text-base font-medium text-gray-900">
                      {movie.imdbRating}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                No Favourites Yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add movies to your favourites to see them here.
              </p>
              <button
                className="mt-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                type="button"
                onClick={() => history.push("/")}
              >
                Find Movies
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FavouritesPage;
