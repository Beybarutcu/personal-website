// src/components/visualizations/ParticleEffect.jsx
import React, { useRef, useEffect } from 'react';
import { hexToRgba } from '../../utils/colorUtils';

const ParticleEffect = ({ 
  width = 300, 
  height = 300, 
  particleCount = 50,
  color = '#ffffff',
  speed = 1,
  opacity = 0.5,
  size = { min: 1, max: 3 },
  direction = 'outward', // 'outward', 'inward', 'clockwise', 'random'
  origin = { x: 0.5, y: 0.5 }, // normalized coordinates (0-1)
  pulse = true,
  trail = false
}) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions with proper scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    
    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        // Set particle origin to specified point
        this.x = width * origin.x;
        this.y = height * origin.y;
        
        // Calculate random angle based on direction
        this.angle = 0;
        switch(direction) {
          case 'outward':
            this.angle = Math.random() * Math.PI * 2;
            break;
          case 'inward':
            this.angle = Math.random() * Math.PI * 2;
            // We'll invert the movement in the update method
            break;
          case 'clockwise':
            // Start at a random point on a circle
            const initAngle = Math.random() * Math.PI * 2;
            const distance = Math.random() * Math.min(width, height) * 0.4;
            this.x += Math.cos(initAngle) * distance;
            this.y += Math.sin(initAngle) * distance;
            // Set angle perpendicular to center
            this.angle = initAngle + Math.PI / 2;
            break;
          case 'random':
            this.angle = Math.random() * Math.PI * 2;
            // Random starting position
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            break;
        }
        
        // Random size
        this.size = Math.random() * (size.max - size.min) + size.min;
        
        // Random speed
        this.speed = (Math.random() * 0.5 + 0.5) * speed;
        
        // Initial opacity
        this.alpha = Math.random() * opacity + 0.1;
        
        // Pulse variables (if enabled)
        if (pulse) {
          this.pulseSpeed = Math.random() * 0.02 + 0.01;
          this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
        }
        
        // Distance traveled (for timing reset)
        this.distance = 0;
        
        // Maximum distance before reset
        this.maxDistance = Math.hypot(width, height) * (Math.random() * 0.2 + 0.8);
      }
      
      update() {
        // Movement direction
        let moveX = Math.cos(this.angle) * this.speed;
        let moveY = Math.sin(this.angle) * this.speed;
        
        // Adjust for inward movement
        if (direction === 'inward') {
          moveX *= -1;
          moveY *= -1;
        }
        
        // Update position
        this.x += moveX;
        this.y += moveY;
        
        // Update distance traveled
        this.distance += this.speed;
        
        // Pulsing effect
        if (pulse) {
          this.alpha += this.pulseSpeed * this.pulseDirection;
          
          // Reverse direction if reaching bounds
          if (this.alpha > opacity || this.alpha < 0.1) {
            this.pulseDirection *= -1;
          }
        }
        
        // Reset particle if it's gone too far
        if (this.distance > this.maxDistance) {
          this.reset();
          this.distance = 0;
        }
      }
      
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, this.alpha);
        ctx.fill();
        
        // Draw trail if enabled
        if (trail) {
          const trailLength = 5; // Number of trail segments
          for (let i = 1; i <= trailLength; i++) {
            const trailX = this.x - Math.cos(this.angle) * this.speed * i;
            const trailY = this.y - Math.sin(this.angle) * this.speed * i;
            const trailSize = this.size * (1 - i / (trailLength + 1));
            const trailAlpha = this.alpha * (1 - i / trailLength);
            
            ctx.beginPath();
            ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
            ctx.fillStyle = hexToRgba(color, trailAlpha);
            ctx.fill();
          }
        }
      }
    }
    
    // Create particles
    const particles = Array.from({ length: particleCount }, () => new Particle());
    
    // Animation loop
    let animationId;
    const animate = () => {
      // Clear canvas with a slight fade effect for trails
      if (trail) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [width, height, particleCount, color, speed, opacity, size, direction, origin, pulse, trail]);
  
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ width, height }}
    />
  );
};

export default ParticleEffect;