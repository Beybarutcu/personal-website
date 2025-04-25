// src/components/sections/InteractivePortfolio/InteractivePortfolio.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTranslation } from 'react-i18next';
import styles from './InteractivePortfolio.module.css';

// Sample data structure - you can replace this with your actual data later
const sampleData = {
  nodes: [
    { id: "intro", name: "Introduction", category: "main", size: 25, content: "Hello! I'm [Your Name], a [Your Profession] with a passion for creating innovative solutions." },
    { id: "education1", name: "Education", category: "education", size: 18, content: "Bachelor's Degree in Computer Science" },
    { id: "experience1", name: "Experience", category: "experience", size: 20, content: "Senior Developer at XYZ Company (2020-Present)" },
    { id: "experience2", name: "Experience", category: "experience", size: 16, content: "Web Developer at ABC Agency (2018-2020)" },
    { id: "skills1", name: "Frontend", category: "skills", size: 15, content: "React, Vue, JavaScript, CSS" },
    { id: "skills2", name: "Backend", category: "skills", size: 15, content: "Node.js, Express, Python, SQL" },
    { id: "project1", name: "E-commerce", category: "projects", size: 17, content: "Full-stack e-commerce platform with payment integration" },
    { id: "project2", name: "Dashboard", category: "projects", size: 14, content: "Real-time analytics dashboard for business metrics" },
    { id: "skills3", name: "Tools", category: "skills", size: 12, content: "Git, Docker, AWS, Figma" },
    { id: "skills4", name: "Design", category: "skills", size: 13, content: "UI/UX, Responsive Design, Accessibility" },
    { id: "achievements", name: "Achievements", category: "achievements", size: 16, content: "Award-winning developer with multiple recognitions" },
    { id: "languages", name: "Languages", category: "skills", size: 14, content: "JavaScript, Python, TypeScript, Java" },
    { id: "contact", name: "Contact", category: "contact", size: 18, content: "Email: your.email@example.com | LinkedIn: linkedin.com/in/yourprofile" }
  ],
  links: [
    { source: "intro", target: "education1", value: 1 },
    { source: "intro", target: "experience1", value: 1 },
    { source: "intro", target: "skills1", value: 1 },
    { source: "experience1", target: "experience2", value: 1 },
    { source: "experience1", target: "project1", value: 1 },
    { source: "skills1", target: "skills2", value: 1 },
    { source: "skills1", target: "skills3", value: 1 },
    { source: "skills1", target: "skills4", value: 1 },
    { source: "skills2", target: "project1", value: 1 },
    { source: "skills2", target: "project2", value: 1 },
    { source: "skills2", target: "languages", value: 1 },
    { source: "intro", target: "achievements", value: 1 },
    { source: "intro", target: "contact", value: 1 }
  ]
};

