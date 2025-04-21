// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import i18n configuration
import "./i18n/i18n";

// Import styles in the correct order
import "./styles/index.css"; // Tailwind directives
import "./styles/custom-base.css";
import "./styles/custom-theme.css";
import "./styles/animations.css";
import "./App.css";

// Initialize the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);