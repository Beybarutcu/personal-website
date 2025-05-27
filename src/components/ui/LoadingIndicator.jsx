import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LoadingIndicator = ({ size = 200 }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Store all ongoing transitions for cleanup
    const transitions = new Set();

    // Function to create and track transitions
    const createTrackedTransition = (selection) => {
      const transition = selection.transition();
      transitions.add(transition);
      return transition;
    };

    // Add glow filter
    const defs = svg.append('defs');
    
    // Glow filter for nodes
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Moving dot gradient
    const gradient = defs.append('linearGradient')
      .attr('id', 'dotGradient')
      .attr('gradientUnits', 'userSpaceOnUse');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'white')
      .attr('stop-opacity', '0');

    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', 'white')
      .attr('stop-opacity', '1');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'white')
      .attr('stop-opacity', '0');

    const center = { x: size / 2, y: size / 2 };
    const radius = size * 0.35;

    // Generate 7 positions around the circle
    const nodes = d3.range(7).map((i) => {
      const angle = (Math.PI * 2 * i) / 7;
      const r = radius * (0.85 + Math.random() * 0.15);
      return {
        x: center.x + Math.cos(angle) * r,
        y: center.y + Math.sin(angle) * r,
        size: size * (0.045 + Math.random() * 0.02)
      };
    });

    // Create lines container
    const linesGroup = svg.append('g');
    
    // Create nodes container
    const nodesGroup = svg.append('g');

    // Draw center node with orange color
    const centerNode = nodesGroup
      .append('circle')
      .attr('cx', center.x)
      .attr('cy', center.y)
      .attr('r', size * 0.1)
      .attr('fill', 'rgb(var(--color-primary))')
      .attr('opacity', 0);

    // Fade in center node
    const centerTransition = createTrackedTransition(centerNode)
      .duration(400)
      .attr('opacity', 1)
      .ease(d3.easeCubicOut);

    // Create and animate lines and outer nodes
    nodes.forEach((node, i) => {
      // Create line
      const line = linesGroup
        .append('line')
        .attr('x1', center.x)
        .attr('y1', center.y)
        .attr('x2', center.x)
        .attr('y2', center.y)
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5);

      // Create outer node
      const outerNode = nodesGroup
        .append('circle')
        .attr('cx', node.x)
        .attr('cy', node.y)
        .attr('r', 0)
        .attr('fill', 'white')
        .attr('opacity', 0);

      // Enhanced fade in for outer node
      const nodeTransition = createTrackedTransition(outerNode)
        .delay(300 + i * 50)
        .duration(400)
        .attr('r', node.size)
        .attr('opacity', 0.5)
        .ease(d3.easeCubicOut);

      // Animate line growth
      const lineTransition = createTrackedTransition(line)
        .delay(300 + i * 60)
        .duration(450)
        .attr('x2', node.x)
        .attr('y2', node.y)
        .ease(d3.easeCubicOut)
        .on('end', () => {
          if (!svg.node()) return; // Check if component is still mounted

          const length = Math.hypot(node.x - center.x, node.y - center.y);
          
          gradient
            .attr('x1', center.x)
            .attr('y1', center.y)
            .attr('x2', node.x)
            .attr('y2', node.y);

          const signalDot = linesGroup
            .append('circle')
            .attr('r', 3)
            .attr('fill', 'url(#dotGradient)')
            .attr('opacity', 0);

          const dotTransition = createTrackedTransition(signalDot)
            .delay(100 + i * 50)
            .duration(300)
            .attr('opacity', 1)
            .ease(d3.easeLinear);

          dotTransition
            .attrTween('transform', () => (t) => {
              const x = center.x + (node.x - center.x) * t;
              const y = center.y + (node.y - center.y) * t;
              return `translate(${x},${y})`;
            })
            .on('end', () => {
              if (!svg.node()) return; // Check if component is still mounted

              const glowTransition = createTrackedTransition(outerNode)
                .duration(200)
                .attr('opacity', 1)
                .attr('filter', 'url(#glow)')
                .attr('r', node.size * 1.2);

              glowTransition.on('end', function() {
                if (!svg.node()) return; // Check if component is still mounted

                const pulseTransition = createTrackedTransition(d3.select(this))
                  .duration(300)
                  .attr('r', node.size)
                  .ease(d3.easeCubicInOut);
                
                transitions.add(pulseTransition);
              });

              signalDot.remove();
            });

          transitions.add(dotTransition);
        });

      transitions.add(lineTransition);
      transitions.add(nodeTransition);
    });

    transitions.add(centerTransition);

    // Cleanup function
    return () => {
      // Interrupt all ongoing transitions
      transitions.forEach(t => {
        try {
          t.interrupt();
        } catch (e) {
          // Ignore any errors during cleanup
        }
      });
    };
  }, [size]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      style={{ overflow: 'visible' }}
    />
  );
};

export default LoadingIndicator;
