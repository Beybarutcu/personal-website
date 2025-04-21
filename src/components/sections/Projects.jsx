// src/components/sections/Projects.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github, Eye } from 'lucide-react';

const Projects = ({ language }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Sample project data - would typically come from your projectsData.js file
  const projects = [
    {
      id: 'neural-network',
      title: t('portfolio.projects.neuralNetwork.title'),
      description: t('portfolio.projects.neuralNetwork.description'),
      details: t('portfolio.projects.neuralNetwork.details'),
      image: '/assets/images/projects/neural-network-thumb.jpg', // This would be a placeholder image
      technologies: ['React', 'D3.js', 'TypeScript'],
      demoUrl: 'https://example.com/neural-network-demo',
      codeUrl: 'https://github.com/yourusername/neural-network-viz',
      categories: ['featured', 'visualization', 'frontend']
    },
    {
      id: 'data-dashboard',
      title: 'Interactive Data Dashboard',
      description: 'Real-time data visualization dashboard with customizable widgets and filtering capabilities.',
      details: 'Built with React and D3.js, this dashboard provides a modular system for creating reusable visualization components.',
      image: '/assets/images/projects/dashboard-thumb.jpg',
      technologies: ['React', 'Redux', 'D3.js', 'Firebase'],
      demoUrl: 'https://example.com/dashboard-demo',
      codeUrl: 'https://github.com/yourusername/interactive-dashboard',
      categories: ['featured', 'frontend', 'visualization']
    },
    {
      id: 'portfolio-site',
      title: 'Portfolio Website',
      description: 'Personal portfolio website with interactive mind map navigation and multilingual support.',
      details: 'A responsive website built with React and Tailwind CSS, featuring creative animations and interactive elements.',
      image: '/assets/images/projects/portfolio-thumb.jpg',
      technologies: ['React', 'Tailwind CSS', 'i18next', 'Framer Motion'],
      demoUrl: 'https://example.com',
      codeUrl: 'https://github.com/yourusername/portfolio',
      categories: ['frontend', 'design']
    },
    {
      id: 'ar-education',
      title: 'AR Educational App',
      description: 'Augmented reality application for teaching complex scientific concepts through interactive 3D models.',
      details: 'Uses WebXR and Three.js to create immersive educational experiences accessible through modern browsers.',
      image: '/assets/images/projects/ar-app-thumb.jpg',
      technologies: ['Three.js', 'WebXR', 'React', 'Node.js'],
      demoUrl: 'https://example.com/ar-demo',
      codeUrl: 'https://github.com/yourusername/ar-education',
      categories: ['featured', 'frontend', 'webxr']
    },
    {
      id: 'sentiment-analysis',
      title: 'Sentiment Analysis Dashboard',
      description: 'Real-time analysis of social media sentiment with natural language processing and data visualization.',
      details: 'Combines Python backend for NLP processing with a React frontend for data visualization.',
      image: '/assets/images/projects/sentiment-thumb.jpg',
      technologies: ['Python', 'React', 'D3.js', 'NLP'],
      demoUrl: 'https://example.com/sentiment-demo',
      codeUrl: 'https://github.com/yourusername/sentiment-analysis',
      categories: ['backend', 'ai', 'visualization']
    },
    {
      id: 'music-visualizer',
      title: 'Audio Spectrum Visualizer',
      description: 'Interactive music visualization tool that responds to audio input with beautiful generative visuals.',
      details: 'Uses Web Audio API and WebGL to create dynamic visualizations that react to music frequencies and beats.',
      image: '/assets/images/projects/audio-viz-thumb.jpg',
      technologies: ['JavaScript', 'Web Audio API', 'Three.js', 'WebGL'],
      demoUrl: 'https://example.com/audio-visualizer',
      codeUrl: 'https://github.com/yourusername/audio-visualizer',
      categories: ['frontend', 'visualization', 'creative']
    }
  ];
  
  // Available filter categories
  const categories = [
    { id: 'all', label: t('portfolio.filters.all') },
    { id: 'featured', label: t('portfolio.filters.featured') },
    { id: 'visualization', label: 'Visualization' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'creative', label: 'Creative' }
  ];
  
  // Filter projects when activeFilter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => 
        project.categories.includes(activeFilter)
      ));
    }
    
    // Reset visible count when filter changes
    setVisibleCount(4);
  }, [activeFilter, language]);
  
  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
  };
  
  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, filteredProjects.length));
  };
  
  const openProjectModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };
  
  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
  };
  
  return (
    <section id="portfolio" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-tl from-gray-800/10 to-gray-900/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-white/5 to-gray-800/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('portfolio.title')}
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-300">
            {t('portfolio.subtitle')}
          </p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === category.id
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600/50'
              }`}
              onClick={() => handleFilterClick(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.slice(0, visibleCount).map(project => (
            <ProjectCard 
              key={project.id}
              project={project}
              onClick={() => openProjectModal(project)}
              t={t}
            />
          ))}
        </div>
        
        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">{t('portfolio.noResults')}</p>
            <button
              className="px-6 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-300 font-medium hover:text-white hover:bg-gray-700/80 transition-all"
              onClick={() => handleFilterClick('all')}
            >
              {t('portfolio.showAll')}
            </button>
          </div>
        )}
        
        {/* Load More button */}
        {visibleCount < filteredProjects.length && (
          <div className="text-center mt-12">
            <button
              className="px-8 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-300 font-medium hover:text-white hover:bg-gray-700/80 transition-all hover:-translate-y-1"
              onClick={loadMore}
            >
              Load More
            </button>
          </div>
        )}
        
        {/* GitHub link */}
        <div className="text-center mt-16">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-300 font-medium hover:text-white hover:bg-gray-700/80 transition-all hover:-translate-y-1"
          >
            <Github size={18} />
            {t('portfolio.viewMoreGithub')}
          </a>
        </div>
      </div>
      
      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={closeProjectModal}
          t={t}
        />
      )}
    </section>
  );
};

// Project Card Component with Orange Highlight for Technologies and without View Live button
const ProjectCard = ({ project, onClick, t }) => {
  return (
    <div 
      className="group bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden shadow-xl transition-transform hover:transform hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      {/* Placeholder for project image - would be replaced with actual image */}
      <div className="h-56 bg-gradient-to-br from-gray-700 to-gray-900 relative overflow-hidden">
        {/* Create a monochromatic space-themed placeholder if no image */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 to-gray-900/30"></div>
        
        {/* Placeholder stars */}
        {Array.from({ length: 30 }).map((_, i) => {
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
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          );
        })}
        
        {/* View overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Github size={24} className="text-gray-900" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
        <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p>
        
        {/* Technologies - Colorful tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => {
            // Assign a different color to each technology
            const colors = [
              "bg-orange-500/20 text-orange-400 border-orange-500/30",
              "bg-blue-500/20 text-blue-400 border-blue-500/30",
              "bg-green-500/20 text-green-400 border-green-500/30",
              "bg-purple-500/20 text-purple-400 border-purple-500/30",
              "bg-pink-500/20 text-pink-400 border-pink-500/30",
              "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            ];
            
            const colorClass = colors[index % colors.length];
            
            return (
              <span 
                key={index}
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${colorClass}`}
              >
                {tech}
              </span>
            );
          })}
        </div>
        
        {/* Action links - Only View Code */}
        <div className="flex justify-center pt-4 border-t border-gray-700/30">
          <a 
            href={project.codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Github size={16} />
            {t('portfolio.viewCode')}
          </a>
        </div>
      </div>
    </div>
  );
};

