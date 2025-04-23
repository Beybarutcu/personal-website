// src/components/visualizations/ClusterNode.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Define animation variants with enhanced spring physics for different node types
const nodeVariants = {
  main: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 120,
        damping: 14,
        delay: 0.1
      }
    }
  },
  category: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 150,
        damping: 15,
        delay: 0.2
      }
    }
  },
  detail: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 180,
        damping: 16,
        delay: 0.3
      }
    }
  }
};

// Enhanced spring transition for hover states
const hoverTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 15,
  mass: 1.2 // Slightly more mass for natural movement
};

const ClusterNode = ({
  node,
  isActive,
  isConnected,
  onClick,
  radius = 20,
  label = "",
  position = { x: 0, y: 0 },
  nodeType = "detail"
}) => {
  const [hover, setHover] = useState(false);
  
  // Determine which animation variant to use
  const variant = nodeVariants[nodeType] || nodeVariants.detail;
  
  // Calculate scale with smoother transitions
  const getScale = () => {
    if (hover) return 1.08;
    if (isActive) return 1.05; 
    if (isConnected) return 1.02;
    return 1;
  };
  
  // Get colors based on node type and state with enhanced values
  const getNodeColors = () => {
    // All nodes are white now
    let strokeOpacity = isActive ? 0.95 : isConnected ? 0.8 : 0.5;
    let fillOpacity = isActive ? 1 : isConnected ? 0.9 : 0.75;
    
    // Hover effect with softer boost
    if (hover) {
      strokeOpacity = Math.min(1, strokeOpacity + 0.1);
      fillOpacity = Math.min(1, fillOpacity + 0.1);
    }
    
    // Main node has orange border
    const strokeColor = nodeType === 'main' ? '#f97316' : '#ffffff';
    
    return {
      stroke: strokeColor,
      strokeOpacity,
      fill: '#ffffff',
      fillOpacity
    };
  };

  const nodeColors = getNodeColors();

  // Handle click with explicit stopping of propagation
  const handleClick = (e) => {
    // Prevent event bubbling
    e.stopPropagation();
    
    // Call parent click handler if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.g
      initial={variant.initial}
      animate={variant.animate}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      // Use the handleClick wrapper instead of directly passing onClick
      onClick={handleClick}
      className="cursor-pointer"
    >
      {/* Node circle with smoother animations */}
      <motion.circle
        r={radius}
        fill={nodeColors.fill}
        fillOpacity={nodeColors.fillOpacity}
        stroke={nodeColors.stroke}
        strokeWidth={2}
        strokeOpacity={nodeColors.strokeOpacity}
        animate={{ 
          scale: getScale(),
          fillOpacity: nodeColors.fillOpacity,
          strokeOpacity: nodeColors.strokeOpacity
        }}
        transition={hoverTransition}
        // Add subtle shadow for depth
        style={{
          filter: hover || isActive ? 'drop-shadow(0 0 3px rgba(255,255,255,0.3))' : 'none'
        }}
      />
      
      {/* Node label with smoother text animations - fixed opacity initialization */}
      <motion.text
        dy={radius + 16} // Position below the node with slightly more space
        textAnchor="middle"
        fill="#ffffff"
        fontWeight={nodeType === 'main' ? 'bold' : 'normal'}
        fontSize={nodeType === 'main' ? 14 : nodeType === 'category' ? 12 : 10}
        style={{ 
          pointerEvents: 'none',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
          opacity: 0.9 // Initialize opacity here in style
        }}
        animate={{ 
          scale: getScale(),
          opacity: hover || isActive ? 1 : 0.9
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20
        }}
      >
        {label}
      </motion.text>
      
      {/* Subtle glow effect when active or hovered */}
      {(isActive || hover) && (
        <motion.circle
          r={radius * 1.2}
          fill="none"
          stroke={nodeColors.stroke}
          strokeWidth={1}
          strokeOpacity={0.2}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: isActive ? 0.3 : hover ? 0.2 : 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25
          }}
        />
      )}
    </motion.g>
  );
};

export default ClusterNode;