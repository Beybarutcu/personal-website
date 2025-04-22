// src/components/visualization/NodeTooltip.jsx
import React, { useEffect } from 'react';
import { useMindMap } from '../../context/MindMapContext';

const NodeTooltip = () => {
  const { tooltipRef } = useMindMap();
  
  // Initialize tooltip styles when component mounts
  useEffect(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.position = 'fixed';
      tooltipRef.current.style.zIndex = '1000';
      tooltipRef.current.style.visibility = 'hidden';
      tooltipRef.current.style.opacity = '0';
      tooltipRef.current.style.transition = 'opacity 0.3s ease-in-out';
      tooltipRef.current.style.pointerEvents = 'none';
    }
  }, [tooltipRef]);
  
  return (
    <div 
      ref={tooltipRef}
      className="fixed pointer-events-none bg-gray-900/90 backdrop-blur-md border border-gray-700/50 p-3 rounded-lg shadow-xl z-50 max-w-xs"
      style={{ visibility: 'hidden', opacity: 0 }}
    />
  );
};

export default NodeTooltip;