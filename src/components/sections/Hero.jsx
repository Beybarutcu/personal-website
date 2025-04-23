// src/components/sections/Hero.jsx
import React, { useEffect } from 'react';
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

  // Function to create comet effect with smoother timing
  const createComet = () => {
    if (!document.querySelector('.hero-comet-container')) return;
    
    const comet = document.createElement('div');
    comet.className = 'absolute bg-white rounded-full opacity-0 pointer-events-none';
    
    // Random properties for the comet with enhanced values
    const size = 2 + Math.random() * 3;
    const angle = Math.PI / 4 + (Math.random() * Math.PI / 4); // Angle between π/4 and π/2
    const duration = 2 + Math.random() * 3; // 2-5 seconds
    const delay = Math.random() * 8; // 0-8 seconds for more organic timing
    
    // Position the comet off-screen
    const startX = Math.random() * 100;
    const startY = -10;
    
    // Improved style for the comet with better glow effect
    comet.style.width = `${size}px`;
    comet.style.height = `${size}px`;
    comet.style.left = `${startX}vw`;
    comet.style.top = `${startY}vh`;
    comet.style.boxShadow = `0 0 20px 2px rgba(255, 255, 255, 0.8), 0 0 30px 10px rgba(255, 255, 255, 0.5)`;
    comet.style.zIndex = '1';
    
    // Animation with cubic-bezier for smoother motion
    comet.style.animation = `cometEnhanced ${duration}s cubic-bezier(0.4, 0.0, 0.2, 1) ${delay}s forwards`;
    comet.style.transform = `rotate(${angle}rad)`;
    
    // Add to DOM
    document.querySelector('.hero-comet-container')?.appendChild(comet);
    
    // Clean up after animation
    setTimeout(() => {
      comet.remove();
    }, (duration + delay) * 1000);
  };
  
  // Create comets periodically
  useEffect(() => {
    // Create comets with more natural intervals
    const cometInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to create a comet
        createComet();
      }
    }, 3000); // Shorter interval for more frequent comets
    
    // Initial comets
    for (let i = 0; i < 3; i++) { // Start with more comets
      setTimeout(() => createComet(), i * 800); // Staggered initial comets
    }
    
    return () => clearInterval(cometInterval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layer with stars - enhanced with more stars */}
      <div className="absolute inset-0 star-field">
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="star animate-starTwinkle absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 2}s`,
              boxShadow: Math.random() > 0.92 ? '0 0 4px rgba(255, 255, 255, 0.8)' : 'none' // Occasional glowing stars
            }}
          />
        ))}
      </div>
      
      {/* Comet container */}
      <div className="hero-comet-container absolute inset-0"></div>
      
      {/* Content with enhanced animations */}
      <div className="container mx-auto px-6 z-10 relative">
        <div className="flex flex-col items-center text-center">
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
      
      {/* Cosmic background elements - Enhanced positioning and animation */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated gradient orbs - Now positioned around the center text */}
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
      
      {/* Scroll indicator - centered at the bottom with delayed fade-in */}
      <div 
        className="absolute bottom-8 left-0 right-0 flex flex-col items-center z-10 opacity-0"
        style={{ animation: 'fadeIn 1s ease-out 1.8s forwards' }}
      >
        <span className="text-gray-400 text-sm mb-2">{t('hero.scrollDown')}</span>
        <div className="animate-bounce">
          <ChevronDown className="text-gray-400" size={24} />
        </div>
      </div>
      
      {/* Add CSS for enhanced comet animation */}
      <style>{`
        @keyframes cometEnhanced {
          0% {
            opacity: 0;
            transform: rotate(45deg) translateX(-10vw) translateY(-10vh);
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: rotate(45deg) translateX(110vw) translateY(110vh);
          }
        }
        
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