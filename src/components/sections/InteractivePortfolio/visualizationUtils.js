// src/components/sections/InteractivePortfolio/visualizationUtils.js
import * as d3 from 'd3';


// Update to setupVisualizations - create groups but don't use particles
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
    
    // Catch and disable any attempted drag on the SVG itself - capture phase
    svg.on("mousedown", function(event) {
      // Only prevent default and stop propagation if it's the background or SVG itself
      if (event.target === svgElement || event.target.tagName === "rect") {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
    
    // Force simulation with improved settings for a more balanced layout
    // INCREASED distances and forces to spread nodes apart more
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(220)) // Increased from 150 to 220
      .force("charge", d3.forceManyBody().strength(-550)) // Much stronger repulsion (from -350 to -550)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.size * 5)) // Increased from 3 to 5
      .force("x", d3.forceX(width/2).strength(0.05)) 
      .force("y", d3.forceY(height/2).strength(0.05))
      .velocityDecay(0.3) // Higher decay for more stable positions
      .alphaDecay(0.008) // Slightly slower cooling for better layout
      .on("tick", () => ticked(links, nodes));
    
    // Create links with enhanced visibility
    const links = linkGroup.selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "rgba(255, 255, 255, 0.4)") // More visible white links
      .attr("stroke-opacity", 0.5) // Higher opacity for better visibility
      .attr("stroke-width", d => Math.sqrt(d.value) + 0.5); // Slightly thicker
    
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



// Updated createNodeElements function with correct inner circle size
export function createNodeElements(nodes, styles) {
  // Increase node size multiplier for all nodes
  const sizeMultiplier = 1.3; // Increase overall node size by 30%
  
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
  .attr("stop-opacity", 1); // merkezde beyaz ve tamamen opak

gradient.append("stop")
  .attr("offset", "50%")
  .attr("stop-color", "#ffffff")
  .attr("stop-opacity", 0.7); // orta kısımda şeffaflaşmaya başlar

gradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#ffffff")
  .attr("stop-opacity", 0.1); // dışta tamamen şeffaf (arka plan siyahsa bu kararma gibi görünür)

      
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
      
    // Associate the gradient with the node
    d.gradientId = gradientId;
    d.innerGradientId = innerGradientId;
  });
  
  // Create a group for each node to organize elements
  const nodeGroups = nodes.append("g")
    .attr("class", "node-elements");
  
  // First add the glow effect layer with gradient that starts at the edge of white circle
  nodeGroups.append("circle")
    .attr("r", d => d.size * 2.4 * sizeMultiplier) // Larger gradient circle
    .attr("fill", d => `url(#${d.gradientId})`)
    .attr("class", "nodeGlow")
    .style("pointer-events", "none") // Ensure it doesn't interfere with events
    .style("opacity", 1); // Full opacity for the element itself
  
  // Create outer circles for nodes - full opacity white circles
  nodeGroups.append("circle")
    .attr("r", d => d.size * 1.5 * sizeMultiplier)
    .attr("fill", "#ffffff")
    .attr("fill-opacity", 1)
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.3)
    .attr("class", styles.nodeCircle);
  
  // Add inner circle with custom gradient (orange) - RESTORED TO ORIGINAL SIZE
  nodeGroups.append("circle")
    .attr("r", d => d.size * 1.2 * sizeMultiplier) // Restored to original size (1.2×)
    .attr("fill", d => `url(#${d.innerGradientId})`)
    .attr("fill-opacity", 1)
    .attr("class", styles.nodeInnerCircle);
  
  // Create a text background rect first (below the node)
  nodeGroups.append("rect")
    .attr("class", "textBackground")
    .attr("x", d => -d.name.length * 3.5) // Estimate width based on text length
    .attr("y", d => d.size * sizeMultiplier + 5) // Position below node
    .attr("width", d => d.name.length * 7) // Estimate width based on text length
    .attr("height", 22) // Fixed height
    .attr("rx", 4) // Rounded corners
    .attr("ry", 4) // Rounded corners
    .attr("fill", "rgba(0, 0, 0, 0.5)") // Semi-transparent black background
    .attr("opacity", 0.8);
  
  // Add node labels with consistent, larger font size - BELOW the node
  nodeGroups.append("text")
    .text(d => d.name)
    .attr("class", "nodeLabel")
    .attr("font-size", d => Math.max(d.size * 0.7, 12) + "px") // Ensure minimum font size of 12px
    .attr("text-anchor", "middle")
    .attr("dy", d => d.size * sizeMultiplier + 18) // Positioned below node
    .attr("fill", "#ffffff")
    .attr("fill-opacity", 1)
    .attr("font-family", "'Montserrat', 'Segoe UI', 'Roboto', sans-serif")
    .attr("font-weight", 400) // Slightly bolder for better readability
    .style("text-shadow", "0px 0px 3px rgba(0,0,0,0.5)"); // Lighter shadow with background
}

