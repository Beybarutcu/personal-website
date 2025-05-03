// src/components/sections/InteractivePortfolio/visualizationUtils.js
import * as d3 from 'd3';

// Updated setupVisualizations with improved physics settings to prevent vibration
export function setupVisualizations(svgElement, width, height, data) {
    // Create SVG element first WITHOUT zoom behavior
    const svg = d3.select(svgElement)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);
    
    // Create an empty defs element for gradients
    svg.append("defs");
    
    // Create visualization groups - order matters for z-index layering
    const linkGroup = svg.append("g").attr("class", "links");
    const particleGroup = svg.append("g").attr("class", "particles");
    const nodeGroup = svg.append("g").attr("class", "nodes");
    
    // Define a simple programmatic zoom to be used only by our code,
    // not triggered by user interactions with the background
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        // Apply the transformation to all elements
        nodeGroup.attr("transform", event.transform);
        linkGroup.attr("transform", event.transform);
        particleGroup.attr("transform", event.transform);
      });

    // Disable all default zoom behaviors
    svg.on(".zoom", null);
    svg.call(zoom.transform, d3.zoomIdentity); // Reset to identity transformation

    // Disable dblclick zoom specifically - this prevents the double-click zoom behavior
    svg.on("dblclick.zoom", null);

    // Add passive event listeners for better performance
    svg.node().addEventListener('touchstart', function(event) {
      // Empty handler marked as passive
    }, { passive: true });

    svg.node().addEventListener('touchmove', function(event) {
      // Empty handler marked as passive
    }, { passive: true });

    // Catch and disable any attempted drag on the SVG itself - capture phase
    svg.on("mousedown", function(event) {
      // Only prevent default and stop propagation if it's the background or SVG itself
      if (event.target === svgElement || event.target.tagName === "rect") {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
    
    // Modified force simulation settings to reduce vibration
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(220))
      .force("charge", d3.forceManyBody().strength(-550))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.size * 5))
      // Stronger centering forces to prevent vibration
      .force("x", d3.forceX(width/2).strength(0.08))
      .force("y", d3.forceY(height/2).strength(0.08))
      // Higher decay values for more stability and less oscillation
      .velocityDecay(0.4)
      .alphaDecay(0.01)
      .on("tick", () => {
        // Apply boundary constraints during each tick
        data.nodes.forEach(node => {
          const padding = 60; // Padding from edge
          node.x = Math.max(padding, Math.min(width - padding, node.x));
          node.y = Math.max(padding, Math.min(height - padding, node.y));
        });
        
        ticked(links, nodes);
      });
    
    // Create links with enhanced visibility
    const links = linkGroup.selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "rgba(255, 255, 255, 0.4)")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", d => Math.sqrt(d.value) + 0.5);
    
    // Create node groups - each with its own isolated drag behavior
    const nodes = nodeGroup.selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("class", "nodeGroup")
      .call(d3.drag()
        .on("start", event => dragstarted(event, simulation))
        .on("drag", dragged)
        .on("end", event => dragended(event, simulation)));
    
    // Update positions on each tick
    function ticked(links, nodes) {
      links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      nodes
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
    }
    
    return {
      svg,
      zoom,
      nodeGroup,
      linkGroup,
      particleGroup,
      simulation,
      links,
      nodes
    };
}

// Drag functions
function dragstarted(event, simulation) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragended(event, simulation) {
  if (!event.active) simulation.alphaTarget(0.2);
  
  if (!event.subject.isSelected) {
    setTimeout(() => {
      event.subject.fx = null;
      event.subject.fy = null;
      
      setTimeout(() => {
        simulation.alphaTarget(0);
      }, 100);
    }, 50);
  }
}

