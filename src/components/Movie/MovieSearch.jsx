import React, { useState, useEffect } from "react";

import { Search } from "neetoicons";
import { Input, Pagination } from "neetoui";
import { useQuery } from "react-query";
import { useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

import movies from "../../api/movies";
import useDebounce from "../../hooks/useDebounce";

const DEFAULT_PAGE_SIZE = 10;

const MovieSearch = () => {
  const location = useLocation();
  const history = useHistory();

  const queryParams = new URLSearchParams(location.search);
  const currentSearch = queryParams.get("query") || "";
  const currentPage = Number(queryParams.get("page")) || 1;

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

  useEffect(() => {
    if (debouncedSearchQuery) {
      history.replace(`/?query=${debouncedSearchQuery}&page=1`);
    } else {
      history.replace("/");
    }
  }, [debouncedSearchQuery, history]);

  const handlePageChange = newPage => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("page", newPage);
    history.push({ search: newParams.toString() });
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
      return <p className="mt-10 text-center text-gray-500">Searching...</p>;
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
