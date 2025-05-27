// src/components/ui/LoadingIndicator.jsx
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const LoadingIndicator = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // More realistic and faster loading phases
  const phases = [
    { label: "Initializing portfolio", duration: 200 },
    { label: "Loading interactive elements", duration: 250 },
    { label: "Preparing mind map", duration: 300 },
    { label: "Welcome!", duration: 150 }
  ];
  
  useEffect(() => {
    if (!isLoading) return;
    
    let currentProgress = 0;
    let phaseIndex = 0;
    const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0);
    
    const updateProgress = () => {
      const increment = 100 / (totalDuration / 20); // Update every 20ms
      currentProgress += increment;
      setProgress(Math.min(currentProgress, 100));
      
      // Update phase based on progress
      const progressPerPhase = 100 / phases.length;
      const newPhaseIndex = Math.min(
        Math.floor(currentProgress / progressPerPhase),
        phases.length - 1
      );
      
      if (newPhaseIndex !== phaseIndex) {
        setCurrentPhase(newPhaseIndex);
        phaseIndex = newPhaseIndex;
      }
      
      if (currentProgress >= 100) {
        setIsComplete(true);
      }
    };
    
    const interval = setInterval(updateProgress, 20);
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  if (!isLoading) return null;
  
  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${isComplete ? 'opacity-0' : 'opacity-100'}`}
         style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white opacity-20 animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Main loading animation */}
      <div className="relative mb-8">
        {/* Outer ring with progress */}
        <div className="w-24 h-24 rounded-full border-2 border-gray-700 relative">
          {/* Progress ring */}
          <svg className="w-24 h-24 absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-orange-500"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              style={{ 
                transition: 'stroke-dashoffset 0.3s ease',
                filter: 'drop-shadow(0 0 5px rgba(249, 115, 22, 0.5))'
              }}
            />
          </svg>
          
          {/* Inner glow */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 animate-pulse" />
          </div>
        </div>
        
        {/* Floating particles around the loader */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`orbit-${i}`}
            className="absolute w-2 h-2 bg-orange-400 rounded-full animate-spin"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-40px)`,
              animationDuration: '3s',
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Loading text */}
      <div className="text-center">
        <div className="text-white text-xl font-medium mb-2 transition-all duration-300">
          {phases[currentPhase]?.label}
        </div>
        <div className="text-gray-400 text-sm font-mono">
          {Math.round(progress)}%
        </div>
      </div>
      
      {/* Subtle hint for what's coming */}
      {progress > 75 && (
        <div className="absolute bottom-16 text-center opacity-0 animate-fadeIn">
          <p className="text-gray-400 text-sm mb-2">Interactive portfolio ready</p>
          <ChevronDown className="mx-auto text-gray-400 animate-bounce" size={20} />
        </div>
      )}
    </div>
  );
};

export default LoadingIndicator;