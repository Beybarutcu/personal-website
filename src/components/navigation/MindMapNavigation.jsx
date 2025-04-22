// src/components/navigation/MindMapNavigation.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { mindMapData, nodeContent } from '../../data/mindMapData';
import ContentPanel from './ContentPanel';
import NodeRenderer from './mindmap/NodeRenderer';
import LinkRenderer from './mindmap/LinkRenderer';
import SignalAnimator from './mindmap/SignalAnimator';

const MindMapNavigation = ({ onNodeSelect, currentLanguage = 'en' }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [activeNode, setActiveNode] = useState(null);
  const [contentPanelVisible, setContentPanelVisible] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  
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
      // Deep clone nodes and links to avoid mutations
      const nodesData = JSON.parse(JSON.stringify(mindMapData.nodes)).map(node => ({
        ...node,
        // Make nodes smaller
        size: node.size ? node.size * 0.75 : 15
      }));
      
      const linksData = JSON.parse(JSON.stringify(mindMapData.links));
      
      // Set state for nodes and links
      setNodes(nodesData);
      setLinks(linksData);
      
      // Set up the force simulation
      const newSimulation = d3.forceSimulation(nodesData)
        .force('link', d3.forceLink()
          .id(d => d.id)
          .links(linksData)
          .distance(d => 120 + d.weight * 30)
          .strength(d => 0.6))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2).strength(0.1))
        .force('collision', d3.forceCollide().radius(d => (d.size || 15) * 2.5));
      
      // Add positioning forces by node type
      const nodeTypes = ['main', 'skills', 'interests', 'education', 'projects'];
      
      // Create cluster positioning
      newSimulation.force('x', d3.forceX().strength(0.1).x(d => {
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
      
      newSimulation.force('y', d3.forceY().strength(0.1).y(d => {
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
      
      // Keep nodes within bounds during simulation
      newSimulation.on('tick', () => {
        // Keep nodes within bounds with padding
        nodesData.forEach(d => {
          const padding = 80;
          d.x = Math.max(padding, Math.min(dimensions.width - padding, d.x));
          d.y = Math.max(padding, Math.min(dimensions.height - padding, d.y));
        });
      });
      
      // Set simulation in state to use it in child components
      setSimulation(newSimulation);
      
      // Create custom tooltip if it doesn't exist
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
      
      // Clean up
      return () => {
        if (newSimulation) {
          newSimulation.stop();
        }
        
        // Remove tooltip if component unmounts
        if (tooltipRef.current) {
          document.body.removeChild(tooltipRef.current);
          tooltipRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error in MindMap:", error);
    }
  }, [dimensions]);
  
  // Handle node click
  const handleNodeClick = (nodeId) => {
    // Set selected node
    setActiveNode(nodeId);
    
    // Show content panel
    setContentPanelVisible(true);
    
    // Notify parent if callback provided
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    }
    
    // IMPORTANT: When a node is clicked, we want to fix its position
    // so it doesn't jump around when the content panel appears
    if (simulation) {
      // Create a temporary "alpha" burst to allow other nodes to adjust without
      // moving the selected node
      simulation.alpha(0.3).restart();
      
      // Find the node in our nodes array
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        // Fix the position of the selected node
        node.fx = node.x;
        node.fy = node.y;
        
        // After a short delay, allow all nodes to move freely again
        // but only when the content panel is closed
        if (!contentPanelVisible) {
          setTimeout(() => {
            if (node) {
              node.fx = null;
              node.fy = null;
            }
          }, 1000);
        }
      }
    }
  };
  
  // Handle content panel close
  const handleClosePanel = () => {
    setContentPanelVisible(false);
    
    // Release fixed positions after panel closes
    if (simulation) {
      const node = nodes.find(n => n.id === activeNode);
      if (node) {
        // Keep position fixed briefly during transition
        setTimeout(() => {
          node.fx = null;
          node.fy = null;
          
          // Restart simulation with a gentle alpha
          simulation.alpha(0.1).restart();
        }, 300);
      }
    }
  };
  
  // Function to create comet effect
  const createComet = () => {
    if (!document.querySelector('.mindmap-comet-container')) return;
    
    const comet = document.createElement('div');
    comet.className = 'absolute bg-white rounded-full opacity-0 pointer-events-none';
    
    // Random properties for the comet
    const size = 2 + Math.random() * 3;
    const angle = Math.PI / 4 + (Math.random() * Math.PI / 4);
    const duration = 2 + Math.random() * 3;
    const delay = Math.random() * 10;
    
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
    document.querySelector('.mindmap-comet-container')?.appendChild(comet);
    
    // Clean up after animation
    setTimeout(() => {
      comet.remove();
    }, (duration + delay) * 1000);
  };
  
  // Create comets periodically
  useEffect(() => {
    // Create comets periodically
    const cometInterval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance to create a comet
        createComet();
      }
    }, 8000);
    
    // Initial comet
    if (Math.random() > 0.5) {
      createComet();
    }
    
    return () => clearInterval(cometInterval);
  }, []);
  
  return (
    <section id="portfolio" className="relative py-20 min-h-screen flex flex-col items-center">
      {/* Background elements - matching the style of other sections */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Star background */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
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
        <div className="mindmap-comet-container absolute inset-0"></div>
        
        {/* Gradient orbs with different hues - positioned away from corners and edges */}
        <div className="absolute rounded-full bg-blue-500/10 blur-3xl animate-float-y" 
             style={{ 
               top: '30%',
               left: '35%',
               width: '30vw',
               height: '30vw',
               maxWidth: '400px',
               maxHeight: '400px',
               animationDelay: "0s" 
             }}></div>
        <div className="absolute rounded-full bg-purple-500/10 blur-3xl animate-float-y" 
             style={{ 
               bottom: '35%', 
               right: '30%',
               width: '25vw',
               height: '25vw',
               maxWidth: '350px',
               maxHeight: '350px',
               animationDelay: "1.5s" 
             }}></div>
        <div className="absolute rounded-full bg-teal-500/10 blur-3xl animate-float-x" 
             style={{ 
               top: '60%', 
               left: '28%',
               width: '20vw',
               height: '20vw',
               maxWidth: '300px',
               maxHeight: '300px',
               animationDelay: "1s" 
             }}></div>
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
      
      {/* Mind Map Container - Important: Use grid to prevent resizing issues */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
        {/* Mind Map Visualization - Important: z-10 to ensure it's above background */}
        <div 
          className={`${contentPanelVisible ? 'lg:col-span-2' : 'lg:col-span-3'} 
                      w-full flex-grow flex items-center justify-center 
                      overflow-hidden relative z-10 transition-all duration-300`} 
          ref={containerRef}
          style={{ width: '100%', height: '600px' }}
        >
          <svg 
            ref={svgRef} 
            className="w-full h-full"
            width="100%"
            height="100%"
            style={{ cursor: 'grab' }}
          >
            {/* Render links, nodes and signal animations from specialized components */}
            {links.length > 0 && nodes.length > 0 && (
              <>
                <LinkRenderer links={links} nodes={nodes} activeNode={activeNode} />
                <SignalAnimator nodes={nodes} links={links} activeNode={activeNode} />
                <NodeRenderer 
                  nodes={nodes} 
                  activeNode={activeNode} 
                  onNodeClick={handleNodeClick} 
                  currentLanguage={currentLanguage}
                  tooltipRef={tooltipRef}
                  simulation={simulation}
                  nodeContent={nodeContent}
                />
              </>
            )}
          </svg>
        </div>
        
        {/* Content Panel */}
        {contentPanelVisible && (
          <div className="lg:col-span-1 w-full">
            <ContentPanel 
              nodeId={activeNode} 
              currentLanguage={currentLanguage} 
              onClose={handleClosePanel} 
            />
          </div>
        )}
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
        
        /* When dragging, show grabbing cursor */
        svg:active {
          cursor: grabbing;
        }
      `}</style>
    </section>
  );
};

export default MindMapNavigation;