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
  
  // Updated project data with your real projects
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
      image: '/assets/images/gym-tracker-thumb.jpg',
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
    { id: 'visualization', label: 'Visualization' },
    { id: 'computer-vision', label: 'Computer Vision' }
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

// Fixed Project Card Component that actually uses the images
const ProjectCard = ({ project, onClick, t }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      className="group bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden shadow-xl transition-transform hover:transform hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      {/* Image container that actually uses the project.image */}
      <div className="h-56 bg-gradient-to-br from-gray-700 to-gray-900 relative overflow-hidden">
        {/* Always show the gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 project-card-bg"></div>
        
        {/* Show actual image if available and not errored */}
        {project.image && !imageError && (
          <>
            {/* Loading state - show while image is loading */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            
            {/* Actual image */}
            <img
              src={project.image}
              alt={project.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            
            {/* Dark overlay on top of image for better text readability */}
            {imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-gray-900/30"></div>
            )}
          </>
        )}
        
        {/* Fallback content when no image or image fails to load */}
        {(!project.image || imageError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="mb-4 p-4 rounded-full bg-white/10 backdrop-blur-sm">
              {/* Tech-specific icons */}
              {project.technologies[0]?.toLowerCase().includes('flutter') && (
                <svg className="w-10 h-10 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zm.159 11.871L6.857 19.487l4.537 4.526L18.031 17.3 14.473 11.871z"/>
                </svg>
              )}
              {project.technologies[0]?.toLowerCase().includes('python') && (
                <svg className="w-10 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.26-.02.21-.01H8.77v-.69l-.05-.59-.14-.5-.22-.41-.27-.33-.32-.27-.35-.2-.36-.15-.37-.1-.35-.07-.32-.04-.27-.02H3.17l-.21.03-.28.07-.32.12-.35.18-.36.26-.36.36-.35.46-.32.59-.28.73-.21.88-.14 1.05-.05 1.23.06 1.22.16 1.04.24.87.32.71.36.57.4.44.42.33.42.24.4.16.36.1.32.05.26.02.21.01h5.1l.69-.05.59-.14.5-.22.41-.27.33-.32.27-.35.2-.36.15-.37.1-.35.07-.32.04-.27.02-.21V3.06h2.83l.21.03.28.07.32.12.35.18.36.26.36.36.35.46.32.59.28.73.21.88.14 1.05.05 1.23-.06 1.22-.16 1.04-.24.87-.32.71-.36.57-.4.44-.42.33-.42.24-.4.16-.36.1-.32.05-.26.02-.21.01H8.77v.69l.05.59.14.5.22.41.27.33.32.27.35.2.36.15.37.1.35.07.32.04.27.02h5.1l.21-.03.28-.07.32-.12.35-.18.36-.26.36-.36.35-.46.32-.59.28-.73.21-.88.14-1.05.05-1.23-.06-1.22-.16-1.04-.24-.87-.32-.71-.36-.57-.4-.44-.42-.33-.42-.24-.4-.16-.36-.1-.32-.05-.26-.02-.21-.01H14.25V.18z"/>
                </svg>
              )}
              {project.technologies[0]?.toLowerCase().includes('react') && (
                <svg className="w-10 h-10 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.36-.034-.47 0-.92.015-1.36.034.44-.572.895-1.096 1.36-1.564zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.788-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.36.034.47 0 .92-.015 1.36-.034-.44.572-.895 1.095-1.36 1.563-.455-.468-.91-.991-1.36-1.563z"/>
                </svg>
              )}
              {/* Default code icon for other technologies */}
              {!['flutter', 'python', 'react'].some(tech => 
                project.technologies[0]?.toLowerCase().includes(tech)
              ) && (
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              )}
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">{project.title}</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {project.technologies.slice(0, 2).map((tech, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-white/20 rounded text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* View overlay that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={24} className="text-gray-900" />
          </div>
        </div>
      </div>
      
      {/* Card content below the image */}
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