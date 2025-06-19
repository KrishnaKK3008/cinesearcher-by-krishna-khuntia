import React, { useState, useEffect } from "react";

// 1. Import hooks from react-router-dom v5 and react-query v3

import { Search } from "neetoicons";
import { Input } from "neetoui";
import { useQuery } from "react-query";
import { useLocation, useHistory } from "react-router-dom";

import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

import movies from "../../api/movies";
import useDebounce from "../../hooks/useDebounce";

const MovieSearch = () => {
  // --- STATE MANAGEMENT FOR v5 ---
  // 2. Get location and history objects from react-router-dom v5
  const location = useLocation();
  const history = useHistory();

  // 3. Manually parse the search query from the URL
  const queryParams = new URLSearchParams(location.search);
  const currentSearch = queryParams.get("query") || "";

  // Local state for the input field, initialized with the URL value
  const [inputValue, setInputValue] = useState(currentSearch);
  const debouncedSearchQuery = useDebounce(inputValue, 500);

  // 4. useQuery from 'react-query' v3. The API is very similar.
  const {
    data: searchResults,
    isLoading: isSearching,
    isError,
  } = useQuery(
    ["movies", debouncedSearchQuery], // Query key
    () => movies.search(debouncedSearchQuery), // Fetching function
    { enabled: !!debouncedSearchQuery } // Options
  );

  // Modal state remains the same
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  // ... (rest of modal state is identical)
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // 5. This effect syncs the debounced input to the URL using history.replace
  useEffect(() => {
    if (debouncedSearchQuery) {
      history.replace(`/?query=${debouncedSearchQuery}`);
    } else {
      history.replace("/");
    }
  }, [debouncedSearchQuery, history]);

  // All other logic remains the same
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (selectedMovieId) {
        setIsLoadingDetails(true);
        try {
          const details = await movies.getById(selectedMovieId);
          if (details.Response === "True") {
            setMovieDetails(details);
          } else setMovieDetails(null);
        } catch (error) {
          console.error("Error fetching movie details:", error);
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
    if (isSearching) {
      return <p className="mt-10 text-center text-gray-500">Searching...</p>;
    }

    if (isError) {
      return (
        <p className="mt-10 text-center text-red-500">An error occurred.</p>
      );
    }

    if (searchResults?.Response === "True") {
      return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {searchResults.Search.map(movie => (
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
      );
    }

    if (debouncedSearchQuery) {
      return (
        <p className="mt-10 text-center text-gray-500">
          No results found for "{debouncedSearchQuery}"
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
