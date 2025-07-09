// src/api/movies.js
import axios from "axios";

import { OMDB_API } from "../constants";

const search = async (query, page, year, type) => {
  try {
    const params = {
      s: query,
      apikey: process.env.REACT_APP_OMDB_API_KEY,
      page,
    };
    if (year) params.y = year;

    if (type) params.type = type;
    const response = await axios.get(OMDB_API, { params });
    console.log(params);
    console.log(response);

    return response;
  } catch (error) {
    console.error("OMDB Fetch Error:", error);

    return null;
  }
};

const getById = async id => {
  try {
    const response = await axios.get(OMDB_API, {
      params: { i: id, apikey: process.env.REACT_APP_OMDB_API_KEY },
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
