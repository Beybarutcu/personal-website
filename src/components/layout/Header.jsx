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
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
        {/* Logo/Brand with fixed hover color */}
        <a href="#" className="flex items-center group">
          <h1 className="text-2xl md:text-3xl font-bold relative">
            {/* The key fix is using "bg-clip-text" in the base state AND in the hover state */}
            <span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400 
                         hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-400"
            >
              {currentLanguage === 'tr' ? 'Zihin Haritam' : 'My Mind Map'}
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
          </h1>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#home" 
            className="text-gray-300 hover:text-white transition-colors relative group"
          >
            {t('navigation.home')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="#about" 
            className="text-gray-300 hover:text-white transition-colors relative group"
          >
            {t('navigation.about')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="#portfolio" 
            className="text-gray-300 hover:text-white transition-colors relative group"
          >
            {t('navigation.portfolio')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="#contact" 
            className="text-gray-300 hover:text-white transition-colors relative group"
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
      
      {/* Mobile Navigation Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/95 backdrop-blur-lg z-30 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ 
          top: mobileMenuOpen ? '0' : '-100%',
          transitionProperty: 'opacity, top' 
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <nav className="flex flex-col items-center gap-8 p-8">
            <a 
              href="#home" 
              className="text-2xl text-gray-300 hover:text-white transition-colors"
              onClick={closeMobileMenu}
            >
              {t('navigation.home')}
            </a>
            <a 
              href="#about" 
              className="text-2xl text-gray-300 hover:text-white transition-colors"
              onClick={closeMobileMenu}
            >
              {t('navigation.about')}
            </a>
            <a 
              href="#portfolio" 
              className="text-2xl text-gray-300 hover:text-white transition-colors"
              onClick={closeMobileMenu}
            >
              {t('navigation.portfolio')}
            </a>
            <a 
              href="#contact" 
              className="text-2xl text-gray-300 hover:text-white transition-colors"
              onClick={closeMobileMenu}
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