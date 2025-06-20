import React from "react";

import { Button } from "neetoui";

import { FALLBACK_IMAGE } from "../../constants";

const MovieCard = ({ title, year, poster, type, onViewDetails }) => (
  <div className="flex h-full w-full flex-col rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
    <div className="h-48 w-full overflow-hidden rounded-md bg-gray-100">
      <img
        alt={title}
        className="h-full w-full object-contain"
        src={poster}
        onError={e => {
          e.target.onerror = null;
          e.target.src = FALLBACK_IMAGE;
        }}
      />
    </div>
    <div className="mt-3 flex flex-grow flex-col justify-between">
      <div>
        <h3 className="line-clamp-1 text-sm font-semibold text-gray-800">
          {title}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {type.charAt(0).toUpperCase() + type.slice(1)} • {year}
        </p>
      </div>
      <Button
        fullWidth
        className="mt-2 text-blue-600"
        label="View details"
        style="text"
        onClick={onViewDetails}
      />
    </div>
  </div>
);

export default MovieCard;
