// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingIndicator from './components/ui/LoadingIndicator';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import Hero from './components/sections/Hero'; // Import original Hero instead of EnhancedHero
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import EnhancedCosmicBackground from './components/ui/EnhancedCosmicBackground';
import MindMap from './components/visualizations/MindMap';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [language, setLanguage] = useState('en');
  const { i18n } = useTranslation();

  // Function to handle language changes throughout the app
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  // Detect browser language and initialize loading
  useEffect(() => {
    // Detect browser language (simplified)
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'tr') {
      setLanguage('tr');
      i18n.changeLanguage('tr');
    }
    
    // Simulate initial loading time with a minimum duration
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Fade in content after loading is complete
      setTimeout(() => {
        setContentLoaded(true);
      }, 300);
    }, 2500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [i18n]);

  // Add decorative background orbs
  const renderBackgroundOrbs = () => (
    <>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {isLoading ? (
        <LoadingIndicator isLoading={isLoading} />
      ) : (
        <>
          {/* Cosmic animated background */}
          <EnhancedCosmicBackground />
          
          {/* Background decorative elements */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {renderBackgroundOrbs()}
          </div>
          
          <div className={`transition-opacity duration-1000 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Header currentLanguage={language} onLanguageChange={handleLanguageChange} />
            <Navbar currentLanguage={language} />
            
            <main className="flex-grow relative z-10">
              {/* Original Hero with enhanced animations */}
              <Hero language={language} />
              
              {/* Self-contained MindMap component */}
              <MindMap language={language} />
              
              {/* Home Page with features section */}
              <HomePage 
                currentLanguage={language} 
                onLanguageChange={handleLanguageChange}
              />
              
              {/* Other sections */}
              <About language={language} />
              <Projects language={language} />
              <Contact language={language} />
            </main>
            
            <Footer language={language} />
          </div>
          
          {/* Development indicator - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 right-4 z-50 bg-black/60 text-white text-xs p-2 rounded">
              Language: {language} | Dev Mode
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;