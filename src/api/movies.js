// movies.js
import axios from "axios";

const API_ENDPOINT = "https://www.omdbapi.com/";

const search = async query => {
  try {
    const response = await axios.get(API_ENDPOINT, {
      params: {
        s: query,
        apikey: process.env.REACT_APP_OMDB_API_KEY,
      },
    });
    console.log(response);

    return response;
  } catch (error) {
    console.error("OMDB Fetch Error:", error);

    return null;
  }
};

const movies = { search };

export default movies;
