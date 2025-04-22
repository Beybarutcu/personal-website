// src/components/navigation/ContentPanel.jsx
import React, { useState, useEffect } from 'react';
import { nodeContent } from '../../data/mindMapData';
import { X, ExternalLink } from 'lucide-react';

const ContentPanel = ({ nodeId, currentLanguage = 'en', onClose }) => {
  const [content, setContent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (nodeId) {
      // Get content for this node
      const nodeData = nodeContent[nodeId];
      if (nodeData) {
        // Get content in current language or fall back to English
        const localized = nodeData[currentLanguage] || nodeData['en'];
        setContent(localized);
        
        // Animate in
        setTimeout(() => {
          setIsVisible(true);
        }, 50);
      }
    } else {
      setContent(null);
    }
    
    return () => {
      setIsVisible(false);
    };
  }, [nodeId, currentLanguage]);
  
  // Handle closing the panel
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300); // Wait for fade out animation
  };
  
  if (!content) {
    return null;
  }
  
  return (
    <div 
      className={`bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-xl 
                  shadow-xl overflow-hidden transition-all duration-300 h-full
                  ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-x-10'}`}
    >
      {/* Panel Header */}
      <div className="relative h-48 bg-gradient-to-r from-gray-900/80 to-gray-800/80 overflow-hidden">
        {/* Background stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`panel-star-${i}`}
              className="absolute rounded-full bg-white animate-starTwinkle"
              style={{
                width: `${Math.random() * 2 + 0.5}px`,
                height: `${Math.random() * 2 + 0.5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.2,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 5 + 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Title overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent">
          <h3 className="text-2xl font-bold text-white mb-2">{content.title}</h3>
          
          {content.subtitle && (
            <p className="text-gray-300">{content.subtitle}</p>
          )}
        </div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/60 backdrop-blur-sm text-gray-400 hover:text-white transition-colors"
          aria-label="Close panel"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Panel Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(600px-12rem)]">
        {/* Description */}
        <div className="prose prose-invert max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: content.description }} />
        </div>
        
        {/* Skills/Technologies if available */}
        {content.skills && content.skills.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              {currentLanguage === 'tr' ? 'Beceriler' : 'Skills'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Links if available */}
        {content.links && content.links.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-700/30">
            <h4 className="text-lg font-semibold text-white mb-3">
              {currentLanguage === 'tr' ? 'İlgili Bağlantılar' : 'Related Links'}
            </h4>
            <div className="space-y-2">
              {content.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPanel;