import React from "react";

// Placeholder data to build the UI without functionality
const staticHistory = [
  "Interstellar",
  "Avengers: Infinity War",
  "Spider-Man: No Way Home",
  "Avengers: Age of Ultron",
  "The Office",
  "Modern Family",
  "Friends",
  "Good Will Hunting",
  "The Avengers",
  "Avengers: Endgame",
  "Spider-Man: Into the Spider-Verse",
  "Aavesham",
  "12th Fail",
];

const History = () => (
  // The sidebar is hidden on small screens and appears on large screens (lg)
  <aside className="hidden w-full max-w-sm shrink-0 border-l border-gray-200 bg-white p-6 lg:block">
    <h2 className="mb-4 text-lg font-bold text-gray-800">View history</h2>
    <div className="flex flex-col gap-2">
      {staticHistory.map((title, index) => (
        <button
          key={title}
          type="button"
          // This applies the active style to the second item to match the screenshot
          className={`w-full truncate rounded-lg p-3 text-left text-sm font-medium transition-colors ${
            index === 1
              ? "bg-blue-600 text-white shadow-md" // Active style
              : "bg-gray-100 text-gray-700 hover:bg-gray-200" // Inactive style
          }`}
        >
          {title}
        </button>
      ))}
    </div>
  </aside>
);

export default History;