// Updated handleNodeTransformation function with color transition and other fixes
// Updated handleNodeTransformation function with correct inner circle size
export function handleNodeTransformation(nodeGroup, d, containerWidth, containerHeight, svg, zoom, styles) {
  // Making the panel smaller as requested
  const panelWidth = Math.min(280, containerWidth * 0.6);
  const panelHeight = Math.min(220, containerHeight * 0.6);
  
  // Thinner border margin
  const borderMargin = 2;
  
  // Get references to circles
  const innerCircle = nodeGroup.select(`.${styles.nodeInnerCircle}`);
  const outerCircle = nodeGroup.select(`.${styles.nodeCircle}`);
  const nodeGlow = nodeGroup.select(".nodeGlow");
  const textBackground = nodeGroup.select(".textBackground");
  const nodeLabel = nodeGroup.select(".nodeLabel");
  
  // Get current node position
  const nodeX = d.x;
  const nodeY = d.y;
  
  // Check if node is too close to edges and adjust zoom target to keep panel in view
  const safeX = Math.max(panelWidth/2, Math.min(containerWidth - panelWidth/2, nodeX));
  const safeY = Math.max(panelHeight/2, Math.min(containerHeight - panelHeight/2, nodeY));
  
  // IMPORTANT: Fix the position immediately to prevent vibration during transformation
  d.fx = d.x; 
  d.fy = d.y;
  
  // Move this node to the front
  nodeGroup.raise();
  
  // Hide label and background
  textBackground.transition().duration(300).style("opacity", 0);
  nodeLabel.transition().duration(300).style("opacity", 0);
  
  // Start transformation IMMEDIATELY - don't wait for zoom
  // 1. Prepare the outer white rectangle (initially sized same as circle)
  const sizeMultiplier = 1.3;
  const innerCircleRadius = d.size * 1.2 * sizeMultiplier; // Correct original size (1.2×)
  const outerCircleRadius = d.size * 1.5 * sizeMultiplier;
  
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
  
  // 2. Prepare the inner colored rectangle - using rgb(15, 23, 42) as target color
  // Initially with orange color from node
  const innerRect = nodeGroup.append("rect")
    .attr("class", "innerRect")
    .attr("x", -innerCircleRadius)
    .attr("y", -innerCircleRadius)
    .attr("width", innerCircleRadius * 2)
    .attr("height", innerCircleRadius * 2)
    .attr("rx", innerCircleRadius)
    .attr("ry", innerCircleRadius)
    .attr("fill", "rgb(249, 115, 22)") // Start with orange color
    .attr("fill-opacity", 1);
  
  // 3. Hide the original circles and glow
  innerCircle.style("opacity", 0);
  outerCircle.style("opacity", 0);
  if (nodeGlow) nodeGlow.style("opacity", 0);
  
  // Zoom to the safe node position
  const scale = 2.5;
  const translate = [
    containerWidth / 2 - safeX * scale, 
    containerHeight / 2 - safeY * scale
  ];
  
  const transform = d3.zoomIdentity
    .translate(translate[0], translate[1])
    .scale(scale);
  
  // Perform zoom simultaneously with rectangle animation
  svg.transition()
    .duration(750)
    .call(zoom.transform, transform);
  
  // 4. Animate rectangles growing while zoom happens
  outerRect.transition()
    .duration(1200)
    .ease(d3.easeCubicInOut)
    .attr("x", -panelWidth / 2)
    .attr("y", -panelHeight / 2)
    .attr("width", panelWidth)
    .attr("height", panelHeight)
    .attr("rx", 8) // Smaller rounded corners
    .attr("ry", 8);
  
  // Use smaller border margin and animate color change from orange to dark blue
  innerRect.transition()
    .duration(1200)
    .ease(d3.easeCubicInOut)
    .attr("x", -panelWidth / 2 + borderMargin)
    .attr("y", -panelHeight / 2 + borderMargin)
    .attr("width", panelWidth - (borderMargin * 2))
    .attr("height", panelHeight - (borderMargin * 2))
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("fill", "rgb(15, 23, 42)"); // Transition to dark blue color
  
  // Store the border margin for use in handleNodeReturn
  d.borderMargin = borderMargin;
  
  // 6. Add content after the rectangles have expanded
  setTimeout(() => {
    addContentPanel(nodeGroup, d, panelWidth, panelHeight, svg, zoom, styles);
  }, 900);
}

