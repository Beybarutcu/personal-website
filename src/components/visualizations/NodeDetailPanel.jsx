// src/components/visualizations/NodeDetailPanel.jsx
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const NodeDetailPanel = ({ 
  node, 
  onClose,
  position = 'bottom' // 'bottom', 'right', 'modal'
}) => {
  const { t } = useTranslation();
  const panelRef = useRef(null);
  
  // Animation variants based on panel position
  const panelVariants = {
    bottom: {
      hidden: { y: 200, opacity: 0 },
      visible: { y: 0, opacity: 1 },
      exit: { y: 200, opacity: 0 }
    },
    right: {
      hidden: { x: 200, opacity: 0 },
      visible: { x: 0, opacity: 1 },
      exit: { x: 200, opacity: 0 }
    },
    modal: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 }
    }
  };
  
  // Select the appropriate variant based on position prop
  const variant = panelVariants[position] || panelVariants.bottom;
  
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  // Generate panel classNames based on position
  const getPanelClassNames = () => {
    const baseClasses = "bg-gray-800/90 backdrop-blur-lg border border-gray-700/50 shadow-xl z-20";
    
    switch (position) {
      case 'bottom':
        return `absolute bottom-0 left-0 right-0 p-6 ${baseClasses}`;
      case 'right':
        return `absolute top-0 bottom-0 right-0 w-full md:w-96 p-6 overflow-y-auto ${baseClasses}`;
      case 'modal':
        return `fixed inset-6 md:inset-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 p-6 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-xl ${baseClasses}`;
      default:
        return `absolute bottom-0 left-0 right-0 p-6 ${baseClasses}`;
    }
  };
  
  // Handle click outside for modal
  const handleBackdropClick = (e) => {
    if (position === 'modal' && !panelRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Skills section
  const renderSkills = () => {
    if (!node.data.skills || node.data.skills.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">{t('mindMap.skillsLabel')}</h4>
        <div className="flex flex-wrap gap-2">
          {node.data.skills.map((skill, index) => (
            <motion.span 
              key={index}
              className="inline-block px-3 py-1 text-sm bg-gray-700/60 backdrop-blur-sm rounded-full text-white border border-gray-600/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    );
  };
  
  // Related links section
  const renderLinks = () => {
    if (!node.data.links || Object.keys(node.data.links).length === 0) return null;
    
    return (
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">{t('mindMap.relatedLinksLabel')}</h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(node.data.links).map(([key, label], index) => (
            <motion.a 
              key={key}
              href={`#${key}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/60 backdrop-blur-sm rounded-lg border border-gray-600/50 text-white hover:bg-gray-600/60 hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              onClick={onClose}
            >
              {label}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </motion.a>
          ))}
        </div>
      </div>
    );
  };
  
  // Modal backdrop if position is 'modal'
  const renderBackdrop = () => {
    if (position !== 'modal') return null;
    
    return (
      <motion.div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      />
    );
  };
  
  return (
    <AnimatePresence>
      {renderBackdrop()}
      <motion.div
        ref={panelRef}
        className={getPanelClassNames()}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={variant}
        transition={{ 
          type: 'spring', 
          stiffness: 500, 
          damping: 30 
        }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-700/50 text-gray-300 hover:text-white transition-colors"
          aria-label="Close panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-2 text-orange-400 font-medium text-sm"
          >
            {node.data.subtitle}
          </motion.div>
          
          <motion.h3 
            className="text-2xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {node.data.title}
          </motion.h3>
          
          <motion.div 
            className="text-gray-300 mb-6 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            dangerouslySetInnerHTML={{ __html: node.data.description }}
          />
          
          {renderSkills()}
          {renderLinks()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NodeDetailPanel;