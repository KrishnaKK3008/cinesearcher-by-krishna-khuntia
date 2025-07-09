// src/components/Movie/FilterDropdown.jsx

import React from "react";

import { Close } from "neetoicons";
import { Input } from "neetoui";

const FilterDropdown = ({
  isOpen,
  onClose,
  year,
  onYearChange,
  types,
  onTypesChange,
  onApply,
  onReset,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleYearChange = e => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    onYearChange(value);
  };

  const handleCheckboxChange = type => {
    onTypesChange(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Filters</h3>
        <button
          aria-label="Close filters"
          className="text-gray-400 hover:text-gray-600"
          onClick={onClose}
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
          value={year}
          onChange={handleYearChange}
        />
      </div>
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Type
        </label>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center">
            <input
              checked={types.movie}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              type="checkbox"
              onChange={() => handleCheckboxChange("movie")}
            />
            <span className="ml-2 text-sm text-gray-600">Movie</span>
          </label>
          <label className="flex cursor-pointer items-center">
            <input
              checked={types.series}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              type="checkbox"
              onChange={() => handleCheckboxChange("series")}
            />
            <span className="ml-2 text-sm text-gray-600">Series</span>
          </label>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="text-sm font-medium text-gray-600 hover:text-gray-800"
          type="button"
          onClick={onReset}
        >
          Reset
        </button>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          type="button"
          onClick={onApply}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;