// Updated addContentPanel function to ensure content is visible
function addContentPanel(nodeGroup, d, panelWidth, panelHeight, svg, zoom, styles) {
  // Create content container - minimal padding to maximize content area
  const foreignObject = nodeGroup.append("foreignObject")
    .attr("x", -panelWidth / 2 + 12) // Small padding for comfort
    .attr("y", -panelHeight / 2 + 12)
    .attr("width", panelWidth - 24) // Match inner blue rectangle with small padding
    .attr("height", panelHeight - 24)
    .attr("class", styles.panelContent)
    .style("opacity", 0);
  
  // Make sure we can track this element easily
  foreignObject.classed("node-panel-content", true);
  
  // Add HTML content - fixed layout for better space utilization
  foreignObject.append("xhtml:div")
    .style("color", "white")
    .style("height", "100%")
    .style("overflow", "auto")
    .style("display", "flex")
    .style("flex-direction", "column")
    .html(`
      <div class="${styles.panelContainer}">
        <div class="${styles.panelHeader}">
          <h2 style="margin: 0; font-size: 18px; font-weight: 500;">${d.name}</h2>
        </div>
        <div class="${styles.panelBody}">
          <p style="font-size: 14px; line-height: 1.5; margin-top: 8px;">${d.content || "No content available"}</p>
        </div>
      </div>
    `);
  
  // Add close button absolutely positioned in the top right corner
  const closeButton = nodeGroup.append("g")
    .attr("class", "close-button")
    .attr("transform", `translate(${panelWidth/2 - 18}, ${-panelHeight/2 + 18})`)
    .style("cursor", "pointer");
    
  // Circle background for close button
  closeButton.append("circle")
    .attr("r", 12)
    .attr("fill", "rgba(255, 255, 255, 0.1)")
    .attr("stroke", "rgba(255, 255, 255, 0.3)")
    .attr("stroke-width", 1);
    
  // X symbol
  closeButton.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("fill", "#ffffff")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("×");
  
  // Add hover effect to close button
  closeButton
    .on("mouseover", function() {
      d3.select(this).select("circle").attr("fill", "rgba(255, 255, 255, 0.2)");
    })
    .on("mouseout", function() {
      d3.select(this).select("circle").attr("fill", "rgba(255, 255, 255, 0.1)");
    });
  
  // Fade in the content
  foreignObject.transition()
    .duration(400)
    .style("opacity", 1);
  
  // Add event listener to close button
  closeButton.on("click", function(event) {
    // Prevent the event from bubbling
    event.stopPropagation();
    
    // Trigger deselection
    d.isSelected = false;
    
    handleNodeReturn(nodeGroup, d, styles, svg, zoom);
  });
}

