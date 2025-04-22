// src/components/navigation/MindMapNavigation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import NodeRenderer from './mindmap/NodeRenderer';
import LinkRenderer from './mindmap/LinkRenderer';
import SignalAnimator from './mindmap/SignalAnimator';
import ContentPanel from './ContentPanel';

const MindMapNavigation = ({ language, data = {} }) => {
  const { t } = useTranslation();
  const [activeNode, setActiveNode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const tooltipRef = useRef(null);
  const svgRef = useRef(null);
  
  useEffect(() => {
    // Organize data into nodes and links
    if (data && data.nodes && data.links) {
      // Create a copy of the nodes with fixed positions instead of using simulation
      const nodesList = data.nodes.map(node => ({
        ...node,
        // We'll use predefined positions instead of force layout
        x: node.initialX || Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
        y: node.initialY || Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1
      }));
      
      // Set nodes with fixed positions
      setNodes(nodesList);
      
      // Process links to make sure they reference the node objects
      const linksList = data.links.map(link => {
        const source = nodesList.find(n => n.id === link.source) || link.source;
        const target = nodesList.find(n => n.id === link.target) || link.target;
        return { ...link, source, target };
      });
      
      setLinks(linksList);
    }
  }, [data]);
  
  const handleNodeClick = (nodeId) => {
    setActiveNode(nodeId);
    setIsContentVisible(true);
  };
  
  const handleCloseContent = () => {
    setIsContentVisible(false);
  };
  
  // Calculate which nodes are connected to the active node
  const getConnectedNodeIds = (nodeId) => {
    if (!nodeId || !links.length) return [];
    
    return links
      .filter(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return sourceId === nodeId || targetId === nodeId;
      })
      .map(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return sourceId === nodeId ? targetId : sourceId;
      });
  };
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-10">
      {/* SVG container for mind map */}
      <svg 
        ref={svgRef}
        width="100%"
        height="100%" 
        className="pointer-events-auto"
      >
        {/* Links between nodes */}
        <LinkRenderer 
          links={links} 
          nodes={nodes} 
          activeNode={activeNode}
        />
        
        {/* Nodes */}
        <NodeRenderer 
          nodes={nodes}
          activeNode={activeNode}
          onNodeClick={handleNodeClick}
          currentLanguage={language}
          tooltipRef={tooltipRef}
          nodeContent={data.nodeContent || {}}
          getConnectedNodeIds={getConnectedNodeIds}
        />
        
        {/* Signal animation for connections */}
        <SignalAnimator 
          nodes={nodes} 
          links={links} 
          activeNode={activeNode}
        />
      </svg>
      
      {/* Tooltip */}
      <div 
        ref={tooltipRef}
        className="fixed pointer-events-none bg-gray-900/90 backdrop-blur-md border border-gray-700/50 p-3 rounded-lg shadow-xl z-20 max-w-xs"
        style={{ visibility: 'hidden', opacity: 0 }}
      ></div>
      
      {/* Content panel */}
      {activeNode && data.nodeContent && data.nodeContent[activeNode] && (
        <ContentPanel 
          isVisible={isContentVisible}
          onClose={handleCloseContent}
          content={data.nodeContent[activeNode][language] || data.nodeContent[activeNode]['en']}
          language={language}
        />
      )}
    </div>
  );
};

export default MindMapNavigation;