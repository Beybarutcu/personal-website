// src/components/sections/InteractivePortfolio/visualizationUtils.js
import * as d3 from 'd3';

// Function to center the portfolio section in the viewport
export function centerPortfolioSection(sectionRef) {
  console.log('centerPortfolioSection called!');
  
  if (!sectionRef?.current) {
    console.log('No sectionRef or current');
    return;
  }
  
  // Find the interactive visualization container (the actual SVG container)
  const container = sectionRef.current.querySelector('.interactivePortfolioContainer') ||
                   sectionRef.current.querySelector('[class*="interactivePortfolioContainer"]');
  
  console.log('Container found:', container);
  
  if (!container) {
    console.log('No container found');
    return;
  }
  
  // Get the container's bounding rect for more accurate positioning
  const containerRect = container.getBoundingClientRect();
  const currentScrollY = window.pageYOffset;
  
  // Calculate the absolute position of the container top
  const containerAbsoluteTop = containerRect.top + currentScrollY;
  
  console.log('Container rect top:', containerRect.top);
  console.log('Current scroll Y:', currentScrollY);
  console.log('Container absolute top:', containerAbsoluteTop);
  
  // Account for the fixed header height
  const headerHeight = 80;
  
  // Calculate scroll position to put container right below header
  const targetScroll = containerAbsoluteTop - headerHeight;
  
  console.log('Target scroll position:', targetScroll);
  
  // Scroll to position the visualization area at the top of viewport
  window.scrollTo({
    top: Math.max(0, targetScroll),
    behavior: 'smooth'
  });
  
  console.log('Scroll command executed to:', Math.max(0, targetScroll));
}

// Responsive node size multiplier based on screen width
function getResponsiveNodeSizeMultiplier() {
  const width = window.innerWidth;
  if (width < 480) return 0.7;
  if (width < 768) return 0.9;
  if (width < 1200) return 1.1;
  return 1.3;
}

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
      .force("collision", d3.forceCollide().radius(d => d.size * 4 * getResponsiveNodeSizeMultiplier()))
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
  // Use responsive node size multiplier
  const sizeMultiplier = 1.2 * getResponsiveNodeSizeMultiplier();

  // Increase node size multiplier for all nodes
  // const sizeMultiplier = 1.3;
  
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

// Add this improved setupParticleSystem function to your visualizationUtils.js file
// Make sure to keep all your other functions like setupVisualizations, createNodeElements, etc.

