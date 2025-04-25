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

export default function InteractivePortfolio() {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  const contentPanelRef = useRef(null);
  
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
    
    // Create tooltip
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
      .style("transition", "opacity 0.3s");
    
    // Create content panel
    const contentPanel = d3.select(contentPanelRef.current)
      .style("opacity", 0);
      
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
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    // Create circles for nodes - now all white and larger
    nodes.append("circle")
      .attr("r", d => d.size * 1.5) // Increased size by 50%
      .attr("fill", "#ffffff") // All nodes are white now
      .attr("fill-opacity", 0.7)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.3)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr("fill-opacity", 0.9)
          .attr("r", d.size * 1.8); // Larger hover effect
        
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
            .attr("fill-opacity", 0.7)
            .attr("r", d.size * 1.5);
        }
        
        // Hide tooltip
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("click", function(event, d) {
        event.stopPropagation();
        
        // Reset any previously selected nodes
        nodes.selectAll("circle").each(function(node) {
          if (node.id !== d.id && node.isSelected) {
            node.isSelected = false;
            d3.select(this)
              .transition()
              .duration(300)
              .attr("r", node.size * 1.5)
              .attr("fill-opacity", 0.7);
          }
        });
        
        // Mark this node as selected
        d.isSelected = true;
        
        // Get node position
        const nodeX = d.x;
        const nodeY = d.y;
        
        // Zoom to the node
        const currentTransform = d3.zoomTransform(svg.node());
        const scale = 1.8; // Zoom level
        const translate = [
          containerWidth / 2 - scale * nodeX,
          containerHeight / 2 - scale * nodeY
        ];
        
        svg.transition()
          .duration(750)
          .call(
            zoom.transform,
            d3.zoomIdentity
              .translate(translate[0], translate[1])
              .scale(scale)
          );
        
        // Expand the node
        d3.select(this)
          .transition()
          .duration(300)
          .attr("r", d.size * 2)
          .attr("fill-opacity", 0.9);
        
        // Update content panel with more details
        contentPanel.html(`
          <div class="${styles.panelHeader}">${d.name}</div>
          <div class="${styles.panelContent}">${d.content}</div>
          <div class="${styles.panelClose}">×</div>
        `)
        .style("left", (containerWidth / 2 - 150) + "px") // Center the panel
        .style("top", (containerHeight / 2 + 50) + "px")  // Position below the node
        .transition()
        .duration(300)
        .style("opacity", 1)
        .style("transform", "scale(1)")
        .style("width", "300px") // Fixed width
        .style("height", "auto");  // Height based on content
        
        // Add event listener to close button
        contentPanel.select(`.${styles.panelClose}`).on("click", function() {
          // Reset zoom
          svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
          
          // Reset the node
          d.isSelected = false;
          d3.select(this.parentNode.parentNode)
            .selectAll("circle")
            .filter(function(node) { return node.id === d.id; })
            .transition()
            .duration(300)
            .attr("r", d.size * 1.5)
            .attr("fill-opacity", 0.7);
          
          // Hide panel
          contentPanel.transition()
            .duration(300)
            .style("opacity", 0)
            .style("transform", "scale(0.8)");
        });
      });
    
    // Add node labels
    nodes.append("text")
      .text(d => d.name)
      .attr("font-size", d => d.size * 0.6 + "px")
      .attr("text-anchor", "middle")
      .attr("dy", d => d.size + 15)
      .attr("fill", "#ffffff")
      .attr("fill-opacity", 0.8);
    
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
        if (!node.fx && !node.fy) { // Only move nodes that aren't being dragged
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
      setTimeout(() => {
        d.fx = null;
        d.fy = null;
        
        // Quickly transition to normal state
        setTimeout(() => {
          simulation.alphaTarget(0);
        }, 100);
      }, 50); // Very short delay before releasing
    }
    
    // Hide content panel and reset zoom when clicking elsewhere
    svg.on("click", function() {
      // Reset any selected nodes
      nodes.selectAll("circle").each(function(node) {
        if (node.isSelected) {
          node.isSelected = false;
          d3.select(this)
            .transition()
            .duration(300)
            .attr("r", node.size * 1.5)
            .attr("fill-opacity", 0.7);
        }
      });
      
      // Reset zoom
      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
      
      // Hide panel
      contentPanel.transition()
        .duration(300)
        .style("opacity", 0)
        .style("transform", "scale(0.8)");
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
        <div ref={contentPanelRef} className={styles.contentPanel}></div>
      </div>
    </div>
  );
}