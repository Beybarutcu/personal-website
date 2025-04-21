// src/components/navigation/ContentPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { nodeContent } from '../../data/mindMapData';
import { X, ArrowLeft } from 'lucide-react';

const ContentPanel = ({ nodeId, language = 'en' }) => {
  const [content, setContent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
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
      
      // Animate in
      setIsAnimating(true);
      setIsVisible(true);
      
      // After animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [nodeId, language]);
  
  // Handle close button or outside click
  const handleClose = () => {
    setIsAnimating(true);
    
    // Start hiding animation
    if (panelRef.current) {
      panelRef.current.style.transform = 'translateY(100%)';
    }
    
    // After animation completes, hide component
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
    }, 500);
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
      <div 
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}
      ></div>
      
      {/* Content panel sliding from bottom */}
      <div 
        ref={panelRef}
        className="w-full max-w-4xl bg-gray-800/90 backdrop-blur-md border-t border-t-gray-700/50 rounded-t-xl shadow-2xl transition-transform duration-500 ease-in-out transform"
        style={{ 
          transform: isAnimating ? 'translateY(100%)' : 'translateY(0)',
          maxHeight: '70vh'
        }}
      >
        {/* Handle bar for visual indication */}
        <div className="mx-auto w-12 h-1 bg-gray-600 rounded-full my-3"></div>
        
        {/* Content container with scrolling */}
        <div className="p-6 md:p-8 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 40px)' }}>
          <div className="relative">
            {/* Close button */}
            <button 
              onClick={handleClose}
              className="absolute top-0 right-0 p-2 rounded-full bg-gray-700/60 text-gray-300 hover:bg-white hover:text-gray-900 transition-colors z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            
            {/* Back button */}
            <button 
              onClick={handleClose}
              className="mb-4 flex items-center text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
              <span>{language === 'tr' ? 'Geri' : 'Back'}</span>
            </button>
            
            {/* Title with gradient background */}
            <div className="relative mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {content.title}
              </h2>
              <div className="absolute h-1 w-20 bg-white/50 bottom-0 left-0 mt-2 rounded-full"></div>
            </div>
            
            {/* Content */}
            <div 
              className="text-gray-300 leading-relaxed space-y-4 mb-8"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
            
            {/* Bottom actions */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700/30">
              <button 
                onClick={handleClose}
                className="px-4 py-2 bg-gray-700/50 hover:bg-white hover:text-gray-900 rounded-lg border border-gray-600/50 text-gray-300 transition-colors"
              >
                {language === 'tr' ? 'Kapat' : 'Close'}
              </button>
              
              {/* You could add additional actions here if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPanel;