// src/components/navigation/mindmap/LinkRenderer.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LinkRenderer = ({ links, nodes, activeNode }) => {
  const linkGroupRef = useRef(null);
  
  useEffect(() => {
    if (!linkGroupRef.current || links.length === 0 || nodes.length === 0) return;
    
    const linkGroup = d3.select(linkGroupRef.current);
    
    // Clear existing links
    linkGroup.selectAll('*').remove();
    
    // Create links
    const link = linkGroup.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-opacity', d => d.weight * 0.3 + 0.15)
      .attr('stroke-width', d => d.weight * 0.8)
      .style('opacity', 0);
    
    // Fade in links with staggered timing
    link.transition()
      .delay((d, i) => 100 + i * 5)
      .duration(500)
      .style('opacity', 1);
    
    // Apply initial highlighting if there's an active node
    if (activeNode) {
      updateLinkHighlighting(activeNode);
    }
    
    function updateLinkHighlighting(nodeId) {
      // Update link appearance
      linkGroup.selectAll('line')
        .transition()
        .duration(500)
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
    
  }, [links, nodes]);
  
  // Update links when active node changes
  useEffect(() => {
    if (!linkGroupRef.current || links.length === 0 || !activeNode) return;
    
    const linkGroup = d3.select(linkGroupRef.current);
    
    // Update link styling
    linkGroup.selectAll('line')
      .transition()
      .duration(500)
      .attr('stroke', link => {
        // Handle both object and string references
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        
        if (sourceId === activeNode || targetId === activeNode) {
          return 'rgba(255, 255, 255, 0.45)';  // Brighter for connected links
        }
        return 'rgba(255, 255, 255, 0.15)';
      })
      .attr('stroke-opacity', link => {
        // Handle both object and string references
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        
        if (sourceId === activeNode || targetId === activeNode) {
          return 0.6;  // More visible for connected links
        }
        return 0.25;
      })
      .attr('stroke-width', link => {
        // Handle both object and string references
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        
        if (sourceId === activeNode || targetId === activeNode) {
          return link.weight * 1.0;  // Slightly thicker for connected links
        }
        return link.weight * 0.6;
      });
  }, [activeNode, links]);
  
  // Update link positions when nodes move
  useEffect(() => {
    if (!linkGroupRef.current || links.length === 0 || nodes.length === 0) return;
    
    // Find the simulation object from the parent components
    const parentSvg = linkGroupRef.current.parentNode;
    if (!parentSvg) return;
    
    const updateLinkPositions = () => {
      d3.select(linkGroupRef.current).selectAll('line')
        .attr('x1', d => {
          const source = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source);
          return source ? source.x : 0;
        })
        .attr('y1', d => {
          const source = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source);
          return source ? source.y : 0;
        })
        .attr('x2', d => {
          const target = typeof d.target === 'object' ? d.target : nodes.find(n => n.id === d.target);
          return target ? target.x : 0;
        })
        .attr('y2', d => {
          const target = typeof d.target === 'object' ? d.target : nodes.find(n => n.id === d.target);
          return target ? target.y : 0;
        });
    };
    
    // Set up an interval to update link positions repeatedly
    const interval = setInterval(updateLinkPositions, 30);
    
    return () => clearInterval(interval);
  }, [links, nodes]);
  
  return <g ref={linkGroupRef} className="links"></g>;
};

export default LinkRenderer;