// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MindMapNavigation from '../components/navigation/MindMapNavigation';
import ContentPanel from '../components/navigation/ContentPanel';

const HomePage = ({ currentLanguage, onLanguageChange }) => {
  // Use state to track the selected node ID
  const [selectedNode, setSelectedNode] = useState(null);
  const { t } = useTranslation();
  
  // Handler for when a node is clicked in the mind map
  const handleNodeSelect = (nodeId) => {
    setSelectedNode(nodeId);
  };
  
  // Handler for closing the content panel
  const handleContentClose = () => {
    setSelectedNode(null);
  };
  
  return (
    <>
      {/* Mind Map Component - Pass pauseSimulation prop to stop movement when panel is open */}
      <MindMapNavigation 
        onNodeSelect={handleNodeSelect}
        currentLanguage={currentLanguage}
        pauseSimulation={selectedNode !== null}
      />
      
      {/* Content Panel - renders when a node is selected */}
      {selectedNode && (
        <ContentPanel 
          nodeId={selectedNode}
          language={currentLanguage}
          onClose={handleContentClose}
        />
      )}
    </>
  );
};

export default HomePage;