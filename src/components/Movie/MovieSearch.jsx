import React, { useState, useEffect } from "react";

import { Search } from "neetoicons";
import { Input, Pagination, Spinner } from "neetoui";
import { useQuery } from "react-query";
import { useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

// Import the new utility functions

import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

import movies from "../../api/movies";
import { DEFAULT_PAGE_SIZE } from "../../constants";
import useDebounce from "../../hooks/useDebounce";
import { getUrlParams, buildSearchString } from "../../utils/url";

const MovieSearch = () => {
  const location = useLocation();
  const history = useHistory();

  // Use the utility function to get parameters from the URL.
  const { query: currentSearch, page: currentPage } = getUrlParams(
    location.search
  );

  const [inputValue, setInputValue] = useState(currentSearch);
  const debouncedSearchQuery = useDebounce(inputValue, 500);

  const {
    data: searchResults,
    isLoading: isSearching,
    isError,
  } = useQuery(
    ["movies", debouncedSearchQuery, currentPage],
    () => movies.search(debouncedSearchQuery, currentPage),
    {
      enabled: !!debouncedSearchQuery,
      keepPreviousData: true,
      onSuccess: data => {
        if (data?.Response === "False") {
          toast.error(data.Error);
        }
      },
      onError: () => {
        toast.error("A network error occurred. Please try again later.");
      },
    }
  );

  // This effect updates the URL when the user stops typing a new search query.
  useEffect(() => {
    if (debouncedSearchQuery !== currentSearch) {
      const search = buildSearchString({
        query: debouncedSearchQuery,
        page: 1,
      });
      history.replace({ search });
    }
  }, [debouncedSearchQuery, currentSearch, history]);

  const handlePageChange = newPage => {
    const search = buildSearchString({ query: currentSearch, page: newPage });
    history.push({ search });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (selectedMovieId) {
        setIsLoadingDetails(true);
        try {
          const details = await movies.getById(selectedMovieId);
          if (details?.Response === "True") {
            setMovieDetails(details);
          } else {
            setMovieDetails(null);
            if (details?.Error) toast.error(details.Error);
          }
        } catch (error) {
          console.error("Error fetching movie details:", error);
          toast.error("Could not fetch movie details.");
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };
    fetchMovieDetails();
  }, [selectedMovieId]);

  const handleViewDetails = imdbID => {
    setSelectedMovieId(imdbID);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedMovieId(null);
      setMovieDetails(null);
    }, 300);
  };

  const renderContent = () => {
    if (isSearching && !searchResults) {
      return (
        <div className="mt-10 flex h-full w-full items-center justify-center">
          <Spinner size="large" />
        </div>
      );
    }

    if (isError && !searchResults) {
      return (
        <p className="mt-10 text-center text-red-500">
          Could not connect to the server.
        </p>
      );
    }

    if (searchResults?.Response === "True") {
      const { Search: movies, totalResults } = searchResults;

      return (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {movies.map(movie => (
              <MovieCard
                key={movie.imdbID}
                poster={movie.Poster}
                title={movie.Title}
                type={movie.Type}
                year={movie.Year}
                onViewDetails={() => handleViewDetails(movie.imdbID)}
              />
            ))}
          </div>
          {totalResults > DEFAULT_PAGE_SIZE && (
            <div className="mt-8 flex w-full justify-center">
              <Pagination
                count={Number(totalResults)}
                isLoading={isSearching}
                navigate={handlePageChange}
                pageNo={currentPage}
                pageSize={DEFAULT_PAGE_SIZE}
              />
            </div>
          )}
        </>
      );
    }

    if (debouncedSearchQuery) {
      return (
        <p className="mt-10 text-center text-gray-500">
          No results to display for "{debouncedSearchQuery}"
        </p>
      );
    }

    return (
      <p className="mt-10 text-center text-gray-500">
        Search for a movie to get started
      </p>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-6">
        <Input
          className="!rounded-md !border-gray-200"
          placeholder="Search for movies, series..."
          prefix={<Search className="text-gray-400" />}
          size="large"
          suffix={isSearching ? <Spinner /> : null}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      </div>
      <div className="flex-grow overflow-y-auto p-6">
        <div className="mx-auto w-full max-w-7xl">{renderContent()}</div>
      </div>
      <MovieModal
        details={movieDetails}
        isLoading={isLoadingDetails}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MovieSearch;
