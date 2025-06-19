import React from "react";

import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MovieSearch from "./components/Movie/MovieSearch";
import History from "./components/Pages/History";

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
      <ToastContainer
        closeOnClick
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        position="top-right"
        theme="light"
      />
    </Router>
  </QueryClientProvider>
);

export default App;
