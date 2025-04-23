import React, { useState } from 'react';
import { Github, ExternalLink, Code, ArrowRight } from 'lucide-react';

const EnhancedProjectCard = ({ 
  project, 
  onClick, 
  t, 
  variant = 'default', // 'default', 'featured', 'compact'
  index = 0 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation delay based on index for staggered appearance
  const animationDelay = `${0.1 + (index * 0.15)}s`;
  
  // Generate particles for the card effect
  const renderParticles = () => {
    return Array.from({ length: 8 }).map((_, i) => (
      <div
        key={`particle-${i}`}
        className={`absolute rounded-full bg-orange-500/30 transition-all duration-1000 ease-out
                   ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        style={{
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          transitionDelay: `${0.1 + Math.random() * 0.3}s`,
          boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)'
        }}
      />
    ));
  };
  
  // Handle different card variants
  const getCardClassNames = () => {
    const baseClasses = `
      project-card relative overflow-hidden rounded-xl border transition-all duration-500
      hover:shadow-xl
    `;
    
    switch (variant) {
      case 'featured':
        return `${baseClasses} bg-gray-800/40 backdrop-blur-md border-orange-500/30 hover:border-orange-400/50`;
      case 'compact':
        return `${baseClasses} bg-gray-800/30 backdrop-blur-sm border-gray-700/50 hover:border-orange-500/30`;
      default:
        return `${baseClasses} bg-gray-800/30 backdrop-blur-sm border-gray-700/50 hover:border-orange-500/20`;
    }
  };
  
  // Create tag components with different styles
  const renderTags = () => {
    if (!project.technologies || project.technologies.length === 0) return null;
    
    // Different color schemes for variation
    const colorClasses = [
      "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "bg-amber-500/20 text-amber-400 border-amber-500/30",
      "bg-green-500/20 text-green-400 border-green-500/30",
      "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
    ];
    
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech, index) => {
          const colorClass = colorClasses[index % colorClasses.length];
          
          return (
            <span 
              key={index}
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${colorClass} transition-all duration-300 ${isHovered ? 'transform scale-105' : ''}`}
              style={{ transitionDelay: isHovered ? `${0.1 + index * 0.05}s` : '0s' }}
            >
              {tech}
            </span>
          );
        })}
      </div>
    );
  };
  
  return (
    <div 
      className={`${getCardClassNames()} transform transition-all duration-700 opacity-0 translate-y-8`}
      style={{ 
        animationName: 'fadeSlideUp', 
        animationDuration: '0.8s', 
        animationDelay, 
        animationFillMode: 'forwards'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Top radial gradient accent */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500/0 via-orange-500/80 to-orange-500/0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-30'}`}
      ></div>
      
      {/* Decorative particles that appear on hover */}
      {renderParticles()}
      
      {/* Project image or placeholder */}
      <div className="h-56 bg-gradient-to-br from-gray-700/50 to-gray-900/50 relative overflow-hidden">
        {/* Placeholder stars */}
        {Array.from({ length: 20 }).map((_, i) => {
          const size = Math.random() * 1.5 + 0.5;
          return (
            <div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                boxShadow: size > 1.2 ? '0 0 3px rgba(255, 255, 255, 0.8)' : 'none'
              }}
            />
          );
        })}
        
        {/* Custom Project Image Overlay */}
        <div className={`
          absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 opacity-0 
          transition-opacity duration-500 ${isHovered ? 'opacity-40' : ''}
        `}></div>
        
        {/* Title overlay with gradient background */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent p-4">
          <h3 className={`
            text-xl font-bold text-white mb-1 transform transition-all duration-300
            ${isHovered ? 'translate-y-0 text-orange-300' : 'translate-y-0'}`}
          >
            {project.title}
          </h3>
        </div>
        
        {/* View overlay with custom icon animation */}
        <div className={`
          absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/30 to-transparent 
          flex items-center justify-center opacity-0 transition-opacity duration-500
          ${isHovered ? 'opacity-100' : ''}
        `}>
          <div className={`
            flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md
            border border-white/30 transform transition-all duration-500
            ${isHovered ? 'translate-y-0 scale-100' : 'translate-y-8 scale-90'}
          `}>
            <ExternalLink size={20} className="text-white" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Description with animated underline */}
        <p className="text-gray-300 mb-5 line-clamp-3 relative">
          {project.description}
          <span className={`
            absolute bottom-0 left-0 h-px w-16 bg-orange-500/50
            transform transition-all duration-700 ease-out
            ${isHovered ? 'w-3/4 opacity-100' : 'w-0 opacity-0'}
          `}></span>
        </p>
        
        {/* Technologies as tags */}
        {renderTags()}
        
        {/* Action links with animated indicator */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-700/30">
          <a 
            href={project.codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 group"
            onClick={(e) => e.stopPropagation()}
          >
            <Github size={16} className="group-hover:rotate-12 transition-transform" />
            {t('portfolio.viewCode')}
          </a>
          
          {project.demoUrl && (
            <a 
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
              onClick={(e) => e.stopPropagation()}
            >
              <span>{t('portfolio.viewLive')}</span>
              <ArrowRight size={14} className="transform transition-transform group-hover:translate-x-1" />
            </a>
          )}
        </div>
      </div>
      
      {/* Decorative corner accent */}
      <div className={`
        absolute bottom-0 right-0 w-12 h-12 opacity-0 transition-opacity duration-500
        ${isHovered ? 'opacity-100' : ''}
      `}>
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-orange-500/20"
        >
          <path d="M0 48C0 21.49 21.49 0 48 0V48H0Z" fill="currentColor"/>
        </svg>
      </div>
    </div>
  );
};

export default EnhancedProjectCard;