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
  const [fadeOut, setFadeOut] = useState(false);
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
  // Handle intro animation timing with smooth transition
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 1800); // Start fade out after all signals complete

    const timer2 = setTimeout(() => {
      setLoading(false);
    }, 2100); // Complete removal with enough buffer for all animations
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  
  // Show intro animation
  if (loading) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out
        ${fadeOut ? 'opacity-0' : 'opacity-100'}
        bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950
        before:absolute before:inset-0 before:bg-[radial-gradient(circle,rgba(var(--color-primary),0.08)_0%,transparent_70%)]`}>
        <div className="relative">
          <LoadingIndicator size={250} />
        </div>
      </div>
    );
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
      
      {/* Main content - Make sure section IDs match navigation targets */}
      <main className="flex-grow pt-16">
        <section id="home">
          <Hero />
        </section>
        <section id="portfolio" className="portfolio-section">
          <InteractivePortfolio />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      
      {/* Footer */}
      <Footer language={language} />
    </div>
  );
}

export default App;