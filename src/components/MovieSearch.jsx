import React from "react";

import { Search } from "neetoicons";
import { Input } from "neetoui";

const MovieSearch = () => (
  <Input
    placeholder="Search for a movie..."
    prefix={<Search />}
    size="medium"
  />
);

export default MovieSearch;
