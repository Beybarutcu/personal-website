// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Header = ({ currentLanguage, onLanguageChange }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  
  // Track scroll position for header transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // FIXED: Close mobile menu without scrolling to home
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    // Removed automatic scroll to top - stay where user was
  };
  
  // FIXED: Custom navigation handler that doesn't force scroll to home
  const handleNavigation = (targetId, event) => {
    event.preventDefault();
    closeMobileMenu();
    
    // Only scroll if clicking on a different section
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        scrollPosition > 50 || mobileMenuOpen
          ? 'bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-800/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Empty div to maintain flex layout, since we removed the logo */}
        <div className="w-8"></div>
        
        {/* Desktop Navigation - now includes InSight */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#home" 
            className="text-gray-300 hover:text-white transition-colors relative group"
            onClick={(e) => handleNavigation('home', e)}
          >
            {t('navigation.home')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="#portfolio" 
            className="text-gray-300 hover:text-white transition-colors relative group"
            onClick={(e) => handleNavigation('portfolio', e)}
          >
            InSight
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="#about" 
            className="text-gray-300 hover:text-white transition-colors relative group"
            onClick={(e) => handleNavigation('about', e)}
          >
            {t('navigation.about')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="#projects" 
            className="text-gray-300 hover:text-white transition-colors relative group"
            onClick={(e) => handleNavigation('projects', e)}
          >
            Projects
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="#contact" 
            className="text-gray-300 hover:text-white transition-colors relative group"
            onClick={(e) => handleNavigation('contact', e)}
          >
            {t('navigation.contact')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
          
          <LanguageSwitcher 
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
            variant="header"
          />
        </nav>
        
        {/* Mobile Menu Controls */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSwitcher 
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
            variant="minimal"
          />
          
          <button 
            onClick={toggleMobileMenu}
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* MODIFIED: Mobile Navigation Shelf - 30% height from top, cropped 15% left/right */}
      <div 
        className={`fixed bg-gray-900/95 backdrop-blur-lg z-30 transition-all duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ 
          /* FIXED: Shelf is only 30% of screen height, starts from top */
          top: mobileMenuOpen ? '0' : '-30vh',  /* Slides down only 30vh */
          left: '15%',      /* 15% crop from left */
          right: '15%',     /* 15% crop from right */
          height: '30vh',   /* Only 30% of screen height */
          borderRadius: '0 0 12px 12px', /* Rounded only at bottom */
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)', 
          transitionProperty: 'opacity, top',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex flex-col items-center justify-center h-full py-4">
          <nav className="flex flex-col items-center justify-between h-full w-full max-w-sm">
            <a 
              href="#home" 
              className="text-xl text-gray-300 hover:text-white transition-colors"
              onClick={(e) => handleNavigation('home', e)}
            >
              {t('navigation.home')}
            </a>
            <a 
              href="#portfolio" 
              className="text-xl text-gray-300 hover:text-white transition-colors"
              onClick={(e) => handleNavigation('portfolio', e)}
            >
              InSight
            </a>
            <a 
              href="#about" 
              className="text-xl text-gray-300 hover:text-white transition-colors"
              onClick={(e) => handleNavigation('about', e)}
            >
              {t('navigation.about')}
            </a>
            <a 
              href="#projects" 
              className="text-xl text-gray-300 hover:text-white transition-colors"
              onClick={(e) => handleNavigation('projects', e)}
            >
              Projects
            </a>
            <a 
              href="#contact" 
              className="text-xl text-gray-300 hover:text-white transition-colors"
              onClick={(e) => handleNavigation('contact', e)}
            >
              {t('navigation.contact')}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;