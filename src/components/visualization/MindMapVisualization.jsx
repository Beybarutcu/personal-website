// src/components/visualization/MindMapVisualization.jsx
import React, { useEffect, useRef } from 'react';
import { MindMapProvider } from '../../context/MindMapContext';
import MindMapCanvas from './MindMapCanvas';
import NodeTooltip from './NodeTooltip';
import ContentPanel from './ContentPanel';

const MindMapVisualization = ({ 
  data, 
  language,
  className = '',
  showContentPanel = true
}) => {
  // Defensive check for data validity
  const validData = data && 
    Array.isArray(data.nodes) && 
    data.nodes.length > 0 && 
    Array.isArray(data.links) && 
    data.links.length > 0;

  // If data is invalid, display a fallback or error message
  if (!validData) {
    console.error("Invalid mind map data structure:", data);
    return (
      <div className={`mind-map-container ${className}`} style={{ position: 'relative' }}>
        <div className="flex items-center justify-center h-full text-white/50">
          Mind map visualization unavailable
        </div>
      </div>
    );
  }

  return (
    <MindMapProvider initialData={data}>
      <div className={`mind-map-container relative ${className}`} style={{ pointerEvents: 'auto' }}>
        <MindMapCanvas language={language} />
        <NodeTooltip />
        {showContentPanel && <ContentPanel language={language} />}
      </div>
    </MindMapProvider>
  );
};

export default MindMapVisualization;