// src/components/navigation/MindMapNavigation.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { mindMapData, nodeContent } from '../../data/mindMapData';

const MindMapNavigation = ({ onNodeSelect, currentLanguage = 'en' }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // Changed from 'main' to null to prevent automatic welcome message
  const [activeNode, setActiveNode] = useState(null);
  
  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Setup visualization - the main effect that creates everything
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;
    
    // Clear SVG
    d3.select(svgRef.current).selectAll('*').remove();
    
    const svg = d3.select(svgRef.current);
    
    // Deep clone nodes and links to avoid mutations
    const nodes = JSON.parse(JSON.stringify(mindMapData.nodes)).map(node => ({
      ...node,
      // Make nodes smaller
      size: node.size ? node.size * 0.75 : 15
    }));
    
    const links = JSON.parse(JSON.stringify(mindMapData.links));
    
    // Create a defs section for filters and patterns
    const defs = svg.append('defs');
  
    
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
    
    // Create container for links
    const linkGroup = svg.append('g').attr('class', 'links');
    
    // Create links
    const link = linkGroup.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-opacity', d => d.weight * 0.3 + 0.15)
      .attr('stroke-width', d => d.weight * 0.8);
    
    // Container for signal pulses traveling on links
    const signalsGroup = svg.append('g').attr('class', 'signals');
    
    // Create node groups
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
    
    // Outer glow for nodes - lighter shade of white
    node.append('circle')
      .attr('r', d => (d.size || 15) * 1.8) 
      .attr('class', 'node-glow')
      .attr('fill', 'rgba(255, 255, 255, 0.05)')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', 0.5)
      .attr('opacity', d => d.id === activeNode ? 0.7 : 0.4);
    
    // Main node circle - brighter white
    node.append('circle')
      .attr('r', d => d.size || 15)
      .attr('class', 'node-main')
      .attr('fill', d => {
        // Active node is brightest 
        if (d.id === activeNode) {
          return 'rgba(255, 255, 255, 0.95)';
        }
        
        // Create a subtle gradient from white to light gray based on node type
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
    
    // Inner pulse for active node - pure bright white
    node.append('circle')
      .attr('r', d => (d.size || 15) * 0.6)
      .attr('fill', 'rgba(255, 255, 255, 1)') // Pure white
      .attr('opacity', d => d.id === activeNode ? 0.7 : 0)
      .attr('class', 'node-pulse');
    
    // Add text labels below nodes
    node.append('text')
      .attr('dy', d => (d.size || 15) + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255, 255, 255, 0.9)')
      .attr('font-size', 10)
      .attr('font-weight', d => d.id === activeNode ? 'bold' : 'normal')
      .attr('class', 'node-label')
      .text(d => {
        // Get the appropriate label based on language
        const label = currentLanguage === 'tr' ? 
          (d.labelTr || d.label || d.id) : 
          (d.labelEn || d.label || d.id);
          
        // Truncate if too long
        return label.length > 12 ? label.slice(0, 10) + '...' : label;
      });
      
    // Create an enhanced tooltip that appears near the node
    // Create custom tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip-container")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("width", "220px")
      .style("background-color", "rgba(30, 41, 59, 0.95)") // Darker blue-gray
      .style("border", "1px solid rgba(255, 255, 255, 0.2)")
      .style("border-radius", "8px")
      .style("padding", "12px")
      .style("color", "white")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", 1000)
      .style("box-shadow", "0 4px 15px rgba(0, 0, 0, 0.3)")
      .style("transition", "opacity 0.2s ease-in-out");
    
    tooltipRef.current = tooltip.node();
      
    // Add mouse events
    node.on('mouseover', function(event, d) {
      // Get mouse position for tooltip
      const [mouseX, mouseY] = d3.pointer(event, document.body);
      
      // Brighten the node
      d3.select(this).select('.node-glow')
        .attr('opacity', 0.9)
        .attr('fill', 'rgba(255, 255, 255, 0.3)');
      
      d3.select(this).select('.node-main')
        .attr('fill', 'rgba(255, 255, 255, 0.95)');
      
      // Show tooltip near the node
      const nodeData = nodeContent[d.id] ? 
        nodeContent[d.id][currentLanguage] || nodeContent[d.id]['en'] : null;
        
      if (nodeData && tooltipRef.current) {
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
        
        // Position tooltip near mouse but ensure it stays within viewport
        tooltip
          .style("visibility", "visible")
          .style("opacity", 1)
          .style("left", `${mouseX + 15}px`)
          .style("top", `${mouseY - 15}px`);
      }
    })
    .on('mousemove', function(event) {
      // Move tooltip with mouse
      if (tooltipRef.current && tooltipRef.current.style.visibility === 'visible') {
        const [mouseX, mouseY] = d3.pointer(event, document.body);
        tooltip
          .style("left", `${mouseX + 15}px`)
          .style("top", `${mouseY - 15}px`);
      }
    })
    .on('mouseout', function() {
      // Reset node appearance
      const d = d3.select(this).datum();
      const isActive = d.id === activeNode;
      
      d3.select(this).select('.node-glow')
        .attr('opacity', isActive ? 0.7 : 0.4)
        .attr('fill', 'rgba(255, 255, 255, 0.05)');
      
      d3.select(this).select('.node-main')
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
      tooltip.style("visibility", "hidden");
    })
    .on('click', function(event, d) {
      // Prevent event bubbling
      event.preventDefault();
      event.stopPropagation();
      
      // Hide tooltip
      tooltip.style("visibility", "hidden");
      
      // Update active node for visual highlighting
      setActiveNode(d.id);
      updateHighlighting(d.id);
      
      // Notify parent component to handle ContentPanel
      if (onNodeSelect) {
        onNodeSelect(d.id);
      }
    });
    
    // Function to update highlighting of nodes and links
    function updateHighlighting(nodeId) {
      // Find connected nodes
      const connectedNodeIds = links
        .filter(link => {
          // Check both source and target, which might be objects or string IDs
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          return sourceId === nodeId || targetId === nodeId;
        })
        .map(link => {
          // Extract the ID of the connected node
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          return sourceId === nodeId ? targetId : sourceId;
        });
      
      // Update node styling
      nodeGroup.selectAll('.node-glow')
        .attr('opacity', d => {
          if (d.id === nodeId) return 0.8;  // Increased opacity for better visibility
          if (connectedNodeIds.includes(d.id)) return 0.6;
          return 0.3;
        });
      
      // Update node main circles
      nodeGroup.selectAll('.node-main')
        .attr('stroke-width', d => {
          if (d.id === nodeId) return 1.5;  // Slightly thicker for active node
          if (connectedNodeIds.includes(d.id)) return 0.8;
          return 0.4;
        })
        .attr('fill', d => {
          // Active node is brightest
          if (d.id === nodeId) {
            return 'rgba(255, 255, 255, 0.95)';  // Pure white
          }
          
          // Connected nodes are brighter than inactive
          if (connectedNodeIds.includes(d.id)) {
            const brightnessByType = {
              main: 0.85,
              skills: 0.8,
              projects: 0.75,
              education: 0.7,
              interests: 0.65
            };
            
            const brightness = brightnessByType[d.type] || 0.65;
            const color = Math.floor(255 * brightness);
            return `rgba(${color}, ${color}, ${color}, 0.85)`;
          }
          
          // Inactive nodes are dimmer but still visible
          const brightnessByType = {
            main: 0.75,
            skills: 0.7,
            projects: 0.65,
            education: 0.6,
            interests: 0.55
          };
          
          const brightness = brightnessByType[d.type] || 0.5;
          const color = Math.floor(255 * brightness);
          return `rgba(${color}, ${color}, ${color}, 0.65)`;
        });
        
      // Update inner pulse for active node
      nodeGroup.selectAll('.node-pulse')
        .attr('opacity', d => d.id === nodeId ? 0.7 : 0);
      
      // Update labels
      nodeGroup.selectAll('.node-label')
        .attr('font-weight', d => d.id === nodeId ? 'bold' : 'normal')
        .attr('fill', d => {
          if (d.id === nodeId) return 'rgba(255, 255, 255, 1)';
          if (connectedNodeIds.includes(d.id)) return 'rgba(255, 255, 255, 0.9)';
          return 'rgba(255, 255, 255, 0.6)';
        });
      
      // Update link appearance
      linkGroup.selectAll('line')
        .attr('stroke', link => {
          // Handle both object and string references
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          
          if (sourceId === nodeId || targetId === nodeId) {
            return 'rgba(255, 255, 255, 0.45)';  // Brighter for connected links
          }
          return 'rgba(255, 255, 255, 0.15)';
        })
        .attr('stroke-opacity', link => {
          // Handle both object and string references
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          
          if (sourceId === nodeId || targetId === nodeId) {
            return 0.6;  // More visible for connected links
          }
          return 0.25;
        })
        .attr('stroke-width', link => {
          // Handle both object and string references
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          
          if (sourceId === nodeId || targetId === nodeId) {
            return link.weight * 1.0;  // Slightly thicker for connected links
          }
          return link.weight * 0.6;
        });
    }
    
    // Only apply initial highlighting if activeNode exists
    if (activeNode) {
      updateHighlighting(activeNode);
    }
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
      // Keep nodes within bounds with padding
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
    
    // Signal animation - signals traveling along connections
    function animateSignals() {
      // Remove old signals that have completed their journey
      signalsGroup.selectAll('.signal')
        .filter(function() {
          return parseFloat(d3.select(this).attr('opacity')) <= 0.1;
        })
        .remove();
      
      // Create new signals occasionally
      if (Math.random() < 0.04) {
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
            signalsGroup.append('circle')
              .attr('class', 'signal')
              .attr('cx', sourceNode.x)
              .attr('cy', sourceNode.y)
              .attr('r', 1.5)
              .attr('fill', 'rgba(255, 255, 255, 1)')  // Pure white for better visibility
              .attr('opacity', 0.9)  // Slightly higher opacity
              .datum({
                source: sourceNode,
                target: targetNode,
                progress: 0,
                speed: 0.004 + Math.random() * 0.006
              });
          }
        }
      }
      
      // Create occasional ambient signals on other links
      if (Math.random() < 0.012) {
        const inactiveLinks = links.filter(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          return sourceId !== activeNode && targetId !== activeNode;
        });
        
        if (inactiveLinks.length > 0) {
          const randomLink = inactiveLinks[Math.floor(Math.random() * inactiveLinks.length)];
          
          // Random direction for ambient signals
          const direction = Math.random() > 0.5;
          
          const sourceNode = direction ? 
            (typeof randomLink.source === 'object' ? randomLink.source : nodes.find(n => n.id === randomLink.source)) : 
            (typeof randomLink.target === 'object' ? randomLink.target : nodes.find(n => n.id === randomLink.target));
            
          const targetNode = direction ? 
            (typeof randomLink.target === 'object' ? randomLink.target : nodes.find(n => n.id === randomLink.target)) : 
            (typeof randomLink.source === 'object' ? randomLink.source : nodes.find(n => n.id === randomLink.source));
          
          if (sourceNode && targetNode) {
            signalsGroup.append('circle')
              .attr('class', 'signal ambient')
              .attr('cx', sourceNode.x)
              .attr('cy', sourceNode.y)
              .attr('r', 1)
              .attr('fill', 'rgba(255, 255, 255, 0.7)')  // White light
              .attr('opacity', 0.5)
              .datum({
                source: sourceNode,
                target: targetNode,
                progress: 0,
                speed: 0.002 + Math.random() * 0.004
              });
          }
        }
      }
      
      // Animate existing signals
      signalsGroup.selectAll('.signal')
        .each(function(d) {
          d.progress += d.speed;
          
          // If signal completes journey, start fading out
          if (d.progress >= 1) {
            d3.select(this).attr('opacity', function() {
              const currentOpacity = parseFloat(d3.select(this).attr('opacity'));
              return Math.max(0.1, currentOpacity - 0.03);
            });
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
      
      // Pulsate effect for nodes with light emission
      nodeGroup.selectAll('.node-pulse')
        .filter(function(d) {
          return d.id === activeNode;
        })
        .attr('opacity', function() {
          const baseOpacity = 0.5;
          const pulseRange = 0.2;
          return baseOpacity + pulseRange * Math.sin(Date.now() * 0.002);
        });
      
      // More subtle ambient pulsing for all nodes
      nodeGroup.selectAll('.node-glow')
        .filter(function(d) {
          // Don't animate if being hovered
          const nodeElement = d3.select(this.parentNode);
          const isHovered = nodeElement.classed('hovered');
          if (isHovered) return false;
          
          return true;
        })
        .attr('opacity', function(d) {
          if (d.id === activeNode) {
            return 0.6 + 0.15 * Math.sin(Date.now() * 0.0015);
          }
          
          // Find if connected to active node
          const isConnected = links.some(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            return (sourceId === activeNode && targetId === d.id) || 
                  (targetId === activeNode && sourceId === d.id);
          });
          
          if (isConnected) {
            return 0.4 + 0.08 * Math.sin(Date.now() * 0.0008 + d.id.charCodeAt(0));
          }
          
          return 0.2 + 0.05 * Math.sin(Date.now() * 0.0004 + d.id.charCodeAt(0));
        });
      
      requestAnimationFrame(animateSignals);
    }
    
    // Start the animation loop
    animateSignals();
    
    // Drag functions
    function dragStarted(event, d) {
      // Hide tooltip when dragging starts
      if (tooltipRef.current) {
        tooltip.style("visibility", "hidden");
      }
      
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
    
    // Add click handler to background to hide tooltip
    svg.on('click', function() {
      tooltip.style("visibility", "hidden");
    });
    
    // Cleanup simulation on component unmount
    return () => {
      simulation.stop();
      
      // Remove tooltip if component unmounts
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
    };
  }, [dimensions, activeNode, currentLanguage, onNodeSelect]);
  
  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden" ref={containerRef}>
      {/* SVG for visualization */}
      <svg 
        ref={svgRef} 
        className="w-full h-full relative z-10"
        style={{ minHeight: "600px" }}
      />
    </div>
  );
};

export default MindMapNavigation;