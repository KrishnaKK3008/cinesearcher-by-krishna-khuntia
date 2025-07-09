// src/components/Movie/MovieModal.jsx

import React, { useEffect } from "react";

import { Favorite, Close } from "neetoicons";
import { Spinner, Tooltip } from "neetoui";

import { FALLBACK_IMAGE } from "../../constants";
import useFavouritesStore from "../../stores/useFavouritesStore";
import useViewHistoryStore from "../../stores/useViewHistoryStore";

// This is just a small display helper, it's correct as is.
const DetailItem = ({ label, value }) =>
  value &&
  value !== "N/A" && (
    <p className="mt-3 text-sm">
      <span className="font-bold text-gray-900">{label}:</span>{" "}
      <span className="text-gray-500">{value}</span>
    </p>
  );

// THE FIX: The component now accepts 'details' and 'isLoading' props again.
// It NO LONGER uses useQuery.
const MovieModal = ({ isOpen, onClose, details, isLoading }) => {
  const { setMovies, setSelectedMovie } = useViewHistoryStore();
  const { addFavourite, removeFavourite, isFavourite } = useFavouritesStore();

  const isMovieFavourite = details ? isFavourite(details.imdbID) : false;

  useEffect(() => {
    // This logic to update the view history remains correct.
    if (isOpen && details) {
      setMovies(details);
      setSelectedMovie(details);
    }
    console.log(details);
  }, [isOpen, details, setMovies, setSelectedMovie]);

  const handleToggleFavourite = () => {
    if (isMovieFavourite) {
      removeFavourite(details.imdbID);
    } else {
      addFavourite(details);
    }
  };

  if (!isOpen) return null;

  const genreTags = details?.Genre?.split(", ") || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-lg bg-white p-8 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="flex min-h-[450px] items-center justify-center">
            <Spinner size="large" />
          </div>
        ) : (
          details && (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-4">
                    <h2 className="text-3xl font-bold text-gray-900">
                      {details.Title}
                    </h2>
                    <Tooltip content="Add to favourites" position="bottom">
                      <button
                        className="group inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                        type="button"
                        onClick={handleToggleFavourite}
                      >
                        <Favorite
                          fill={isMovieFavourite ? "currentColor" : "none"}
                          className={`h-5 w-5 transition-colors ${
                            isMovieFavourite
                              ? "text-yellow-400"
                              : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        />
                        {isMovieFavourite ? "Favourited" : "Add to favourites"}
                      </button>
                    </Tooltip>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {genreTags.map(genre => (
                      <span
                        className="rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800"
                        key={genre}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  aria-label="Close modal"
                  className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                  onClick={onClose}
                >
                  <Close size={20} />
                </button>
              </div>
              <div className="mt-6 flex flex-col gap-8 md:flex-row">
                <div className="w-full shrink-0 md:w-[280px]">
                  <img
                    alt={details.Title}
                    className="h-auto w-full rounded-md object-cover"
                    src={details.Poster}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="leading-relaxed text-gray-600">
                    {details.Plot}
                  </p>
                  <div className="mt-6">
                    <DetailItem label="Director" value={details.Director} />
                    <DetailItem label="Actors" value={details.Actors} />
                    <DetailItem label="Box Office" value={details.BoxOffice} />
                    <DetailItem label="Year" value={details.Year} />
                    <DetailItem label="Runtime" value={details.Runtime} />
                    <DetailItem label="Language" value={details.Language} />
                    <DetailItem label="Rated" value={details.Rated} />
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default MovieModal;
