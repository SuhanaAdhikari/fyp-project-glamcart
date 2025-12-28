import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import Store from "./redux/store";

// Get the root DOM element
const container = document.getElementById("root");

// Create a root and render the app
const root = createRoot(container);
root.render(
  <Provider store={Store}>
    <App />
  </Provider>
);

reportWebVitals();
