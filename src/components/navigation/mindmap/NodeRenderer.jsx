// src/components/navigation/mindmap/NodeRenderer.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTranslation } from 'react-i18next';

const NodeRenderer = ({ 
  nodes, 
  activeNode, 
  onNodeClick, 
  currentLanguage, 
  tooltipRef,
  simulation
}) => {
  const nodeGroupRef = useRef(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!nodeGroupRef.current || !simulation || nodes.length === 0) return;
    
    const nodeGroup = d3.select(nodeGroupRef.current);
    
    // Clear existing nodes
    nodeGroup.selectAll('*').remove();
    
    // Create node groups
    const node = nodeGroup.selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('opacity', 0)
      .on('mouseover', handleMouseOver)
      .on('mousemove', handleMouseMove)
      .on('mouseout', handleMouseOut)
      .on('click', handleClick)
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));
    
    // Fade in nodes with staggered timing
    node.transition()
      .delay((d, i) => 300 + i * 10)
      .duration(500)
      .style('opacity', 1);
    
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
      .attr('r', 0) // Start with radius 0 for animation
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
      .attr('stroke-width', d => d.id === activeNode ? 1.2 : 0.5)
      // Animate radius from 0 to full size
      .transition()
      .delay((d, i) => 500 + i * 10)
      .duration(600)
      .ease(d3.easeBackOut)
      .attr('r', d => d.size || 15);
    
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
      .style('opacity', 0) // Start invisible for animation
      .text(d => {
        // Get the translated label from i18n
        const translationKey = `mindMap.nodes.${d.id}.label`;
        const label = t(translationKey);
          
        // Truncate if too long
        return label.length > 12 ? label.slice(0, 10) + '...' : label;
      })
      // Fade in labels with slight delay
      .transition()
      .delay((d, i) => 700 + i * 10)
      .duration(500)
      .style('opacity', 1);
    
    // Apply initial highlighting if there's an active node
    if (activeNode) {
      updateHighlighting(activeNode);
    }
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
      // Keep nodes within bounds with padding
      nodes.forEach(d => {
        const padding = 80;
        d.x = Math.max(padding, Math.min(window.innerWidth - padding, d.x));
        d.y = Math.max(padding, Math.min(window.innerHeight - padding, d.y));
      });
      
      // Update node positions
      node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });
    
    // Mouse event handlers
    function handleMouseOver(event, d) {
      // Get mouse position for tooltip
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
      
      // Show tooltip near the node
      if (tooltipRef && tooltipRef.current) {
        const tooltip = d3.select(tooltipRef.current);
        
        // Get translated content using i18n
        const titleKey = `mindMap.nodes.${d.id}.title`;
        const descriptionKey = `mindMap.nodes.${d.id}.description`;
        
        const title = t(titleKey);
        const description = t(descriptionKey);
        
        // Clean up description (remove HTML tags for tooltip)
        const plainDescription = description.replace(/<[^>]*>?/gm, ' ');
        
        // Extract first sentence for the tooltip
        const firstSentence = plainDescription.split('.')[0];
        const displayText = firstSentence.length > 120 ? 
          firstSentence.substring(0, 120) + '...' : 
          firstSentence;
        
        // Update tooltip content
        tooltip.html(`
          <div style="font-weight: bold; margin-bottom: 8px; color: white;">${title}</div>
          <div style="color: rgba(255, 255, 255, 0.8); font-size: 12px;">${displayText}</div>
          <div style="margin-top: 8px; font-size: 11px; color: rgba(255, 255, 255, 0.6);">${t('mindMap.clickToView')}</div>
        `);
        
        // Position tooltip near mouse and fade it in
        tooltip
          .style("visibility", "visible")
          .style("left", `${mouseX + 15}px`)
          .style("top", `${mouseY - 15}px`)
          .transition()
          .duration(300)
          .style("opacity", 1);
      }
    }
    
    function handleMouseMove(event) {
      // Move tooltip with mouse
      if (tooltipRef && tooltipRef.current && tooltipRef.current.style.visibility === 'visible') {
        const [mouseX, mouseY] = d3.pointer(event, document.body);
        d3.select(tooltipRef.current)
          .style("left", `${mouseX + 15}px`)
          .style("top", `${mouseY - 15}px`);
      }
    }
    
    function handleMouseOut() {
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
      
      // Hide tooltip with fade out animation
      if (tooltipRef && tooltipRef.current) {
        d3.select(tooltipRef.current)
          .transition()
          .duration(300)
          .style("opacity", 0)
          .on("end", () => d3.select(tooltipRef.current).style("visibility", "hidden"));
      }
    }
    
    function handleClick(event, d) {
      // Prevent event bubbling
      event.preventDefault();
      event.stopPropagation();
      
      // Hide tooltip
      if (tooltipRef && tooltipRef.current) {
        d3.select(tooltipRef.current)
          .transition()
          .duration(300)
          .style("opacity", 0)
          .on("end", () => d3.select(tooltipRef.current).style("visibility", "hidden"));
      }
      
      // Call the provided click handler
      if (onNodeClick) {
        onNodeClick(d.id);
      }
    }
    
    function updateHighlighting(nodeId) {
      // Find connected nodes
      const connectedNodeIds = simulation.force('link').links()
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
      
      // Update node styling
      nodeGroup.selectAll('.node-glow')
        .transition()
        .duration(500)
        .attr('opacity', d => {
          if (d.id === nodeId) return 0.8;
          if (connectedNodeIds.includes(d.id)) return 0.6;
          return 0.3;
        });
      
      // Update node main circles
      nodeGroup.selectAll('.node-main')
        .transition()
        .duration(500)
        .attr('stroke-width', d => {
          if (d.id === nodeId) return 1.5;
          if (connectedNodeIds.includes(d.id)) return 0.8;
          return 0.4;
        })
        .attr('fill', d => {
          if (d.id === nodeId) {
            return 'rgba(255, 255, 255, 0.95)';
          }
          
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
        .transition()
        .duration(500)
        .attr('opacity', d => d.id === nodeId ? 0.7 : 0);
      
      // Update labels
      nodeGroup.selectAll('.node-label')
        .transition()
        .duration(500)
        .attr('font-weight', d => d.id === nodeId ? 'bold' : 'normal')
        .attr('fill', d => {
          if (d.id === nodeId) return 'rgba(255, 255, 255, 1)';
          if (connectedNodeIds.includes(d.id)) return 'rgba(255, 255, 255, 0.9)';
          return 'rgba(255, 255, 255, 0.6)';
        });
    }
    
    // Drag functions
    function dragStarted(event, d) {
      // Hide tooltip when dragging starts
      if (tooltipRef && tooltipRef.current) {
        d3.select(tooltipRef.current).style("visibility", "hidden");
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
    
    // Click handler to background to hide tooltip
    d3.select(nodeGroupRef.current.parentNode).on('click', () => {
      if (tooltipRef && tooltipRef.current) {
        d3.select(tooltipRef.current)
          .transition()
          .duration(300)
          .style("opacity", 0)
          .on("end", () => d3.select(tooltipRef.current).style("visibility", "hidden"));
      }
    });
    
    return () => {
      // Clean up event listeners
      node.on('mouseover', null)
        .on('mousemove', null)
        .on('mouseout', null)
        .on('click', null);
      
      d3.select(nodeGroupRef.current.parentNode).on('click', null);
    };
  }, [nodes, activeNode, simulation, currentLanguage, onNodeClick, tooltipRef, t]);
  
  // Apply highlighting when activeNode changes
  useEffect(() => {
    if (!nodeGroupRef.current || !simulation || !activeNode) return;
    
    const nodeGroup = d3.select(nodeGroupRef.current);
    
    // Find connected nodes
    const connectedNodeIds = simulation.force('link').links()
      .filter(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return sourceId === activeNode || targetId === activeNode;
      })
      .map(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return sourceId === activeNode ? targetId : sourceId;
      });
    
    // Update node styling
    nodeGroup.selectAll('.node-glow')
      .transition()
      .duration(500)
      .attr('opacity', d => {
        if (d.id === activeNode) return 0.8;
        if (connectedNodeIds.includes(d.id)) return 0.6;
        return 0.3;
      });
    
    // Update node main circles
    nodeGroup.selectAll('.node-main')
      .transition()
      .duration(500)
      .attr('stroke-width', d => {
        if (d.id === activeNode) return 1.5;
        if (connectedNodeIds.includes(d.id)) return 0.8;
        return 0.4;
      })
      .attr('fill', d => {
        if (d.id === activeNode) {
          return 'rgba(255, 255, 255, 0.95)';
        }
        
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
      .transition()
      .duration(500)
      .attr('opacity', d => d.id === activeNode ? 0.7 : 0);
    
    // Update labels
    nodeGroup.selectAll('.node-label')
      .transition()
      .duration(500)
      .attr('font-weight', d => d.id === activeNode ? 'bold' : 'normal')
      .attr('fill', d => {
        if (d.id === activeNode) return 'rgba(255, 255, 255, 1)';
        if (connectedNodeIds.includes(d.id)) return 'rgba(255, 255, 255, 0.9)';
        return 'rgba(255, 255, 255, 0.6)';
      });
  }, [activeNode, simulation, t]);

  return <g ref={nodeGroupRef} className="nodes"></g>;
};

export default NodeRenderer;