// src/components/ui/LoadingIndicator.jsx
import React, { useState, useEffect } from 'react';

const LoadingIndicator = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("Initializing");
  
  useEffect(() => {
    if (!isLoading) return;
    
    // Simulate loading sequence
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 25);
    
    // Update loading text
    const textSequence = [
      { time: 0, text: "Initializing" },
      { time: 20, text: "Loading assets" },
      { time: 40, text: "Building interface" },
      { time: 60, text: "Connecting space-time" },
      { time: 80, text: "Almost ready" },
      { time: 95, text: "Launching experience" }
    ];
    
    const textTimers = textSequence.map(item => {
      return setTimeout(() => {
        setText(item.text);
      }, item.time * 25);
    });
    
    return () => {
      clearInterval(progressInterval);
      textTimers.forEach(timer => clearTimeout(timer));
    };
  }, [isLoading]);
  
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900">
      {/* Star background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`loader-star-${i}`}
            className="absolute rounded-full bg-white animate-starTwinkle"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Cosmic design */}
      <div className="relative w-24 h-24 mb-8">
        {/* Spinning outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-b-white/30 animate-spin"></div>
        
        {/* Middle orbital ring */}
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-l-purple-400 border-r-blue-400 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
        
        {/* Inner core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute w-6 h-6 bg-white rounded-full animate-pulse opacity-80"></div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className="text-white text-xl font-medium mb-4">{text}...</div>
      
      {/* Progress bar */}
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Progress percentage */}
      <div className="text-gray-400 mt-2">{progress}%</div>
    </div>
  );
};

export default LoadingIndicator;