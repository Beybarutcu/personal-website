import { useState, useEffect } from 'react';

const CosmicIntro = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-xl bg-gray-900 flex items-center justify-center">
      {/* Background stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>
      
      {/* Cosmic orbs */}
      <div 
        className="absolute w-64 h-64 rounded-full bg-purple-500/20 blur-3xl animate-float-y"
        style={{
          top: '30%',
          left: '20%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      <div 
        className="absolute w-48 h-48 rounded-full bg-blue-500/20 blur-3xl animate-float-x"
        style={{
          bottom: '20%',
          right: '25%'
        }}
      />
      
      {/* Main content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${loaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Welcome to My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Cosmic</span> Portfolio
        </h2>
        <p className="text-gray-300 max-w-lg mx-auto mb-6">
          Explore my universe of design, code, and creativity through this interactive journey.
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="#portfolio" 
            className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
          >
            Explore Projects
          </a>
          <a 
            href="#contact" 
            className="px-6 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-white hover:bg-purple-500/30 transition-all"
          >
            Get in Touch
          </a>
        </div>
      </div>
      
      {/* Animated circles */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={`dot-${i}`}
            className="w-2 h-2 rounded-full bg-white opacity-70 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default CosmicIntro;