// Create node elements with improved visibility
export function createNodeElements(nodes, styles) {
  // Increase node size multiplier for all nodes
  const sizeMultiplier = 1.3;
  
  // Create gradient definitions for each node
  const defs = d3.select("svg").select("defs");
  if (defs.empty()) {
    d3.select("svg").append("defs");
  }
  
  // For each node, create a radial gradient - using white as requested
  nodes.each(function(d) {
    const gradientId = `node-gradient-${d.id}`;
    
    // Create gradient - all WHITE as requested
    const gradient = d3.select("svg").select("defs").append("radialGradient")
      .attr("id", gradientId)
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%")
      .attr("fx", "50%")
      .attr("fy", "50%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 1); // Center white and fully opaque

    gradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 0.5); // Middle part starts to fade

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 0.05); // Outer edge almost transparent
    
    // Create hover version of gradient with higher opacity
    const hoverGradientId = `node-hover-gradient-${d.id}`;
    const hoverGradient = d3.select("svg").select("defs").append("radialGradient")
      .attr("id", hoverGradientId)
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%")
      .attr("fx", "50%")
      .attr("fy", "50%");

    hoverGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 1); // Center white and fully opaque

    hoverGradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 0.9); // More opaque in middle for hover state

    hoverGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 0.3); // More opaque at edges for hover state
      
    // Create a second gradient for the inner circle - with RGB 249, 115, 22 (orange) as requested
    const innerGradientId = `node-inner-gradient-${d.id}`;
    const innerGradient = d3.select("svg").select("defs").append("radialGradient")
      .attr("id", innerGradientId)
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "100%");
      
    innerGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgb(249, 115, 22)") // Orange color as requested
      .attr("stop-opacity", 1);
      
    innerGradient.append("stop")
      .attr("offset", "90%")
      .attr("stop-color", "rgb(249, 115, 22)") // Orange color as requested
      .attr("stop-opacity", 1);
      
    // Associate the gradients with the node
    d.gradientId = gradientId;
    d.hoverGradientId = hoverGradientId;
    d.innerGradientId = innerGradientId;
  });
  
  // Create a group for each node to organize elements
  const nodeGroups = nodes.append("g")
    .attr("class", "node-elements");
  
  // First add the glow effect layer with gradient that starts at the edge of white circle
  nodeGroups.append("circle")
    .attr("r", d => Math.max(d.size * 2.4 * sizeMultiplier, 10)) // Minimum size for small screens
    .attr("fill", d => `url(#${d.gradientId})`)
    .attr("class", "nodeGlow")
    .style("pointer-events", "none") // Ensure it doesn't interfere with events
    .style("opacity", 1); // Full opacity for the element itself
  
  // Create outer circles for nodes - full opacity white circles
  nodeGroups.append("circle")
    .attr("r", d => Math.max(d.size * 1.5 * sizeMultiplier, 8)) // Minimum size for small screens
    .attr("fill", "#ffffff")
    .attr("fill-opacity", 1)
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.3)
    .attr("class", styles.nodeCircle);
  
  // Add a background solid color circle behind the gradient inner circle
  // This ensures the orange is visible even if gradient rendering has issues
  nodeGroups.append("circle")
    .attr("r", d => Math.max(d.size * 1.2 * sizeMultiplier, 6)) // Match inner circle size 
    .attr("fill", "rgb(249, 115, 22)") // Solid orange as fallback
    .attr("class", "innerCircleBg")
    .style("pointer-events", "none");
    
  // Add inner circle with custom gradient (orange)
  nodeGroups.append("circle")
    .attr("r", d => Math.max(d.size * 1.2 * sizeMultiplier, 6)) // Minimum size for small screens
    .attr("fill", d => `url(#${d.innerGradientId})`)
    .attr("stroke", "rgba(249, 115, 22, 0.7)") // Add subtle orange stroke
    .attr("stroke-width", 1)
    .attr("fill-opacity", 1)
    .attr("class", styles.nodeInnerCircle)
    .style("pointer-events", "none"); // Ensure it doesn't block events
  
  // Calculate text width and height properly
  const calculateTextWidth = (text) => {
    // Approximate width calculation based on character count
    return Math.max(text.length * 7, 40); // Ensure minimum width
  };
  
  // Create a better positioned text background rect
  nodeGroups.append("rect")
    .attr("class", "textBackground")
    .attr("x", d => -calculateTextWidth(d.name) / 2) // Center horizontally
    .attr("y", d => Math.max(d.size * 1.8 * sizeMultiplier, 12)) // Position further below node with minimum
    .attr("width", d => calculateTextWidth(d.name)) // More precise width based on text
    .attr("height", 22) // Fixed height
    .attr("rx", 4) // Rounded corners
    .attr("ry", 4) // Rounded corners
    .attr("fill", "rgba(0, 0, 0, 0.7)") // Darker background for better readability
    .attr("opacity", 0.9); // Higher opacity
  
  // Add node labels with consistent, larger font size - MOVED BELOW the node
  nodeGroups.append("text")
    .text(d => d.name)
    .attr("class", "nodeLabel")
    .attr("font-size", "12px") // Fixed font size for consistency
    .attr("text-anchor", "middle")
    .attr("dy", d => Math.max(d.size * 1.8 * sizeMultiplier, 12) + 15) // Vertically centered in background
    .attr("fill", "#ffffff")
    .attr("fill-opacity", 1)
    .attr("font-family", "'Montserrat', 'Segoe UI', 'Roboto', sans-serif")
    .attr("font-weight", 500) // Slightly bolder for better readability
    .style("text-shadow", "0px 0px 2px rgba(0,0,0,0.5)"); // Subtle shadow for readability
    
  // Add hover effects to node groups
  nodeGroups
    .on("mouseover", function(event, d) {
      if (d.isSelected) return; // Skip hover effect if node is selected
      
      // Apply hover gradient to glow
      d3.select(this).select(".nodeGlow")
        .attr("fill", `url(#${d.hoverGradientId})`)
        .transition().duration(200)
        .attr("r", d => Math.max(d.size * 2.6 * sizeMultiplier, 11)); // Slightly larger on hover
      
      // Enlarge inner and outer circles slightly
      d3.select(this).select(`.${styles.nodeCircle}`)
        .transition().duration(200)
        .attr("r", d => Math.max(d.size * 1.55 * sizeMultiplier, 8.5));
        
      d3.select(this).select(`.${styles.nodeInnerCircle}`)
        .transition().duration(200)
        .attr("r", d => Math.max(d.size * 1.25 * sizeMultiplier, 6.5));
        
      d3.select(this).select(".innerCircleBg")
        .transition().duration(200)
        .attr("r", d => Math.max(d.size * 1.25 * sizeMultiplier, 6.5));
        
      // Make text background slightly larger
      d3.select(this).select(".textBackground")
        .transition().duration(200)
        .attr("opacity", 1);
    })
    .on("mouseout", function(event, d) {
      if (d.isSelected) return; // Skip reset if node is selected
      
      // Reset gradient to normal 
      d3.select(this).select(".nodeGlow")
        .attr("fill", `url(#${d.gradientId})`)
        .transition().duration(300)
        .attr("r", d => Math.max(d.size * 2.4 * sizeMultiplier, 10));
      
      // Reset circle sizes
      d3.select(this).select(`.${styles.nodeCircle}`)
        .transition().duration(300)
        .attr("r", d => Math.max(d.size * 1.5 * sizeMultiplier, 8));
        
      d3.select(this).select(`.${styles.nodeInnerCircle}`)
        .transition().duration(300)
        .attr("r", d => Math.max(d.size * 1.2 * sizeMultiplier, 6));
      
      d3.select(this).select(".innerCircleBg")
        .transition().duration(300)
        .attr("r", d => Math.max(d.size * 1.2 * sizeMultiplier, 6));
        
      // Reset text background 
      d3.select(this).select(".textBackground")
        .transition().duration(300)
        .attr("opacity", 0.9);
    });
}

// Setup a minimal particle system (all particles removed as they were unnecessary)
export function setupParticleSystem() {
  return { 
    particleInterval: null, 
    motionInterval: null 
  };
}