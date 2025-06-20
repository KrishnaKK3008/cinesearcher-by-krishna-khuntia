import axios from "axios";

import { OMDB_API } from "../constants";

const search = async (query, page) => {
  try {
    const response = await axios.get(OMDB_API, {
      params: {
        s: query,
        apikey: process.env.REACT_APP_OMDB_API_KEY,
        page,
      },
    });
    console.log(`${response} for page number ${page}`);

    return response;
  } catch (error) {
    console.error("OMDB Fetch Error:", error);

    return null;
  }
};

const getById = async id => {
  try {
    const response = await axios.get(OMDB_API, {
      params: {
        i: id,
        apikey: process.env.REACT_APP_OMDB_API_KEY,
      },
    });
    console.log(response);

    return response;
  } catch (error) {
    console.error("OMDB Fetch Error (getById):", error);

    return null;
  }
};

const movies = { search, getById };

export default movies;
