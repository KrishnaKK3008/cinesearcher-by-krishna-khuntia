// MovieSearch.js
import React, { useState, useEffect } from "react";

import { Search } from "neetoicons";
import { Input } from "neetoui";

import MovieCard from "./MovieCard";

import movies from "../api/movies";
import useDebounce from "../hooks/useDebounce";

const MovieSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedSearchQuery) {
        try {
          const results = await movies.search(debouncedSearchQuery);
          setSearchResults(results?.Search || []);
        } catch (err) {
          console.error("OMDB Fetch Error:", err);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    handleSearch();
  }, [debouncedSearchQuery]);

  const handleInputChange = e => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 w-full">
          <Input
            className="w-full rounded-lg border border-[#ddd] bg-white px-4 py-2 shadow-sm"
            placeholder="Search for a movie..."
            prefix={<Search className="text-gray-400" />}
            size="medium"
            value={searchQuery}
            onChange={handleInputChange}
          />
        </div>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {searchResults.map(movie => (
              <MovieCard
                key={movie.imdbID}
                poster={movie.Poster}
                title={movie.Title}
                type={movie.Type}
                year={movie.Year}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {debouncedSearchQuery ? "No results found" : "Search for movies"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSearch;
