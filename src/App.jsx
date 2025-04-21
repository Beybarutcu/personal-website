// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import LoadingIndicator from './components/ui/LoadingIndicator';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import CosmicBackground from './components/ui/CosmicBackground';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const { i18n } = useTranslation();

  // Function to handle language changes throughout the app
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    // Change i18n language to update translations across components
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
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [i18n]);

  return (
    <div className="flex flex-col min-h-screen">
      <LoadingIndicator isLoading={isLoading} />
      
      {!isLoading && (
        <>
          {/* Cosmic animated background */}
          <CosmicBackground />
          
          <Header currentLanguage={language} onLanguageChange={handleLanguageChange} />
          <Navbar currentLanguage={language} />
          
          <main className="flex-grow relative z-10">
            {/* Hero Section */}
            <Hero language={language} />
            
            {/* Mind Map Home Section */}
            <HomePage currentLanguage={language} onLanguageChange={handleLanguageChange} />
            
            {/* Other sections */}
            <About language={language} />
            <Projects language={language} />
            <Contact language={language} />
          </main>
          
          <Footer language={language} />
        </>
      )}
    </div>
  );
};

export default App;