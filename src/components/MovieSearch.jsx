import React, { useState, useEffect } from "react";

import { Search } from "neetoicons";
import { Input } from "neetoui";

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
          if (results && results.Search) {
            setSearchResults(results.Search);
          } else {
            setSearchResults([]);
          }
          console.log(searchResults);
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
    <div>
      <Input
        placeholder="Search for a movie..."
        prefix={<Search />}
        size="medium"
        value={searchQuery}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default MovieSearch;
