// src/data/mindMapData.js

// Mind map structure with nodes and connections using i18n key references
export const mindMapData = {
  // Nodes representing different aspects
  nodes: [
    // Center node (self)
    { id: 'main', type: 'main', size: 25 },
    
    // Skills nodes
    { id: 'frontend', type: 'skills', size: 20 },
    { id: 'design', type: 'skills', size: 18 },
    { id: 'backend', type: 'skills', size: 16 },
    { id: 'dataviz', type: 'skills', size: 20 },
    { id: 'animation', type: 'skills', size: 15 },
    
    // Education nodes
    { id: 'masters', type: 'education', size: 18 },
    { id: 'bachelors', type: 'education', size: 16 },
    { id: 'courses', type: 'education', size: 14 },
    
    // Project nodes
    { id: 'portfolio', type: 'projects', size: 18 },
    { id: 'datadashboard', type: 'projects', size: 16 },
    { id: 'visualizer', type: 'projects', size: 14 },
    { id: 'neuralnet', type: 'projects', size: 16 },
    
    // Interest nodes
    { id: 'ai', type: 'interests', size: 18 },
    { id: 'interactive', type: 'interests', size: 16 },
    { id: 'music', type: 'interests', size: 14 },
    { id: 'space', type: 'interests', size: 15 }
  ],
  
  // Links between nodes (unchanged as these are language-independent)
  links: [
    // Main node connections
    { source: 'main', target: 'frontend', weight: 4 },
    { source: 'main', target: 'design', weight: 4 },
    { source: 'main', target: 'backend', weight: 3 },
    { source: 'main', target: 'dataviz', weight: 5 },
    { source: 'main', target: 'animation', weight: 3 },
    { source: 'main', target: 'masters', weight: 4 },
    { source: 'main', target: 'bachelors', weight: 3 },
    { source: 'main', target: 'ai', weight: 4 },
    { source: 'main', target: 'interactive', weight: 5 },
    { source: 'main', target: 'music', weight: 3 },
    { source: 'main', target: 'space', weight: 3 },
    
    // Skills connections
    { source: 'frontend', target: 'design', weight: 4 },
    { source: 'frontend', target: 'animation', weight: 3 },
    { source: 'design', target: 'animation', weight: 4 },
    { source: 'dataviz', target: 'frontend', weight: 4 },
    { source: 'dataviz', target: 'backend', weight: 3 },
    { source: 'frontend', target: 'backend', weight: 2 },
    
    // Project connections
    { source: 'main', target: 'portfolio', weight: 5 },
    { source: 'main', target: 'datadashboard', weight: 4 },
    { source: 'main', target: 'visualizer', weight: 4 },
    { source: 'main', target: 'neuralnet', weight: 5 },
    { source: 'dataviz', target: 'datadashboard', weight: 5 },
    { source: 'dataviz', target: 'neuralnet', weight: 4 },
    { source: 'frontend', target: 'portfolio', weight: 4 },
    { source: 'frontend', target: 'datadashboard', weight: 3 },
    { source: 'design', target: 'portfolio', weight: 4 },
    { source: 'design', target: 'visualizer', weight: 3 },
    { source: 'animation', target: 'visualizer', weight: 5 },
    { source: 'backend', target: 'datadashboard', weight: 3 },
    
    // Education connections
    { source: 'masters', target: 'dataviz', weight: 4 },
    { source: 'masters', target: 'ai', weight: 4 },
    { source: 'bachelors', target: 'frontend', weight: 3 },
    { source: 'bachelors', target: 'backend', weight: 3 },
    { source: 'courses', target: 'design', weight: 3 },
    { source: 'courses', target: 'animation', weight: 2 },
    
    // Interest connections
    { source: 'ai', target: 'neuralnet', weight: 5 },
    { source: 'ai', target: 'dataviz', weight: 3 },
    { source: 'interactive', target: 'animation', weight: 4 },
    { source: 'interactive', target: 'design', weight: 3 },
    { source: 'interactive', target: 'visualizer', weight: 4 },
    { source: 'music', target: 'visualizer', weight: 5 },
    { source: 'space', target: 'dataviz', weight: 3 }
  ]
};