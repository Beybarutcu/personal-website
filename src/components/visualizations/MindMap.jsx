import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as d3 from 'd3';
import ScrollReveal from '../ui/ScrollReveal';

const MindMap = ({ language = 'en' }) => {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const simulationRef = useRef(null);
  
  // Track if visualization is ready
  const [isReady, setIsReady] = useState(false);
  
  // Prepare data from translations - Simplified version for debugging
  const prepareGraphData = () => {
    // Create simplified static data for testing
    const nodes = [
      { id: 'main', label: 'Me', title: 'About Me', type: 'main', radius: 50 },
      { id: 'frontend', label: 'Frontend', title: 'Frontend Development', type: 'category', radius: 35 },
      { id: 'design', label: 'Design', title: 'UI/UX Design', type: 'category', radius: 35 },
      { id: 'backend', label: 'Backend', title: 'Backend Development', type: 'category', radius: 35 },
      { id: 'dataviz', label: 'Data Viz', title: 'Data Visualization', type: 'category', radius: 35 },
      { id: 'animation', label: 'Animation', title: 'Web Animation', type: 'category', radius: 35 },
      { id: 'portfolio', label: 'Portfolio', title: 'Portfolio Website', type: 'detail', radius: 25 },
      { id: 'neuralnet', label: 'Neural Network', title: 'Neural Network Visualization', type: 'detail', radius: 25 },
      { id: 'courses', label: 'Courses', title: 'Online Courses', type: 'detail', radius: 25 },
    ];
    
    // Create links between nodes
    const links = [
      { source: 'main', target: 'frontend', value: 10, type: 'primary' },
      { source: 'main', target: 'design', value: 10, type: 'primary' },
      { source: 'main', target: 'backend', value: 10, type: 'primary' },
      { source: 'main', target: 'dataviz', value: 10, type: 'primary' },
      { source: 'main', target: 'animation', value: 10, type: 'primary' },
      { source: 'frontend', target: 'portfolio', value: 5, type: 'secondary' },
      { source: 'design', target: 'portfolio', value: 5, type: 'secondary' },
      { source: 'dataviz', target: 'neuralnet', value: 5, type: 'secondary' },
      { source: 'frontend', target: 'courses', value: 5, type: 'tertiary' },
    ];
    
    console.log("Generated static nodes and links for debugging");
    return { nodes, links };
  };
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        console.log("Container dimensions:", width, height);
        setDimensions({ 
          width: width || 800, 
          height: height > 100 ? height : 500 // Set minimum height
        });
      }
    };
    
    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Create and update visualization
  useEffect(() => {
    if (!svgRef.current || !dimensions.width) {
      console.log("SVG reference or dimensions not ready");
      return;
    }
    
    console.log("Setting up D3 visualization with dimensions:", dimensions);
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Prepare data - use static data for debugging
    const { nodes, links } = prepareGraphData();
    if (nodes.length === 0) {
      console.log("No nodes to render");
      return;
    }
    
    // Configure SVG
    const svg = d3.select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", [0, 0, dimensions.width, dimensions.height])
      .classed("cluster-visualization", true);
    
    console.log("Created SVG:", dimensions.width, "x", dimensions.height);
    
    // Create definitions for gradients and filters
    const defs = svg.append("defs");
    
    // Create glow filter
    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("width", "300%")
      .attr("height", "300%")
      .attr("x", "-100%")
      .attr("y", "-100%");
      
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "5")
      .attr("result", "coloredBlur");
      
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    
    // Node color gradients
    const createNodeGradient = (id, color) => {
      const gradient = defs.append("radialGradient")
        .attr("id", `node-gradient-${id}`)
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%");
        
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color);
        
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color);
    };
    
    // Create gradients for each node type
    createNodeGradient("main", "#f97316");  // Orange for main node
    createNodeGradient("category", "#f97316");  // Orange for category nodes
    createNodeGradient("detail", "#f97316");  // Orange for detail nodes
    
    // Create a group for all elements
    const container = svg.append("g");
    
    // Create links
    const link = container.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "cluster-link")
      .attr("stroke", "#ffffff")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", d => Math.sqrt(d.value));
    
    console.log("Created links:", links.length);
    
    // Create nodes
    const node = container.append("g")
      .selectAll(".cluster-node")
      .data(nodes)
      .join("g")
      .attr("class", d => `cluster-node cluster-node-${d.type}`);
    
    console.log("Created nodes:", nodes.length);
    
    // Add circles to nodes
    node.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => `url(#node-gradient-${d.type})`)
      .attr("stroke", "#ffffff")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 1.5)
      .style("filter", d => d.type === "main" ? "url(#glow)" : "none")
      .style("cursor", "pointer");
    
    // Add labels to nodes
    node.append("text")
      .attr("dy", d => d.type === "main" ? -8 : 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", d => d.type === "main" ? 14 : d.type === "category" ? 12 : 10)
      .attr("font-weight", d => d.type === "main" ? "bold" : "normal")
      .text(d => d.label);
    
    // Set up force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => {
        // Adjust distance based on node types
        if (d.source.type === "main" && d.target.type === "category") return 150;
        if (d.source.type === "category" && d.target.type === "detail") return 100;
        return 80;
      }))
      .force("charge", d3.forceManyBody().strength(d => {
        // Adjust repulsion based on node type
        if (d.type === "main") return -500;
        if (d.type === "category") return -300;
        return -200;
      }))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide().radius(d => d.radius * 1.5));
    
    console.log("Force simulation created");
    
    // Position nodes initially
    nodes.forEach((node, i) => {
      if (node.type === 'main') {
        node.x = dimensions.width / 2;
        node.y = dimensions.height / 2;
      } else if (node.type === 'category') {
        const categoryNodes = nodes.filter(n => n.type === 'category');
        const index = categoryNodes.indexOf(node);
        const angle = (index * Math.PI * 2) / categoryNodes.length;
        node.x = dimensions.width / 2 + Math.cos(angle) * 150;
        node.y = dimensions.height / 2 + Math.sin(angle) * 150;
      } else {
        node.x = dimensions.width / 2 + (Math.random() - 0.5) * 250;
        node.y = dimensions.height / 2 + (Math.random() - 0.5) * 250;
      }
    });
    
    // Update positions on tick
    simulation.on("tick", () => {
      // Keep nodes within bounds
      nodes.forEach(d => {
        d.x = Math.max(d.radius, Math.min(dimensions.width - d.radius, d.x));
        d.y = Math.max(d.radius, Math.min(dimensions.height - d.radius, d.y));
      });
      
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    // Handle node click
    node.on("click", (event, d) => {
      event.stopPropagation();
      setSelectedNode(d);
      
      // Highlight selected node and connections
      node.select("circle")
        .transition()
        .duration(300)
        .attr("r", node => node.id === d.id ? node.radius * 1.2 : node.radius)
        .attr("stroke-opacity", node => node.id === d.id ? 1 : 0.5);
      
      link
        .transition()
        .duration(300)
        .attr("stroke-opacity", l => 
          (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.2
        );
    });
    
    // Reset on background click
    svg.on("click", () => {
      setSelectedNode(null);
      
      node.select("circle")
        .transition()
        .duration(300)
        .attr("r", d => d.radius)
        .attr("stroke-opacity", 0.5);
      
      link
        .transition()
        .duration(300)
        .attr("stroke-opacity", 0.3);
    });
    
    // Set hover effects
    node
      .on("mouseenter", function() {
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("stroke-opacity", 1);
      })
      .on("mouseleave", function(event, d) {
        if (selectedNode && d.id === selectedNode.id) return;
        
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("stroke-opacity", 0.5);
      });
    
    // Store simulation reference
    simulationRef.current = simulation;
    
    // Signal that visualization is ready
    setTimeout(() => setIsReady(true), 1000);
    
    // Cleanup function
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [dimensions, language]);
  
  // Render node details panel
  const renderNodeDetails = () => {
    if (!selectedNode) {
      return (
        <div className="p-6 text-center">
          <p className="text-gray-400">Click on a node to view details</p>
        </div>
      );
    }
    
    return (
      <div className="p-6 space-y-4 text-left">
        <h3 className="text-2xl font-bold text-white">{selectedNode.title}</h3>
        <p className="text-orange-400">{selectedNode.subtitle || ""}</p>
        
        <div className="text-gray-300 space-y-3 mt-4">
          <p>Node type: {selectedNode.type}</p>
          <p>ID: {selectedNode.id}</p>
        </div>
      </div>
    );
  };
  
  return (
    <section id="mind-map" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl animate-float-y"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl animate-float-y" style={{ animationDelay: "1.1s" }}></div>
        <div className="absolute top-2/3 left-1/5 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl animate-float-x" style={{ animationDelay: "0.8s" }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal>
          {/* Header section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              My Mind Map
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-300">
              Explore my skills and interests through this interactive visualization.
            </p>
          </div>
          
          <div className="w-full flex flex-col lg:flex-row gap-8">
            {/* Visualization container */}
            <div 
              ref={containerRef}
              className="relative flex-grow min-h-[500px] lg:min-h-[600px] rounded-xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-md overflow-hidden"
              style={{ minHeight: "500px" }} // Enforce minimum height
            >
              <svg 
                ref={svgRef} 
                className="w-full h-full" 
                style={{ minHeight: "500px" }}
              ></svg>
              
              {/* Loading indicator */}
              {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-b-orange-500/50 animate-spin"></div>
                    <div className="absolute inset-4 rounded-full border-2 border-transparent border-l-orange-400 border-r-white/70 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Details panel */}
            <div className="lg:w-1/3 bg-gray-800/30 backdrop-blur-md rounded-xl border border-gray-700/50 h-auto">
              {renderNodeDetails()}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default MindMap;