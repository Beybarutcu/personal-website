// src/utils/cosmicMapUtils.js
import * as d3 from 'd3';

/**
 * Utilities for the cosmic mind map visualization
 */

// Safely get node label from i18n
export const getNodeLabel = (t, node) => {
  if (!node || !node.label) return '';
  
  // Use i18n to get the node label
  return t(`mindMap.nodes.${node.label}.label`, node.label);
};

// Get connected nodes from a nodeId
export const getConnectedNodes = (nodeId, links) => {
  if (!nodeId) return new Set();
  
  const connected = new Set([nodeId]);
  
  links.forEach(link => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    
    if (sourceId === nodeId) connected.add(targetId);
    if (targetId === nodeId) connected.add(sourceId);
  });
  
  return connected;
};

// Create star background pattern
export const createStarBackground = (defs, patternId = 'starField', options = {}) => {
  const {
    width = 1000,
    height = 1000,
    starCount = 800,
    maxRadius = 0.8,
    minOpacity = 0.1,
    maxOpacity = 0.7
  } = options;
  
  // Create a star field pattern
  const starPattern = defs.append('pattern')
    .attr('id', patternId)
    .attr('width', width)
    .attr('height', height)
    .attr('patternUnits', 'userSpaceOnUse');
  
  // Generate stars in the background
  for (let i = 0; i < starCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * maxRadius;
    const opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
    
    starPattern.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', radius)
      .attr('fill', 'white')
      .attr('opacity', opacity);
  }
  
  return starPattern;
};

// Set up force simulation with custom forces
export const createForceSimulation = (nodes, links, dimensions, options = {}) => {
  const {
    linkDistance = 120,
    linkStrength = 0.6,
    chargeStrength = -500,
    collisionRadius = 2.5
  } = options;
  
  // Create simulation
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink()
      .id(d => d.id)
      .links(links)
      .distance(d => linkDistance + d.weight * 30)
      .strength(linkStrength))
    .force('charge', d3.forceManyBody().strength(chargeStrength))
    .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2).strength(0.1))
    .force('collision', d3.forceCollide().radius(d => (d.size || 15) * collisionRadius));
  
  // Add positioning forces to spread nodes by type
  const nodeTypes = ['main', 'skills', 'interests', 'education', 'projects'];
  
  // X force positions different types horizontally
  simulation.force('x', d3.forceX().strength(0.1).x(d => {
    const typeIndex = nodeTypes.indexOf(d.type);
    if (typeIndex === -1) return dimensions.width / 2;
    
    // Position clusters at different areas of the screen
    switch(d.type) {
      case 'main':
        return dimensions.width / 2;
      case 'skills':
        return dimensions.width * 0.25;
      case 'interests':
        return dimensions.width * 0.75;
      case 'education':
        return dimensions.width * 0.4;
      case 'projects':
        return dimensions.width * 0.6;
      default:
        return dimensions.width / 2;
    }
  }));
  
  // Y force positions different types vertically
  simulation.force('y', d3.forceY().strength(0.1).y(d => {
    const typeIndex = nodeTypes.indexOf(d.type);
    if (typeIndex === -1) return dimensions.height / 2;
    
    // Position clusters at different areas of the screen
    switch(d.type) {
      case 'main':
        return dimensions.height / 2;
      case 'skills':
        return dimensions.height * 0.3;
      case 'interests':
        return dimensions.height * 0.3;
      case 'education':
        return dimensions.height * 0.7;
      case 'projects':
        return dimensions.height * 0.7;
      default:
        return dimensions.height / 2;
    }
  }));
  
  return simulation;
};

// Keep nodes within bounds with padding
export const applyBoundaryForces = (nodes, dimensions, padding = 80) => {
  nodes.forEach(d => {
    d.x = Math.max(padding, Math.min(dimensions.width - padding, d.x));
    d.y = Math.max(padding, Math.min(dimensions.height - padding, d.y));
  });
};

// Drag behavior for nodes
export const createDragBehavior = (simulation) => {
  return d3.drag()
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
      d.fx = null;
      d.fy = null;
    });
};

// Create animation for signals traveling along connections
export class SignalAnimator {
  constructor(svgGroup, links, nodes) {
    this.signalsGroup = svgGroup;
    this.links = links;
    this.nodes = nodes;
    this.activeNodeId = null;
    this.animationFrameId = null;
  }
  
  setActiveNode(nodeId) {
    this.activeNodeId = nodeId;
  }
  
