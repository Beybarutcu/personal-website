// src/components/ui/CosmicBackground.jsx
import React, { useEffect, useRef } from 'react';

const CosmicBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Star properties
    const stars = [];
    const starCount = Math.floor(window.innerWidth * window.innerHeight / 20000); // Reduced star count
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.7 + 0.2,
        pulse: Math.random() * 0.01 + 0.005, // Much slower pulse
        pulseFactor: Math.random() < 0.5 ? 1 : -1,
      });
    }
    
    // Very gentle parallax effect
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    const handleMouseMove = (e) => {
      // Set target mouse position - will be eased to
      targetMouseX = (e.clientX - window.innerWidth / 2) / 300; // Much slower movement
      targetMouseY = (e.clientY - window.innerHeight / 2) / 300;
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
      
      // Draw stars with very slow pulse effect
      stars.forEach(star => {
        // Update opacity for pulse effect - much slower
        star.opacity += star.pulse * star.pulseFactor * 0.5;
        
        // Reverse pulse direction when reaching opacity limits
        if (star.opacity > 0.8) {
          star.opacity = 0.8;
          star.pulseFactor = -1;
        } else if (star.opacity < 0.2) {
          star.opacity = 0.2;
          star.pulseFactor = 1;
        }
        
        // Apply very subtle parallax effect based on mouse position
        const parallaxX = star.x + mouseX * (star.radius / 3);
        const parallaxY = star.y + mouseY * (star.radius / 3);
        
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
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default CosmicBackground;