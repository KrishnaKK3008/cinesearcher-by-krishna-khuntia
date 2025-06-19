import React from "react";

import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";

import MovieSearch from "./components/Movie/MovieSearch"; // Adjust path as needed
import History from "./components/Pages/History"; // Adjust path as needed

// Create a client for react-query
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <div className="flex h-screen bg-gray-50">
        <main className="flex-1 flex-col overflow-hidden">
          <MovieSearch />
        </main>
        <History />
      </div>
    </Router>
  </QueryClientProvider>
);

export default App;
