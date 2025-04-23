import React, { useEffect, useRef } from 'react';

const EnhancedCosmicBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let starCount;
    
    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeStars();
    };
    
    // Initialize stars
    const initializeStars = () => {
      // Scale star count based on screen size
      starCount = Math.floor((canvas.width * canvas.height) / 15000);
      stars = [];
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.2,
          opacity: Math.random() * 0.8 + 0.2,
          pulse: Math.random() * 0.005 + 0.0025,
          pulseFactor: Math.random() < 0.5 ? 1 : -1,
          twinkleSpeed: Math.random() * 0.01 + 0.003,
          hue: Math.floor(Math.random() * 60) + 20, // Warm hues for stars
        });
      }
    };
    
    // Parallax effect
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) / 200;
      targetMouseY = (e.clientY - window.innerHeight / 2) / 200;
    };
    
    // Occasionally create shooting stars
    const SHOOTING_STAR_INTERVAL = 8000; // ms
    let lastShootingStarTime = 0;
    const shootingStars = [];
    
    const createShootingStar = (time) => {
      if (time - lastShootingStarTime > SHOOTING_STAR_INTERVAL && Math.random() < 0.3) {
        lastShootingStarTime = time;
        
        // Starting position off screen
        const startX = Math.random() * canvas.width;
        const startY = -20; // Start above the screen
        
        // Calculate angle and speed
        const angle = (Math.PI / 4) + (Math.random() * Math.PI / 8); // Angle between PI/4 and 3PI/8
        const speed = 3 + Math.random() * 5;
        
        shootingStars.push({
          x: startX,
          y: startY,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          radius: 2 + Math.random() * 1,
          trail: [],
          trailLength: 15 + Math.random() * 20,
          hue: Math.floor(Math.random() * 30) + 30, // Golden colors
          life: 1.0,
          maxTrail: 30 // Maximum length of trail
        });
      }
    };
    
    // Animation loop
    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Ease mouse movement for parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f172a'); // Darker at top
      gradient.addColorStop(1, '#111b35'); // Slightly lighter at bottom
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach(star => {
        // Update star twinkle
        star.opacity += star.pulse * star.pulseFactor;
        
        // Reverse pulse direction when reaching opacity limits
        if (star.opacity > 0.8) {
          star.opacity = 0.8;
          star.pulseFactor = -1;
        } else if (star.opacity < 0.2) {
          star.opacity = 0.2;
          star.pulseFactor = 1;
        }
        
        // Apply subtle parallax effect
        const parallaxX = star.x + mouseX * (star.radius * 2);
        const parallaxY = star.y + mouseY * (star.radius * 2);
        
        // Draw star with subtle color
        ctx.beginPath();
        ctx.arc(
          parallaxX,
          parallaxY,
          star.radius,
          0,
          Math.PI * 2
        );
        
        // Warm-colored stars using HSL
        const hue = star.hue;
        const saturation = 20 + (star.opacity * 30); // More saturation for brighter stars
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, 90%, ${star.opacity})`;
        ctx.fill();
        
        // Optional: add subtle glow to some stars
        if (star.radius > 1) {
          ctx.beginPath();
          ctx.arc(
            parallaxX,
            parallaxY,
            star.radius * 3,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, 90%, ${star.opacity * 0.2})`;
          ctx.fill();
        }
      });
      
      // Create and update shooting stars
      createShootingStar(time);
      
      // Draw and update shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        
        // Update position
        star.x += star.speedX;
        star.y += star.speedY;
        star.trail.unshift({x: star.x, y: star.y});
        
        // Limit trail length
        if (star.trail.length > star.maxTrail) {
          star.trail.pop();
        }
        
        // Draw trail
        ctx.beginPath();
        ctx.moveTo(star.trail[0].x, star.trail[0].y);
        
        // Draw shooting star with gradient
        const gradient = ctx.createLinearGradient(
          star.trail[0].x, star.trail[0].y,
          star.trail[star.trail.length - 1].x, 
          star.trail[star.trail.length - 1].y
        );
        
        gradient.addColorStop(0, `hsla(${star.hue}, 80%, 80%, ${star.life})`);
        gradient.addColorStop(1, `hsla(${star.hue}, 80%, 80%, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.radius;
        
        for (let j = 1; j < star.trail.length; j++) {
          ctx.lineTo(star.trail[j].x, star.trail[j].y);
        }
        
        ctx.stroke();
        
        // Draw head of shooting star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 80%, 80%, ${star.life})`;
        ctx.fill();
        
        // Fade out as it moves
        star.life -= 0.008;
        
        // Remove if off-screen or faded out
        if (star.y > canvas.height + 50 || star.x > canvas.width + 50 || star.life <= 0) {
          shootingStars.splice(i, 1);
        }
      }
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = window.requestAnimationFrame(animate);
    
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

export default EnhancedCosmicBackground;