import React, { useState, useEffect } from "react";

import { Search } from "neetoicons";
import { Input } from "neetoui";

import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

import movies from "../../api/movies";
import useDebounce from "../../hooks/useDebounce";

const MovieSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    // ... your existing search logic (unchanged)
    const handleSearch = async () => {
      if (debouncedSearchQuery) {
        setIsSearching(true);
        try {
          const results = await movies.search(debouncedSearchQuery);
          if (results.Response === "True") {
            setSearchResults(results.Search);
          } else {
            setSearchResults([]);
          }
        } catch (err) {
          console.error("OMDB Fetch Error:", err);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };
    handleSearch();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    // ... your existing details logic (unchanged)
    const fetchMovieDetails = async () => {
      if (selectedMovieId) {
        setIsLoadingDetails(true);
        try {
          const details = await movies.getById(selectedMovieId);
          if (details.Response === "True") {
            setMovieDetails(details);
          } else {
            setMovieDetails(null);
          }
        } catch (error) {
          console.error("Error fetching movie details:", error);
          setMovieDetails(null);
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };
    fetchMovieDetails();
  }, [selectedMovieId]);

  const handleInputChange = e => setSearchQuery(e.target.value);
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

    if (searchResults.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {searchResults.map(movie => (
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

    return (
      <p className="mt-10 text-center text-gray-500">
        {debouncedSearchQuery
          ? `No results found for "${debouncedSearchQuery}"`
          : "Search for a movie to get started"}
      </p>
    );
  };

  return (
    // This container fills the height of its parent (<main>) and lays out its own children vertically.
    <div className="flex h-full flex-col">
      {/* Search bar section - this part does NOT scroll */}
      <div className="border-b border-gray-200 p-6">
        <Input
          className="!rounded-md !border-gray-200"
          placeholder="Search for movies, series..."
          prefix={<Search className="text-gray-400" />}
          size="large"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>
      {/* Results grid section - this part IS scrollable */}
      <div className="flex-grow overflow-y-auto p-6">
        <div className="mx-auto w-full max-w-7xl">{renderContent()}</div>
      </div>
      {/* Modal remains outside the layout flow */}
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
