import React from "react";

import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PageNotFound from "./commons/PageNotFound";
import FavouritesPage from "./components/Pages/FavouritesPage"; // Import the new Favourites page
import MainPageLayout from "./components/Pages/MainPageLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <ToastContainer
        closeOnClick
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        position="top-right"
        theme="light"
      />
      <Switch>
        <Route exact path="/">
          <MainPageLayout />
        </Route>
        {/* Add the new Favourites route */}
        <Route exact path="/favourites">
          <FavouritesPage />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </Router>
  </QueryClientProvider>
);

export default App;
