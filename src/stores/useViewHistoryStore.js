import { uniqBy, pipe, prepend } from "ramda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useViewHistoryStore = create(
  persist(
    set => ({
      movies: [],
      selectedMovie: null,
      setMovies: movie =>
        set(state => ({
          movies: pipe(
            prepend(movie),
            uniqBy(m => m.imdbID)
          )(state.movies),
        })),
      setSelectedMovie: movie => set({ selectedMovie: movie }),
    }),
    {
      name: "movie-history-storage",
    }
  )
);

export default useViewHistoryStore;
