// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import i18n configuration
import "./i18n/i18n";

// Import styles in the correct order
import "./styles/index.css"; // Tailwind directives
import "./styles/custom-base.css";
import "./styles/custom-theme.css"; // Our enhanced theme
import "./styles/animations.css";
import "./styles/transitions.css";
import "./App.css";

// Create a preloader for smooth initial loading
const preloadFonts = async () => {
  // You can add custom font preloading logic here if needed
  return new Promise((resolve) => {
    // Simulate font loading
    setTimeout(resolve, 100);
  });
};

// Initialize the app with preloaded assets
const initializeApp = async () => {
  // Preload critical assets
  await preloadFonts();
  
  // Add a class to the body when everything is ready
  document.body.classList.add('app-ready');
  
  // Render the application
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Start initialization
initializeApp().catch(console.error);

// Add a minimal inline style for the initial loading state
const style = document.createElement('style');
style.textContent = `
  body {
    background-color: #0f172a;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  body.app-ready {
    opacity: 1;
  }
`;
document.head.appendChild(style);