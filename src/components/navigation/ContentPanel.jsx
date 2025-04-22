// src/components/navigation/ContentPanel.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ExternalLink } from 'lucide-react';

const ContentPanel = ({ nodeId, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    if (nodeId) {
      // Animate in
      setTimeout(() => {
        setIsVisible(true);
      }, 50);
    }
    
    return () => {
      setIsVisible(false);
    };
  }, [nodeId]);
  
  // Handle closing the panel
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300); // Wait for fade out animation
  };
  
  if (!nodeId) {
    return null;
  }
  
  // Get node content from i18n translations
  const titleKey = `mindMap.nodes.${nodeId}.title`;
  const subtitleKey = `mindMap.nodes.${nodeId}.subtitle`;
  const descriptionKey = `mindMap.nodes.${nodeId}.description`;
  const skillsKey = `mindMap.nodes.${nodeId}.skills`;
  
  // Get skills array from i18n or use fallback
  const getSkills = () => {
    try {
      const skillsJson = t(skillsKey, '', { returnObjects: true });
      return Array.isArray(skillsJson) ? skillsJson : [];
    } catch (error) {
      return [];
    }
  };
  
  // Get links from i18n
  const getLinks = () => {
    try {
      const linksPrefix = `mindMap.nodes.${nodeId}.links`;
      const linksObject = t(`${linksPrefix}`, '', { returnObjects: true });
      
      if (typeof linksObject === 'object' && linksObject !== null) {
        return Object.entries(linksObject).map(([key, label]) => ({
          key,
          label,
          url: key === 'portfolio' ? '#portfolio' : 
               key === 'contact' ? '#contact' : 
               `#${key}` // Fallback for other keys
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  };
  
  const skills = getSkills();
  const links = getLinks();
  
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
          <h3 className="text-2xl font-bold text-white mb-2">{t(titleKey)}</h3>
          
          <p className="text-gray-300">{t(subtitleKey)}</p>
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
          <div dangerouslySetInnerHTML={{ __html: t(descriptionKey) }} />
        </div>
        
        {/* Skills/Technologies if available */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              {t('mindMap.skillsLabel')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
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
        {links.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-700/30">
            <h4 className="text-lg font-semibold text-white mb-3">
              {t('mindMap.relatedLinksLabel')}
            </h4>
            <div className="space-y-2">
              {links.map((link) => (
                <a
                  key={link.key}
                  href={link.url}
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