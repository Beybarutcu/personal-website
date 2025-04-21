// src/components/sections/Hero.jsx
import React from 'react';
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

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layer with stars */}
      <div className="absolute inset-0 star-field">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="star animate-starTwinkle"
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
      
      {/* Cosmic background elements */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient orbs */}
        <div className="cosmic-orb w-64 h-64 top-1/4 left-1/4 animate-float-y" style={{ animationDelay: "0s" }}></div>
        <div className="cosmic-orb cosmic-orb-highlight w-80 h-80 bottom-1/3 right-1/5 animate-float-y" style={{ animationDelay: "1.5s" }}></div>
        <div className="cosmic-orb w-48 h-48 top-2/3 left-1/3 animate-float-x" style={{ animationDelay: "1s" }}></div>
      </div>
      
      {/* Content with improved animations */}
      <div className="container mx-auto px-6 z-10 relative">
        <div className="flex flex-col items-center text-center">
          {/* Greeting with staggered animation */}
          <div className="overflow-hidden mb-2">
            <h2 
              className="text-2xl text-gray-300 opacity-0 animate-[fadeSlideUp_1s_ease-out_0.2s_forwards]"
            >
              {t('hero.greeting')}
            </h2>
          </div>
          
          {/* Title with staggered animation */}
          <div className="overflow-hidden mb-6">
            <h1 
              className="text-5xl md:text-7xl font-bold opacity-0 animate-[fadeSlideUp_1.2s_ease-out_0.5s_forwards]"
              style={titleStyle}
            >
              <span className="block">{t('hero.title')}</span>
            </h1>
          </div>
          
          {/* Description with staggered animation */}
          <div className="overflow-hidden mb-10">
            <p className="max-w-3xl text-xl text-gray-300 opacity-0 animate-[fadeSlideUp_1s_ease-out_0.8s_forwards]">
              {t('hero.description')}
            </p>
          </div>
          
          {/* Buttons with staggered animation */}
          <div className="flex flex-col sm:flex-row gap-6 opacity-0 animate-[fadeSlideUp_1s_ease-out_1.1s_forwards]">
            <a 
              href="#portfolio" 
              className="button-modern button-highlight border-glow group flex items-center justify-center"
            >
              <Briefcase size={18} className="mr-2 transition-transform group-hover:scale-110" />
              {t('hero.viewWork')}
            </a>
            
            <a 
              href="#contact"
              className="button-modern flex items-center justify-center"
            >
              <Code size={18} className="mr-2" />
              {t('hero.contactMe')}
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator - centered at the bottom with delayed fade-in */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center z-10 opacity-0 animate-[fadeIn_1s_ease-out_1.8s_forwards]">
        <span className="text-gray-400 text-sm mb-2">{t('hero.scrollDown')}</span>
        <div className="animate-bounce">
          <ChevronDown className="text-gray-400" size={24} />
        </div>
      </div>
    </section>
  );
};

// Add these animation keyframes to your CSS file:
/*
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
*/

export default Hero;