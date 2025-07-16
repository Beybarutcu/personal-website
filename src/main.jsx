// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import i18n configuration
import "./i18n/i18n";

// Import styles in the correct order
import "./styles/index.css";
import "./styles/custom-base.css";
import "./styles/custom-theme.css";
import "./styles/animations.css";
import "./App.css";

// Initialize the app
const initializeApp = async () => {
  // Add a class to the body when ready
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

// Add initial loading styles
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