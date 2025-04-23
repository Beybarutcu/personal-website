// src/components/sections/EnhancedMindMapSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import EnhancedMindMap from '../visualizations/EnhancedMindMap';

const EnhancedMindMapSection = ({ language }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Detect when section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      id="mindmap" 
      className="relative py-20 overflow-hidden outline-none"
      style={{ outline: 'none' }}
    >
      {/* No background containers - use the site background directly */}
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400">
              {t('mindMap.title')}
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-300 mb-6">
            {t('mindMap.subtitle')}
          </p>
          <motion.div 
            className="inline-block px-4 py-2 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-300 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              scale: isVisible ? 1 : 0.9,
              y: isVisible ? [0, -5, 0] : 0
            }}
            transition={{ 
              duration: 0.6, 
              delay: 0.8,
              y: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1.5
              }
            }}
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              {t('mindMap.clickToView')}
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="bg-transparent outline-none overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ outline: 'none' }}
        >
          <div className="h-[100vh] max-h-[900px] min-h-[300px] outline-none" style={{ outline: 'none' }}>
            <EnhancedMindMap language={language} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedMindMapSection;