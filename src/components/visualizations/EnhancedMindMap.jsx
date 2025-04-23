// src/components/visualizations/EnhancedMindMap.jsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import ClusterNode from './ClusterNode';
import ClusterLink from './ClusterLink';
import NodeDetailPanel from './NodeDetailPanel';

// Node types with simplified styling
const NODE_TYPES = {
  main: {
    radius: 36,
    textSize: 14
  },
  category: {
    radius: 26,
    textSize: 12
  },
  detail: {
    radius: 18,
    textSize: 10
  }
};

const EnhancedMindMap = ({ language }) => {
  const { t } = useTranslation();
  const [activeNode, setActiveNode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [initialNodesSet, setInitialNodesSet] = useState(false);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const draggedNodeRef = useRef(null);
  const isDraggingRef = useRef(false);
  
  // Get connected nodes set when active node changes
  const connectedNodes = useMemo(() => {
    if (!activeNode) return new Set();
    
    const connected = new Set([activeNode.id]);
    
    links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      
      if (sourceId === activeNode.id) connected.add(targetId);
      if (targetId === activeNode.id) connected.add(sourceId);
    });
    
    return connected;
  }, [activeNode, links]);

  // Detect container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Prepare mind map data from translations
  const prepareNodesAndLinks = () => {
    try {
      const nodes = [];
      const links = [];
      let nodeIndex = 0;
      
      // Create main node
      const mainLabel = t('mindMap.nodes.main.label', 'Me');
      
      nodes.push({
        id: 'main',
        label: mainLabel,
        type: 'main',
        radius: NODE_TYPES.main.radius,
        index: nodeIndex++,
        data: {
          title: t('mindMap.nodes.main.title', 'About Me'),
          subtitle: t('mindMap.nodes.main.subtitle', 'Creative Developer'),
          description: t('mindMap.nodes.main.description', '<p>About me description</p>')
        }
      });
      
      // Create category nodes (first-level connections)
      const categories = [
        'frontend', 'design', 'backend', 'dataviz', 'animation',
        'masters', 'bachelors', 'courses'
      ];
      
      categories.forEach(category => {
        const label = t(`mindMap.nodes.${category}.label`, category);
        
        nodes.push({
          id: category,
          label: label,
          type: 'category',
          radius: NODE_TYPES.category.radius,
          index: nodeIndex++,
          data: {
            title: t(`mindMap.nodes.${category}.title`, label),
            subtitle: t(`mindMap.nodes.${category}.subtitle`, ''),
            description: t(`mindMap.nodes.${category}.description`, '<p>Description</p>')
          }
        });
        
        // Link to main node
        links.push({
          source: 'main',
          target: category,
          value: 3
        });
      });
      
      // Create detail nodes (second-level connections)
      const details = [
        { id: 'portfolio', category: 'frontend' },
        { id: 'datadashboard', category: 'dataviz' },
        { id: 'visualizer', category: 'animation' },
        { id: 'neuralnet', category: 'masters' },
        { id: 'ai', category: 'masters' },
        { id: 'interactive', category: 'design' },
        { id: 'music', category: 'animation' },
        { id: 'space', category: 'dataviz' }
      ];
      
      details.forEach(detail => {
        // Check if category exists
        const categoryExists = nodes.some(node => node.id === detail.category);
        if (!categoryExists) return;
        
        const label = t(`mindMap.nodes.${detail.id}.label`, detail.id);
        
        nodes.push({
          id: detail.id,
          label: label,
          type: 'detail',
          category: detail.category,
          radius: NODE_TYPES.detail.radius,
          index: nodeIndex++,
          data: {
            title: t(`mindMap.nodes.${detail.id}.title`, label),
            subtitle: t(`mindMap.nodes.${detail.id}.subtitle`, ''),
            description: t(`mindMap.nodes.${detail.id}.description`, '<p>Description</p>')
          }
        });
        
        // Link to category node
        links.push({
          source: detail.category,
          target: detail.id,
          value: 2
        });
      });
      
      // Add cross-connections for related nodes
      const crossConnections = [
        { source: 'ai', target: 'dataviz' },
        { source: 'animation', target: 'interactive' },
        { source: 'dataviz', target: 'backend' },
        { source: 'frontend', target: 'design' },
        { source: 'music', target: 'interactive' },
        { source: 'neuralnet', target: 'ai' },
        { source: 'portfolio', target: 'design' },
        { source: 'space', target: 'interactive' }
      ];
      
      crossConnections.forEach(connection => {
        // Check if both nodes exist
        const sourceExists = nodes.some(node => node.id === connection.source);
        const targetExists = nodes.some(node => node.id === connection.target);
        
        if (sourceExists && targetExists) {
          links.push({
            source: connection.source,
            target: connection.target,
            value: 1
          });
        }
      });
      
      return { nodes, links };
    } catch (error) {
      console.error("Error preparing mind map data:", error);
      return { nodes: [], links: [] };
    }
  };

  // Calculate initial positions for nodes with more vertical spread
  const calculateInitialPositions = (nodes, width, height) => {
    if (!nodes.length) return nodes;
    
    const mainNode = nodes.find(node => node.type === 'main');
    const categoryNodes = nodes.filter(node => node.type === 'category');
    const detailNodes = nodes.filter(node => node.type === 'detail');
    
    // Center main node
    if (mainNode) {
      mainNode.x = width / 2;
      mainNode.y = height / 2;
    }
    
    // Position categories in a circle around main node
    categoryNodes.forEach((node, i) => {
      const angle = (i / Math.max(1, categoryNodes.length)) * 2 * Math.PI;
      const distance = Math.min(width, height) * 0.25; // More compact layout
      
      node.x = width / 2 + distance * Math.cos(angle);
      node.y = height / 2 + distance * Math.sin(angle);
    });
    
    // Position detail nodes near their categories
    detailNodes.forEach((node) => {
      const parentNode = categoryNodes.find(n => n.id === node.category);
      
      if (parentNode) {
        const angle = Math.random() * 2 * Math.PI;
        const minDistance = (parentNode.radius + node.radius) * 3;
        const distance = minDistance + (Math.random() * 40);
        
        node.x = parentNode.x + distance * Math.cos(angle);
        node.y = parentNode.y + distance * Math.sin(angle);
      } else {
        // Fallback to random position
        node.x = Math.random() * width;
        node.y = Math.random() * height;
      }
    });
    
    return nodes;
  };

  // Initialize data
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    try {
      // Prepare nodes and links directly here to avoid i18next issues
      const { nodes: initialNodes, links: initialLinks } = prepareNodesAndLinks();
      
      if (initialNodes.length === 0) return;
      
      // Set initial positions
      const nodesWithPositions = calculateInitialPositions(
        initialNodes, 
        dimensions.width, 
        dimensions.height
      );
      
      setNodes(nodesWithPositions);
      setLinks(initialLinks);
      setInitialNodesSet(true);
      setIsLoading(true);
    } catch (error) {
      console.error("Error initializing mind map data:", error);
      setIsLoading(false);
    }
  }, [dimensions, t, language]);

  // Create simulation with slightly adjusted parameters for simpler layout
  const createSimulation = (nodes, links) => {
    const simulation = d3.forceSimulation(nodes)
      // Link force with more reasonable distances
      .force("link", d3.forceLink(links)
        .id(d => d.id)
        .distance(d => {
          if (d.source.type === "main" && d.target.type === "category") return 150;
          if (d.source.type === "category" && d.target.type === "detail") return 120;
          return 80;
        })
        .strength(0.2))
      
      // Reduce charge force for less spread
      .force("charge", d3.forceManyBody()
        .strength(d => {
          if (d.type === "main") return -300;
          if (d.type === "category") return -200;
          return -100;
        })
        .distanceMin(30)
        .distanceMax(250))
      
      // Center force
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      
      // X and Y forces for more stability
      .force("x", d3.forceX(dimensions.width / 2).strength(0.02))
      .force("y", d3.forceY(dimensions.height / 2).strength(0.02))
      
      // Collision force with slightly larger radius to prevent overlap
      .force("collision", d3.forceCollide()
        .radius(d => d.radius * 2) // Increased to account for labels
        .strength(0.7));
      
    // Reduce the alpha settings for smoother transitions
    simulation.alphaDecay(0.01);
    simulation.velocityDecay(0.4);
    
    return simulation;
  };

  // Set up and run simulation
  useEffect(() => {
    if (!initialNodesSet || nodes.length === 0 || dimensions.width === 0) return;
    
    // Clean up previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }
    
    // Create new simulation
    const simulation = createSimulation([...nodes], [...links]);
    
    // Update node positions on tick
    simulation.on("tick", () => {
      // Only update if not currently dragging
      if (isDraggingRef.current) return;
      
      // Apply boundaries with padding
      const padding = 80; // Increased padding for labels
      const currentNodes = [...nodes];
      
      currentNodes.forEach(node => {
        // Apply boundaries
        node.x = Math.max(node.radius + padding, Math.min(dimensions.width - node.radius - padding, node.x));
        node.y = Math.max(node.radius + padding, Math.min(dimensions.height - node.radius - padding, node.y));
      });
      
      // Update nodes state
      setNodes([...currentNodes]);
    });
    
    // Save simulation reference for cleanup
    simulationRef.current = simulation;
    
    // Run simulation for a set number of ticks to get a good initial layout
    for (let i = 0; i < 100; i++) {
      simulation.tick();
    }
    
    // Update nodes state with initial positions
    setNodes([...nodes]);
    setIsLoading(false);
    
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [initialNodesSet, dimensions, nodes.length, links]);

  // Handle node click - only if not dragging
  const handleNodeClick = (node, e) => {
    // Prevent default to stop any other handlers
    if (e) e.preventDefault();
    
    // Only handle clicks if we're not dragging
    if (isDraggingRef.current || draggedNodeRef.current) return;
    
    // Toggle active node
    setActiveNode(activeNode && activeNode.id === node.id ? null : node);
    
    // Restart simulation with reduced alpha
    if (simulationRef.current) {
      simulationRef.current.alpha(0.2).restart();
    }
  };

  // Helper function to convert screen coordinates to SVG coordinates
  const screenToSVGCoordinates = (screenX, screenY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const svg = svgRef.current;
    const point = new DOMPoint(screenX, screenY);
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    
    return { x: svgPoint.x, y: svgPoint.y };
  };

  // Handle background click to deselect active node
  const handleBackgroundClick = (e) => {
    if (e.target === svgRef.current) {
      setActiveNode(null);
    }
  };

  // Get node status (active, connected)
  const getNodeStatus = (node) => {
    const isActive = activeNode && activeNode.id === node.id;
    const isConnected = activeNode && !isActive && connectedNodes.has(node.id);
    return { isActive, isConnected };
  };
  
  // Get link status (active, connected)
  const getLinkStatus = (link) => {
    if (!activeNode) return { isActive: false, isConnectedToActive: false };
    
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    
    const isActive = sourceId === activeNode.id || targetId === activeNode.id;
    const isConnectedToActive = !isActive && 
      connectedNodes.has(sourceId) && connectedNodes.has(targetId);
    
    return { isActive, isConnectedToActive };
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden outline-none"
      style={{ outline: 'none' }}
    >
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10">
          <div className="text-white flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-orange-500 border-b-orange-500 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
            <span>{t('mindMap.loading', 'Loading visualization...')}</span>
          </div>
        </div>
      )}
      
      {/* Main visualization */}
      <svg
        ref={svgRef}
        className="w-full h-full outline-none"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
        onClick={handleBackgroundClick}
        tabIndex={-1}
        aria-label="Mind map visualization"
        style={{ outline: 'none' }}
      >
        {/* Links */}
        <g>
          {links.map((link, index) => {
            // Find source and target nodes
            const sourceNode = nodes.find(n => n.id === (typeof link.source === 'object' ? link.source.id : link.source));
            const targetNode = nodes.find(n => n.id === (typeof link.target === 'object' ? link.target.id : link.target));
            
            if (!sourceNode || !targetNode) return null;
            
            // Determine link status
            const { isActive, isConnectedToActive } = getLinkStatus(link);
            
            return (
              <ClusterLink
                key={`link-${index}`}
                source={{ x: sourceNode.x, y: sourceNode.y }}
                target={{ x: targetNode.x, y: targetNode.y }}
                isActive={isActive}
                isConnectedToActive={isConnectedToActive}
                strength={link.value || 1}
                color="#ffffff"
              />
            );
          })}
        </g>
        
        {/* Nodes */}
        <g>
          {nodes.map((node) => {
            if (!node || !node.id) return null;
            
            // Determine node status
            const { isActive, isConnected } = getNodeStatus(node);
            
            // Custom drag handlers for more precise control
            const onDragStart = (e) => {
              // Prevent normal click handling
              e.stopPropagation();
              e.preventDefault();
              
              // Set drag state immediately to prevent click events
              isDraggingRef.current = true;
              draggedNodeRef.current = node.id;
              
              // Get initial mouse position in SVG coordinates
              const svgCoords = screenToSVGCoordinates(e.clientX, e.clientY);
              
              // Store initial offset between mouse and node center
              const dragStartPosition = {
                offsetX: node.x - svgCoords.x,
                offsetY: node.y - svgCoords.y,
                initialX: svgCoords.x,
                initialY: svgCoords.y
              };
              
              // Pause simulation during drag
              if (simulationRef.current) {
                simulationRef.current.alphaTarget(0);
              }
              
              const onMouseMove = (moveEvent) => {
                // Convert mouse position to SVG coordinates
                const svgCoords = screenToSVGCoordinates(moveEvent.clientX, moveEvent.clientY);
                
                // Calculate new position with offset to keep node relative to cursor
                const newX = svgCoords.x + dragStartPosition.offsetX;
                const newY = svgCoords.y + dragStartPosition.offsetY;
                
                // Apply boundaries
                const padding = 80;
                const boundedX = Math.max(node.radius + padding, Math.min(dimensions.width - node.radius - padding, newX));
                const boundedY = Math.max(node.radius + padding, Math.min(dimensions.height - node.radius - padding, newY));
                
                // Update the node position in the simulation and our state
                if (simulationRef.current) {
                  const simNodes = simulationRef.current.nodes();
                  const nodeIndex = simNodes.findIndex(n => n.id === node.id);
                  if (nodeIndex !== -1) {
                    simNodes[nodeIndex].fx = boundedX;
                    simNodes[nodeIndex].fy = boundedY;
                  }
                }
                
                // Update the nodes array for rendering
                setNodes(prevNodes => {
                  const updatedNodes = [...prevNodes];
                  const index = updatedNodes.findIndex(n => n.id === node.id);
                  
                  if (index !== -1) {
                    updatedNodes[index] = {
                      ...updatedNodes[index],
                      x: boundedX,
                      y: boundedY
                    };
                  }
                  
                  return updatedNodes;
                });
                
                moveEvent.preventDefault();
              };
              
              const onMouseUp = () => {
                // Clean up event listeners
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                
                // Get the final position
                const finalNode = nodes.find(n => n.id === node.id);
                if (!finalNode) {
                  isDraggingRef.current = false;
                  draggedNodeRef.current = null;
                  return;
                }
                
                // Keep the node in place temporarily
                if (simulationRef.current) {
                  const simNodes = simulationRef.current.nodes();
                  const nodeIndex = simNodes.findIndex(n => n.id === node.id);
                  if (nodeIndex !== -1) {
                    // Calculate velocity from drag
                    const svgCoords = screenToSVGCoordinates(e.clientX, e.clientY);
                    const vx = (svgCoords.x - dragStartPosition.initialX) * 0.05;
                    const vy = (svgCoords.y - dragStartPosition.initialY) * 0.05;
                    
                    simNodes[nodeIndex].vx = vx;
                    simNodes[nodeIndex].vy = vy;
                    
                    // Keep the position fixed for a short time
                    setTimeout(() => {
                      if (simulationRef.current) {
                        const nodes = simulationRef.current.nodes();
                        if (nodeIndex < nodes.length) {
                          nodes[nodeIndex].fx = null;
                          nodes[nodeIndex].fy = null;
                        }
                      }
                    }, 300);
                  }
                }
                
                // Small delay before clearing the drag state
                // This prevents immediate clicks after a drag
                setTimeout(() => {
                  isDraggingRef.current = false;
                  draggedNodeRef.current = null;
                }, 200);
              };
              
              // Add event listeners for the drag operation
              window.addEventListener('mousemove', onMouseMove);
              window.addEventListener('mouseup', onMouseUp);
            };
            
            return (
              <g 
                key={`node-${node.id}`} 
                className="draggable-node"
                transform={`translate(${node.x || 0}, ${node.y || 0})`}
                data-node-id={node.id}
                onMouseDown={onDragStart}
                style={{cursor: 'grab'}}
              >
                <ClusterNode
                  node={node}
                  isActive={isActive}
                  isConnected={isConnected}
                  onClick={(e) => {
                    // Only handle clicks if not dragging
                    if (!isDraggingRef.current && !draggedNodeRef.current) {
                      handleNodeClick(node, e);
                    }
                  }}
                  radius={node.radius}
                  label={node.label}
                  position={{ x: 0, y: 0 }} // Position is handled by the parent g element
                  nodeType={node.type}
                />
              </g>
            );
          })}
        </g>
      </svg>
      
      {/* Node detail panel */}
      {activeNode && (
        <NodeDetailPanel 
          node={activeNode} 
          onClose={() => setActiveNode(null)}
          position="bottom"
        />
      )}
      
      {/* Instructions overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1.5 }}
      >
        <div className="bg-gray-900/80 backdrop-blur-md px-6 py-4 rounded-xl border border-gray-700/50 shadow-xl">
          <div className="flex items-center gap-3 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <div>
              <p>{t('mindMap.clickNodes', 'Click nodes to explore')}</p>
              <p className="text-gray-400 text-sm">{t('mindMap.dragNodes', 'Drag to rearrange')}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedMindMap;