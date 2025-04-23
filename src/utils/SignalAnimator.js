// src/utils/SignalAnimator.js
import * as d3 from 'd3';

/**
 * Class to handle signal animations along the links in the mind map
 */
export class SignalAnimator {
  constructor(svgGroup, links, nodes) {
    this.signalsGroup = svgGroup;
    this.links = links;
    this.nodes = nodes;
    this.activeNodeId = null;
    this.animationFrameId = null;
    this.pulsatingNodes = null; // Reference to pulsating nodes
    this.nodeGlows = null; // Reference to node glows
    this.signalFrequency = 0.04; // Probability of creating a new signal on active links
    this.ambientFrequency = 0.012; // Probability of creating ambient signals
  }
  
  /**
   * Set the active node for signal animations
   * @param {string} nodeId - ID of the active node
   */
  setActiveNode(nodeId) {
    this.activeNodeId = nodeId;
  }
  
  /**
   * Set references to node elements for animation
   * @param {Selection} pulsatingNodes - D3 selection of pulsating node elements
   * @param {Selection} nodeGlows - D3 selection of node glow elements
   */
  setNodeReferences(pulsatingNodes, nodeGlows) {
    this.pulsatingNodes = pulsatingNodes;
    this.nodeGlows = nodeGlows;
  }
  
  /**
   * Configure animation settings
   * @param {Object} options - Configuration options
   */
  configure(options = {}) {
    this.signalFrequency = options.signalFrequency || this.signalFrequency;
    this.ambientFrequency = options.ambientFrequency || this.ambientFrequency;
  }
  
  /**
   * Start the animation loop
   */
  start() {
    this.animate();
  }
  
  /**
   * Stop the animation loop
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * Main animation loop
   */
  animate = () => {
    // Remove old signals that have completed their journey
    this.signalsGroup.selectAll('.signal')
      .filter(function() {
        return parseFloat(d3.select(this).attr('opacity')) <= 0.1;
      })
      .remove();
    
    // Create new signals occasionally
    if (this.activeNodeId && Math.random() < this.signalFrequency) {
      this.createActiveSignal();
    }
    
    // Create occasional ambient signals on other links
    if (Math.random() < this.ambientFrequency) {
      this.createAmbientSignal();
    }
    
    // Animate existing signals
    this.updateExistingSignals();
    
    // Animate pulsating nodes if available
    this.animatePulsatingNodes();
    
    // Continue animation loop
    this.animationFrameId = requestAnimationFrame(this.animate);
  };
  
  /**
   * Create a signal traveling from the active node
   */
  createActiveSignal() {
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
  
  /**
   * Create ambient signals on random links
   */
  createAmbientSignal() {
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
  
  /**
   * Update the animation of existing signals
   */
  updateExistingSignals() {
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
  }
  
  /**
   * Animate the pulsating effect for nodes
   */
  animatePulsatingNodes() {
    // Pulsate effect for active node
    if (this.pulsatingNodes) {
      this.pulsatingNodes
        .filter(d => d.id === this.activeNodeId)
        .attr('opacity', function() {
          const baseOpacity = 0.5;
          const pulseRange = 0.2;
          return baseOpacity + pulseRange * Math.sin(Date.now() * 0.002);
        });
    }
    
    // More subtle ambient pulsing for all node glows
    if (this.nodeGlows) {
      this.nodeGlows
        .attr('opacity', d => {
          if (d.id === this.activeNodeId) {
            return 0.6 + 0.15 * Math.sin(Date.now() * 0.0015);
          }
          
          // Find if connected to active node
          const isConnected = this.links.some(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            return (sourceId === this.activeNodeId && targetId === d.id) || 
                  (targetId === this.activeNodeId && sourceId === d.id);
          });
          
          if (isConnected) {
            return 0.4 + 0.08 * Math.sin(Date.now() * 0.0008 + d.id.charCodeAt(0));
          }
          
          return 0.2 + 0.05 * Math.sin(Date.now() * 0.0004 + d.id.charCodeAt(0));
        });
    }
  }
  
  /**
   * Create a special signal effect between two specific nodes
   * @param {string} sourceId - ID of source node
   * @param {string} targetId - ID of target node
   * @param {Object} options - Customization options
   */
  createSpecialSignal(sourceId, targetId, options = {}) {
    const sourceNode = this.nodes.find(n => n.id === sourceId);
    const targetNode = this.nodes.find(n => n.id === targetId);
    
    if (!sourceNode || !targetNode) return;
    
    const {
      radius = 2,
      color = 'rgba(255, 255, 255, 0.95)',
      opacity = 1,
      speed = 0.006
    } = options;
    
    // Create a larger, brighter signal
    this.signalsGroup.append('circle')
      .attr('class', 'signal special')
      .attr('cx', sourceNode.x)
      .attr('cy', sourceNode.y)
      .attr('r', radius)
      .attr('fill', color)
      .attr('opacity', opacity)
      .datum({
        source: sourceNode,
        target: targetNode,
        progress: 0,
        speed: speed
      });
      
    // Optional: create a glowing trail
    if (options.trail) {
      this.signalsGroup.append('circle')
        .attr('class', 'signal-trail')
        .attr('cx', sourceNode.x)
        .attr('cy', sourceNode.y)
        .attr('r', radius * 2)
        .attr('fill', color)
        .attr('opacity', opacity * 0.3)
        .style('filter', 'blur(2px)')
        .datum({
          source: sourceNode,
          target: targetNode,
          progress: 0,
          speed: speed * 0.9
        });
    }
  }
  
  /**
   * Highlight a specific connection between nodes
   * @param {string} sourceId - ID of source node
   * @param {string} targetId - ID of target node
   * @param {Object} options - Customization options
   */
  highlightConnection(sourceId, targetId, options = {}) {
    const {
      duration = 1000,
      pulseCount = 3,
      color = 'rgba(255, 255, 255, 0.8)'
    } = options;
    
    // Find the link between these nodes
    const link = this.links.find(link => {
      const s = typeof link.source === 'object' ? link.source.id : link.source;
      const t = typeof link.target === 'object' ? link.target.id : link.target;
      return (s === sourceId && t === targetId) || (s === targetId && t === sourceId);
    });
    
    if (!link) return;
    
    // Create highlight overlay for this link
    const linkSelection = d3.selectAll('line')
      .filter(function(d) {
        if (!d) return false;
        const s = typeof d.source === 'object' ? d.source.id : d.source;
        const t = typeof d.target === 'object' ? d.target.id : d.target;
        return (s === sourceId && t === targetId) || (s === targetId && t === sourceId);
      });
    
    // Pulse the link
    const startTime = Date.now();
    const pulseInterval = duration / pulseCount;
    
    const pulseLink = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) return;
      
      const phase = (elapsed % pulseInterval) / pulseInterval;
      const opacity = 0.3 + 0.7 * Math.sin(phase * Math.PI);
      
      linkSelection
        .attr('stroke', color)
        .attr('stroke-opacity', opacity)
        .attr('stroke-width', link.weight * 1.5);
      
      requestAnimationFrame(pulseLink);
    };
    
    pulseLink();
    
    // Reset after duration
    setTimeout(() => {
      linkSelection
        .attr('stroke', 'rgba(255, 255, 255, 0.2)')
        .attr('stroke-opacity', link.weight * 0.3 + 0.15)
        .attr('stroke-width', link.weight * 0.8);
    }, duration);
  }
}

export default SignalAnimator;