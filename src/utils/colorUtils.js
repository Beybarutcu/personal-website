/**
 * Utility functions for working with colors in the mind map visualization
 */

// Define color constants for the new design
export const COLORS = {
  NODE_INNER: '#f97316', // Orange for inner circle
  NODE_OUTER: '#ffffff', // White for outer circle
  NODE_GLOW: '#ffffff',  // White for the glowing effect
  LINK_DEFAULT: '#ffffff', // Solid white for links
  LINK_ACTIVE: '#ffffff', // Bright white for active links
  SIGNAL: '#ffffff', // White for signals
};

// Get color based on node type
export const getNodeColor = (type, intensity = 0.5) => {
  // Use orange for all node types now, with adjustable intensity
  return COLORS.NODE_INNER;
};

// Create gradient color between two hex colors with safety checks
export const getGradientColor = (color1, color2, ratio) => {
  ratio = Math.min(1, Math.max(0, ratio));
  
  if (!color1 || !color2 || typeof color1 !== 'string' || typeof color2 !== 'string') {
    return '#6366f1';  
  }
  
  // Parse hex colors to RGB
  const parseHex = (hex) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return [r, g, b];
  };
  
  // Convert RGB back to hex
  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b]
      .map(x => Math.round(x))
      .map(x => Math.max(0, Math.min(255, x)))
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  };
  
  try {
    const rgb1 = parseHex(color1);
    const rgb2 = parseHex(color2);
    const resultRgb = rgb1.map((c1, i) => Math.round(c1 * (1 - ratio) + rgb2[i] * ratio));
    return rgbToHex(...resultRgb);
  } catch (error) {
    console.error('Error creating gradient color:', error);
    return '#6366f1'; // Fallback color
  }
};

// Convert hex color to rgba string
export const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
    return `rgba(100, 100, 100, ${alpha})`; // Fallback color
  }

  try {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    
    // Check if RGB values are valid numbers
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return `rgba(100, 100, 100, ${alpha})`;
    }
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch (e) {
    console.error('Error parsing hex color:', hex, e);
    return `rgba(100, 100, 100, ${alpha})`;
  }
};

// Generate a glow effect CSS value for a given color
export const getGlowEffect = (color, intensity = 0.5) => {
  return `0 0 ${10 * intensity}px ${intensity * 5}px ${hexToRgba(color, intensity * 0.5)}`;
};

// Get color brightness (0-255) to determine if text should be light or dark
export const getColorBrightness = (hexColor) => {
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  
  // Calculate perceived brightness using the formula:
  // (R * 299 + G * 587 + B * 114) / 1000
  return (r * 299 + g * 587 + b * 114) / 1000;
};

// Determine if a color needs light or dark text
export const needsLightText = (hexColor) => {
  return getColorBrightness(hexColor) < 128;
};