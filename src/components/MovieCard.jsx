// MovieCard.js
import React from "react";

import { Button } from "neetoui";

const MovieCard = ({ title, year, poster, type }) => (
  <div className="flex w-full flex-col rounded-lg bg-white p-3 shadow-sm">
    <div className="h-48 w-full overflow-hidden rounded-md bg-gray-100">
      <img alt={title} className="h-full w-full object-contain" src={poster} />
    </div>
    <div className="mt-3">
      <h3 className="text-md line-clamp-1 font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-xs text-gray-500">
        {type.toLowerCase()} • {year}
      </p>
    </div>
    <Button
      className="mt-2 w-full justify-start p-0 font-bold !text-[#4a90e2]"
      label="View details"
      style="text"
    />
  </div>
);

export default MovieCard;
