// Updated InteractivePortfolio component with consistent animation speeds and improved signal system
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTranslation } from 'react-i18next';
import styles from './InteractivePortfolio.module.css';
import { sampleData, categoryColors } from './data';
import { 
  setupVisualizations,
  createNodeElements,
  setupParticleSystem,
  centerPortfolioSection
} from './visualizationUtils';

// Define consistent animation speeds to use throughout the component
const ANIMATION_SPEEDS = {
  fast: 400,     // For simple transitions like glows and scaling
  medium: 600,   // For panel expansions
  reset: 400     // For returning to initial state
};

export default function InteractivePortfolio() {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [visualization, setVisualization] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
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
      // Cleanup particle system if it exists
      if (visualization.particleSystem) {
        visualization.particleSystem.cleanup();
      }
    }
    
    // Initialize the visualization
    const width = dimensions.width;
    const height = dimensions.height;
    
    const vis = setupVisualizations(svgRef.current, width, height, sampleData);
    
    // Create node elements (circles, etc.)
    createNodeElements(vis.nodes, styles);
    
    // Set up the particle system with improved handling
    const particleSystem = setupParticleSystem(
      vis.particleGroup, sampleData, vis.simulation
    );
    
    // Direct implementation of node click handler
    vis.nodes.on("click", function(event, d) {
      event.stopPropagation();
      
      // Prevent clicking during transitions
      if (isTransitioning) {
        return;
      }
      
      // Center the portfolio section in the viewport when a node is clicked
      centerPortfolioSection(sectionRef);
      
      // Set transitioning flag to prevent multiple clicks
      setIsTransitioning(true);
      
      // Reset any previously selected nodes
      let hasResetOtherNode = false;
      
      vis.nodes.each(function(node) {
        if (node.id !== d.id && node.isSelected) {
          // Deselect the node
          node.isSelected = false;
          hasResetOtherNode = true;
          
          // Get node elements
          const nodeGroup = d3.select(this);
          const innerCircle = nodeGroup.select(`.${styles.nodeInnerCircle}`);
          const innerCircleBg = nodeGroup.select(".innerCircleBg");
          const outerCircle = nodeGroup.select(`.${styles.nodeCircle}`);
          const nodeGlow = nodeGroup.select(".nodeGlow");
          const innerRect = nodeGroup.select(".innerRect");
          const outerRect = nodeGroup.select(".outerRect");
          const textBackground = nodeGroup.select(".textBackground");
          const nodeLabel = nodeGroup.select(".nodeLabel");
          
          // Calculate sizes
          const sizeMultiplier = 1.3;
          const innerCircleRadius = Math.max(node.size * 1.2 * sizeMultiplier, 6);
          const outerCircleRadius = Math.max(node.size * 1.5 * sizeMultiplier, 8);
          const glowRadius = Math.max(node.size * 2.4 * sizeMultiplier, 10);
          
          // Force clean up any dangling elements
          nodeGroup.selectAll(".node-panel-content").remove();
          nodeGroup.selectAll(".close-button").remove();
          nodeGroup.selectAll(".return-glow").remove();
          nodeGroup.selectAll(".temp-inner-circle").remove();
          nodeGroup.selectAll(".animated-glow").remove();
          nodeGroup.selectAll(".animation-inner-circle").remove();
          
          // Add shrinking gradient circle animation
          if (node.gradientId) {
            // Create the shrinking glow effect
            const returnGlow = nodeGroup.append("circle")
              .attr("class", "return-glow")
              .attr("r", glowRadius * 0.1) // Start small
              .attr("fill", `url(#${node.gradientId})`) // Use gradient from original node
              .style("opacity", 0); // Start invisible
            
            // Animate the glow expanding - using consistent animation speed
            returnGlow.transition()
              .duration(ANIMATION_SPEEDS.fast)
              .attr("r", glowRadius * 1.2) // Expand beyond normal size
              .style("opacity", 0.7)
              .on("end", function() {
                d3.select(this).transition().duration(ANIMATION_SPEEDS.fast).style("opacity", 0).remove();
              });
                
            // Create a copy of inner circle for animation
            const tempInnerCircle = nodeGroup.append("circle")
              .attr("class", "temp-inner-circle")
              .attr("r", innerCircleRadius * 0.1)
              .attr("fill", "rgb(249, 115, 22)")
              .style("opacity", 0);
                
            // Animate the inner circle - using consistent animation speed
            tempInnerCircle.transition()
              .duration(ANIMATION_SPEEDS.fast)
              .attr("r", innerCircleRadius)
              .style("opacity", 0.8)
              .on("end", function() {
                d3.select(this).transition().duration(ANIMATION_SPEEDS.fast).style("opacity", 0).remove();
              });
          }
            
          // Animate rectangles back to circles - using consistent animation speed
          if (!innerRect.empty() && !outerRect.empty()) {
            innerRect.transition()
              .duration(ANIMATION_SPEEDS.medium)
              .attr("x", -innerCircleRadius)
              .attr("y", -innerCircleRadius)
              .attr("width", innerCircleRadius * 2)
              .attr("height", innerCircleRadius * 2)
              .attr("rx", innerCircleRadius)
              .attr("ry", innerCircleRadius)
              .attr("fill", "rgb(249, 115, 22)");
            
            outerRect.transition()
              .duration(ANIMATION_SPEEDS.medium)
              .attr("x", -outerCircleRadius)
              .attr("y", -outerCircleRadius)
              .attr("width", outerCircleRadius * 2)
              .attr("height", outerCircleRadius * 2)
              .attr("rx", outerCircleRadius)
              .attr("ry", outerCircleRadius)
              .on("end", function() {
                // Remove rectangles
                innerRect.remove();
                outerRect.remove();
                
                // Show original circles
                innerCircle.style("opacity", 1);
                if (!innerCircleBg.empty()) innerCircleBg.style("opacity", 1);
                outerCircle.style("opacity", 1);
                if (nodeGlow) nodeGlow.style("opacity", 1);
                
                // Show text and background
                textBackground.style("opacity", 0.9);
                nodeLabel.style("opacity", 1);
                
                // Reset hover state completely
                // Reset the glow to normal size and opacity
                if (nodeGlow) {
                  nodeGlow
                    .attr("fill", `url(#${node.gradientId})`)
                    .attr("r", glowRadius);
                }
                
                // Reset outer circle to normal size
                outerCircle
                  .attr("r", outerCircleRadius);
                
                // Reset inner circle to normal size
                innerCircle
                  .attr("r", innerCircleRadius);
                    
                if (!innerCircleBg.empty()) {
                  innerCircleBg
                    .attr("r", innerCircleRadius);
                }
              });
          } else {
            // If rectangles don't exist, just show circles
            innerCircle.style("opacity", 1);
            if (!innerCircleBg.empty()) innerCircleBg.style("opacity", 1);
            outerCircle.style("opacity", 1);
            if (nodeGlow) nodeGlow.style("opacity", 1);
            
            // Show text and background
            textBackground.style("opacity", 0.9);
            nodeLabel.style("opacity", 1);
          }
          
          // Reset hover state with smooth animation like when mouse leaves
          nodeGroup.select(".nodeGlow")
            .attr("fill", `url(#${node.gradientId})`)
            .transition()
            .duration(ANIMATION_SPEEDS.reset)
            .attr("r", glowRadius);
              
          nodeGroup.select(`.${styles.nodeCircle}`)
            .transition()
            .duration(ANIMATION_SPEEDS.reset)
            .attr("r", outerCircleRadius);
              
          nodeGroup.select(`.${styles.nodeInnerCircle}`)
            .transition()
            .duration(ANIMATION_SPEEDS.reset)
            .attr("r", innerCircleRadius);
              
          if (!innerCircleBg.empty()) {
            nodeGroup.select(".innerCircleBg")
              .transition()
              .duration(ANIMATION_SPEEDS.reset)
              .attr("r", innerCircleRadius);
          }
          
          // Release fixed position
          node.fx = null;
          node.fy = null;
        }
      });
      
      // Toggle this node's selection
      d.isSelected = !d.isSelected;
      
      // Get current node selection
      const nodeGroup = d3.select(this);
      
      // We need to add a slight delay if we're resetting another node
      // to prevent overlapping animations
      const startNewPanelDelay = hasResetOtherNode ? ANIMATION_SPEEDS.fast / 2 : 0;
      
      setTimeout(() => {
        if (d.isSelected) {
          // *** NODE EXPANSION LOGIC ***
          
          // Fix position during expansion
          d.fx = d.x;
          d.fy = d.y;
          
          // Move this node to the front
          nodeGroup.raise();
          
          // Get references to circles
          const innerCircle = nodeGroup.select(`.${styles.nodeInnerCircle}`);
          const outerCircle = nodeGroup.select(`.${styles.nodeCircle}`);
          const nodeGlow = nodeGroup.select(".nodeGlow");
          const textBackground = nodeGroup.select(".textBackground");
          const nodeLabel = nodeGroup.select(".nodeLabel");
          
          // Hide label and background
          textBackground.style("opacity", 0);
          nodeLabel.style("opacity", 0);
          
          // Calculate sizes
          const sizeMultiplier = 1.3;
          const innerCircleRadius = Math.max(d.size * 1.2 * sizeMultiplier, 6);
          const outerCircleRadius = Math.max(d.size * 1.5 * sizeMultiplier, 8);
          
          // Panel dimensions
          const isMobile = width < 768;
          const panelWidth = isMobile ? Math.min(width * 0.7, 240) : Math.min(280, width * 0.6);
          const panelHeight = isMobile ? Math.min(height * 0.6, 180) : Math.min(220, height * 0.6);
          const borderMargin = 2;
          
          // Create gradient animation for expansion
          // Get gradient IDs (assuming they're stored on the node data)
          if (!d.gradientId) {
            // If gradient IDs aren't available, create a simple fallback
            d.gradientId = `node-gradient-${d.id}`;
            d.hoverGradientId = `node-hover-gradient-${d.id}`;
            
            // Create gradients if they don't exist
            const defs = vis.svg.select("defs");
            
            // Basic gradient
            const gradient = defs.append("radialGradient")
              .attr("id", d.gradientId)
              .attr("cx", "50%")
              .attr("cy", "50%")
              .attr("r", "50%");
              
            gradient.append("stop")
              .attr("offset", "0%")
              .attr("stop-color", "#ffffff")
              .attr("stop-opacity", 1);
              
            gradient.append("stop")
              .attr("offset", "100%")
              .attr("stop-color", "#ffffff")
              .attr("stop-opacity", 0.1);
              
            // Hover gradient (brighter)
            const hoverGradient = defs.append("radialGradient")
              .attr("id", d.hoverGradientId)
              .attr("cx", "50%")
              .attr("cy", "50%")
              .attr("r", "50%");
              
            hoverGradient.append("stop")
              .attr("offset", "0%")
              .attr("stop-color", "#ffffff")
              .attr("stop-opacity", 1);
              
            hoverGradient.append("stop")
              .attr("offset", "100%")
              .attr("stop-color", "#ffffff")
              .attr("stop-opacity", 0.3);
          }
          
          // Calculate glow size
          const glowRadius = Math.max(d.size * 2.4 * sizeMultiplier, 10);
          
          // Create animated glow for transformation
          const animatedGlow = nodeGroup.append("circle")
            .attr("class", "animated-glow")
            .attr("r", glowRadius * 1.2) // Start larger than the glow
            .attr("fill", `url(#${d.hoverGradientId})`) // Use hover gradient for more brightness 
            .style("opacity", 0.7);
            
          // Animate the glow circle shrinking during transformation - using consistent animation speed
          animatedGlow.transition()
            .duration(ANIMATION_SPEEDS.medium)
            .attr("r", glowRadius * 0.1) // Shrink to almost nothing
            .style("opacity", 0)
            .on("end", function() {
              d3.select(this).remove(); // Remove when animation is done
            });
            
          // Create a copy of inner circle for animation
          const animationInnerCircle = nodeGroup.append("circle")
            .attr("class", "animation-inner-circle")
            .attr("r", innerCircleRadius)
            .attr("fill", "rgb(249, 115, 22)")
            .attr("fill-opacity", 1)
            .style("pointer-events", "none");
            
          // Animate this circle separately - using consistent animation speed
          animationInnerCircle.transition()
            .duration(ANIMATION_SPEEDS.medium)
            .attr("r", innerCircleRadius * 0.1)
            .style("opacity", 0)
            .on("end", function() {
              d3.select(this).remove();
            });
          
          // Create outer rectangle
          const outerRect = nodeGroup.append("rect")
            .attr("class", "outerRect")
            .attr("x", -outerCircleRadius)
            .attr("y", -outerCircleRadius)
            .attr("width", outerCircleRadius * 2)
            .attr("height", outerCircleRadius * 2)
            .attr("rx", outerCircleRadius)
            .attr("ry", outerCircleRadius)
            .attr("fill", "#ffffff")
            .attr("fill-opacity", 1)
            .style("filter", "drop-shadow(0 0 10px rgba(0,0,0,0.5))");
          
          // Create inner rectangle
          const innerRect = nodeGroup.append("rect")
            .attr("class", "innerRect")
            .attr("x", -innerCircleRadius)
            .attr("y", -innerCircleRadius)
            .attr("width", innerCircleRadius * 2)
            .attr("height", innerCircleRadius * 2)
            .attr("rx", innerCircleRadius)
            .attr("ry", innerCircleRadius)
            .attr("fill", "rgb(249, 115, 22)")
            .attr("fill-opacity", 1);
          
          // Hide original circles
          innerCircle.style("opacity", 0);
          outerCircle.style("opacity", 0);
          if (nodeGlow) nodeGlow.style("opacity", 0);
          
          // Setup zoom
          const scale = isMobile ? 1.4 : 2.5;
          const translate = [
            width / 2 - d.x * scale, 
            height / 2 - d.y * scale
          ];
          
          const transform = d3.zoomIdentity
            .translate(translate[0], translate[1])
            .scale(scale);
          
          // Apply zoom with faster animation
          vis.svg.transition()
            .duration(ANIMATION_SPEEDS.medium)
            .call(vis.zoom.transform, transform);
          
          // Animate rectangles with faster animation
          outerRect.transition()
            .duration(ANIMATION_SPEEDS.medium)
            .attr("x", -panelWidth / 2)
            .attr("y", -panelHeight / 2)
            .attr("width", panelWidth)
            .attr("height", panelHeight)
            .attr("rx", 8)
            .attr("ry", 8);
          
          innerRect.transition()
            .duration(ANIMATION_SPEEDS.medium)
            .attr("x", -panelWidth / 2 + borderMargin)
            .attr("y", -panelHeight / 2 + borderMargin)
            .attr("width", panelWidth - (borderMargin * 2))
            .attr("height", panelHeight - (borderMargin * 2))
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("fill", "rgb(15, 23, 42)")
            .on("end", function() {
              // Add content panel after animation
              // Create content container
              const hPadding = isMobile ? 8 : 12;
              const vPadding = isMobile ? 8 : 12;
              
              // Create the foreignObject for the panel content with initial opacity 0
              const foreignObject = nodeGroup.append("foreignObject")
                .attr("x", -panelWidth / 2 + hPadding)
                .attr("y", -panelHeight / 2 + vPadding)
                .attr("width", panelWidth - (hPadding * 2))
                .attr("height", panelHeight - (vPadding * 2))
                .attr("class", styles.panelContent)
                .classed("node-panel-content", true)
                .style("opacity", 0); // Start with opacity 0 for fade-in effect
              
              // Set font sizes based on device
              const headerFontSize = isMobile ? "16px" : "18px";
              const bodyFontSize = isMobile ? "12px" : "14px";
              
              // Add content
              foreignObject.append("xhtml:div")
                .style("color", "white")
                .style("height", "100%")
                .style("overflow", "auto")
                .style("display", "flex")
                .style("flex-direction", "column")
                .html(`
                  <div class="${styles.panelContainer}" style="width: 100%; height: 100%;">
                    <div class="${styles.panelHeader}" style="padding-bottom: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.2);">
                      <h2 style="margin: 0; font-size: ${headerFontSize}; font-weight: 500;">${d.name}</h2>
                    </div>
                    <div class="${styles.panelBody}" style="flex-grow: 1; overflow-y: auto;">
                      <p style="font-size: ${bodyFontSize}; line-height: 1.5; margin-top: 6px;">${d.content || "No content available"}</p>
                    </div>
                  </div>
                `);
              
              // Add close button with initial opacity 0
              const closeButtonPosition = {
                x: panelWidth/2 - (isMobile ? 14 : 18),
                y: -panelHeight/2 + (isMobile ? 14 : 18)
              };
              
              const closeButton = nodeGroup.append("g")
                .attr("class", "close-button")
                .attr("transform", `translate(${closeButtonPosition.x}, ${closeButtonPosition.y})`)
                .style("cursor", "pointer")
                .style("opacity", 0); // Start with opacity 0 for fade-in effect
              
              closeButton.append("circle")
                .attr("r", isMobile ? 10 : 12)
                .attr("fill", "rgba(255, 255, 255, 0.1)")
                .attr("stroke", "rgba(255, 255, 255, 0.3)")
                .attr("stroke-width", 1);
              
              closeButton.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em")
                .attr("fill", "#ffffff")
                .style("font-size", isMobile ? "14px" : "16px")
                .style("font-weight", "bold")
                .text("×");
              
              // Animate fade-in for content and close button with a short delay
              // to ensure the panel is fully formed first
              setTimeout(() => {
                foreignObject.transition()
                  .duration(ANIMATION_SPEEDS.fast)
                  .style("opacity", 1);
                
                closeButton.transition()
                  .duration(ANIMATION_SPEEDS.fast)
                  .style("opacity", 1)
                  .on("end", function() {
                    // Reset transitioning flag when animation is complete
                    setIsTransitioning(false);
                  });
              }, 50); // Short delay before starting fade-in
              
              // Add click handler to close button - using consistent animation speed
              closeButton.on("click", function(event) {
                event.stopPropagation();
                
                // Prevent clicking if already transitioning
                if (isTransitioning) {
                  return;
                }
                
                // Set transitioning flag
                setIsTransitioning(true);
                
                d.isSelected = false;
                
                // Remove panel elements immediately without fading
                nodeGroup.selectAll(".node-panel-content").remove();
                nodeGroup.selectAll(".close-button").remove();
                
                // Continue with the rest of the closing animation immediately
                // Reset zoom SIMULTANEOUSLY with the rectangle animation
                vis.svg.transition()
                  .duration(ANIMATION_SPEEDS.medium)
                  .call(vis.zoom.transform, d3.zoomIdentity);
                
                // Add shrinking gradient circle animation
                const glowRadius = Math.max(d.size * 2.4 * sizeMultiplier, 10);
                
                // Create the shrinking glow effect - using consistent animation speed
                const returnGlow = nodeGroup.append("circle")
                  .attr("class", "return-glow")
                  .attr("r", glowRadius * 0.1) // Start small
                  .attr("fill", `url(#${d.gradientId})`) // Use gradient from original node
                  .style("opacity", 0); // Start invisible
                
                // Animate the glow expanding - using consistent animation speed
                returnGlow.transition()
                  .duration(ANIMATION_SPEEDS.fast)
                  .attr("r", glowRadius * 1.2) // Expand beyond normal size
                  .style("opacity", 0.7)
                  .on("end", function() {
                    d3.select(this).transition().duration(ANIMATION_SPEEDS.fast).style("opacity", 0).remove();
                  });
                  
                // Create a copy of inner circle for animation
                const tempInnerCircle = nodeGroup.append("circle")
                  .attr("class", "temp-inner-circle")
                  .attr("r", innerCircleRadius * 0.1)
                  .attr("fill", "rgb(249, 115, 22)")
                  .style("opacity", 0);
                  
                // Animate the inner circle - using consistent animation speed
                tempInnerCircle.transition()
                  .duration(ANIMATION_SPEEDS.fast)
                  .attr("r", innerCircleRadius)
                  .style("opacity", 0.8)
                  .on("end", function() {
                    d3.select(this).transition().duration(ANIMATION_SPEEDS.fast).style("opacity", 0).remove();
                  });
                
                // Animate rectangles back to circles - using consistent animation speed
                innerRect.transition()
                  .duration(ANIMATION_SPEEDS.medium)
                  .attr("x", -innerCircleRadius)
                  .attr("y", -innerCircleRadius)
                  .attr("width", innerCircleRadius * 2)
                  .attr("height", innerCircleRadius * 2)
                  .attr("rx", innerCircleRadius)
                  .attr("ry", innerCircleRadius)
                  .attr("fill", "rgb(249, 115, 22)");
                
                outerRect.transition()
                  .duration(ANIMATION_SPEEDS.medium)
                  .attr("x", -outerCircleRadius)
                  .attr("y", -outerCircleRadius)
                  .attr("width", outerCircleRadius * 2)
                  .attr("height", outerCircleRadius * 2)
                  .attr("rx", outerCircleRadius)
                  .attr("ry", outerCircleRadius)
                  .on("end", function() {
                    // Rest of the closing animation remains the same...
                    // Remove rectangles
                    outerRect.remove();
                    innerRect.remove();
                    
                    // Show original circles
                    innerCircle.style("opacity", 1);
                    outerCircle.style("opacity", 1);
                    if (nodeGlow) nodeGlow.style("opacity", 1);
                    
                    // Show text and background
                    textBackground.style("opacity", 0.9);
                    nodeLabel.style("opacity", 1);
                    
                    // Reset hover state with smooth animation - using consistent animation speed
                    // Reset the glow to normal size and opacity
                    if (nodeGlow) {
                      nodeGlow
                        .attr("fill", `url(#${d.gradientId})`)
                        .transition()
                        .duration(ANIMATION_SPEEDS.reset)
                        .attr("r", glowRadius);
                    }
                    
                    // Reset outer circle to normal size
                    outerCircle
                      .transition()
                      .duration(ANIMATION_SPEEDS.reset)
                      .attr("r", outerCircleRadius);
                    
                    // Reset inner circle to normal size
                    innerCircle
                      .transition()
                      .duration(ANIMATION_SPEEDS.reset)
                      .attr("r", innerCircleRadius);
                    
                    // Release position
                    setTimeout(() => {
                      d.fx = null;
                      d.fy = null;
                      
                      // Reset transitioning flag when animation is complete
                      setIsTransitioning(false);
                    }, 100);
                  });
              });
            });
        } else {
          // *** NODE CONTRACTION LOGIC ***
          
          // Get references to elements
          const innerCircle = nodeGroup.select(`.${styles.nodeInnerCircle}`);
          const innerCircleBg = nodeGroup.select(".innerCircleBg");
          const outerCircle = nodeGroup.select(`.${styles.nodeCircle}`);
          const nodeGlow = nodeGroup.select(".nodeGlow");
          const innerRect = nodeGroup.select(".innerRect");
          const outerRect = nodeGroup.select(".outerRect");
          const textBackground = nodeGroup.select(".textBackground");
          const nodeLabel = nodeGroup.select(".nodeLabel");
          
          // Force clean up any dangling elements
          nodeGroup.selectAll(".node-panel-content").remove();
          nodeGroup.selectAll(".close-button").remove();
          nodeGroup.selectAll(".return-glow").remove();
          nodeGroup.selectAll(".temp-inner-circle").remove();
          nodeGroup.selectAll(".animated-glow").remove();
          nodeGroup.selectAll(".animation-inner-circle").remove();
          
          // Calculate sizes
          const sizeMultiplier = 1.3;
          const innerCircleRadius = Math.max(d.size * 1.2 * sizeMultiplier, 6);
          const outerCircleRadius = Math.max(d.size * 1.5 * sizeMultiplier, 8);
          
          // Reset zoom - using consistent animation speed
          vis.svg.transition()
            .duration(ANIMATION_SPEEDS.medium)
            .call(vis.zoom.transform, d3.zoomIdentity);
          
          // Animate rectangles back to circles if they exist
          if (!innerRect.empty() && !outerRect.empty()) {
            innerRect.transition()
              .duration(ANIMATION_SPEEDS.medium)
              .attr("x", -innerCircleRadius)
              .attr("y", -innerCircleRadius)
              .attr("width", innerCircleRadius * 2)
              .attr("height", innerCircleRadius * 2)
              .attr("rx", innerCircleRadius)
              .attr("ry", innerCircleRadius)
              .attr("fill", "rgb(249, 115, 22)");
            
              outerRect.transition()
              .duration(ANIMATION_SPEEDS.medium)
              .attr("x", -outerCircleRadius)
              .attr("y", -outerCircleRadius)
              .attr("width", outerCircleRadius * 2)
              .attr("height", outerCircleRadius * 2)
              .attr("rx", outerCircleRadius)
              .attr("ry", outerCircleRadius)
              .on("end", function() {
                // Remove rectangles
                innerRect.remove();
                outerRect.remove();
                
                // Show original circles
                innerCircle.style("opacity", 1);
                if (!innerCircleBg.empty()) innerCircleBg.style("opacity", 1);
                outerCircle.style("opacity", 1);
                if (nodeGlow) nodeGlow.style("opacity", 1);
                
                // Show text and background
                textBackground.style("opacity", 0.9);
                nodeLabel.style("opacity", 1);
                
                // Release position
                setTimeout(() => {
                  d.fx = null;
                  d.fy = null;
                  
                  // Reset transitioning flag
                  setIsTransitioning(false);
                }, 100);
              });
          } else {
            // If rectangles don't exist, just show circles
            innerCircle.style("opacity", 1);
            if (!innerCircleBg.empty()) innerCircleBg.style("opacity", 1);
            outerCircle.style("opacity", 1);
            if (nodeGlow) nodeGlow.style("opacity", 1);
            
            // Show text and background
            textBackground.style("opacity", 0.9);
            nodeLabel.style("opacity", 1);
            
            // Release position and reset transitioning flag
            setTimeout(() => {
              d.fx = null;
              d.fy = null;
              setIsTransitioning(false);
            }, 100);
          }
          
          // Reset hover state with smooth animation like when mouse leaves
          const glowRadius = Math.max(d.size * 2.4 * sizeMultiplier, 10);
          
          if (nodeGlow) {
            nodeGlow
              .attr("fill", `url(#${d.gradientId})`)
              .transition()
              .duration(ANIMATION_SPEEDS.reset)
              .attr("r", glowRadius);
          }
          
          outerCircle
            .transition()
            .duration(ANIMATION_SPEEDS.reset)
            .attr("r", outerCircleRadius);
          
          innerCircle
            .transition()
            .duration(ANIMATION_SPEEDS.reset)
            .attr("r", innerCircleRadius);
          
          if (!innerCircleBg.empty()) {
            innerCircleBg
              .transition()
              .duration(ANIMATION_SPEEDS.reset)
              .attr("r", innerCircleRadius);
          }
        }
      }, startNewPanelDelay);
    });
    
    // Store the visualization for cleanup
    setVisualization({
      ...vis,
      particleSystem
    });
    
    // Fix initial positions to prevent clustering in corner
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
      if (visualization && visualization.particleSystem) {
        visualization.particleSystem.cleanup();
      }
    };
  }, [dimensions]);
  
  return (
    <div className={styles.sectionContainer} ref={sectionRef}>
      <div className={styles.sectionHeading}>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">InSight</h2>
        <p className="max-w-3xl mx-auto text-xl text-gray-300">Explore my portfolio through the nodes.</p>
      </div>
      <div className={styles.interactivePortfolioContainer} ref={containerRef}>
        <svg ref={svgRef} className={styles.portfolioVisualization}></svg>
      </div>
    </div>
  );
}