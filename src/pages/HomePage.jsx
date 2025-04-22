// src/pages/HomePage.jsx
import React from 'react';
import { mindMapData } from '../data/mindMapData';
import MindMapVisualization from '../components/visualization/MindMapVisualization';

const HomePage = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="relative z-20 w-full h-screen overflow-hidden">
      {/* Main Mind Map Visualization */}
      <MindMapVisualization 
        data={mindMapData}
        language={currentLanguage}
        className="w-full h-full pointer-events-auto"
      />
    </div>
  );
};

export default HomePage;