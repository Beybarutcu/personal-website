// src/components/navigation/ContentPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { nodeContent } from '../../data/mindMapData';
import { X } from 'lucide-react';

const ContentPanel = ({ nodeId, language = 'en', onClose }) => {
  const [content, setContent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef(null);
  
  // Handle escape key to close panel
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isVisible]);
  
  // Load content when nodeId changes
  useEffect(() => {
    if (nodeId && nodeContent[nodeId]) {
      const nodeData = nodeContent[nodeId][language] || nodeContent[nodeId]['en'];
      setContent(nodeData);
      setIsVisible(true);
      
      // Animation for panel entry
      if (panelRef.current) {
        panelRef.current.style.transform = 'translateY(100%)';
        panelRef.current.style.opacity = '0';
        
        // Trigger animation after a tiny delay to ensure styles are applied
        setTimeout(() => {
          panelRef.current.style.transform = 'translateY(0)';
          panelRef.current.style.opacity = '1';
        }, 10);
      }
    }
  }, [nodeId, language]);
  
  // Handle close button or outside click
  const handleClose = () => {
    // Animate out
    if (panelRef.current) {
      panelRef.current.style.transform = 'translateY(100%)';
      panelRef.current.style.opacity = '0';
      
      // Hide after animation completes
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, 500);
    } else {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }
  };
  
  if (!isVisible || !content) {
    return null;
  }
  
  return (
    <div 
      className="fixed inset-0 z-30 flex items-end justify-center"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the content
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500"></div>
      
      {/* Content panel sliding from bottom */}
      <div 
        ref={panelRef}
        className="w-full max-w-4xl bg-gray-800/90 backdrop-blur-md border-t border-t-gray-700/50 rounded-t-xl shadow-2xl transition-all duration-500 ease-in-out transform"
        style={{ 
          maxHeight: '70vh',
          transform: 'translateY(100%)', // Initial position
          opacity: 0
        }}
      >
        {/* Handle bar for visual indication */}
        <div className="mx-auto w-12 h-1 bg-gray-600 rounded-full my-3"></div>
        
        {/* Content container with scrolling */}
        <div className="p-6 md:p-8 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 40px)' }}>
          <div className="relative">
            {/* Close button - single button design */}
            <button 
              onClick={handleClose}
              className="absolute top-0 right-0 p-2 rounded-full bg-gray-700/60 text-gray-300 hover:bg-white hover:text-gray-900 transition-colors z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            
            {/* Title with gradient background */}
            <div className="relative mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {content.title}
              </h2>
              <div className="absolute h-1 w-20 bg-orange-500/50 bottom-0 left-0 mt-2 rounded-full"></div>
            </div>
            
            {/* Content */}
            <div 
              className="text-gray-300 leading-relaxed space-y-4 mb-8"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPanel;