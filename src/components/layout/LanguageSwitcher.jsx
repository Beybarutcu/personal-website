// src/components/layout/LanguageSwitcher.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({ currentLanguage, onLanguageChange, variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
  ];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const changeLanguage = (code) => {
    if (onLanguageChange) {
      onLanguageChange(code);
    }
    setIsOpen(false);
  };
  
  // Define variant styles
  const variantStyles = {
    default: {
      button: "flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700/50 text-gray-300 hover:text-white transition-colors",
      dropdown: "absolute right-0 mt-2 w-40 bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-xl z-50 overflow-hidden",
      item: "flex items-center w-full px-4 py-2 text-sm text-left transition-colors"
    },
    minimal: {
      button: "flex items-center gap-1 px-2 py-1 rounded-md bg-gray-800/40 hover:bg-gray-700/60 text-gray-300 hover:text-white transition-colors text-sm",
      dropdown: "absolute right-0 mt-1 w-36 bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-md shadow-lg z-50 overflow-hidden",
      item: "flex items-center w-full px-3 py-1.5 text-xs text-left transition-colors"
    },
    header: {
      button: "flex items-center gap-1 px-3 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 text-gray-300 hover:text-white transition-colors",
      dropdown: "absolute right-0 mt-2 w-40 bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-xl z-50 overflow-hidden",
      item: "flex items-center w-full px-4 py-2 text-sm text-left transition-colors"
    }
  };
  
  const styles = variantStyles[variant] || variantStyles.default;
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`${styles.button} hover:bg-gray-700/60 group`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Globe size={variant === 'minimal' ? 16 : 18} className="group-hover:text-white transition-colors" />
        <span className={variant === 'minimal' ? 'text-xs' : 'text-sm'}>
          {currentLanguage === 'tr' ? 'TR' : 'EN'}
        </span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdown}>
          <div className="py-1">
            {languages.map(language => (
              <button
                key={language.code}
                className={`${styles.item} ${
                  currentLanguage === language.code
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
                onClick={() => changeLanguage(language.code)}
              >
                <span className="mr-2">{language.flag}</span>
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;