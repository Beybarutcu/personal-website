// src/utils/d3Utils.js
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * Custom hook for using D3 with React
 * @param {Function} renderFn - Function that uses D3 to render visualization
 * @param {Array} dependencies - Dependencies array for useEffect
 * @returns {Object} - Ref to attach to the DOM element
 */
export const useD3 = (renderFn, dependencies = []) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      renderFn(d3.select(ref.current));
    }
    return () => {};
  }, dependencies);

  return ref;
};

/**
 * Standard transition presets
 */
export const transitions = {
  // Standard duration values
  duration: {
    fast: 300,
    medium: 500,
    slow: 800,
    verySlow: 1500
  },
  
  // Easing functions
  easing: {
    smooth: d3.easeCubicInOut,
    bounce: d3.easeElasticOut,
    back: d3.easeBackOut,
    gentle: d3.easeQuadInOut
  },
  
  // Fade in with customizable duration
  fadeIn: (selection, duration = 500, delay = 0, opacity = 1) => {
    return selection
      .style('opacity', 0)
      .transition()
      .delay(delay)
      .duration(duration)
      .ease(d3.easeCubicOut)
      .style('opacity', opacity);
  },
  
  // Fade out
  fadeOut: (selection, duration = 300, delay = 0) => {
    return selection
      .transition()
      .delay(delay)
      .duration(duration)
      .ease(d3.easeCubicIn)
      .style('opacity', 0);
  },
  
  // Slide up with a duration
  slideUp: (selection, duration = 800, delay = 0) => {
    return selection
      .style('opacity', 0)
      .style('transform', 'translateY(20px)')
      .transition()
      .delay(delay)
      .duration(duration)
      .ease(d3.easeBackOut.overshoot(1.5))
      .style('opacity', 1)
      .style('transform', 'translateY(0)');
  },
  
  // Slide down (for menus, etc.)
  slideDown: (selection, duration = 500, delay = 0) => {
    return selection
      .style('opacity', 0)
      .style('transform', 'translateY(-20px)')
      .transition()
      .delay(delay)
      .duration(duration)
      .ease(d3.easeBackOut)
      .style('opacity', 1)
      .style('transform', 'translateY(0)');
  },
  
  // Scale in (for elements that should grow into view)
  scaleIn: (selection, duration = 500, delay = 0) => {
    return selection
      .style('opacity', 0)
      .style('transform', 'scale(0.8)')
      .transition()
      .delay(delay)
      .duration(duration)
      .ease(d3.easeBackOut)
      .style('opacity', 1)
      .style('transform', 'scale(1)');
  },
  
  // Pulse effect for elements that need attention
  pulse: (selection, minScale = 1, maxScale = 1.05, duration = 1500) => {
    (function repeat() {
      selection
        .transition()
        .duration(duration)
        .ease(d3.easeSinInOut)
        .style('transform', `scale(${maxScale})`)
        .transition()
        .duration(duration)
        .ease(d3.easeSinInOut)
        .style('transform', `scale(${minScale})`)
        .on('end', repeat);
    })();
    
    return selection;
  },
  
  // Glow effect for highlighting elements
  glow: (selection, duration = 1500, color = 'rgba(255, 255, 255, 0.8)') => {
    (function repeat() {
      selection
        .transition()
        .duration(duration)
        .ease(d3.easeSinInOut)
        .style('filter', `drop-shadow(0 0 8px ${color})`)
        .transition()
        .duration(duration)
        .ease(d3.easeSinInOut)
        .style('filter', 'drop-shadow(0 0 0px transparent)')
        .on('end', repeat);
    })();
    
    return selection;
  },
  
  // Typewriter effect for text
  typewriter: (selection, text, duration = 1500) => {
    const length = text.length;
    
    selection.text('');
    
    for (let i = 0; i < length; i++) {
      selection
        .transition()
        .delay(i * (duration / length))
        .on('start', function() {
          d3.select(this).text(d => text.substring(0, i + 1));
        });
    }
    
    return selection;
  },
  
  // Path drawing animation for SVG paths
  drawPath: (selection, duration = 1200) => {
    const length = selection.node().getTotalLength();
    
    return selection
      .attr('stroke-dasharray', length)
      .attr('stroke-dashoffset', length)
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
  },
  
  // Staggered animations for lists
  stagger: (selection, transitionFn, staggerDelay = 50) => {
    selection.each(function(d, i) {
      const node = d3.select(this);
      transitionFn(node, i * staggerDelay);
    });
    
    return selection;
  },
  
  // Cosmic twinkling effect for background stars
  twinkle: (selection, minOpacity = 0.3, maxOpacity = 1, minDuration = 2000, maxDuration = 5000) => {
    selection.each(function() {
      const star = d3.select(this);
      
      function randomDuration() {
        return Math.random() * (maxDuration - minDuration) + minDuration;
      }
      
      (function twinkle() {
        const duration = randomDuration();
        
        star
          .style('opacity', minOpacity)
          .transition()
          .duration(duration / 2)
          .ease(d3.easeSinInOut)
          .style('opacity', maxOpacity)
          .transition()
          .duration(duration / 2)
          .ease(d3.easeSinInOut)
          .style('opacity', minOpacity)
          .on('end', twinkle);
      })();
    });
    
    return selection;
  }
};

/**
 * Apply sequential animations to a selection
 * @param {d3.Selection} selection - D3 selection to animate
 * @param {Array} animationSequence - Array of animation functions
 * @returns {d3.Selection} - The original selection
 */
export const sequence = (selection, animationSequence) => {
  let lastTransition = selection;
  
  animationSequence.forEach(animFn => {
    lastTransition = animFn(lastTransition);
  });
  
  return selection;
};

/**
 * Generate a random starburst pattern
 * @param {d3.Selection} container - D3 selection of container element
 * @param {number} count - Number of particles
 * @param {Object} options - Configuration options
 */
export const createStarburst = (container, count = 20, options = {}) => {
  const defaults = {
    x: 0,
    y: 0,
    minRadius: 2,
    maxRadius: 5,
    minDistance: 30,
    maxDistance: 100,
    duration: 1000,
    colors: ['#ffffff', '#f8f8f8', '#eeeeee']
  };
  
  const config = { ...defaults, ...options };
  
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = config.minDistance + Math.random() * (config.maxDistance - config.minDistance);
    const targetX = config.x + Math.cos(angle) * distance;
    const targetY = config.y + Math.sin(angle) * distance;
    const radius = config.minRadius + Math.random() * (config.maxRadius - config.minRadius);
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    
    container.append('circle')
      .attr('cx', config.x)
      .attr('cy', config.y)
      .attr('r', radius)
      .attr('fill', color)
      .style('opacity', 1)
      .transition()
      .duration(config.duration)
      .ease(d3.easeBackOut)
      .attr('cx', targetX)
      .attr('cy', targetY)
      .style('opacity', 0)
      .remove();
  }
};
