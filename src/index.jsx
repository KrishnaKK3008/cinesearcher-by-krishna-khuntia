import React from "react";

import ReactDOM from "react-dom/client";

import initializeAxios from "./api/axios"; // move this above App
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
initializeAxios();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
