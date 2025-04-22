// src/data/mindMapData.js

// Mind map structure with nodes and connections
export const mindMapData = {
  // Nodes representing different aspects
  nodes: [
    // Center node (self)
    { id: 'main', label: 'Me', labelEn: 'Me', labelTr: 'Ben', type: 'main', size: 25 },
    
    // Skills nodes
    { id: 'frontend', label: 'Frontend', labelEn: 'Frontend', labelTr: 'Önyüz', type: 'skills', size: 20 },
    { id: 'design', label: 'Design', labelEn: 'Design', labelTr: 'Tasarım', type: 'skills', size: 18 },
    { id: 'backend', label: 'Backend', labelEn: 'Backend', labelTr: 'Arkayüz', type: 'skills', size: 16 },
    { id: 'dataviz', label: 'Data Viz', labelEn: 'Data Viz', labelTr: 'Veri Görsel.', type: 'skills', size: 20 },
    { id: 'animation', label: 'Animation', labelEn: 'Animation', labelTr: 'Animasyon', type: 'skills', size: 15 },
    
    // Education nodes
    { id: 'masters', label: 'Masters Degree', labelEn: 'Masters Degree', labelTr: 'Yüksek Lisans', type: 'education', size: 18 },
    { id: 'bachelors', label: 'Bachelors', labelEn: 'Bachelors', labelTr: 'Lisans', type: 'education', size: 16 },
    { id: 'courses', label: 'Online Courses', labelEn: 'Online Courses', labelTr: 'Online Kurslar', type: 'education', size: 14 },
    
    // Project nodes
    { id: 'portfolio', label: 'Portfolio', labelEn: 'Portfolio', labelTr: 'Portfolyo', type: 'projects', size: 18 },
    { id: 'datadashboard', label: 'Data Dashboard', labelEn: 'Data Dashboard', labelTr: 'Veri Paneli', type: 'projects', size: 16 },
    { id: 'visualizer', label: 'Audio Visualizer', labelEn: 'Audio Visualizer', labelTr: 'Ses Görselleştirici', type: 'projects', size: 14 },
    { id: 'neuralnet', label: 'Neural Network', labelEn: 'Neural Network', labelTr: 'Sinir Ağı', type: 'projects', size: 16 },
    
    // Interest nodes
    { id: 'ai', label: 'AI & ML', labelEn: 'AI & ML', labelTr: 'YZ & ML', type: 'interests', size: 18 },
    { id: 'interactive', label: 'Interactive Art', labelEn: 'Interactive Art', labelTr: 'Etkileşimli Sanat', type: 'interests', size: 16 },
    { id: 'music', label: 'Music', labelEn: 'Music', labelTr: 'Müzik', type: 'interests', size: 14 },
    { id: 'space', label: 'Space', labelEn: 'Space', labelTr: 'Uzay', type: 'interests', size: 15 }
  ],
  
  // Links between nodes
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