// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';

// Section Components
import Hero from './components/sections/Hero';
import InteractivePortfolio from './components/sections/InteractivePortfolio/InteractivePortfolio';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';

// UI Components
import LoadingIndicator from './components/ui/LoadingIndicator';
import CosmicBackground from './components/ui/CosmicBackground';

function App() {
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const { i18n } = useTranslation();
  
  // Handle language switch
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    
    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
  };
  
  // Initialize with stored language preference
  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage) {
      setLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);
  
  // Simulate loading time
  useEffect(() => {
    // Show loading for at least 1.5 seconds to make loading animation visible
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return <LoadingIndicator isLoading={loading} />;
  }
  
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Cosmic animated background */}
      <CosmicBackground />
      
      {/* Fixed navigation */}
      <Header 
        currentLanguage={language} 
        onLanguageChange={handleLanguageChange} 
      />
      <Navbar currentLanguage={language} />
      
      {/* Main content - Rearranged to put EnhancedMindMapSection right after Hero */}
      <main className="flex-grow pt-16">
        <Hero language={language} />
        <section className="portfolio-section">
          <InteractivePortfolio />
        </section>
        <About language={language} />
        <Projects language={language} />
        <Contact language={language} />
      </main>
      
      {/* Footer */}
      <Footer language={language} />
    </div>
  );
}

export default App;