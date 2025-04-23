// src/components/visualizations/ClusterLink.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ClusterLink = ({
  source,
  target,
  isActive,
  isConnectedToActive,
  strength = 1,
  color = '#ffffff'
}) => {
  // Calculate link path
  const path = `M${source.x},${source.y} L${target.x},${target.y}`;
  
  // Calculate distance and angle for smooth animation
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Line animation variants with smoother transitions
  const lineVariants = {
    initial: { 
      pathLength: 0, 
      opacity: 0,
      strokeWidth: 0
    },
    animate: { 
      pathLength: 1, 
      opacity: isActive ? 0.8 : isConnectedToActive ? 0.4 : 0.15,
      strokeWidth: isActive 
        ? Math.max(1.2, strength * 1.5) 
        : isConnectedToActive 
          ? Math.max(0.8, strength) 
          : Math.max(0.5, strength * 0.7),
      transition: {
        pathLength: {
          type: 'spring',
          stiffness: 90,
          damping: 15,
          duration: 0.8
        },
        opacity: { 
          type: 'spring', 
          stiffness: 100, 
          damping: 20, 
          duration: 0.5 
        },
        strokeWidth: { 
          type: 'spring', 
          stiffness: 100, 
          damping: 20, 
          duration: 0.3 
        }
      }
    }
  };
  
  // Generate different active styles for smoother visual effects
  const getStrokeColor = () => {
    if (isActive) return color;
    if (isConnectedToActive) return color;
    return color;
  };
  
  // Get dash array for different link types
  const getStrokeDashArray = () => {
    if (isActive) return "none";
    if (isConnectedToActive) return "none";
    return "1, 2"; // Subtle dashed line for inactive links
  };
  
  // Calculate opacity using a non-linear function for more visual impact
  const getOpacity = () => {
    if (isActive) return 0.85;
    if (isConnectedToActive) return 0.45;
    return 0.12;
  };
  
  return (
    <motion.path
      d={path}
      stroke={getStrokeColor()}
      strokeWidth={isActive 
        ? Math.max(1.2, strength * 1.5) 
        : isConnectedToActive 
          ? Math.max(0.8, strength) 
          : Math.max(0.5, strength * 0.7)}
      strokeLinecap="round"
      strokeOpacity={getOpacity()}
      strokeDasharray={getStrokeDashArray()}
      fill="none"
      initial={{ 
        pathLength: 0, 
        opacity: 0.1, // Set an initial opacity value
        strokeWidth: 0 
      }}
      animate="animate"
      variants={lineVariants}
    />
  );
};

export default ClusterLink;