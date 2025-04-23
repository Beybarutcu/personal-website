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
 * Utility functions for force-directed graphs
 */
export const forceGraph = {
  // Create and configure a force simulation
  createSimulation: (nodes, links, width, height) => {
    return d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      .force("collision", d3.forceCollide().radius(d => d.radius * 1.2));
  },
  
  // Configure forces with specific settings for interest cluster
  configureClusterForces: (simulation, options = {}) => {
    const {
      linkDistance = 100,
      linkStrength = 0.7,
      chargeStrength = -300,
      centerStrength = 0.1,
      xStrength = 0.1,
      yStrength = 0.1,
      collisionStrength = 0.7
    } = options;
    
    simulation.force("link")
      .distance(d => {
        // Custom distance based on node types
        if (d.source.type === "main" && d.target.type === "category") return linkDistance * 1.5;
        if (d.source.type === "category" && d.target.type === "detail") return linkDistance;
        return linkDistance * 0.8;
      })
      .strength(linkStrength);
    
    simulation.force("charge")
      .strength(d => {
        // Custom charge based on node type
        if (d.type === "main") return chargeStrength * 2;
        if (d.type === "category") return chargeStrength * 1.5;
        return chargeStrength;
      });
    
    simulation.force("center").strength(centerStrength);
    simulation.force("x").strength(xStrength);
    simulation.force("y").strength(yStrength);
    simulation.force("collision").strength(collisionStrength);
    
    return simulation;
  },
  
  // Apply constraints to keep nodes within bounds
  applyBoundaryForces: (nodes, width, height, padding = 20) => {
    nodes.forEach(node => {
      // Apply constraints
      const r = node.radius + padding;
      if (node.x < r) node.x = r;
      if (node.x > width - r) node.x = width - r;
      if (node.y < r) node.y = r;
      if (node.y > height - r) node.y = height - r;
    });
  },
  
  // Set initial positions for nodes in a more structured way
  setInitialPositions: (nodes, width, height) => {
    const mainNode = nodes.find(node => node.type === "main");
    const categoryNodes = nodes.filter(node => node.type === "category");
    const detailNodes = nodes.filter(node => node.type === "detail");
    
    // Center main node
    if (mainNode) {
      mainNode.x = width / 2;
      mainNode.y = height / 2;
      mainNode.fx = width / 2; // Fix position initially
      mainNode.fy = height / 2;
      
      // Release after simulation has settled
      setTimeout(() => {
        mainNode.fx = null;
        mainNode.fy = null;
      }, 2000);
    }
    
    // Arrange categories in a circle around main node
    const radius = Math.min(width, height) * 0.25;
    categoryNodes.forEach((node, i) => {
      const angle = (i / categoryNodes.length) * 2 * Math.PI;
      node.x = width / 2 + radius * Math.cos(angle);
      node.y = height / 2 + radius * Math.sin(angle);
    });
    
    // Position detail nodes near their categories
    detailNodes.forEach(node => {
      const parent = categoryNodes.find(cat => cat.id === node.category);
      if (parent) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = 70 + Math.random() * 30;
        node.x = parent.x + distance * Math.cos(angle);
        node.y = parent.y + distance * Math.sin(angle);
      } else {
        // If no parent, position randomly
        node.x = Math.random() * width;
        node.y = Math.random() * height;
      }
    });
    
    return nodes;
  }
};
