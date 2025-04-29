// src/components/sections/InteractivePortfolio/visualizationUtils.js
import * as d3 from 'd3';

// Set up the main visualization elements
export function setupVisualizations(svgElement, width, height, data) {
    // Create SVG element first WITHOUT zoom behavior
    const svg = d3.select(svgElement)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);
    
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
    
    // Add background (with no event handlers)
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#background-gradient)")
      .style("pointer-events", "none"); // Disable all events on background
    
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
    
    // Catch and disable any attempted drag on the SVG itself - capture phase
    svg.on("mousedown", function(event) {
      // Only prevent default and stop propagation if it's the background or SVG itself
      if (event.target === svgElement || event.target.tagName === "rect") {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
    
    // Force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.size * 3))
      .force("x", d3.forceX().strength(0.05))
      .force("y", d3.forceY().strength(0.05))
      .velocityDecay(0.2)
      .alphaDecay(0.01)
      .on("tick", () => ticked(links, nodes));
    
    // Create links
    const links = linkGroup.selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "#424242")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", d => Math.sqrt(d.value));
    
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

// Create tooltip
export function setupTooltip() {
  return d3.select("body").append("div")
    .attr("class", "nodeTooltip")
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
    .style("font-family", "'Montserrat', 'Segoe UI', 'Roboto', sans-serif")
    .style("font-weight", 300);
}

export function createNodeElements(nodes, tooltip, styles) {
  // Create outer circles for nodes - full opacity white circles
  nodes.append("circle")
    .attr("r", d => d.size * 1.5)
    .attr("fill", "#ffffff")
    .attr("fill-opacity", 1)
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.3)
    .attr("class", styles.nodeCircle)
    .on("mouseover", function(event, d) {
      // Mark as hovered to track state
      d.isHovered = true;
      
      // Only animate if not selected
      if (!d.isSelected) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr("r", d.size * 1.8);
        
        d3.select(this.parentNode).select(`.${styles.nodeInnerCircle}`)
          .transition()
          .duration(300)
          .attr("r", d.size * 1.4);
      }
      
      // Show tooltip
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(d.name)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event, d) {
      // Mark as not hovered
      d.isHovered = false;
      
      // Only animate if not selected
      if (!d.isSelected) {
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
  
  // Add inner circle with rgb(31, 41, 55) color
  nodes.append("circle")
    .attr("r", d => d.size * 1.2)
    .attr("fill", "rgb(31, 41, 55)")
    .attr("fill-opacity", 1)
    .attr("class", styles.nodeInnerCircle);
  
  // Add node labels
  nodes.append("text")
    .text(d => d.name)
    .attr("class", "nodeLabel")
    .attr("font-size", d => d.size * 0.6 + "px")
    .attr("text-anchor", "middle")
    .attr("dy", d => d.size + 15)
    .attr("fill", "#ffffff")
    .attr("fill-opacity", 0.8)
    .attr("font-family", "'Montserrat', 'Segoe UI', 'Roboto', sans-serif")
    .attr("font-weight", 300);
}

// Updated handleNodeTransformation function with smaller border and contained panel
export function handleNodeTransformation(nodeGroup, d, containerWidth, containerHeight, svg, zoom, styles) {
  // Making the panel more constrained so it stays within bounds
  const panelWidth = Math.min(350, containerWidth * 0.8);
  const panelHeight = Math.min(280, containerHeight * 0.8);
  
  // Thinner border margin as requested
  const borderMargin = 3; // Reduced to 3px
  
  // Get references to circles
  const innerCircle = nodeGroup.select(`.${styles.nodeInnerCircle}`);
  const outerCircle = nodeGroup.select(`.${styles.nodeCircle}`);
  
  // Get current node position
  const nodeX = d.x;
  const nodeY = d.y;
  
  // Check if node is too close to edges and adjust zoom target to keep panel in view
  const safeX = Math.max(panelWidth/2, Math.min(containerWidth - panelWidth/2, nodeX));
  const safeY = Math.max(panelHeight/2, Math.min(containerHeight - panelHeight/2, nodeY));
  
  // Move this node to the front
  nodeGroup.raise();
  
  // First, zoom to the safe node position
  const scale = 2.5;
  const translate = [
    containerWidth / 2 - safeX * scale, 
    containerHeight / 2 - safeY * scale
  ];
  
  const transform = d3.zoomIdentity
    .translate(translate[0], translate[1])
    .scale(scale);
  
  svg.transition()
    .duration(750)
    .call(zoom.transform, transform);
  
  // After zooming, begin the transformation
  setTimeout(() => {
    // 1. Prepare the outer white rectangle (initially sized same as circle)
    const outerRect = nodeGroup.append("rect")
      .attr("class", "outerRect")
      .attr("x", -d.size * 1.5)
      .attr("y", -d.size * 1.5)
      .attr("width", d.size * 3)
      .attr("height", d.size * 3)
      .attr("rx", d.size * 1.5)
      .attr("ry", d.size * 1.5)
      .attr("fill", "#ffffff")
      .attr("fill-opacity", 1)
      .style("filter", "drop-shadow(0 0 10px rgba(0,0,0,0.5))");
    
    // 2. Prepare the inner blue-black rectangle
    const innerRect = nodeGroup.append("rect")
      .attr("class", "innerRect")
      .attr("x", -d.size * 1.2)
      .attr("y", -d.size * 1.2)
      .attr("width", d.size * 2.4)
      .attr("height", d.size * 2.4)
      .attr("rx", d.size * 1.2)
      .attr("ry", d.size * 1.2)
      .attr("fill", "rgb(31, 41, 55)")
      .attr("fill-opacity", 1);
    
    // 3. Hide the original circles
    innerCircle.style("opacity", 0);
    outerCircle.style("opacity", 0);
    
    // 4. Animate rectangles growing
    outerRect.transition()
      .duration(1200)
      .ease(d3.easeCubicInOut)
      .attr("x", -panelWidth / 2)
      .attr("y", -panelHeight / 2)
      .attr("width", panelWidth)
      .attr("height", panelHeight)
      .attr("rx", 10)
      .attr("ry", 10);
    
    // Use smaller border margin
    innerRect.transition()
      .duration(1200)
      .ease(d3.easeCubicInOut)
      .attr("x", -panelWidth / 2 + borderMargin)
      .attr("y", -panelHeight / 2 + borderMargin)
      .attr("width", panelWidth - (borderMargin * 2))
      .attr("height", panelHeight - (borderMargin * 2))
      .attr("rx", 6)
      .attr("ry", 6);
    
    // 5. Fade the label
    nodeGroup.select("text.nodeLabel")
      .transition()
      .duration(600)
      .style("opacity", 0);
    
    // 6. Add dark semi-transparent background to the rest of the svg
    const background = svg.insert("rect", ":first-child")
      .attr("class", "darkBackground")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("fill", "rgba(0, 0, 0, 0.7)")
      .style("opacity", 0.5);
      
    // Store reference to the background
    d.darkBackground = background;
    
    // Fade in the dark background
    background.transition()
      .duration(500)
      .style("opacity", 1);
    
    // Store the border margin for use in handleNodeReturn
    d.borderMargin = borderMargin;
    
    // 7. Add content after the rectangles have expanded
    setTimeout(() => {
      addContentPanel(nodeGroup, d, panelWidth, panelHeight, svg, zoom, styles);
    }, 900);
  }, 750);
}
// Add the content panel to the expanded node
function addContentPanel(nodeGroup, d, panelWidth, panelHeight, svg, zoom, styles) {
  // Create content container
  const foreignObject = nodeGroup.append("foreignObject")
    .attr("x", -panelWidth / 2 + 25) // Increased padding
    .attr("y", -panelHeight / 2 + 25)
    .attr("width", panelWidth - 50)
    .attr("height", panelHeight - 50)
    .attr("class", styles.panelContent)
    .style("opacity", 0);
  
  // Make sure we can track this element easily
  foreignObject.classed("node-panel-content", true);
  
  // Add HTML content with enhanced styling for larger panel
  foreignObject.append("xhtml:div")
    .style("color", "white")
    .style("height", "100%")
    .style("overflow", "auto")
    .style("display", "flex")
    .style("flex-direction", "column")
    .html(`
      <div class="${styles.panelContainer}">
        <div class="${styles.panelHeader}">
          <h2 style="margin: 0; font-size: 24px; font-weight: 500;">${d.name}</h2>
        </div>
        <div class="${styles.panelBody}">
          <p style="font-size: 16px; line-height: 1.6;">${d.content}</p>
        </div>
        <div class="${styles.panelClose}" 
             style="position: absolute; top: 10px; right: 10px; font-size: 24px; 
                    width: 36px; height: 36px; display: flex; justify-content: center; 
                    align-items: center; border-radius: 50%; background: rgba(255,255,255,0.1);
                    cursor: pointer; transition: all 0.2s;">×</div>
      </div>
    `);
  
  // Add hover effect to close button
  foreignObject.select(`.${styles.panelClose}`)
    .on("mouseover", function() {
      d3.select(this).style("background", "rgba(255,255,255,0.2)");
    })
    .on("mouseout", function() {
      d3.select(this).style("background", "rgba(255,255,255,0.1)");
    });
  
  // Fade in the content
  foreignObject.transition()
    .duration(400)
    .style("opacity", 1);
  
  // Add event listener to close button
  foreignObject.select("div").on("click", function(event) {
    const target = event.target;
    if (target.classList.contains(styles.panelClose)) {
      // Prevent the event from bubbling
      event.stopPropagation();
      
      // Trigger deselection
      d.isSelected = false;
      
      handleNodeReturn(nodeGroup, d, styles, svg, zoom);
    }
  });
}
// Updated handleNodeReturn with thinner border
export function handleNodeReturn(nodeGroup, d, styles, svg, zoom) {
  // Get references to SVG elements
  const innerCircle = nodeGroup.select(`.${styles.nodeInnerCircle}`);
  const outerCircle = nodeGroup.select(`.${styles.nodeCircle}`);
  const innerRect = nodeGroup.select(".innerRect");
  const outerRect = nodeGroup.select(".outerRect");
  const foreignObject = nodeGroup.select(`.${styles.panelContent}`);
  const darkBackground = d.darkBackground;
  
  // Get the border margin that was used (if stored, otherwise use default)
  const borderMargin = d.borderMargin || 5;
  
  // Interrupt any ongoing transitions
  nodeGroup.selectAll("*").interrupt();
  
  // Hide content with fade-out
  if (!foreignObject.empty()) {
    foreignObject
      .transition()
      .duration(400)
      .style("opacity", 0)
      .remove();
  }
  
  // Fade out the dark background
  if (darkBackground) {
    darkBackground.transition()
      .duration(500)
      .style("opacity", 0)
      .on("end", function() {
        this.remove();
      });
  }
  
  // Ensure both rectangles exist
  if (innerRect.empty() || outerRect.empty()) {
    // If rectangles don't exist, create them at the expanded size
    const panelWidth = 400;
    const panelHeight = 300;
    
    nodeGroup.append("rect")
      .attr("class", "outerRect")
      .attr("x", -panelWidth / 2)
      .attr("y", -panelHeight / 2)
      .attr("width", panelWidth)
      .attr("height", panelHeight)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", "#ffffff")
      .attr("fill-opacity", 1);
    
    nodeGroup.append("rect")
      .attr("class", "innerRect")
      .attr("x", -panelWidth / 2 + borderMargin) // Use the thinner border margin
      .attr("y", -panelHeight / 2 + borderMargin) // Use the thinner border margin
      .attr("width", panelWidth - (borderMargin * 2)) // Adjust width accordingly
      .attr("height", panelHeight - (borderMargin * 2)) // Adjust height accordingly
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("fill", "rgb(31, 41, 55)")
      .attr("fill-opacity", 1);
  }
  
  // Get updated references to rectangles
  const updatedInnerRect = nodeGroup.select(".innerRect");
  const updatedOuterRect = nodeGroup.select(".outerRect");
  
  // Ensure circles are visible behind rectangles
  innerCircle.style("opacity", 1).attr("r", d.size * 1.2);
  outerCircle.style("opacity", 1).attr("r", d.size * 1.5);
  
  // IMPORTANT: Make sure the node isn't fixed
  d.fx = null;
  d.fy = null;
  
  // Shrink both rectangles simultaneously
  updatedInnerRect.transition()
    .duration(1000)
    .ease(d3.easeCubicInOut)
    .attr("x", -d.size * 1.2)
    .attr("y", -d.size * 1.2)
    .attr("width", d.size * 2.4)
    .attr("height", d.size * 2.4)
    .attr("rx", d.size * 1.2)
    .attr("ry", d.size * 1.2);
  
  updatedOuterRect.transition()
    .duration(1000)
    .ease(d3.easeCubicInOut)
    .attr("x", -d.size * 1.5)
    .attr("y", -d.size * 1.5)
    .attr("width", d.size * 3)
    .attr("height", d.size * 3)
    .attr("rx", d.size * 1.5)
    .attr("ry", d.size * 1.5)
    .style("filter", "drop-shadow(0 0 0px rgba(0,0,0,0))")
    .on("end", function() {
      // Once animation is complete, remove rectangles
      updatedInnerRect.remove();
      updatedOuterRect.remove();
      
      // Show the label
      nodeGroup.select("text.nodeLabel")
        .transition()
        .duration(300)
        .style("opacity", 0.8);
    });
  
  // Reset zoom
  if (svg && zoom) {
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
  }
}

// Setup the particle system
export function setupParticleSystem(particleGroup, data, simulation) {
  // Create particles along links
  function createParticles() {
    data.links.forEach(link => {
      if (Math.random() > 0.7) return; // Only create particles for some links
      
      const source = data.nodes.find(n => n.id === link.source.id || n.id === link.source);
      const target = data.nodes.find(n => n.id === link.target.id || n.id === link.target);
      
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
  
  // Add gentle random motion
  function addRandomMotion() {
    data.nodes.forEach(node => {
      if (!node.fx && !node.fy && !node.isSelected) {
        node.vx = (node.vx || 0) + (Math.random() - 0.5) * 0.3;
        node.vy = (node.vy || 0) + (Math.random() - 0.5) * 0.3;
      }
    });
  }
  
  const particleInterval = setInterval(createParticles, 500);
  const motionInterval = setInterval(addRandomMotion, 2000);
  
  return { particleInterval, motionInterval };
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