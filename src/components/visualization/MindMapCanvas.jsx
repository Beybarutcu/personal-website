// src/components/visualization/MindMapCanvas.jsx
import React, { useEffect } from 'react';
import { useMindMap } from '../../context/MindMapContext';
import NodeRenderer from './elements/NodeRenderer';
import LinkRenderer from './elements/LinkRenderer';
import SignalAnimator from './elements/SignalAnimator';

const MindMapCanvas = ({ language }) => {
  const { 
    nodes, 
    links, 
    activeNode, 
    tooltipRef, 
    svgRef, 
    handleNodeClick, 
    getConnectedNodeIds,
    simulationPaused,
    updateNodePosition
  } = useMindMap();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Force re-render by triggering a tiny node movement on resize
      if (nodes.length > 0) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Gently adjust nodes towards center on resize
        nodes.forEach(node => {
          const dx = (centerX - node.x) * 0.05;
          const dy = (centerY - node.y) * 0.05;
          updateNodePosition(node.id, node.x + dx, node.y + dy);
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [nodes, updateNodePosition]);

  return (
    <div className="mind-map-canvas w-full h-full overflow-hidden">
      <svg 
        ref={svgRef}
        width="100%"
        height="100%" 
        className="pointer-events-auto"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <g>
          {/* Links between nodes */}
          <LinkRenderer 
            links={links} 
            nodes={nodes} 
            activeNode={activeNode}
            simulationPaused={simulationPaused}
          />
          
          {/* Nodes */}
          <NodeRenderer 
            nodes={nodes}
            activeNode={activeNode}
            onNodeClick={handleNodeClick}
            currentLanguage={language}
            tooltipRef={tooltipRef}
            getConnectedNodeIds={getConnectedNodeIds}
            simulationPaused={simulationPaused}
          />
          
          {/* Signal animation for connections */}
          <SignalAnimator 
            nodes={nodes} 
            links={links} 
            activeNode={activeNode}
            simulationPaused={simulationPaused}
          />
        </g>
      </svg>
    </div>
  );
};

export default MindMapCanvas;