// Define category colors for nodes
const categoryColors = {
  main: "#60a5fa",       // Blue
  education: "#a78bfa",  // Purple
  experience: "#f472b6", // Pink
  skills: "#34d399",     // Green
  projects: "#f59e0b",   // Amber
  achievements: "#ec4899", // Hot pink
  contact: "#6366f1"     // Indigo
};

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
    
    // Setup zoom behavior - disabled scroll zoom
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .filter(event => {
        // Disable scroll zoom, only allow programmatic and drag zoom
        return !event.type.includes('wheel');
      })
      .on("zoom", (event) => {
        // Apply the transformation to all elements
        nodeGroup.attr("transform", event.transform);
        linkGroup.attr("transform", event.transform);
        particleGroup.attr("transform", event.transform);
      });
    
    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("viewBox", [0, 0, containerWidth, containerHeight])
      .call(zoom);
    
    // Create a gradient for the background
    const defs = svg.append("defs");
    
    const gradient = defs.append("radialGradient")
      .attr("id", "background-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
      
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#2a2a2a");
      
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#111111");
    
    // Add background
    svg.append("rect")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("fill", "url(#background-gradient)");
    
    // Create particle group
    const particleGroup = svg.append("g")
      .attr("class", styles.particles);
    
    // Create links group
    const linkGroup = svg.append("g")
      .attr("class", styles.links);
    
    // Create nodes group
    const nodeGroup = svg.append("g")
      .attr("class", styles.nodes);
    
    // Create tooltip with custom font
    const tooltip = d3.select("body").append("div")
      .attr("class", styles.nodeTooltip)
      .style("opacity", 0)
      .style("position", "absolute")
      .style("padding", "8px 12px")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("border-radius", "6px")
      .style("pointer-events", "none")
      .style("font-size", "14px")
      .style("z-index", "100")
      .style("transition", "opacity 0.3s")
      .style("font-family", "'Montserrat', 'Segoe UI', 'Roboto', sans-serif") // Casual minimal font
      .style("font-weight", 300); // Lighter weight for minimal look
    
    // Force simulation with more fluid motion
    const simulation = d3.forceSimulation(sampleData.nodes)
      .force("link", d3.forceLink(sampleData.links).id(d => d.id).distance(150)) // Increased distance
      .force("charge", d3.forceManyBody().strength(-300)) // Reduced strength for looser alignment
      .force("center", d3.forceCenter(containerWidth / 2, containerHeight / 2))
      .force("collision", d3.forceCollide().radius(d => d.size * 3)) // Increased collision radius
      .force("x", d3.forceX().strength(0.05)) // Very gentle x alignment
      .force("y", d3.forceY().strength(0.05)) // Very gentle y alignment
      .velocityDecay(0.2) // Lower value makes motion more fluid (less friction)
      .alphaDecay(0.01) // Slower cooling - nodes move longer
      .on("tick", ticked);
    
    // Create links
    const links = linkGroup.selectAll("line")
      .data(sampleData.links)
      .enter()
      .append("line")
      .attr("stroke", "#424242")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", d => Math.sqrt(d.value));
    
    // Create node groups
    const nodes = nodeGroup.selectAll("g")
      .data(sampleData.nodes)
      .enter()
      .append("g")
      .attr("class", styles.nodeGroup)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    // Create outer circles for nodes - full opacity white circles
    nodes.append("circle")
      .attr("r", d => d.size * 1.5) // Increased size by 50%
      .attr("fill", "#ffffff") // White outer circle
      .attr("fill-opacity", 1) // CHANGE: Full opacity instead of 0
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.3)
      .attr("class", styles.nodeCircle)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr("r", d.size * 1.8); // Larger hover effect
        
        d3.select(this.parentNode).select(`.${styles.nodeInnerCircle}`)
          .transition()
          .duration(300)
          .attr("r", d.size * 1.4); // Also scale inner circle
        
        // Show tooltip
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(d.name)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        if (!d.isSelected) { // Only shrink back if not selected
          d3.select(this)
            .transition()
            .duration(300)
            .attr("r", d.size * 1.5);
            
          d3.select(this.parentNode).select(`.${styles.nodeInnerCircle}`)
            .transition()
            .duration(300)
            .attr("r", d.size * 1.2);
        }
        
        // Hide tooltip
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
    
    // NEW: Add inner circle with rgb(31, 41, 55) color
    nodes.append("circle")
      .attr("r", d => d.size * 1.2) // Slightly smaller than outer circle
      .attr("fill", "rgb(31, 41, 55)") // Dark inner circle as requested
      .attr("fill-opacity", 1)
      .attr("class", styles.nodeInnerCircle);
      
    // We'll handle events at the node group level for smoother interaction
    
    // Add node click handler to the node group
    nodes.on("click", function(event, d) {
      event.stopPropagation();
      
      // Reset any previously selected nodes
      nodes.selectAll("circle").each(function(node) {
        if (node.id !== d.id && node.isSelected) {
          node.isSelected = false;
          
          // Get the node group
          const nodeGroup = d3.select(this.parentNode);
          
          // Get the rectangle if it exists
          const rect = nodeGroup.select("rect");
          const innerRect = nodeGroup.select(".innerRect");
          if (!rect.empty()) {
            // Hide content immediately
            nodeGroup.select(`.${styles.panelContent}`)
              .style("opacity", 0);
            
            // Remove inner rectangle first
            if (!innerRect.empty()) {
              innerRect.remove();
            }
            
            // Animate rectangle back to circle
            rect.transition()
              .duration(500)
              .attr("width", 0)
              .attr("height", 0)
              .attr("x", 0)
              .attr("y", 0)
              .style("opacity", 0)
              .remove();
            
            // Show the circle again
            nodeGroup.selectAll("circle")
              .transition()
              .duration(300)
              .style("opacity", 1);
            
            // Show the label
            nodeGroup.select("text.nodeLabel")
              .transition()
              .duration(300)
              .style("opacity", 0.8);
          }
        }
      });
      
      // Determine if we're selecting or deselecting
      if (d.isSelected) {
        // Deselect - transform rectangle back to node
        d.isSelected = false;
        
        // Get the node group
        const nodeGroup = d3.select(this);
        
        // Get references to circles
        const innerCircle = nodeGroup.select(`.${styles.nodeInnerCircle}`);
        const outerCircle = nodeGroup.select(`.${styles.nodeCircle}`);
        
        // Hide content with gentle fade-out
        nodeGroup.select(`.${styles.panelContent}`)
          .transition()
          .duration(400)
          .style("opacity", 0)
          .remove();
        
        // Get the inner rectangle
        const innerRect = nodeGroup.select(".innerRect");
        // Get the outer rectangle
        const rect = nodeGroup.select("rect");
        
        // First gradually shrink the content rectangles
        rect.transition()
          .duration(450)
          .ease(d3.easeCubicInOut)
          .attr("width", panelWidth * 0.8)
          .attr("height", panelHeight * 0.8)
          .attr("x", -panelWidth / 2 * 0.8)
          .attr("y", -panelHeight / 2 * 0.8)
          .attr("rx", d.size)
          .attr("ry", d.size);
          
        // Inner rectangle transforms back to inner circle shape
        if (!innerRect.empty()) {
          innerRect
            .transition()
            .duration(400)
            .ease(d3.easeCubicInOut)
            .attr("width", panelWidth * 0.7)
            .attr("height", panelHeight * 0.7)
            .attr("x", -panelWidth * 0.35)
            .attr("y", -panelHeight * 0.35)
            .attr("rx", d.size)
            .attr("ry", d.size)
            .transition()
            .duration(500)
            .ease(d3.easeBackIn.overshoot(1.1))
            .attr("width", d.size * 2.4)
            .attr("height", d.size * 2.4)
            .attr("x", -d.size * 1.2)
            .attr("y", -d.size * 1.2)
            .attr("rx", d.size * 1.2)
            .attr("ry", d.size * 1.2)
            .on("end", function() {
              // Make inner circle visible as inner rectangle completes
              innerCircle
                .style("opacity", 0)
                .attr("r", d.size * 1.2)
                .transition()
                .duration(300)
                .style("opacity", 1);
                
              // Remove inner rectangle after transition completes
              d3.select(this).remove();
            });
        }
        
        // Continue with outer rectangle to circle transition
        // Second phase: final circle shape
        rect.transition()
          .delay(250) // Slight delay after first phase
          .duration(550)
          .ease(d3.easeBackIn.overshoot(1.1))
          .attr("width", d.size * 3)
          .attr("height", d.size * 3)
          .attr("x", -d.size * 1.5)
          .attr("y", -d.size * 1.5)
          .attr("rx", d.size * 1.5)
          .attr("ry", d.size * 1.5)
          .on("end", function() {
            // Make outer circle visible as outer rectangle completes
            outerCircle
              .style("opacity", 0)
              .attr("r", d.size * 1.5)
              .transition()
              .duration(300)
              .style("opacity", 1);
              
            // Remove outer rectangle after transition completes
            d3.select(this).remove();
            
            // Keep node fixed in place after closing
            d.fx = d.x;
            d.fy = d.y;
            
            // Show the label
            nodeGroup.select("text.nodeLabel")
              .transition()
              .duration(300)
              .style("opacity", 0.8);
          });
        
        // Reset zoom
        svg.transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity);
        
        return;
      }
      
      // Mark this node as selected
      d.isSelected = true;
      
      // Get circle attributes for animation
      const nodeGroup = d3.select(this);
      const circles = nodeGroup.selectAll("circle");
      
      // Calculate panel dimensions
      const panelWidth = 300;
      const panelHeight = 200;
      
      // Create rectangle that will expand from the circle center (outer white rectangle)
      const rect = nodeGroup.append("rect")
        .attr("x", -d.size * 1.5) // Center the rectangle on the node
        .attr("y", -d.size * 1.5) // Center the rectangle on the node
        .attr("width", d.size * 3)
        .attr("height", d.size * 3)
        .attr("rx", d.size * 1.5) // Rounded corners matching circle
        .attr("ry", d.size * 1.5)
        .attr("fill", "#ffffff") // White to match the circle
        .attr("fill-opacity", 1) // CHANGE: Full opacity instead of 0.7
        .attr("class", styles.nodeRect);
      
      // First, zoom to the node
      const scale = 1.5;
      // Calculate the translation needed to center the node in the view
      const translate = [
        containerWidth / 2 - d.x * scale, 
        containerHeight / 2 - d.y * scale
      ];
      
      const transform = d3.zoomIdentity
        .translate(translate[0], translate[1])
        .scale(scale);
      
      svg.transition()
        .duration(750)
        .call(zoom.transform, transform);
      
      // After zooming, expand the circle to rectangle with more harmonious animation
      setTimeout(() => {
        // Create inner circle reference for later animation
        const innerCircle = nodeGroup.select(`.${styles.nodeInnerCircle}`);
        const outerCircle = nodeGroup.select(`.${styles.nodeCircle}`);
        
        // Scale down circles slightly to begin transition
        innerCircle
          .transition()
          .duration(300)
          .attr("r", d => d.size * 1.0) // Shrink inner circle slightly
          .style("opacity", 0.9);
          
        outerCircle
          .transition()
          .duration(400)
          .attr("r", d => d.size * 1.3) // Shrink outer circle slightly
          .style("opacity", 0.9);
        
        // Fade label more gradually
        nodeGroup.select("text.nodeLabel")
          .transition()
          .duration(500)
          .style("opacity", 0);
        
        // Create a more fluid expansion animation with easing
        rect.transition()
          .duration(900)
          .ease(d3.easeCubicInOut)
          .attr("x", -panelWidth / 2 * 0.8)
          .attr("y", -panelHeight / 2 * 0.8)
          .attr("width", panelWidth * 0.8)
          .attr("height", panelHeight * 0.8)
          .attr("rx", d.size)
          .attr("ry", d.size)
          .transition()
          .duration(300)
          .ease(d3.easeBackOut.overshoot(1.2))
          .attr("x", -panelWidth / 2)
          .attr("y", -panelHeight / 2)
          .attr("width", panelWidth)
          .attr("height", panelHeight)
          .attr("rx", 10)
          .attr("ry", 10)
          .on("start", function() {
            // Start inner rectangle animation as outer rectangle reaches final stage
            // NEW: Add inner rectangle with rgb(31, 41, 55) color that maintains continuity with inner circle
            const innerRect = nodeGroup.append("rect")
              .attr("class", "innerRect")
              .attr("x", -d.size * 1.2) // Start from inner circle size
              .attr("y", -d.size * 1.2)
              .attr("width", d.size * 2.4) // Match inner circle diameter
              .attr("height", d.size * 2.4)
              .attr("rx", d.size * 1.2) // Fully rounded initially like circle
              .attr("ry", d.size * 1.2)
              .attr("fill", "rgb(31, 41, 55)") // Same color as inner circle
              .attr("fill-opacity", 1); // Start fully visible to maintain continuity
              
            // Animate the inner rectangle expansion - coordinated with outer rectangle
            innerRect.transition()
              .delay(100) // Slight delay for visual separation
              .duration(800)
              .ease(d3.easeCubicInOut)
              .attr("x", -panelWidth / 2 + 10)
              .attr("y", -panelHeight / 2 + 10)
              .attr("width", panelWidth - 20)
              .attr("height", panelHeight - 20)
              .attr("rx", 6)
              .attr("ry", 6);
              
            // Only hide circles after inner rectangle has started expanding
            setTimeout(() => {
              innerCircle
                .transition()
                .duration(400)
                .style("opacity", 0);
                
              outerCircle
                .transition()
                .duration(500)
                .style("opacity", 0);
            }, 300);
          })
          .on("end", function() {
            // After rectangle expansion, add content
            // Create content container - position with fixed offset from rectangle
            const foreignObject = nodeGroup.append("foreignObject")
              .attr("x", -panelWidth / 2 + 15) // Offset by padding
              .attr("y", -panelHeight / 2 + 15)
              .attr("width", panelWidth - 30)
              .attr("height", panelHeight - 30)
              .attr("class", styles.panelContent)
              .style("opacity", 0);
              
            // Make sure we can track this element easily
            foreignObject.classed("node-panel-content", true);
            
            // Add HTML content
            foreignObject.append("xhtml:div")
              .style("color", "white")
              .style("height", "100%")
              .style("overflow", "auto")
              .html(`
                <div class="${styles.panelContainer}">
                  <div class="${styles.panelHeader}">${d.name}</div>
                  <div class="${styles.panelBody}">${d.content}</div>
                  <div class="${styles.panelClose}">×</div>
                </div>
              `);
            
            // Fade in the content
            foreignObject.transition()
              .duration(300)
              .style("opacity", 1);
            
            // Add event listener to close button
            foreignObject.select("div").on("click", function(event) {
              const target = event.target;
              if (target.classList.contains(styles.panelClose)) {
                // Prevent the event from bubbling
                event.stopPropagation();
                
                // Trigger deselection
                d.isSelected = false;
                
                // Get references to circles
                const innerCircle = nodeGroup.select(`.${styles.nodeInnerCircle}`);
                const outerCircle = nodeGroup.select(`.${styles.nodeCircle}`);
                
                // Hide content with gentle fade-out
                foreignObject
                  .transition()
                  .duration(400)
                  .style("opacity", 0)
                  .remove();
                
                // Get the inner rectangle
                const innerRect = nodeGroup.select(".innerRect");
                
                // First gradually shrink the content rectangles
                rect.transition()
                  .duration(450)
                  .ease(d3.easeCubicInOut)
                  .attr("width", panelWidth * 0.8)
                  .attr("height", panelHeight * 0.8)
                  .attr("x", -panelWidth / 2 * 0.8)
                  .attr("y", -panelHeight / 2 * 0.8)
                  .attr("rx", d.size)
                  .attr("ry", d.size);
                  
                // Inner rectangle transforms back to inner circle shape
                if (!innerRect.empty()) {
                  innerRect
                    .transition()
                    .duration(400)
                    .ease(d3.easeCubicInOut)
                    .attr("width", panelWidth * 0.7)
                    .attr("height", panelHeight * 0.7)
                    .attr("x", -panelWidth * 0.35)
                    .attr("y", -panelHeight * 0.35)
                    .attr("rx", d.size)
                    .attr("ry", d.size)
                    .transition()
                    .duration(500)
                    .ease(d3.easeBackIn.overshoot(1.1))
                    .attr("width", d.size * 2.4)
                    .attr("height", d.size * 2.4)
                    .attr("x", -d.size * 1.2)
                    .attr("y", -d.size * 1.2)
                    .attr("rx", d.size * 1.2)
                    .attr("ry", d.size * 1.2)
                    .on("end", function() {
                      // Make inner circle visible as inner rectangle completes
                      innerCircle
                        .style("opacity", 0)
                        .attr("r", d.size * 1.2)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                        
                      // Remove inner rectangle after transition completes
                      d3.select(this).remove();
                    });
                }
                
                // Continue with outer rectangle to circle transition
                // Second phase: final circle shape
                rect.transition()
                  .delay(250) // Slight delay after first phase
                  .duration(550)
                  .ease(d3.easeBackIn.overshoot(1.1))
                  .attr("width", d.size * 3)
                  .attr("height", d.size * 3)
                  .attr("x", -d.size * 1.5)
                  .attr("y", -d.size * 1.5)
                  .attr("rx", d.size * 1.5)
                  .attr("ry", d.size * 1.5)
                  .on("end", function() {
                    // Make outer circle visible as outer rectangle completes
                    outerCircle
                      .style("opacity", 0)
                      .attr("r", d.size * 1.5)
                      .transition()
                      .duration(300)
                      .style("opacity", 1);
                      
                    // Remove outer rectangle after transition completes
                    d3.select(this).remove();
                    
                    // Keep node fixed in place after closing
                    d.fx = d.x;
                    d.fy = d.y;
                    
                    // Show the label
                    nodeGroup.select("text.nodeLabel")
                      .transition()
                      .duration(300)
                      .style("opacity", 0.8);
                  });
                
                // Reset zoom
                svg.transition()
                  .duration(750)
                  .call(zoom.transform, d3.zoomIdentity);
              }
            });
          });
      }, 750); // Wait for zoom to complete
    });
    
    // Add node labels with custom font
    nodes.append("text")
      .text(d => d.name)
      .attr("class", "nodeLabel")
      .attr("font-size", d => d.size * 0.6 + "px")
      .attr("text-anchor", "middle")
      .attr("dy", d => d.size + 15)
      .attr("fill", "#ffffff")
      .attr("fill-opacity", 0.8)
      .attr("font-family", "'Montserrat', 'Segoe UI', 'Roboto', sans-serif") // Casual minimal font
      .attr("font-weight", 300); // Lighter weight for minimal look
    
    // Add particles along links
    function createParticles() {
      sampleData.links.forEach(link => {
        if (Math.random() > 0.7) return; // Only create particles for some links
        
        const source = sampleData.nodes.find(n => n.id === link.source.id || n.id === link.source);
        const target = sampleData.nodes.find(n => n.id === link.target.id || n.id === link.target);
        
        if (!source || !target) return;
        
        // Calculate a point along the link
        const t = Math.random();
        const x = source.x * (1 - t) + target.x * t;
        const y = source.y * (1 - t) + target.y * t;
        
        // Create a particle
        particleGroup.append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 1)
          .attr("fill", "#ffffff")
          .attr("fill-opacity", 0.7)
          .transition()
          .duration(2000)
          .attr("cx", target.x)
          .attr("cy", target.y)
          .attr("fill-opacity", 0)
          .remove();
      });
    }
    
    // Generate particles periodically
    const particleInterval = setInterval(createParticles, 500);
    
    // Add gentle random motion
    function addRandomMotion() {
      sampleData.nodes.forEach(node => {
        if (!node.fx && !node.fy && !node.isSelected) { // Only move nodes that aren't being dragged or selected
          node.vx = (node.vx || 0) + (Math.random() - 0.5) * 0.3;
          node.vy = (node.vy || 0) + (Math.random() - 0.5) * 0.3;
        }
      });
    }
    
    const motionInterval = setInterval(addRandomMotion, 2000);
    
    // Update positions on each tick
    function ticked() {
      links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      nodes
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
    }
    
    // Drag functions with fluid realignment and minimal delay
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0.2); // Higher value for more movement
      
      // Release node quickly after dragging for fluid realignment with minimal delay
      if (!d.isSelected) {
        setTimeout(() => {
          d.fx = null;
          d.fy = null;
          
          // Quickly transition to normal state
          setTimeout(() => {
            simulation.alphaTarget(0);
          }, 100);
        }, 50); // Very short delay before releasing
      }
    }
    
    // Hide content panel and reset zoom when clicking elsewhere - with improved animations
    svg.on("click", function() {
      // Reset any selected nodes
      nodes.selectAll("circle").each(function(node) {
        if (node.isSelected) {
          node.isSelected = false;
          
          // Get the node group
          const nodeGroup = d3.select(this.parentNode);
          
          // Get references to the circles
          const innerCircle = nodeGroup.select(`.${styles.nodeInnerCircle}`);
          const outerCircle = nodeGroup.select(`.${styles.nodeCircle}`);
          
          // Hide content with fade-out animation
          nodeGroup.select(`.${styles.panelContent}`)
            .transition()
            .duration(400)
            .style("opacity", 0)
            .remove();
          
          // Get the rectangle elements
          const rect = nodeGroup.select("rect");
          const innerRect = nodeGroup.select(".innerRect");
          
          if (!rect.empty() && !innerRect.empty()) {
            // First stage: Shrink both rectangles to intermediate size
            rect.transition()
              .duration(450)
              .ease(d3.easeCubicInOut)
              .attr("width", function() {
                return parseFloat(d3.select(this).attr("width")) * 0.8;
              })
              .attr("height", function() {
                return parseFloat(d3.select(this).attr("height")) * 0.8;
              })
              .attr("x", function() {
                const width = parseFloat(d3.select(this).attr("width")) * 0.8;
                return -width / 2;
              })
              .attr("y", function() {
                const height = parseFloat(d3.select(this).attr("height")) * 0.8;
                return -height / 2;
              })
              .attr("rx", node.size)
              .attr("ry", node.size);
            
            // Transform inner rectangle back to inner circle shape
            innerRect.transition()
              .duration(400)
              .ease(d3.easeCubicInOut)
              .attr("width", function() {
                return parseFloat(d3.select(this).attr("width")) * 0.7;
              })
              .attr("height", function() {
                return parseFloat(d3.select(this).attr("height")) * 0.7;
              })
              .attr("x", function() {
                const width = parseFloat(d3.select(this).attr("width")) * 0.7;
                return -width / 2;
              })
              .attr("y", function() {
                const height = parseFloat(d3.select(this).attr("height")) * 0.7;
                return -height / 2;
              })
              .attr("rx", node.size)
              .attr("ry", node.size)
              .transition()
              .duration(500)
              .ease(d3.easeBackIn.overshoot(1.1))
              .attr("width", node.size * 2.4)
              .attr("height", node.size * 2.4)
              .attr("x", -node.size * 1.2)
              .attr("y", -node.size * 1.2)
              .attr("rx", node.size * 1.2)
              .attr("ry", node.size * 1.2)
              .on("end", function() {
                // Make inner circle visible when inner rectangle completes
                innerCircle
                  .style("opacity", 0)
                  .attr("r", node.size * 1.2)
                  .transition()
                  .duration(300)
                  .style("opacity", 1);
                  
                // Remove inner rectangle after transition completes
                d3.select(this).remove();
              });
            
            // Second phase for outer rectangle: transform to circle
            rect.transition()
              .delay(250)
              .duration(550)
              .ease(d3.easeBackIn.overshoot(1.2))
              .attr("width", node.size * 3)
              .attr("height", node.size * 3)
              .attr("x", -node.size * 1.5)
              .attr("y", -node.size * 1.5)
              .attr("rx", node.size * 1.5)
              .attr("ry", node.size * 1.5)
              .on("end", function() {
                // Make outer circle visible when outer rectangle completes
                outerCircle
                  .style("opacity", 0)
                  .attr("r", node.size * 1.5)
                  .transition()
                  .duration(300)
                  .style("opacity", 1);
                  
                // Remove outer rectangle after transition completes
                d3.select(this).remove();
                
                // Keep node fixed in place after closing
                node.fx = node.x;
                node.fy = node.y;
                
                // Show the label
                nodeGroup.select("text.nodeLabel")
                  .transition()
                  .duration(300)
                  .style("opacity", 0.8);
              });
          }
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