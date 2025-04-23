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
 * Utility functions for working with D3 transitions and animations
 */
export const transitions = {
  duration: {
    fast: 200,
    medium: 500,
    slow: 800
  },
  
  // Fade in transition for D3 selections
  fadeIn: (selection, duration = 500, delay = 0) => {
    selection
      .transition()
      .delay(delay)
      .duration(duration)
      .style('opacity', 1);
  },
  
  // Apply staggered animations to elements in a selection
  stagger: (selection, callback, staggerDelay = 50) => {
    selection.each(function(d, i) {
      callback(d3.select(this), i * staggerDelay);
    });
  },
  
  // Create a continuous pulsing animation
  pulse: (selection, minOpacity = 0.4, maxOpacity = 0.8, duration = 1500) => {
    selection
      .transition()
      .duration(duration)
      .attr('opacity', minOpacity)
      .transition()
      .duration(duration)
      .attr('opacity', maxOpacity)
      .on('end', function() {
        transitions.pulse(d3.select(this), minOpacity, maxOpacity, duration);
      });
  }
};

/**
 * Create and configure D3 force simulation
 * @param {Array} nodes - Array of node objects
 * @param {Array} links - Array of link objects
 * @param {number} width - Container width
 * @param {number} height - Container height
 * @returns {Object} - D3 force simulation
 */
export const createForceSimulation = (nodes, links, width, height) => {
  return d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(width / 2).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1))
    .force("collision", d3.forceCollide().radius(d => d.radius * 1.2));
};

/**
 * Configure forces for mind map visualization
 * @param {Object} simulation - D3 force simulation
 * @param {Object} options - Force configuration options
 * @returns {Object} - Updated simulation
 */
export const configureMindMapForces = (simulation, options = {}) => {
  const {
    linkDistance = 100,
    chargeStrength = -300,
    verticalSpread = 1.2 // Higher values = more vertical spread
  } = options;
  
  // Configure forces
  simulation.force("charge")
    .strength(d => {
      if (d.type === "main") return chargeStrength * 1.5;
      if (d.type === "category") return chargeStrength * 1.2;
      return chargeStrength;
    });
  
  simulation.force("link")
    .distance(d => {
      if (d.source.type === "main" && d.target.type === "category") {
        return linkDistance * 1.5;
      }
      if (d.source.type === "category" && d.target.type === "detail") {
        return linkDistance;
      }
      return linkDistance * 0.8;
    });
  
  // Add y force with different strength to create more vertical spread
  simulation.force("y")
    .strength(d => {
      if (d.type === "main") return 0.1;
      if (d.type === "category") return 0.05 * verticalSpread;
      return 0.02 * verticalSpread;
    });
  
  return simulation;
};

/**
 * Apply drag behavior to nodes
 * @param {Object} simulation - D3 force simulation
 * @param {Selection} selection - D3 selection of node elements
 */
export const applyDragBehavior = (simulation, selection) => {
  const drag = d3.drag()
    .on('start', (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on('drag', (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on('end', (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      // Keep node in place after dragging ends
      // Remove this to allow nodes to continue moving
      // d.fx = null;
      // d.fy = null;
    });
  
  selection.call(drag);
  
  return drag;
};