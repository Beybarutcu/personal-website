// src/components/icons/InsightIcon.jsx
import React from 'react';

const InsightIcon = ({ size = 20, className = "", color = "currentColor" }) => {
  // Custom positions as specified
  const largeRingX = 8;     // Position of large ring
  const largeRingY = 6.5;
  const largeRingR = 6;     // Radius of large ring
  
  const mediumRingX = 18;   // Position of medium ring
  const mediumRingY = 15;
  const mediumRingR = 4;    // Radius of medium ring
  
  const smallRingX = 7;     // Position of small ring
  const smallRingY = 20;
  const smallRingR = 2.5;   // Radius of small ring
  
  // Manually positioned connection lines
  // These values are carefully placed to connect at the edges of the circles
  const line1StartX = 13;  // Large ring to medium ring connection
  const line1StartY = 9;
  const line1EndX = 15;
  const line1EndY = 12;
  
  const line2StartX = 14;  // Medium ring to small ring connection
  const line2StartY = 16;
  const line2EndX = 9;
  const line2EndY = 18.5;
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Three rings with different sizes */}
      <circle cx={largeRingX} cy={largeRingY} r={largeRingR} />
      <circle cx={mediumRingX} cy={mediumRingY} r={mediumRingR} />
      <circle cx={smallRingX} cy={smallRingY} r={smallRingR} />
      
      {/* Connection lines between the rings */}
      <line x1={line1StartX} y1={line1StartY} x2={line1EndX} y2={line1EndY} />
      <line x1={line2StartX} y1={line2StartY} x2={line2EndX} y2={line2EndY} />
    </svg>
  );
};

export default InsightIcon;