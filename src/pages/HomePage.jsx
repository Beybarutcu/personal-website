// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../components/ui/ScrollReveal';
import Card from '../components/ui/Card';

const HomePage = ({ currentLanguage, onLanguageChange }) => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Featured Section */}
      <section className="py-12 bg-gradient-to-b from-transparent to-gray-900/30 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Star particles */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`feature-star-${i}`}
              className="absolute rounded-full bg-white animate-starTwinkle"
              style={{
                width: `${Math.random() * 2 + 0.5}px`,
                height: `${Math.random() * 2 + 0.5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.2,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 5 + 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card 
                variant="cosmic" 
                hover="glow" 
                className="md:col-span-3 text-center mb-6"
              >
                <Card.Title>
                  Creative developer building captivating digital experiences
                </Card.Title>
                <Card.Subtitle>
                  Turning complex ideas into intuitive digital solutions
                </Card.Subtitle>
              </Card>
              
              <FeaturedCard 
                icon="✨"
                title="Creative Design"
                description="Blending artistic vision with technical precision to create compelling visual experiences that captivate users."
              />
              
              <FeaturedCard 
                icon="🚀"
                title="Performance Focus"
                description="Crafting blazing-fast interfaces that prioritize optimization, responsive design, and smooth interactions."
              />
              
              <FeaturedCard 
                icon="🔍"
                title="Attention to Detail"
                description="Obsessive focus on the small touches that elevate digital experiences from good to exceptional."
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

// Custom Card for Featured Items
const FeaturedCard = ({ icon, title, description }) => {
  return (
    <Card hover="lift" shadow="cosmic" className="flex flex-col items-center text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <Card.Title>{title}</Card.Title>
      <Card.Body>{description}</Card.Body>
    </Card>
  );
};

export default HomePage;