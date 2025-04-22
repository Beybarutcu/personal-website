// src/components/sections/Hero.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Code, Briefcase } from 'lucide-react';

const Hero = ({ language }) => {
  const { t } = useTranslation();
  
  // Define a style object to ensure the gradient text stays consistent
  const titleStyle = {
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    backgroundImage: 'linear-gradient(to right, #f97316, #fb923c)'
  };

  // Function to create comet effect
  const createComet = () => {
    if (!document.querySelector('.hero-comet-container')) return;
    
    const comet = document.createElement('div');
    comet.className = 'absolute bg-white rounded-full opacity-0 pointer-events-none';
    
    // Random properties for the comet
    const size = 2 + Math.random() * 3;
    const angle = Math.PI / 4 + (Math.random() * Math.PI / 4); // Angle between π/4 and π/2
    const duration = 2 + Math.random() * 3; // 2-5 seconds
    const delay = Math.random() * 10; // 0-10 seconds
    
    // Position the comet off-screen
    const startX = Math.random() * 100;
    const startY = -10;
    
    // Style the comet
    comet.style.width = `${size}px`;
    comet.style.height = `${size}px`;
    comet.style.left = `${startX}vw`;
    comet.style.top = `${startY}vh`;
    comet.style.boxShadow = `0 0 20px 2px rgba(255, 255, 255, 0.7), 0 0 30px 10px rgba(255, 255, 255, 0.5)`;
    comet.style.zIndex = '1';
    
    // Animation
    comet.style.animation = `comet ${duration}s linear ${delay}s forwards`;
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
    // Create comets periodically
    const cometInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to create a comet
        createComet();
      }
    }, 5000);
    
    // Initial comets
    for (let i = 0; i < 2; i++) {
      createComet();
    }
    
    return () => clearInterval(cometInterval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layer with stars */}
      <div className="absolute inset-0 star-field">
        {Array.from({ length: 100 }).map((_, i) => (
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
              animationDuration: `${Math.random() * 5 + 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Comet container */}
      <div className="hero-comet-container absolute inset-0"></div>
      
      {/* Content with animations */}
      <div className="container mx-auto px-6 z-10 relative">
        <div className="flex flex-col items-center text-center">
          {/* Greeting with staggered animation */}
          <div className="overflow-hidden mb-2">
            <h2 
              className="text-2xl text-gray-300 animate-[fadeSlideUp_1s_ease-out_0.2s_forwards]"
            >
              {t('hero.greeting')}
            </h2>
          </div>
          
          {/* Title with staggered animation */}
          <div className="overflow-hidden mb-6">
            <h1 
              className="text-5xl md:text-7xl font-bold animate-[fadeSlideUp_1.2s_ease-out_0.5s_forwards]"
              style={titleStyle}
            >
              <span className="block">{t('hero.title')}</span>
            </h1>
          </div>
          
          {/* Description with staggered animation */}
          <div className="overflow-hidden mb-10">
            <p className="max-w-3xl text-xl text-gray-300 animate-[fadeSlideUp_1s_ease-out_0.8s_forwards]">
              {t('hero.description')}
            </p>
          </div>
          
          {/* Buttons with staggered animation */}
          <div className="flex flex-col sm:flex-row gap-6 animate-[fadeSlideUp_1s_ease-out_1.1s_forwards]">
            <a 
              href="#portfolio" 
              className="px-6 py-3 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg font-medium hover:bg-orange-500/30 hover:-translate-y-1 transition-all duration-300 shadow-lg flex items-center justify-center"
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
      
      {/* Cosmic background elements - Positioned around the text */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated gradient orbs - Now positioned around the center text */}
        <div className="absolute w-64 h-64 rounded-full bg-purple-500/20 blur-3xl animate-float-y" 
             style={{ 
               top: '30%', 
               left: '25%', 
               animation: 'float-y 6s ease-in-out infinite 0s' 
             }}></div>
        <div className="absolute w-80 h-80 rounded-full bg-orange-500/20 blur-3xl animate-float-y" 
             style={{ 
               top: '25%', 
               right: '25%', 
               animation: 'float-y 6s ease-in-out infinite 1.5s' 
             }}></div>
        <div className="absolute w-48 h-48 rounded-full bg-blue-500/20 blur-3xl animate-float-x" 
             style={{ 
               top: '65%', 
               left: '40%', 
               animation: 'float-x 6s ease-in-out infinite 1s' 
             }}></div>
      </div>
      
      {/* Scroll indicator - centered at the bottom with delayed fade-in */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center z-10 animate-[fadeIn_1s_ease-out_1.8s_forwards]">
        <span className="text-gray-400 text-sm mb-2">{t('hero.scrollDown')}</span>
        <div className="animate-bounce">
          <ChevronDown className="text-gray-400" size={24} />
        </div>
      </div>
      
      {/* Add CSS for comet animation */}
      <style>{`
        @keyframes comet {
          0% {
            opacity: 0;
            transform: rotate(45deg) translateX(-10vw) translateY(-10vh);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: rotate(45deg) translateX(110vw) translateY(110vh);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;