export function setupParticleSystem(particleGroup, data, simulation) {
  if (!particleGroup || !data || !data.links || !simulation) {
    console.warn("Missing required parameters for particle system");
    return { 
      particleInterval: null, 
      motionInterval: null,
      cleanup: () => {} // Empty cleanup function to prevent errors
    };
  }
  
  // Create a reference to store active particles
  const activeParticles = [];
  
  // Signal configuration
  const signalConfig = {
    size: 2.5,            // Size of the signal dots
    speed: 0.012,         // Speed of signal travel (reduced for smoother motion)
    spawnRate: 750,      // Average time between signal spawns in ms
    maxSignals: 16,        // Maximum number of signals active at once
    duration: 2500,       // How long a signal lives in ms (increased slightly)
    color: "#ffffff",     // Color of signals
    glow: true,           // Whether signals have a glow effect
    randomizeStart: true, // Whether to start signals at random positions on links
    minLinkValue: 0.5,    // Only create signals on links with value >= this
    opacityMax: 0.6,      // Maximum opacity of particles
    useRaf: true          // Use requestAnimationFrame instead of setInterval for smoother animation
  };
  
  // Function to create a new signal/particle
  const createSignal = () => {
    // Don't exceed max signals
    if (activeParticles.length >= signalConfig.maxSignals) {
      return;
    }
    
    // Get valid links (ones with both source and target nodes defined)
    const validLinks = data.links.filter(link => 
      link.source && 
      link.target && 
      typeof link.source !== 'string' && // Make sure it's a node object, not just an ID
      typeof link.target !== 'string' &&
      link.source.id !== link.target.id &&
      (link.value === undefined || link.value >= signalConfig.minLinkValue)
    );
    
    if (validLinks.length === 0) return;
    
    // Randomly select a link to add a signal to
    const linkIndex = Math.floor(Math.random() * validLinks.length);
    const link = validLinks[linkIndex];
    
    // Create the signal particle
    const signalParticle = particleGroup.append("circle")
      .attr("r", signalConfig.size)
      .attr("fill", signalConfig.color)
      .style("opacity", 0)
      .attr("class", "signal-particle"); // Add a class for easier selection
    
    // Add glow effect if enabled
    if (signalConfig.glow) {
      signalParticle.style("filter", "drop-shadow(0 0 2px rgba(255, 255, 255, 0.8))");
    }
    
    // Random starting position along the link if enabled
    const progress = signalConfig.randomizeStart ? Math.random() * 0.3 : 0;
    
    // Store particle data with reference to the actual source and target nodes
    const particle = {
      element: signalParticle,
      source: link.source, // Store direct references to nodes
      target: link.target,
      progress: progress,  // Position along the path (0-1)
      lastProgress: progress, // For interpolation
      speed: signalConfig.speed * (0.8 + Math.random() * 0.4), // Slight speed variation
      createdAt: Date.now(),
      lastUpdate: Date.now(),
      duration: signalConfig.duration * (0.8 + Math.random() * 0.4) // Slight duration variation
    };
    
    // Update the initial position
    updateParticlePosition(particle);
    
    // Track this particle
    activeParticles.push(particle);
    
    // Fade in the particle
    signalParticle.transition()
      .duration(200)
      .style("opacity", signalConfig.opacityMax);
  };
  
  // Function to update a single particle's position
  const updateParticlePosition = (particle) => {
    if (!particle || !particle.source || !particle.target) return;
    
    const sourceX = particle.source.x;
    const sourceY = particle.source.y;
    const targetX = particle.target.x;
    const targetY = particle.target.y;
    
    // Make sure source and target positions are defined
    if (sourceX === undefined || sourceY === undefined || 
        targetX === undefined || targetY === undefined) {
      return;
    }
    
    // Calculate current position
    const x = sourceX + (targetX - sourceX) * particle.progress;
    const y = sourceY + (targetY - sourceY) * particle.progress;
    
    // Update signal position
    particle.element.attr("cx", x).attr("cy", y);
  };
  
  // Function to update all signal positions with smooth interpolation
  const updateSignals = (timestamp) => {
    const currentTime = Date.now();
    
    // Update each particle's position
    for (let i = activeParticles.length - 1; i >= 0; i--) {
      const particle = activeParticles[i];
      
      // Calculate time since last update for smooth movement
      const deltaTime = currentTime - particle.lastUpdate;
      particle.lastUpdate = currentTime;
      
      // Check if particle has expired
      if (currentTime - particle.createdAt > particle.duration) {
        // Fade out and remove expired particles
        particle.element.transition()
          .duration(200)
          .style("opacity", 0)
          .on("end", function() {
            d3.select(this).remove();
          });
        
        // Remove from active particles
        activeParticles.splice(i, 1);
        continue;
      }
      
      // Store last progress for interpolation
      particle.lastProgress = particle.progress;
      
      // Update progress based on elapsed time for smooth movement
      // This makes the animation speed independent of frame rate
      const progressDelta = (particle.speed * deltaTime) / 16.67; // Normalized for 60fps
      particle.progress += progressDelta;
      
      // Remove if reached end (progress > 1)
      if (particle.progress >= 1) {
        // Fade out when reaching target
        particle.element.transition()
          .duration(200)
          .style("opacity", 0)
          .on("end", function() {
            d3.select(this).remove();
          });
        
        // Remove from active particles
        activeParticles.splice(i, 1);
        continue;
      }
      
      // Update the particle position based on source and target nodes
      updateParticlePosition(particle);
    }
    
    // Continue animation loop if using requestAnimationFrame
    if (signalConfig.useRaf) {
      rafId = window.requestAnimationFrame(updateSignals);
    }
  };
  
  // Variables to track animation methods
  let particleInterval;
  let motionInterval;
  let rafId;
  
  // Set up animation based on configuration
  if (signalConfig.useRaf) {
    // Use requestAnimationFrame for smoother animation
    rafId = window.requestAnimationFrame(updateSignals);
    particleInterval = setInterval(createSignal, signalConfig.spawnRate);
    motionInterval = null; // Not used with RAF
  } else {
    // Use interval-based animation (fallback)
    particleInterval = setInterval(createSignal, signalConfig.spawnRate);
    motionInterval = setInterval(updateSignals, 16); // ~60fps
  }
  
  // Update particles when nodes are dragged (crucial for keeping particles on links)
  const onTick = () => {
    // Update all active particles' positions when simulation ticks
    activeParticles.forEach(updateParticlePosition);
  };
  
  // Add the tick listener to the simulation
  simulation.on("tick.particles", onTick);
  
  // After a short delay, create initial signals for immediate visual feedback
  setTimeout(() => {
    // Create a few initial signals
    for (let i = 0; i < Math.min(3, signalConfig.maxSignals); i++) {
      createSignal();
    }
  }, 500);
  
  // Return cleanup functions
  return {
    particleInterval,
    motionInterval,
    cleanup: () => {
      // Clear intervals
      if (particleInterval) clearInterval(particleInterval);
      if (motionInterval) clearInterval(motionInterval);
      
      // Cancel animation frame if using RAF
      if (rafId) window.cancelAnimationFrame(rafId);
      
      // Remove tick listener from simulation
      simulation.on("tick.particles", null);
      
      // Remove all existing particles
      particleGroup.selectAll(".signal-particle").remove();
    }
  };
}