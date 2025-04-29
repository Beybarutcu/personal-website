// src/components/sections/InteractivePortfolio/InteractivePortfolio.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTranslation } from 'react-i18next';
import styles from './InteractivePortfolio.module.css';
import { sampleData, categoryColors } from './data';
import { 
  setupVisualizations,
  createNodeElements,
  setupTooltip,
  handleNodeTransformation,
  handleNodeReturn,
  setupParticleSystem
} from './visualizationUtils';

export default function InteractivePortfolio() {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Get dimensions
    const containerWidth = svgRef.current.clientWidth || 800;
    const containerHeight = svgRef.current.clientHeight || 600;
    
    // Initialize the visualization
    const { 
      svg, 
      zoom,
      nodeGroup, 
      linkGroup, 
      particleGroup,
      simulation, 
      links, 
      nodes 
    } = setupVisualizations(svgRef.current, containerWidth, containerHeight, sampleData);
    
    // Create the tooltip
    const tooltip = setupTooltip();
    
    // Create node elements (circles, etc.)
    createNodeElements(nodes, tooltip, styles);
    
    // Set up the particle system
    const { particleInterval, motionInterval } = setupParticleSystem(
      particleGroup, sampleData, simulation
    );
    
    // Add click handler to nodes for expansion/contraction
    nodes.on("click", function(event, d) {
      event.stopPropagation();
      
      // Reset any previously selected nodes
      nodes.selectAll("circle").each(function(node) {
        if (node.id !== d.id && node.isSelected) {
          handleNodeReturn(d3.select(this.parentNode), node, styles);
        }
      });
      
      // Determine if we're selecting or deselecting
      if (d.isSelected) {
        // Deselect - transform rectangle back to node
        d.isSelected = false;
        handleNodeReturn(d3.select(this), d, styles, svg, zoom);
        return;
      }
      
      // Mark this node as selected
      d.isSelected = true;
      
      // Handle node expansion
      handleNodeTransformation(d3.select(this), d, containerWidth, containerHeight, svg, zoom, styles, t);
    });
    
    // Hide content panel and reset zoom when clicking elsewhere
    svg.on("click", function() {
      // Reset any selected nodes
      nodes.selectAll("circle").each(function(node) {
        if (node.isSelected) {
          node.isSelected = false;
          handleNodeReturn(d3.select(this.parentNode), node, styles, svg, zoom);
        }
      });
      
      // Reset zoom
      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
    });
    
    // Handle window resize
    const handleResize = () => {
      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;
      
      svg
        .attr("width", width)
        .attr("height", height);
      
      simulation
        .force("center", d3.forceCenter(width / 2, height / 2))
        .alpha(0.3)
        .restart();
    };
    
    window.addEventListener("resize", handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      simulation.stop();
      clearInterval(particleInterval);
      clearInterval(motionInterval);
      tooltip.remove();
    };
  }, []);
  
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeading}>
        <h2 className="text-3xl font-bold mb-8 gradient-text-primary">{t('portfolio.title', 'Interactive Resume')}</h2>
      </div>
      <div className={styles.interactivePortfolioContainer}>
        <svg ref={svgRef} className={styles.portfolioVisualization}></svg>
      </div>
    </div>
  );
}