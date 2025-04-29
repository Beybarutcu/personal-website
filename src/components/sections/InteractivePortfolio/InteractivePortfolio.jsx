// Updated InteractivePortfolio component with all final changes
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTranslation } from 'react-i18next';
import styles from './InteractivePortfolio.module.css';
import { sampleData, categoryColors } from './data';
import { 
  setupVisualizations,
  createNodeElements,
  handleNodeTransformation,
  handleNodeReturn,
  setupParticleSystem
} from './visualizationUtils';

export default function InteractivePortfolio() {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [visualization, setVisualization] = useState(null);
  
  // Get container dimensions and update on resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initial measurement
    updateDimensions();
    
    // Create a ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === containerRef.current) {
          updateDimensions();
        }
      }
    });
    
    // Start observing the container
    resizeObserver.observe(containerRef.current);
    
    // Also listen for window resize as a fallback
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Update dimensions and trigger visualization update
  const updateDimensions = () => {
    if (!containerRef.current) return;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    // Only update if dimensions have actually changed
    if (width !== dimensions.width || height !== dimensions.height) {
      setDimensions({ width, height });
    }
  };
  
  // Initialize or update visualization based on dimensions
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;
    
    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Clean up previous visualization if exists
    if (visualization) {
      if (visualization.simulation) visualization.simulation.stop();
      // Cleanup particle intervals if they exist
      if (visualization.particleInterval) clearInterval(visualization.particleInterval);
      if (visualization.motionInterval) clearInterval(visualization.motionInterval);
    }
    
    // Initialize the visualization
    const width = dimensions.width;
    const height = dimensions.height;
    
    const vis = setupVisualizations(svgRef.current, width, height, sampleData);
    
    // Create node elements (circles, etc.)
    createNodeElements(vis.nodes, styles);
    
    // Set up the particle system (now empty)
    const { particleInterval, motionInterval } = setupParticleSystem(
      vis.particleGroup, sampleData, vis.simulation
    );
    
    // Add click handler to nodes for expansion/contraction
    vis.nodes.on("click", function(event, d) {
      event.stopPropagation();
      
      // Reset any previously selected nodes
      vis.nodes.each(function(node) {
        if (node.id !== d.id && node.isSelected) {
          handleNodeReturn(d3.select(this), node, styles, vis.svg, vis.zoom);
          node.isSelected = false;
        }
      });
      
      // Determine if we're selecting or deselecting
      if (d.isSelected) {
        // Deselect - transform rectangle back to node
        d.isSelected = false;
        handleNodeReturn(d3.select(this), d, styles, vis.svg, vis.zoom);
        return;
      }
      
      // Mark this node as selected
      d.isSelected = true;
      
      // Handle node expansion
      handleNodeTransformation(d3.select(this), d, width, height, vis.svg, vis.zoom, styles);
    });
    
    // Hide content panel and reset zoom when clicking elsewhere
    vis.svg.on("click", function() {
      // Reset any selected nodes
      vis.nodes.each(function(node) {
        if (node.isSelected) {
          node.isSelected = false;
          handleNodeReturn(d3.select(this), node, styles, vis.svg, vis.zoom);
        }
      });
      
      // Reset zoom
      vis.svg.transition()
        .duration(750)
        .call(vis.zoom.transform, d3.zoomIdentity);
    });
    
    // Store the visualization for cleanup
    setVisualization({
      ...vis,
      particleInterval,
      motionInterval
    });
    
    // Fix initial positions to prevent clustering in corner
    // Start with a more distributed layout
    for (let i = 0; i < 20; i++) {
      vis.simulation.tick();
    }
    
    // Ensure nodes stay within bounds
    sampleData.nodes.forEach(node => {
      node.x = Math.max(50, Math.min(width - 50, node.x || width/2));
      node.y = Math.max(50, Math.min(height - 50, node.y || height/2));
    });
    
    // Re-center the visualization
    vis.svg.call(vis.zoom.transform, d3.zoomIdentity);
    
    return () => {
      // Cleanup when the effect is rerun or component unmounts
      if (vis.simulation) vis.simulation.stop();
      if (particleInterval) clearInterval(particleInterval);
      if (motionInterval) clearInterval(motionInterval);
    };
  }, [dimensions]);
  
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeading}>
        <h2 className="text-3xl font-bold mb-8 gradient-text-primary">{t('portfolio.title', 'Interactive Resume')}</h2>
      </div>
      <div className={styles.interactivePortfolioContainer} ref={containerRef}>
        <svg ref={svgRef} className={styles.portfolioVisualization}></svg>
      </div>
    </div>
  );
}