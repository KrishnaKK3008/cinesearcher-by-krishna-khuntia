import React, { useState, useEffect } from "react";

import { Search as SearchIcon, Filter, Close } from "neetoicons";
import { Input, Pagination, Spinner } from "neetoui";
import { useQuery } from "react-query";
import { useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

import movies from "../../api/movies";
import { DEFAULT_PAGE_SIZE } from "../../constants";
import useDebounce from "../../hooks/useDebounce";
import { getUrlParams, buildSearchString } from "../../utils/url";

const MovieSearch = () => {
  const location = useLocation();
  const history = useHistory();

  // 1. Get current params from URL
  const {
    query: currentSearch,
    page: currentPage,
    year: currentYear,
    type: currentType,
  } = getUrlParams(location.search);

  // 2. States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [inputValue, setInputValue] = useState(currentSearch);
  const [filterYear, setFilterYear] = useState(currentYear || "");
  const [filterTypes, setFilterTypes] = useState({
    movie: currentType !== "series",
    series: currentType !== "movie",
  });

  const debouncedSearchQuery = useDebounce(inputValue, 500);

  // 3. Movies search query with filters
  const {
    data: searchResults,
    isLoading: isSearching,
    isError,
  } = useQuery(
    ["movies", currentSearch, currentPage, currentYear, currentType],
    () => movies.search(currentSearch, currentPage, currentYear, currentType),
    {
      enabled: !!currentSearch,
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

  // 4. Effect to sync filters & search query → URL → refetch
  useEffect(() => {
    const types = [];
    if (filterTypes.movie) types.push("movie");

    if (filterTypes.series) types.push("series");
    const typeParam = types.length === 1 ? types[0] : "";

    const search = buildSearchString({
      query: debouncedSearchQuery,
      page: 1,
      year: filterYear,
      type: typeParam,
    });

    if (
      debouncedSearchQuery !== currentSearch ||
      filterYear !== currentYear ||
      typeParam !== currentType
    ) {
      history.replace({ search });
    }
  }, [
    debouncedSearchQuery,
    currentSearch,
    filterYear,
    currentYear,
    filterTypes,
    currentType,
    history,
  ]);

  // 5. Pagination
  const handlePageChange = newPage => {
    const search = buildSearchString({
      query: currentSearch,
      page: newPage,
      year: currentYear,
      type: currentType,
    });
    history.push({ search });
  };

  // 6. Movie details modal
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
            if (details?.data?.Error) toast.error(details.data.Error);
          }
        } catch (error) {
          toast.error("Could not fetch movie details.", error);
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };
    fetchMovieDetails();
  }, [selectedMovieId]);

  const handleViewDetails = imdbID => {
    setSelectedMovieId(imdbID);
    console.log(imdbID);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedMovieId(null);
      setMovieDetails(null);
    }, 300);
  };

  const { Search: foundMovies, totalResults } = searchResults || {};
  const showPagination =
    searchResults?.Response === "True" && totalResults > DEFAULT_PAGE_SIZE;

  // 7. Render logic
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
      return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {foundMovies.map(movie => (
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

    if (currentSearch) {
      return (
        <p className="mt-10 text-center text-gray-500">
          No results to display for "{currentSearch}"
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
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Search bar & filters */}
      <div className="shrink-0 border-b border-gray-200 p-6">
        <div className="relative flex items-center gap-4">
          <Input
            className="!flex-1 !rounded-md !border-gray-200"
            placeholder="Search for movies, series..."
            prefix={<SearchIcon className="text-gray-400" />}
            size="large"
            suffix={isSearching ? <Spinner /> : null}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <button
            aria-label="Toggle filters"
            className="flex h-12 w-12 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={20} />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Filters</h3>
                <button
                  aria-label="Close filters"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <Close size={20} />
                </button>
              </div>
              <div className="mb-4">
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="filter-year"
                >
                  Year
                </label>
                <Input
                  id="filter-year"
                  maxLength="4"
                  pattern="\d*"
                  placeholder="e.g., 2023"
                  type="text"
                  value={filterYear}
                  onChange={e =>
                    setFilterYear(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Type
                </label>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center">
                    <input
                      checked={filterTypes.movie}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      type="checkbox"
                      onChange={() =>
                        setFilterTypes(prev => ({
                          ...prev,
                          movie: !prev.movie,
                        }))
                      }
                    />
                    <span className="ml-2 text-sm text-gray-600">Movie</span>
                  </label>
                  <label className="flex cursor-pointer items-center">
                    <input
                      checked={filterTypes.series}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      type="checkbox"
                      onChange={() =>
                        setFilterTypes(prev => ({
                          ...prev,
                          series: !prev.series,
                        }))
                      }
                    />
                    <span className="ml-2 text-sm text-gray-600">Series</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Search results */}
      <div className="flex-grow overflow-y-auto p-6">
        <div className="mx-auto w-full max-w-7xl">{renderContent()}</div>
      </div>
      {showPagination && (
        <div className="flex shrink-0 items-center justify-center border-t border-gray-200 bg-white p-4">
          <Pagination
            count={Number(totalResults)}
            isLoading={isSearching}
            navigate={handlePageChange}
            pageNo={currentPage}
            pageSize={DEFAULT_PAGE_SIZE}
          />
        </div>
      )}
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
