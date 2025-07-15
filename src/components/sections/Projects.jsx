// src/components/sections/Projects.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github, Eye } from 'lucide-react';

const Projects = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Updated project data based on your real information
  const projects = [
    {
      id: 'personal-website',
      title: t('portfolio.projects.personalWebsite.title'),
      description: t('portfolio.projects.personalWebsite.description'),
      details: t('portfolio.projects.personalWebsite.details'),
      image: '/assets/images/portfolio-thumb.jpg',
      technologies: ['React', 'D3.js', 'Tailwind CSS', 'i18next'],
      demoUrl: window.location.origin, // Current website
      codeUrl: 'https://github.com/Beybarutcu/personal-website',
      categories: ['featured', 'frontend', 'visualization']
    },
    {
      id: 'gym-membership-tracker',
      title: t('portfolio.projects.gymTracker.title'),
      description: t('portfolio.projects.gymTracker.description'),
      details: t('portfolio.projects.gymTracker.details'),
      image: './assets/images/gym-tracker-thumb.jpg',
      technologies: ['Flutter', 'Dart', 'SQLite', 'Material Design'],
      codeUrl: 'https://github.com/Beybarutcu/gym_membership_tracker',
      categories: ['featured', 'mobile', 'flutter']
    },
    {
      id: 'human-identifier-tracker',
      title: t('portfolio.projects.humanTracker.title'),
      description: t('portfolio.projects.humanTracker.description'),
      details: t('portfolio.projects.humanTracker.details'),
      image: '/assets/images/projects/cv-tracker-thumb.jpg',
      technologies: ['Python', 'YOLO', 'OpenCV', 'Pyzbar', 'Computer Vision'],
      categories: ['featured', 'ai', 'computer-vision', 'python']
    }
  ];
  
  // Available filter categories
  const categories = [
    { id: 'all', label: t('portfolio.filters.all') },
    { id: 'featured', label: t('portfolio.filters.featured') },
    { id: 'frontend', label: 'Frontend' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'ai', label: 'AI/ML' },
    { id: 'python', label: 'Python' },
    { id: 'flutter', label: 'Flutter' },
    { id: 'visualization', label: 'Visualization' }
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
  }, [activeFilter, currentLanguage]);
  
  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
  };
  
  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, filteredProjects.length));
  };
  
  const openProjectModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };
  
  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };
  
  return (
    <section id="projects" className="relative py-20 overflow-hidden">
      {/* Keep only the gradient orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Gradient orbs with a different color scheme */}
        <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-fuchsia-500/10 blur-3xl animate-float-y" 
             style={{ animationDelay: "0.7s" }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl animate-float-y" 
             style={{ animationDelay: "1.3s" }}></div>
        <div className="absolute top-2/3 right-1/5 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl animate-float-x" 
             style={{ animationDelay: "0.5s" }}></div>
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
            href="https://github.com/Beybarutcu"
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

// Project Card Component
const ProjectCard = ({ project, onClick, t }) => {
  return (
    <div 
      className="group bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden shadow-xl transition-transform hover:transform hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      {/* Simplified background with project-card-bg class */}
      <div className="h-56 bg-gradient-to-br from-gray-700 to-gray-900 relative overflow-hidden">
        {/* Create a tech-themed placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 project-card-bg"></div>
        
        {/* View overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={24} className="text-gray-900" />
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
        
        {/* Action links */}
        <div className="flex justify-between pt-4 border-t border-gray-700/30">
          {project.demoUrl ? (
            <a 
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={16} />
              {t('portfolio.viewLive')}
            </a>
          ) : (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Eye size={16} />
              Mobile/Desktop App
            </span>
          )}
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
        {/* Project Header */}
        <div className="h-80 bg-gradient-to-br from-orange-500/20 to-purple-500/20 relative overflow-hidden">
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
            {project.demoUrl ? (
              <a 
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-all hover:-translate-y-1 shadow-lg"
              >
                <Eye size={18} />
                {t('portfolio.viewLive')}
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-gray-300 rounded-lg font-medium cursor-not-allowed">
                <Eye size={18} />
                Desktop/Mobile App
              </div>
            )}
            
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