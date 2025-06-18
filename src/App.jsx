// eslint-disable-next-line import/extensions
import MovieSearch from "components/Movie/MovieSearch";
import HistorySidebar from "components/Pages/History";
// eslint-disable-next-line import/extensions

import "./App.css";

const App = () => (
  <div className="App">
    {/* This is the main layout container for the entire page */}
    <div className="flex min-h-screen w-full bg-white">
      {/* Main content area that will grow to fill available space */}
      <main className="flex-grow p-6 lg:p-8">
        <MovieSearch />
      </main>
      {/* The history sidebar is now a direct child of the main layout */}
      <HistorySidebar />
    </div>
  </div>
);

export default App;
