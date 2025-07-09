import React from "react";

import { NavLink } from "react-router-dom";

const Header = () => {
  const activeLinkClass = "font-semibold text-indigo-600";
  const defaultLinkClass = "font-medium text-gray-600 hover:text-gray-900";

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-bold">
          <span className="text-indigo-600">Cine</span>
          <span className="text-gray-800">Searcher</span>
        </h1>
      </div>
      <nav className="flex items-center gap-6 text-sm">
        <NavLink
          exact
          to="/"
          className={({ isActive }) =>
            isActive ? activeLinkClass : defaultLinkClass
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/favourites"
          className={({ isActive }) =>
            isActive ? activeLinkClass : defaultLinkClass
          }
        >
          Favourites
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
