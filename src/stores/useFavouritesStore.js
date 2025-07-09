import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFavouritesStore = create(
  persist((set, get) => ({
    favourites: [],
    addFavourite: movie => {
      if (!get().isFavourite(movie.imdbID)) {
        set(state => ({
          favourites: [...state.favourites, movie],
        }));
        toast.success(`${movie.Title} added to favourites!`);
      }
    },
    removeFavourite: imdbID => {
      set(state => ({
        favourites: state.favourites.filter(m => m.imdbID !== imdbID),
      }));
      toast.info("Removed from favourites.");
    },
    isFavourite: imdbID => get().favourites.some(m => m.imdbID === imdbID),
  }))
);

export default useFavouritesStore;