// Updated handleNodeReturn function with correct inner circle size
export function handleNodeReturn(nodeGroup, d, styles, svg, zoom) {
  // Get references to SVG elements
  const innerCircle = nodeGroup.select(`.${styles.nodeInnerCircle}`);
  const outerCircle = nodeGroup.select(`.${styles.nodeCircle}`);
  const nodeGlow = nodeGroup.select(".nodeGlow");
  const innerRect = nodeGroup.select(".innerRect");
  const outerRect = nodeGroup.select(".outerRect");
  const foreignObject = nodeGroup.select(`.${styles.panelContent}`);
  const closeButton = nodeGroup.select(".close-button");
  
  // Get the border margin that was used (if stored, otherwise use default)
  const borderMargin = d.borderMargin || 2;
  
  // Store original sizes for restoration
  const sizeMultiplier = 1.3;
  const innerCircleRadius = d.size * 1.2 * sizeMultiplier; // Correct original size (1.2×)
  const outerCircleRadius = d.size * 1.5 * sizeMultiplier;
  const glowRadius = d.size * 2.4 * sizeMultiplier; // Enlarged glow circle
  
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
  
  // Remove close button
  if (!closeButton.empty()) {
    closeButton
      .transition()
      .duration(300)
      .style("opacity", 0)
      .remove();
  }
  
  // Reset zoom
  if (svg && zoom) {
    svg.transition()
      .duration(500)
      .call(zoom.transform, d3.zoomIdentity);
  }
  
  // Ensure both rectangles exist
  if (innerRect.empty() || outerRect.empty()) {
    // If rectangles don't exist, create them at the expanded size
    const panelWidth = 280; // Match our new smaller panel size
    const panelHeight = 220;
    
    nodeGroup.append("rect")
      .attr("class", "outerRect")
      .attr("x", -panelWidth / 2)
      .attr("y", -panelHeight / 2)
      .attr("width", panelWidth)
      .attr("height", panelHeight)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "#ffffff")
      .attr("fill-opacity", 1);
    
    nodeGroup.append("rect")
      .attr("class", "innerRect")
      .attr("x", -panelWidth / 2 + borderMargin)
      .attr("y", -panelHeight / 2 + borderMargin)
      .attr("width", panelWidth - (borderMargin * 2))
      .attr("height", panelHeight - (borderMargin * 2))
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("fill", "rgb(15, 23, 42)") // Dark blue
      .attr("fill-opacity", 1);
  }
  
  // Get updated references to rectangles
  const updatedInnerRect = nodeGroup.select(".innerRect");
  const updatedOuterRect = nodeGroup.select(".outerRect");
  
  // Ensure circles maintain their proper size
  innerCircle.style("opacity", 1).attr("r", innerCircleRadius);
  outerCircle.style("opacity", 1).attr("r", outerCircleRadius);
  if (nodeGlow) nodeGlow.style("opacity", 1).attr("r", glowRadius);
  
  // Make text and background visible again
  nodeGroup.select(".textBackground").style("opacity", 0.8);
  nodeGroup.select(".nodeLabel").style("opacity", 1);
  
  // Wait a bit for zoom to settle before shrinking
  setTimeout(() => {
    // Shrink both rectangles simultaneously and transition color back to orange
    updatedInnerRect.transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr("x", -innerCircleRadius)
      .attr("y", -innerCircleRadius)
      .attr("width", innerCircleRadius * 2)
      .attr("height", innerCircleRadius * 2)
      .attr("rx", innerCircleRadius)
      .attr("ry", innerCircleRadius)
      .attr("fill", "rgb(249, 115, 22)"); // Transition back to orange
    
    updatedOuterRect.transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr("x", -outerCircleRadius)
      .attr("y", -outerCircleRadius)
      .attr("width", outerCircleRadius * 2)
      .attr("height", outerCircleRadius * 2)
      .attr("rx", outerCircleRadius)
      .attr("ry", outerCircleRadius)
      .style("filter", "drop-shadow(0 0 0px rgba(0,0,0,0))")
      .on("end", function() {
        // Once animation is complete, remove rectangles
        updatedInnerRect.remove();
        updatedOuterRect.remove();
        
        // Ensure circles have correct sizes - important final check
        innerCircle.attr("r", innerCircleRadius);
        outerCircle.attr("r", outerCircleRadius);
        if (nodeGlow) nodeGlow.attr("r", glowRadius);
          
        // IMPORTANT: Release the fixed position AFTER animation completes
        // This prevents vibration during animation
        setTimeout(() => {
          d.fx = null;
          d.fy = null;
        }, 100);
      });
  }, 200);
}
export function setupParticleSystem(particleGroup, data, simulation) {
  // Return empty intervals (no actual particles created)
  return { 
    particleInterval: null, 
    motionInterval: null 
  };
}