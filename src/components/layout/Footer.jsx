// src/components/layout/Footer.jsx
import React from 'react';
import { Heart, Github, Linkedin } from 'lucide-react';

const Footer = ({ language = 'en' }) => {
  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <h2 className="text-xl font-bold text-white header-name-highlight">
              Beyazıt Barutçu
            </h2>
            <p className="text-gray-400 mt-2">
              {language === 'tr' 
                ? 'Pratik ve ölçeklenebilir teknoloji çözümleri geliştiren bilgisayar mühendisi.' 
                : 'Computer engineer building practical and scalable technology solutions.'
              }
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/Beybarutcu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-900 transition-all duration-300"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a 
              href="https://linkedin.com/in/beyazitbarutcu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-900 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-800/50 flex justify-center">
          <p className="text-gray-500 text-sm flex items-center">
            {language === 'tr' ? 'Sevgiyle yapıldı' : 'Made with'} 
            <Heart size={14} className="text-orange-500 mx-1" /> 
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;