// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Home, User, Briefcase, Mail, ArrowUp } from 'lucide-react';
import InsightIcon from '../icons/InsightIcon'; // Import the custom icon

const Navbar = ({ currentLanguage }) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 300; // Offset to trigger earlier
      
      // Show/hide scroll to top button
      if (scrollPosition > 800) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
      
      // Get all sections for intersection detection
      const sections = ['home', 'portfolio', 'about', 'projects', 'contact'];
      let currentActive = 'home';
      
      // Find which section is in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offset = window.innerHeight * 0.3;
          
          if (rect.top <= offset && rect.bottom >= offset) {
            currentActive = section;
            break;
          }
        }
      }
      
      setActiveSection(currentActive);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <>
      {/* Fixed side navigation (desktop) */}
      <nav className="fixed left-6 top-1/2 transform -translate-y-1/2 z-30 hidden md:flex">
        <ul className="flex flex-col gap-6">
          {[
            { id: 'home', icon: Home, label: t('navigation.home') },
            { id: 'portfolio', icon: InsightIcon, label: 'InSight', isCustomIcon: true }, // Using custom icon
            { id: 'about', icon: User, label: t('navigation.about') },
            { id: 'projects', icon: Briefcase, label: 'Projects' },
            { id: 'contact', icon: Mail, label: t('navigation.contact') }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <a 
                  href={`#${item.id}`}
                  className={`relative block group`}
                  aria-label={item.label}
                  title={item.id === 'portfolio' ? 'InSight (Interactive Portfolio)' : item.label}
                >
                  <span className={`
                    absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0.5 group-hover:w-6 transition-all duration-300
                    ${isActive ? 'w-6 bg-white' : 'bg-gray-400'}
                  `}></span>
                  
                  <div className={`
                    ml-8 p-3 rounded-full transition-all duration-300 transform
                    ${isActive 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-gray-800/50 text-gray-400 border border-gray-700/30'
                    }
                    group-hover:scale-110 group-hover:text-white
                  `}>
                    <Icon size={20} />
                  </div>
                  
                  <span className={`
                    absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    text-sm ${isActive ? 'text-white' : 'text-gray-400'}
                  `}>
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Fixed bottom navigation (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-gray-900/90 backdrop-blur-md border-t border-gray-800/50">
        <ul className="flex justify-around">
          {[
            { id: 'home', icon: Home, label: t('navigation.home') },
            { id: 'portfolio', icon: InsightIcon, label: 'InSight', isCustomIcon: true }, // Using custom icon
            { id: 'about', icon: User, label: t('navigation.about') },
            { id: 'projects', icon: Briefcase, label: 'Projects' },
            { id: 'contact', icon: Mail, label: t('navigation.contact') }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id} className="py-3">
                <a 
                  href={`#${item.id}`}
                  className={`flex flex-col items-center px-3 `}
                  aria-label={item.label}
                >
                  <Icon 
                    size={20} 
                    className={isActive 
                      ? 'text-white' 
                      : 'text-gray-400'
                    } 
                  />
                  <span className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed right-6 bottom-20 md:bottom-6 z-30 p-3 rounded-full bg-white text-gray-900 shadow-lg transition-all duration-300 transform hover:scale-110 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
};

export default Navbar;