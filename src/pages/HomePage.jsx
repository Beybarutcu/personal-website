// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MindMapNavigation from '../components/navigation/MindMapNavigation';
import ContentPanel from '../components/navigation/ContentPanel';

const HomePage = ({ currentLanguage, onLanguageChange }) => {
  // Start with no selected node to prevent welcome panel from showing automatically
  const [selectedNode, setSelectedNode] = useState(null);
  const { t } = useTranslation();
  
  const handleNodeSelect = (nodeId) => {
    setSelectedNode(nodeId);
  };
  
  // Handle closing the content panel
  const handleContentClose = () => {
    setSelectedNode(null);
  };
  
  return (
    <>
      {/* No outer container - Let MindMap create its own section */}
      <MindMapNavigation 
        onNodeSelect={handleNodeSelect}
        currentLanguage={currentLanguage}
      />
      
      {/* Content Panel - renders only when a node is selected */}
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