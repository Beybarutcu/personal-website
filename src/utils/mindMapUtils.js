// src/utils/mindMapUtils.js
import { COLORS } from './colorUtils';

/**
 * Utility functions for the mind map visualization
 */

// Node types and their properties
export const NODE_TYPES = {
  main: {
    radius: 40,
    color: COLORS.NODE_INNER,
    textSize: 14,
    glowIntensity: 1.0,
  },
  category: {
    radius: 30,
    color: COLORS.NODE_OUTER,
    textSize: 12,
    glowIntensity: 0.8,
  },
  detail: {
    radius: 20,
    color: COLORS.NODE_OUTER,
    textSize: 10,
    glowIntensity: 0.6,
  }
};

// Link types and their properties
export const LINK_TYPES = {
  primary: {
    width: 3,
    opacity: 0.7,
    particleCount: 10,
    particleSpeed: 2
  },
  secondary: {
    width: 2,
    opacity: 0.5,
    particleCount: 5,
    particleSpeed: 1.5
  },
  tertiary: {
    width: 1,
    opacity: 0.3,
    particleCount: 2,
    particleSpeed: 1
  }
};

/**
 * Safely get a node's data from translation
 * @param {Function} t - Translation function
 * @param {string} key - Translation key
 * @returns {Object} - Node data object
 */
const getNodeData = (t, key) => {
  try {
    // Extract each property individually to avoid returnObjects error
    return {
      title: t(`${key}.title`),
      subtitle: t(`${key}.subtitle`),
      description: t(`${key}.description`),
      skills: t(`${key}.skills`, { defaultValue: [] }),
      links: {}
    };
  } catch (error) {
    console.error(`Error getting data for node ${key}:`, error);
    return {
      title: key,
      subtitle: "",
      description: "",
      skills: [],
      links: {}
    };
  }
};

/**
 * Prepare data for mind map visualization from translations
 * @param {Function} t - Translation function
 * @returns {Object} - Nodes and links for mind map
 */
export const prepareMindMapData = (t) => {
  const nodes = [];
  const links = [];
  let nodeIndex = 0;
  
  // Create main node
  nodes.push({
    id: 'main',
    label: t('mindMap.nodes.main.label'),
    type: 'main',
    radius: NODE_TYPES.main.radius,
    index: nodeIndex++,
    data: getNodeData(t, 'mindMap.nodes.main')
  });
  
  // Create category nodes (first-level connections)
  const categories = [
    'frontend', 'design', 'backend', 'dataviz', 'animation',
    'masters', 'bachelors', 'courses'
  ];
  
  categories.forEach(category => {
    try {
      // Check if translation exists by accessing a simple string property
      const label = t(`mindMap.nodes.${category}.label`, { defaultValue: null });
      if (!label) {
        console.warn(`Missing translation for category: ${category}`);
        return;
      }
      
      nodes.push({
        id: category,
        label: label,
        type: 'category',
        radius: NODE_TYPES.category.radius,
        index: nodeIndex++,
        data: getNodeData(t, `mindMap.nodes.${category}`)
      });
      
      // Link to main node
      links.push({
        source: 'main',
        target: category,
        value: 3,
        type: 'primary'
      });
    } catch (error) {
      console.error(`Error processing category ${category}:`, error);
    }
  });
  
  // Create detail nodes (second-level connections)
  const details = [
    { id: 'portfolio', category: 'frontend' },
    { id: 'datadashboard', category: 'dataviz' },
    { id: 'visualizer', category: 'animation' },
    { id: 'neuralnet', category: 'masters' },
    { id: 'ai', category: 'masters' },
    { id: 'interactive', category: 'design' },
    { id: 'music', category: 'animation' },
    { id: 'space', category: 'dataviz' }
  ];
  
  details.forEach(detail => {
    try {
      // Check if translation exists by accessing a simple string property
      const label = t(`mindMap.nodes.${detail.id}.label`, { defaultValue: null });
      if (!label) {
        console.warn(`Missing translation for detail: ${detail.id}`);
        return;
      }
      
      nodes.push({
        id: detail.id,
        label: label,
        type: 'detail',
        category: detail.category,
        radius: NODE_TYPES.detail.radius,
        index: nodeIndex++,
        data: getNodeData(t, `mindMap.nodes.${detail.id}`)
      });
      
      // Link to category node
      links.push({
        source: detail.category,
        target: detail.id,
        value: 2,
        type: 'secondary'
      });
    } catch (error) {
      console.error(`Error processing detail ${detail.id}:`, error);
    }
  });
  
  // Add cross-connections for related nodes
  const crossConnections = [
    { source: 'ai', target: 'dataviz' },
    { source: 'animation', target: 'interactive' },
    { source: 'dataviz', target: 'backend' },
    { source: 'frontend', target: 'design' },
    { source: 'music', target: 'interactive' },
    { source: 'neuralnet', target: 'ai' },
    { source: 'portfolio', target: 'design' },
    { source: 'space', target: 'interactive' }
  ];
  
  crossConnections.forEach(connection => {
    // Check if both nodes exist
    const sourceExists = nodes.some(node => node.id === connection.source);
    const targetExists = nodes.some(node => node.id === connection.target);
    
    if (sourceExists && targetExists) {
      links.push({
        source: connection.source,
        target: connection.target,
        value: 1,
        type: 'tertiary'
      });
    }
  });
  
  return { nodes, links };
};

/**
 * Get connected nodes for a given node ID
 * @param {string} nodeId - ID of the node
 * @param {Array} links - Array of link objects
 * @returns {Set} - Set of connected node IDs
 */
export const getConnectedNodes = (nodeId, links) => {
  if (!nodeId) return new Set();
  
  const connected = new Set([nodeId]);
  
  links.forEach(link => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    
    if (sourceId === nodeId) connected.add(targetId);
    if (targetId === nodeId) connected.add(sourceId);
  });
  
  return connected;
};

/**
 * Determine if a node is active or connected to active node
 * @param {Object} node - Node object
 * @param {Object|null} activeNode - Currently active node or null
 * @param {Set} connectedNodes - Set of IDs connected to active node
 * @returns {Object} - Object with isActive and isConnected flags
 */
export const getNodeStatus = (node, activeNode, connectedNodes) => {
  const isActive = activeNode && activeNode.id === node.id;
  const isConnected = activeNode && !isActive && connectedNodes.has(node.id);
  
  return { isActive, isConnected };
};

/**
 * Determine if a link is active or connected to active node
 * @param {Object} link - Link object
 * @param {Object|null} activeNode - Currently active node or null
 * @param {Set} connectedNodes - Set of IDs connected to active node
 * @returns {Object} - Object with isActive and isConnectedToActive flags
 */
export const getLinkStatus = (link, activeNode, connectedNodes) => {
  if (!activeNode) return { isActive: false, isConnectedToActive: false };
  
  const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
  const targetId = typeof link.target === 'object' ? link.target.id : link.target;
  
  const isActive = sourceId === activeNode.id || targetId === activeNode.id;
  const isConnectedToActive = !isActive && 
    connectedNodes.has(sourceId) && connectedNodes.has(targetId);
  
  return { isActive, isConnectedToActive };
};