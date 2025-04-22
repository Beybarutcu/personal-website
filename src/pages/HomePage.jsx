// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MindMapNavigation from '../components/navigation/MindMapNavigation';
import ContentPanel from '../components/navigation/ContentPanel';

const HomePage = ({ currentLanguage, onLanguageChange }) => {
  // Use state to track the selected node ID
  const [selectedNode, setSelectedNode] = useState(null);
  const { t } = useTranslation();
  
  // Add debugging to see when a node is selected
  useEffect(() => {
    if (selectedNode) {
      console.log("Node selected in HomePage:", selectedNode);
    }
  }, [selectedNode]);
  
  // Handler for when a node is clicked in the mind map
  const handleNodeSelect = (nodeId) => {
    setSelectedNode(nodeId);
  };
  
  // Handler for closing the content panel
  const handleContentClose = () => {
    console.log("Content panel closed");
    setSelectedNode(null);
  };
  
  return (
    <>
      {/* Mind Map Component */}
      <MindMapNavigation 
        onNodeSelect={handleNodeSelect}
        currentLanguage={currentLanguage}
      />
      
      {/* Content Panel - renders when a node is selected */}
      {selectedNode && (
        <ContentPanel 
          key={`panel-${selectedNode}`} // Force re-creation when nodeId changes
          nodeId={selectedNode}
          language={currentLanguage}
          onClose={handleContentClose}
        />
      )}
      
      {/* Debug display - remove in production */}
      <div className="fixed bottom-20 right-4 z-40 bg-gray-800/80 p-2 rounded text-xs text-white">
        Selected: {selectedNode || 'none'}
      </div>
    </>
  );
};

export default HomePage;