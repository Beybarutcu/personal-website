// src/components/sections/Hero.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Code, Briefcase } from 'lucide-react';

const Hero = ({ language }) => {
  const { t } = useTranslation();
  
  // Define a style object for the gradient text with improved rendering
  const titleStyle = {
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    backgroundImage: 'linear-gradient(to right, #f97316, #fb923c)'
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Content with enhanced animations */}
      <div className="container mx-auto px-6 z-10 relative">
        {/* Added negative margin-top to move the content up a bit */}
        <div className="flex flex-col items-center text-center mt-[-40px]">
          {/* Greeting with enhanced animation */}
          <div className="overflow-hidden mb-2">
            <h2 
              className="text-2xl text-gray-300 opacity-0"
              style={{ 
                animation: 'fadeSlideUp 1s cubic-bezier(0.19, 1, 0.22, 1) 0.2s forwards'
              }}
            >
              {t('hero.greeting')}
            </h2>
          </div>
          
          {/* Title with enhanced animation */}
          <div className="overflow-hidden mb-6">
            <h1 
              className="text-5xl md:text-7xl font-bold opacity-0"
              style={{ 
                ...titleStyle,
                animation: 'fadeSlideUp 1.2s cubic-bezier(0.19, 1, 0.22, 1) 0.5s forwards'
              }}
            >
              <span className="block">{t('hero.title')}</span>
            </h1>
          </div>
          
          {/* Description with enhanced animation */}
          <div className="overflow-hidden mb-10">
            <p 
              className="max-w-3xl text-xl text-gray-300 opacity-0"
              style={{ 
                animation: 'fadeSlideUp 1s cubic-bezier(0.19, 1, 0.22, 1) 0.8s forwards'
              }}
            >
              {t('hero.description')}
            </p>
          </div>
          
          {/* Buttons with enhanced animation */}
          <div 
            className="flex flex-col sm:flex-row gap-6 opacity-0"
            style={{ 
              animation: 'fadeSlideUp 1s cubic-bezier(0.19, 1, 0.22, 1) 1.1s forwards'
            }}
          >
            <a 
              href="#portfolio" 
              className="px-6 py-3 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg font-medium hover:bg-orange-500/30 hover:-translate-y-1 transition-all duration-300 shadow-lg flex items-center justify-center group"
            >
              <Briefcase size={18} className="mr-2 transition-transform group-hover:scale-110" />
              {t('hero.viewWork')}
            </a>
            
            <a 
              href="#contact"
              className="px-6 py-3 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/60 transition-all duration-300 flex items-center justify-center"
            >
              <Code size={18} className="mr-2" />
              {t('hero.contactMe')}
            </a>
          </div>
        </div>
      </div>
      
      {/* Cosmic background elements - Keeping only the gradient orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated gradient orbs - positioned around the center text */}
        <div className="absolute w-64 h-64 rounded-full bg-purple-500/20 blur-3xl" 
             style={{ 
               top: '30%', 
               left: '25%', 
               animation: 'float-y 12s cubic-bezier(0.4, 0, 0.2, 1) infinite 0s' 
             }}></div>
        <div className="absolute w-80 h-80 rounded-full bg-orange-500/20 blur-3xl" 
             style={{ 
               top: '25%', 
               right: '25%', 
               animation: 'float-y 15s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.5s' 
             }}></div>
        <div className="absolute w-48 h-48 rounded-full bg-blue-500/20 blur-3xl" 
             style={{ 
               top: '65%', 
               left: '40%', 
               animation: 'float-x 12s cubic-bezier(0.4, 0, 0.2, 1) infinite 1s' 
             }}></div>
      </div>
      
      {/* Scroll indicator - positioned higher up from the bottom with delayed fade-in */}
      <div 
        className="absolute bottom-16 left-0 right-0 flex flex-col items-center z-10 opacity-0"
        style={{ animation: 'fadeIn 1s ease-out 1.8s forwards' }}
      >
        <span className="text-gray-400 text-sm mb-2">{t('hero.scrollDown')}</span>
        <div className="animate-bounce">
          <ChevronDown className="text-gray-400" size={24} />
        </div>
      </div>
      
      {/* Keep the CSS animations */}
      <style>{`
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;