// src/components/navigation/MindMapNavigation.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { mindMapData, nodeContent } from '../../data/mindMapData';

const MindMapNavigation = ({ onNodeSelect, currentLanguage = 'en' }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [activeNode, setActiveNode] = useState(null);
  
  // Set fixed dimensions immediately to avoid timing issues
  useEffect(() => {
    if (containerRef.current) {
      // Force a fixed height - this is key to making the visualization appear
      containerRef.current.style.height = '600px';
    }
  }, []);
  
  // Update dimensions when component mounts and on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // Use the explicit height we set above
        const height = containerRef.current.clientHeight || 600;
        
        setDimensions({
          width,
          height
        });
      }
    };
    
    // Call it once immediately
    updateDimensions();
    
    // Then set up the listener for future changes
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Create visualization only after dimensions are definitely set
  useEffect(() => {
    // Skip if dimensions aren't available yet or are zero
    if (!dimensions.width || !dimensions.height || !svgRef.current) {
      return;
    }
    
    try {
      // Clear SVG
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();
      
      // Deep clone nodes and links to avoid mutations
      const nodes = JSON.parse(JSON.stringify(mindMapData.nodes)).map(node => ({
        ...node,
        // Make nodes smaller
        size: node.size ? node.size * 0.75 : 15
      }));
      
      const links = JSON.parse(JSON.stringify(mindMapData.links));
      
      // Set up the force simulation
      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink()
          .id(d => d.id)
          .links(links)
          .distance(d => 120 + d.weight * 30)
          .strength(d => 0.6))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2).strength(0.1))
        .force('collision', d3.forceCollide().radius(d => (d.size || 15) * 2.5));
      
      // Add positioning forces by node type
      const nodeTypes = ['main', 'skills', 'interests', 'education', 'projects'];
      
      // Create cluster positioning
      simulation.force('x', d3.forceX().strength(0.1).x(d => {
        const typeIndex = nodeTypes.indexOf(d.type);
        if (typeIndex === -1) return dimensions.width / 2;
        
        // Position clusters at different areas of the screen
        switch(d.type) {
          case 'main':
            return dimensions.width / 2;
          case 'skills':
            return dimensions.width * 0.25;
          case 'interests':
            return dimensions.width * 0.75;
          case 'education':
            return dimensions.width * 0.4;
          case 'projects':
            return dimensions.width * 0.6;
          default:
            return dimensions.width / 2;
        }
      }));
      
      simulation.force('y', d3.forceY().strength(0.1).y(d => {
        const typeIndex = nodeTypes.indexOf(d.type);
        if (typeIndex === -1) return dimensions.height / 2;
        
        // Position clusters at different areas of the screen
        switch(d.type) {
          case 'main':
            return dimensions.height / 2;
          case 'skills':
            return dimensions.height * 0.3;
          case 'interests':
            return dimensions.height * 0.3;
          case 'education':
            return dimensions.height * 0.7;
          case 'projects':
            return dimensions.height * 0.7;
          default:
            return dimensions.height / 2;
        }
      }));
      
      // Create link container and draw links directly 
      const linkGroup = svg.append('g').attr('class', 'links');
      
      const link = linkGroup.selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', 'rgba(255, 255, 255, 0.2)')
        .attr('stroke-opacity', d => d.weight * 0.3 + 0.15)
        .attr('stroke-width', d => d.weight * 0.8);
      
      // Create signal container
      const signalGroup = svg.append('g').attr('class', 'signals');
      
      // Create node container and draw nodes directly
      const nodeGroup = svg.append('g').attr('class', 'nodes');
      
      const node = nodeGroup.selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(d3.drag()
          .on('start', dragStarted)
          .on('drag', dragged)
          .on('end', dragEnded));
      
      // Outer glow for nodes
      node.append('circle')
        .attr('r', d => (d.size || 15) * 1.8)
        .attr('class', 'node-glow')
        .attr('fill', 'rgba(255, 255, 255, 0.05)')
        .attr('stroke', 'rgba(255, 255, 255, 0.2)')
        .attr('stroke-width', 0.5)
        .attr('opacity', d => d.id === activeNode ? 0.7 : 0.4);
      
      // Main node circle
      node.append('circle')
        .attr('r', d => d.size || 15)
        .attr('class', 'node-main')
        .attr('fill', d => {
          if (d.id === activeNode) {
            return 'rgba(255, 255, 255, 0.95)';
          }
          
          const brightnessByType = {
            main: 0.85,
            skills: 0.75,
            projects: 0.7,
            education: 0.65,
            interests: 0.6
          };
          
          const brightness = brightnessByType[d.type] || 0.6;
          const color = Math.floor(255 * brightness);
          return `rgba(${color}, ${color}, ${color}, 0.85)`;
        })
        .attr('stroke', 'rgba(255, 255, 255, 0.9)')
        .attr('stroke-width', d => d.id === activeNode ? 1.2 : 0.5);
      
      // Inner pulse for active node
      node.append('circle')
        .attr('r', d => (d.size || 15) * 0.6)
        .attr('fill', 'rgba(255, 255, 255, 1)') // Pure white
        .attr('opacity', d => d.id === activeNode ? 0.7 : 0)
        .attr('class', 'node-pulse');
      
      // Node labels
      node.append('text')
        .attr('dy', d => (d.size || 15) + 12)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255, 255, 255, 0.9)')
        .attr('font-size', 10)
        .attr('font-weight', d => d.id === activeNode ? 'bold' : 'normal')
        .attr('class', 'node-label')
        .text(d => {
          const label = currentLanguage === 'tr' ? 
            (d.labelTr || d.label || d.id) : 
            (d.labelEn || d.label || d.id);
            
          return label.length > 12 ? label.slice(0, 10) + '...' : label;
        });
      
      // Add click handlers
      node.on('click', function(event, d) {
        // Prevent default
        event.preventDefault();
        event.stopPropagation();
        
        // Set active node
        setActiveNode(d.id);
        
        // Create a starburst effect when node is clicked
        const nodeElement = d3.select(this);
        const nodePosition = {
          x: parseFloat(nodeElement.attr('transform').split('(')[1].split(',')[0]),
          y: parseFloat(nodeElement.attr('transform').split('(')[1].split(',')[1].split(')')[0])
        };
        
        // Create starburst particles
        for (let i = 0; i < 10; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 30 + Math.random() * 70;
          const duration = 700 + Math.random() * 300;
          const size = 1 + Math.random() * 2;
          
          signalGroup.append('circle')
            .attr('class', 'starburst')
            .attr('cx', nodePosition.x)
            .attr('cy', nodePosition.y)
            .attr('r', size)
            .attr('fill', 'white')
            .style('opacity', 0.8)
            .transition()
            .duration(duration)
            .ease(d3.easeCircleOut)
            .attr('cx', nodePosition.x + Math.cos(angle) * distance)
            .attr('cy', nodePosition.y + Math.sin(angle) * distance)
            .style('opacity', 0)
            .remove();
        }
        
        // Notify parent
        if (onNodeSelect) {
          onNodeSelect(d.id);
        }
      });
      
      // Update on simulation tick
      simulation.on('tick', () => {
        // Keep nodes within bounds
        nodes.forEach(d => {
          const padding = 80;
          d.x = Math.max(padding, Math.min(dimensions.width - padding, d.x));
          d.y = Math.max(padding, Math.min(dimensions.height - padding, d.y));
        });
        
        // Update link positions
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
        
        // Update node positions
        node.attr('transform', d => `translate(${d.x}, ${d.y})`);
      });
      
      // Signal animation - creates traveling signals on links
      function animateSignals() {
        // Create new signals occasionally
        if (Math.random() < 0.04 && activeNode) {
          // Filter to get active links connected to the active node
          const activeLinks = links.filter(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            return sourceId === activeNode || targetId === activeNode;
          });
          
          // Randomly select an active link
          if (activeLinks.length > 0) {
            const randomLink = activeLinks[Math.floor(Math.random() * activeLinks.length)];
            
            // Determine source and target for the signal
            const sourceId = typeof randomLink.source === 'object' ? randomLink.source.id : randomLink.source;
            const isSourceActive = sourceId === activeNode;
            
            const sourceNode = isSourceActive ? 
              (typeof randomLink.source === 'object' ? randomLink.source : nodes.find(n => n.id === sourceId)) : 
              (typeof randomLink.target === 'object' ? randomLink.target : nodes.find(n => n.id === randomLink.target));
              
            const targetNode = isSourceActive ? 
              (typeof randomLink.target === 'object' ? randomLink.target : nodes.find(n => n.id === randomLink.target)) : 
              (typeof randomLink.source === 'object' ? randomLink.source : nodes.find(n => n.id === sourceId));
            
            if (sourceNode && targetNode) {
              // Create a signal with pure white light
              signalGroup.append('circle')
                .attr('class', 'signal')
                .attr('cx', sourceNode.x)
                .attr('cy', sourceNode.y)
                .attr('r', 1.5)
                .attr('fill', 'rgba(255, 255, 255, 1)')  // Pure white for visibility
                .attr('opacity', 0.9)
                .datum({
                  source: { x: sourceNode.x, y: sourceNode.y },
                  target: { x: targetNode.x, y: targetNode.y },
                  progress: 0,
                  speed: 0.01
                });
            }
          }
        }
        
        // Animate existing signals
        signalGroup.selectAll('.signal').each(function(d) {
          d.progress += d.speed;
          
          // Remove completed signals
          if (d.progress >= 1) {
            d3.select(this).remove();
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
        
        // Continue animation loop
        requestAnimationFrame(animateSignals);
      }
      
      // Start signal animation
      const animationId = requestAnimationFrame(animateSignals);
      
      // Create custom tooltip
      if (!tooltipRef.current) {
        const tooltip = d3.select("body")
          .append("div")
          .attr("class", "tooltip-container")
          .style("position", "absolute")
          .style("visibility", "hidden")
          .style("width", "220px")
          .style("background-color", "rgba(30, 41, 59, 0.95)")
          .style("border", "1px solid rgba(255, 255, 255, 0.2)")
          .style("border-radius", "8px")
          .style("padding", "12px")
          .style("color", "white")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", 1000)
          .style("box-shadow", "0 4px 15px rgba(0, 0, 0, 0.3)")
          .style("transition", "opacity 0.2s ease-in-out")
          .style("opacity", 0);
        
        tooltipRef.current = tooltip.node();
      }
      
      // Add mouse events for tooltip
      node.on('mouseover', function(event, d) {
        const [mouseX, mouseY] = d3.pointer(event, document.body);
        
        // Brighten the node
        d3.select(this).select('.node-glow')
          .transition()
          .duration(300)
          .attr('opacity', 0.9)
          .attr('fill', 'rgba(255, 255, 255, 0.3)');
        
        d3.select(this).select('.node-main')
          .transition()
          .duration(300)
          .attr('fill', 'rgba(255, 255, 255, 0.95)');
        
        // Show tooltip
        if (tooltipRef.current) {
          const tooltip = d3.select(tooltipRef.current);
          const nodeData = nodeContent[d.id] ? 
            nodeContent[d.id][currentLanguage] || nodeContent[d.id]['en'] : null;
            
          if (nodeData) {
            // Extract first sentence from description
            let summary = nodeData.description;
            summary = summary.replace(/<[^>]*>?/gm, ' ');
            
            const firstSentence = summary.split('.')[0];
            const displayText = firstSentence.length > 120 ? 
              firstSentence.substring(0, 120) + '...' : 
              firstSentence;
            
            // Update tooltip content
            tooltip.html(`
              <div style="font-weight: bold; margin-bottom: 8px; color: white;">${nodeData.title}</div>
              <div style="color: rgba(255, 255, 255, 0.8); font-size: 12px;">${displayText}</div>
              <div style="margin-top: 8px; font-size: 11px; color: rgba(255, 255, 255, 0.6);">Click to view details</div>
            `);
            
            // Position tooltip
            tooltip
              .style("visibility", "visible")
              .style("left", `${mouseX + 15}px`)
              .style("top", `${mouseY - 15}px`)
              .transition()
              .duration(300)
              .style("opacity", 1);
          }
        }
      })
      .on('mousemove', function(event) {
        // Move tooltip with mouse
        if (tooltipRef.current) {
          const [mouseX, mouseY] = d3.pointer(event, document.body);
          d3.select(tooltipRef.current)
            .style("left", `${mouseX + 15}px`)
            .style("top", `${mouseY - 15}px`);
        }
      })
      .on('mouseout', function() {
        // Reset node appearance
        const d = d3.select(this).datum();
        const isActive = d.id === activeNode;
        
        d3.select(this).select('.node-glow')
          .transition()
          .duration(300)
          .attr('opacity', isActive ? 0.7 : 0.4)
          .attr('fill', 'rgba(255, 255, 255, 0.05)');
        
        d3.select(this).select('.node-main')
          .transition()
          .duration(300)
          .attr('fill', d => {
            if (d.id === activeNode) {
              return 'rgba(255, 255, 255, 0.95)';
            }
            
            const brightnessByType = {
              main: 0.85,
              skills: 0.75,
              projects: 0.7,
              education: 0.65,
              interests: 0.6
            };
            
            const brightness = brightnessByType[d.type] || 0.6;
            const color = Math.floor(255 * brightness);
            return `rgba(${color}, ${color}, ${color}, 0.85)`;
          });
        
        // Hide tooltip
        if (tooltipRef.current) {
          d3.select(tooltipRef.current)
            .transition()
            .duration(300)
            .style("opacity", 0)
            .on("end", () => d3.select(tooltipRef.current).style("visibility", "hidden"));
        }
      });
      
      // Drag functions
      function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      
      // Cleanup
      return () => {
        simulation.stop();
        cancelAnimationFrame(animationId);
        
        // Remove tooltip if component unmounts
        if (tooltipRef.current) {
          document.body.removeChild(tooltipRef.current);
          tooltipRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error in MindMap:", error);
    }
  }, [dimensions, activeNode, currentLanguage, onNodeSelect]);
  
  // Function to create comet effect
  const createComet = () => {
    const comet = document.createElement('div');
    comet.className = 'absolute bg-white rounded-full opacity-0 pointer-events-none';
    
    // Random properties for the comet
    const size = 2 + Math.random() * 3;
    const angle = Math.PI / 4 + (Math.random() * Math.PI / 4); // Angle between π/4 and π/2
    const duration = 2 + Math.random() * 3; // 2-5 seconds
    const delay = Math.random() * 10; // 0-10 seconds
    
    // Position the comet off-screen
    const startX = Math.random() * 100;
    const startY = -10;
    
    // Style the comet
    comet.style.width = `${size}px`;
    comet.style.height = `${size}px`;
    comet.style.left = `${startX}vw`;
    comet.style.top = `${startY}vh`;
    comet.style.boxShadow = `0 0 20px 2px rgba(255, 255, 255, 0.7), 0 0 30px 10px rgba(255, 255, 255, 0.5)`;
    comet.style.zIndex = '1';
    
    // Animation
    comet.style.animation = `comet ${duration}s linear ${delay}s forwards`;
    comet.style.transform = `rotate(${angle}rad)`;
    
    // Add to DOM
    document.querySelector('.comet-container')?.appendChild(comet);
    
    // Clean up after animation
    setTimeout(() => {
      comet.remove();
    }, (duration + delay) * 1000);
  };
  
  // Create comets periodically
  useEffect(() => {
    // Create comets periodically
    const cometInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to create a comet
        createComet();
      }
    }, 5000);
    
    // Initial comets
    for (let i = 0; i < 2; i++) {
      createComet();
    }
    
    return () => clearInterval(cometInterval);
  }, []);
  
  return (
    <section className="relative py-20 min-h-screen flex flex-col items-center">
      {/* Background elements - matching the style of other sections */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Star background */}
        <div className="absolute inset-0">
          {Array.from({ length: 70 }).map((_, i) => (
            <div
              key={`mindmap-star-${i}`}
              className="absolute rounded-full bg-white animate-starTwinkle"
              style={{
                width: `${Math.random() * 2 + 0.5}px`,
                height: `${Math.random() * 2 + 0.5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.2,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 5 + 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Comet container */}
        <div className="comet-container absolute inset-0"></div>
        
        {/* Gradient orbs with different hues matching other sections */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-float-y" 
             style={{ animationDelay: "0s" }}></div>
        <div className="absolute bottom-1/4 left-1/5 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-float-y" 
             style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute top-2/4 left-2/3 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl animate-float-x" 
             style={{ animationDelay: "1s" }}></div>
      </div>
      
      {/* Section header */}
      <div className="container mx-auto px-4 relative z-10 mb-10">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">
            {currentLanguage === 'tr' ? 'Zihin Haritam' : 'My Mind Map'}
          </h2>
          <p className="text-xl text-gray-300">
            {currentLanguage === 'tr' 
              ? 'Bu interaktif görselleştirme aracılığıyla becerilerimi ve ilgi alanlarımı keşfedin.'
              : 'Explore my skills and interests through this interactive visualization.'}
          </p>
        </div>
      </div>
      
      {/* Mind Map Visualization */}
      <div 
        className="w-full flex-grow flex items-center justify-center overflow-hidden" 
        ref={containerRef}
        style={{ width: '100%', height: '600px' }}
      >
        <svg 
          ref={svgRef} 
          className="w-full h-full"
          width="100%"
          height="100%"
        ></svg>
      </div>
      
      {/* Add CSS for comet animation */}
      <style jsx>{`
        @keyframes comet {
          0% {
            opacity: 0;
            transform: rotate(45deg) translateX(-10vw) translateY(-10vh);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: rotate(45deg) translateX(110vw) translateY(110vh);
          }
        }
      `}</style>
    </section>
  );
};

export default MindMapNavigation;