  // Start animation loop
  start() {
    this.animate();
  }
  
  // Stop animation loop
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  // Animation loop
  animate = () => {
    // Remove old signals that have completed their journey
    this.signalsGroup.selectAll('.signal')
      .filter(function() {
        return parseFloat(d3.select(this).attr('opacity')) <= 0.1;
      })
      .remove();
    
    // Create new signals occasionally
    if (this.activeNodeId && Math.random() < 0.04) {
      // Filter to get active links connected to the active node
      const activeLinks = this.links.filter(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return sourceId === this.activeNodeId || targetId === this.activeNodeId;
      });
      
      // Randomly select an active link
      if (activeLinks.length > 0) {
        const randomLink = activeLinks[Math.floor(Math.random() * activeLinks.length)];
        
        // Determine source and target for the signal
        const sourceId = typeof randomLink.source === 'object' ? randomLink.source.id : randomLink.source;
        const isSourceActive = sourceId === this.activeNodeId;
        
        const sourceNode = isSourceActive ? 
          (typeof randomLink.source === 'object' ? randomLink.source : this.nodes.find(n => n.id === sourceId)) : 
          (typeof randomLink.target === 'object' ? randomLink.target : this.nodes.find(n => n.id === randomLink.target));
          
        const targetNode = isSourceActive ? 
          (typeof randomLink.target === 'object' ? randomLink.target : this.nodes.find(n => n.id === randomLink.target)) : 
          (typeof randomLink.source === 'object' ? randomLink.source : this.nodes.find(n => n.id === sourceId));
        
        if (sourceNode && targetNode) {
          // Create a signal with gradient-based light
          this.signalsGroup.append('circle')
            .attr('class', 'signal')
            .attr('cx', sourceNode.x)
            .attr('cy', sourceNode.y)
            .attr('r', 1.5)
            .attr('fill', 'rgba(255, 255, 255, 0.9)') // Brighter center
            .attr('opacity', 0.85)
            .datum({
              source: sourceNode,
              target: targetNode,
              progress: 0,
              speed: 0.004 + Math.random() * 0.006
            });
        }
      }
    }
    
    // Create occasional ambient signals on other links
    if (Math.random() < 0.012) {
      const inactiveLinks = this.links.filter(link => {
        if (!this.activeNodeId) return true;
        
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return sourceId !== this.activeNodeId && targetId !== this.activeNodeId;
      });
      
      if (inactiveLinks.length > 0) {
        const randomLink = inactiveLinks[Math.floor(Math.random() * inactiveLinks.length)];
        
        // Random direction for ambient signals
        const direction = Math.random() > 0.5;
        
        const sourceNode = direction ? 
          (typeof randomLink.source === 'object' ? randomLink.source : this.nodes.find(n => n.id === randomLink.source)) : 
          (typeof randomLink.target === 'object' ? randomLink.target : this.nodes.find(n => n.id === randomLink.target));
          
        const targetNode = direction ? 
          (typeof randomLink.target === 'object' ? randomLink.target : this.nodes.find(n => n.id === randomLink.target)) : 
          (typeof randomLink.source === 'object' ? randomLink.source : this.nodes.find(n => n.id === randomLink.source));
        
        if (sourceNode && targetNode) {
          this.signalsGroup.append('circle')
            .attr('class', 'signal ambient')
            .attr('cx', sourceNode.x)
            .attr('cy', sourceNode.y)
            .attr('r', 1)
            .attr('fill', 'rgba(255, 255, 255, 0.7)') // Slightly dimmer
            .attr('opacity', 0.5)
            .datum({
              source: sourceNode,
              target: targetNode,
              progress: 0,
              speed: 0.002 + Math.random() * 0.004
            });
        }
      }
    }
    
    // Animate existing signals
    this.signalsGroup.selectAll('.signal')
      .each(function(d) {
        d.progress += d.speed;
        
        // If signal completes journey, start fading out
        if (d.progress >= 1) {
          d3.select(this).attr('opacity', function() {
            const currentOpacity = parseFloat(d3.select(this).attr('opacity'));
            return Math.max(0.1, currentOpacity - 0.03);
          });
          return;
        }
        
        // Calculate interpolated position
        const x = d.source.x + (d.target.x - d.source.x) * d.progress;
        const y = d.source.y + (d.target.y - d.source.y) * d.progress;
        
        // Update signal position
        d3.select(this)
          .attr('cx', x)
          .attr('cy', y);
      });
    
    // Continue animation loop
    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}