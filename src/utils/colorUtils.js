/**
 * Utility functions for working with colors in the mind map visualization
 */

// Get color based on node type
export const getNodeColor = (type, intensity = 0.5) => {
  const colorMap = {
    main: getGradientColor('#6366f1', '#8b5cf6', intensity),
    skills: getGradientColor('#8b5cf6', '#3b82f6', intensity),
    interests: getGradientColor('#ef4444', '#f97316', intensity),
    education: getGradientColor('#3b82f6', '#14b8a6', intensity),
    projects: getGradientColor('#3b82f6', '#06b6d4', intensity)
  };
  
  return colorMap[type] || colorMap.main;
};

// Create gradient color between two hex colors
export const getGradientColor = (color1, color2, ratio) => {
  ratio = Math.min(1, Math.max(0, ratio));
  
  // Parse the hex colors to RGB
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  
  // Calculate the interpolated color
  const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Convert hex color to rgba string
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Generate a glow effect CSS value for a given color
export const getGlowEffect = (color, intensity = 0.5) => {
  return `0 0 ${10 * intensity}px ${intensity * 5}px ${hexToRgba(color, intensity * 0.5)}`;
};