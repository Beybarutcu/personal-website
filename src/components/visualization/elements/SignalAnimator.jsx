// src/components/visualization/elements/SignalAnimator.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useMindMap } from '../../../context/MindMapContext';

const SignalAnimator = ({ nodes, links, activeNode, simulationPaused }) => {
  const signalsGroupRef = useRef(null);
  const animationRef = useRef(null);
  
  // Set up signal animation
  useEffect(() => {
    if (!signalsGroupRef.current || !activeNode || links.length === 0 || nodes.length === 0) return;
    
    const signalsGroup = d3.select(signalsGroupRef.current);
    
    // Clear existing signals
    signalsGroup.selectAll('*').remove();
    
    // Animation function
    const animateSignals = () => {
      if (simulationPaused) {
        animationRef.current = requestAnimationFrame(animateSignals);
        return;
      }
      
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
            const signal = signalsGroup.append('circle')
              .attr('class', 'signal')
              .attr('cx', sourceNode.x)
              .attr('cy', sourceNode.y)
              .attr('r', 1.5)
              .attr('fill', 'rgba(255, 255, 255, 1)')  // Pure white for better visibility
              .attr('opacity', 0)  // Start invisible for fade in
              .datum({
                source: sourceNode,
                target: targetNode,
                progress: 0,
                speed: 0.004 + Math.random() * 0.006
              });
              
            // Fade in the signal
            signal.transition()
              .duration(300)
              .attr('opacity', 0.9);
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
            const ambientSignal = signalsGroup.append('circle')
              .attr('class', 'signal ambient')
              .attr('cx', sourceNode.x)
              .attr('cy', sourceNode.y)
              .attr('r', 1)
              .attr('fill', 'rgba(255, 255, 255, 0.7)')  // White light
              .attr('opacity', 0) // Start invisible
              .datum({
                source: sourceNode,
                target: targetNode,
                progress: 0,
                speed: 0.002 + Math.random() * 0.004
              });
              
            // Fade in the ambient signal
            ambientSignal.transition()
              .duration(300)
              .attr('opacity', 0.5);
          }
        }
      }
      
      // Animate existing signals
      signalsGroup.selectAll('.signal')
        .each(function(d) {
          d.progress += d.speed;
          
          // If signal completes journey, start fading out
          if (d.progress >= 1) {
            d3.select(this)
              .transition()
              .duration(300)
              .style('opacity', 0)
              .remove();
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
      
      // Create starburst effect when node is clicked
      if (d3.select(signalsGroupRef.current).attr('data-burst') === 'true') {
        const nodeId = activeNode;
        const node = nodes.find(n => n.id === nodeId);
        
        if (node) {
          // Create starburst particles
          for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 70;
            const duration = 700 + Math.random() * 300;
            const size = 1 + Math.random() * 2;
            
            signalsGroup.append('circle')
              .attr('class', 'starburst')
              .attr('cx', node.x)
              .attr('cy', node.y)
              .attr('r', size)
              .attr('fill', 'white')
              .style('opacity', 0.8)
              .transition()
              .duration(duration)
              .ease(d3.easeCircleOut)
              .attr('cx', node.x + Math.cos(angle) * distance)
              .attr('cy', node.y + Math.sin(angle) * distance)
              .style('opacity', 0)
              .remove();
          }
        }
        
        // Reset burst flag
        d3.select(signalsGroupRef.current).attr('data-burst', 'false');
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animateSignals);
    };
    
    // Start animation
    animateSignals();
    
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, links, activeNode, simulationPaused]);
  
  // Create starburst effect when activeNode changes
  useEffect(() => {
    if (!signalsGroupRef.current || !activeNode) return;
    
    // Set burst flag to trigger effect in animation loop
    d3.select(signalsGroupRef.current).attr('data-burst', 'true');
  }, [activeNode]);
  
  return <g ref={signalsGroupRef} className="signals" data-burst="false"></g>;
};

export default SignalAnimator;