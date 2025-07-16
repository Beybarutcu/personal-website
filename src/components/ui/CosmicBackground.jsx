// src/components/ui/CosmicBackground.jsx
import React, { useEffect, useRef, useState } from 'react';

const CosmicBackground = () => {
  const canvasRef = useRef(null);
  const scrollLayerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Fixed background layer (half of the stars with subtle parallax)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Star properties - HALVED the count for the fixed layer
    const stars = [];
    const starCount = Math.floor(window.innerWidth * window.innerHeight / 30000); // Reduced by half
    
    // Create stars for the fixed layer (smaller, more distant stars)
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 0.8 + 0.3, // SMALLER stars for fixed layer
        opacity: Math.random() * 0.7 + 0.2, // Slightly less visible
        pulse: Math.random() * 0.01 + 0.005, // Slow pulse
        pulseFactor: Math.random() < 0.5 ? 1 : -1,
      });
    }
    
    // Gentle parallax effect
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    const handleMouseMove = (e) => {
      // Set target mouse position - will be eased to
      targetMouseX = (e.clientX - window.innerWidth / 2) / 250; 
      targetMouseY = (e.clientY - window.innerHeight / 2) / 250;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Ease mouse movement (smooth interpolation)
      mouseX += (targetMouseX - mouseX) * 0.02; // Very slow easing
      mouseY += (targetMouseY - mouseY) * 0.02;
      
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f172a'); // dark blue-gray
      gradient.addColorStop(1, '#0f1729'); // slightly darker blue-gray
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw fixed stars with slow pulse effect
      stars.forEach(star => {
        // Update opacity for pulse effect
        star.opacity += star.pulse * star.pulseFactor * 0.5;
        
        // Reverse pulse direction when reaching opacity limits
        if (star.opacity > 0.9) {
          star.opacity = 0.9;
          star.pulseFactor = -1;
        } else if (star.opacity < 0.3) {
          star.opacity = 0.3;
          star.pulseFactor = 1;
        }
        
        // Apply subtle parallax effect based on mouse position
        const parallaxX = star.x + mouseX * (star.radius);
        const parallaxY = star.y + mouseY * (star.radius);
        
        // Draw star
        ctx.beginPath();
        ctx.arc(
          parallaxX,
          parallaxY,
          star.radius,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        // Add subtle glow to larger stars
        if (star.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(
            parallaxX,
            parallaxY,
            star.radius * 2,
            0,
            Math.PI * 2
          );
          const glow = ctx.createRadialGradient(
            parallaxX, parallaxY, star.radius * 0.5,
            parallaxX, parallaxY, star.radius * 2
          );
          glow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.3})`);
          glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = glow;
          ctx.fill();
        }
      });
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  // Scrollable layer effects (comets and half the stars)
  useEffect(() => {
    const scrollLayer = scrollLayerRef.current;
    if (!scrollLayer) return;
    
    // Initialize the DOM-based stars for the scrollable layer
    const initScrollStars = () => {
      // Create stars for the scrollable layer - smaller and closer stars that move with scroll
      const starCount = Math.floor(window.innerWidth * window.innerHeight / 25000);
      
      for (let i = 0; i < starCount; i++) {
        const size = Math.random() * 1.2 + 0.4; // Slightly smaller stars for scrolling layer
        const opacity = Math.random() * 0.9 + 0.1;
        
        const star = document.createElement('div');
        star.className = 'scroll-star absolute rounded-full bg-white pointer-events-none';
        
        // Position the star randomly
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 300}vh`; // Spread throughout scrollable area
        star.style.opacity = opacity;
        
        // Add subtle glow for larger stars
        if (size > 1) {
          star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity * 0.5})`;
        }
        
        // Add pulse animation with random duration and delay
        const animDuration = 2 + Math.random() * 3;
        const animDelay = Math.random() * 5;
        star.style.animation = `starPulse ${animDuration}s ease-in-out ${animDelay}s infinite alternate`;
        
        // Add to scrollLayer
        scrollLayer.appendChild(star);
      }
    };
    
    // Track scroll position
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initialize stars
    initScrollStars();
    
    // Generate initial comets
    const createInitialComets = () => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => createComet(scrollLayer), i * 800);
      }
    };
    
    createInitialComets();
    
    // Create comets periodically
    const cometInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to create a comet
        createComet(scrollLayer);
      }
    }, 5000);
    
    // Handle window resize for scrollable stars
    const handleResize = () => {
      // Remove all existing stars
      const scrollStars = scrollLayer.querySelectorAll('.scroll-star');
      scrollStars.forEach(star => star.remove());
      
      // Reinitialize with new dimensions
      initScrollStars();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll, { passive: true });
      window.removeEventListener('resize', handleResize, { passive: true });
      clearInterval(cometInterval);
    };
  }, []);
  
  // Function to create a comet element
  const createComet = (container) => {
    if (!container) return;
    
    const comet = document.createElement('div');
    comet.className = 'absolute bg-white rounded-full opacity-0 pointer-events-none';
    
    // Random properties for the comet with enhanced values
    const size = 2 + Math.random() * 3;
    const angle = Math.PI / 4 + (Math.random() * Math.PI / 4); // Angle between π/4 and π/2
    const duration = 2 + Math.random() * 3; // 2-5 seconds
    const delay = Math.random() * 5; // 0-5 seconds for more organic timing
    
    // Position the comet relative to viewport
    const startX = Math.random() * 100;
    const startY = -10;
    
    // Enhanced style for the comet with better glow effect
    comet.style.width = `${size}px`;
    comet.style.height = `${size}px`;
    comet.style.left = `${startX}vw`;
    comet.style.top = `${startY}vh`;
    comet.style.boxShadow = `0 0 20px 2px rgba(255, 255, 255, 0.8), 0 0 30px 10px rgba(255, 255, 255, 0.5)`;
    comet.style.zIndex = '1';
    
    // Animation with cubic-bezier for smoother motion
    comet.style.animation = `cometEnhanced ${duration}s cubic-bezier(0.4, 0.0, 0.2, 1) ${delay}s forwards`;
    comet.style.transform = `rotate(${angle}rad)`;
    
    // Add to DOM
    container.appendChild(comet);
    
    // Clean up after animation
    setTimeout(() => {
      comet.remove();
    }, (duration + delay) * 1000);
  };
  
  return (
    <>
      {/* Fixed background layer */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Scrollable effects layer */}
      <div 
        ref={scrollLayerRef}
        className="absolute inset-0 z-0 w-full"
        style={{ 
          height: '100%', 
          pointerEvents: 'none',
          minHeight: '300vh', // Ensure there's space for scrolling stars
          position: 'absolute',
          top: 0,
          left: 0
        }}
      ></div>
      
      {/* CSS for animations */}
      <style>{`
        @keyframes cometEnhanced {
          0% {
            opacity: 0;
            transform: rotate(45deg) translateX(-10vw) translateY(-10vh);
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: rotate(45deg) translateX(110vw) translateY(110vh);
          }
        }
        
        @keyframes starPulse {
          0% {
            opacity: var(--base-opacity, 0.5);
            transform: scale(1);
          }
          100% {
            opacity: var(--max-opacity, 1);
            transform: scale(1.2);
          }
        }
      `}</style>
    </>
  );
};

export default CosmicBackground;