// Project Modal Component
const ProjectModal = ({ project, onClose, t }) => {
  // Close when clicking outside the content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-lg"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800/90 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Project Header with large image */}
        <div className="h-80 bg-gradient-to-br from-gray-700 to-gray-900 relative overflow-hidden">
          {/* Create a monochromatic space-themed placeholder if no image */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 to-gray-900/30"></div>
          
          {/* Placeholder stars */}
          {Array.from({ length: 50 }).map((_, i) => {
            const size = Math.random() * 2 + 0.5;
            return (
              <div 
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2
                }}
              />
            );
          })}
          
          {/* Title overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent flex flex-col justify-end p-8">
            <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
            
            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span 
                  key={index}
                  className="inline-block px-2 py-1 text-xs font-medium bg-gray-700/60 backdrop-blur-sm rounded-full text-white border border-gray-600/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/80 backdrop-blur-sm text-gray-300 hover:text-white transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Project content */}
        <div className="p-8">
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
            <p className="text-gray-300 mb-4">{project.description}</p>
            <div className="text-gray-300 space-y-2">
              <p>{project.details}</p>
            </div>
          </div>
          
          {/* Action links */}
          <div className="flex flex-wrap gap-4">
            <a 
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-all hover:-translate-y-1 shadow-lg"
            >
              <Eye size={18} />
              {t('portfolio.viewLive')}
            </a>
            
            <a 
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700/60 backdrop-blur-sm border border-gray-600/50 rounded-lg text-gray-300 font-medium hover:text-white hover:bg-gray-600/60 transition-all hover:-translate-y-1"
            >
              <Github size={18} />
              {t('portfolio.viewCode')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;