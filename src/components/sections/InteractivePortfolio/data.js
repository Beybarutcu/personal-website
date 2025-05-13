// src/components/sections/InteractivePortfolio/data.js

// Updated data structure using translation keys instead of hardcoded content
export const sampleData = {
    nodes: [
      { id: "intro", name: "mindMap.nodes.main.label", category: "main", size: 25, contentKey: "mindMap.nodes.main" },
      { id: "frontend", name: "mindMap.nodes.frontend.label", category: "skills", size: 18, contentKey: "mindMap.nodes.frontend" },
      { id: "design", name: "mindMap.nodes.design.label", category: "skills", size: 20, contentKey: "mindMap.nodes.design" },
      { id: "backend", name: "mindMap.nodes.backend.label", category: "skills", size: 16, contentKey: "mindMap.nodes.backend" },
      { id: "dataviz", name: "mindMap.nodes.dataviz.label", category: "skills", size: 15, contentKey: "mindMap.nodes.dataviz" },
      { id: "animation", name: "mindMap.nodes.animation.label", category: "skills", size: 15, contentKey: "mindMap.nodes.animation" },
      { id: "masters", name: "mindMap.nodes.masters.label", category: "education", size: 17, contentKey: "mindMap.nodes.masters" },
      { id: "bachelors", name: "mindMap.nodes.bachelors.label", category: "education", size: 14, contentKey: "mindMap.nodes.bachelors" },
      { id: "courses", name: "mindMap.nodes.courses.label", category: "education", size: 12, contentKey: "mindMap.nodes.courses" },
      { id: "portfolio", name: "mindMap.nodes.portfolio.label", category: "projects", size: 13, contentKey: "mindMap.nodes.portfolio" },
      { id: "datadashboard", name: "mindMap.nodes.datadashboard.label", category: "projects", size: 16, contentKey: "mindMap.nodes.datadashboard" },
      { id: "visualizer", name: "mindMap.nodes.visualizer.label", category: "projects", size: 14, contentKey: "mindMap.nodes.visualizer" },
      { id: "neuralnet", name: "mindMap.nodes.neuralnet.label", category: "projects", size: 18, contentKey: "mindMap.nodes.neuralnet" },
      { id: "ai", name: "mindMap.nodes.ai.label", category: "interests", size: 16, contentKey: "mindMap.nodes.ai" },
      { id: "interactive", name: "mindMap.nodes.interactive.label", category: "interests", size: 15, contentKey: "mindMap.nodes.interactive" },
      { id: "music", name: "mindMap.nodes.music.label", category: "interests", size: 14, contentKey: "mindMap.nodes.music" },
      { id: "space", name: "mindMap.nodes.space.label", category: "interests", size: 15, contentKey: "mindMap.nodes.space" }
    ],
    links: [
      { source: "intro", target: "frontend", value: 1 },
      { source: "intro", target: "design", value: 1 },
      { source: "intro", target: "backend", value: 1 },
      { source: "intro", target: "dataviz", value: 1 },
      { source: "frontend", target: "backend", value: 1 },
      { source: "frontend", target: "animation", value: 1 },
      { source: "design", target: "frontend", value: 1 },
      { source: "design", target: "animation", value: 1 },
      { source: "dataviz", target: "frontend", value: 1 },
      { source: "dataviz", target: "neuralnet", value: 1 },
      { source: "dataviz", target: "datadashboard", value: 1 },
      { source: "animation", target: "visualizer", value: 1 },
      { source: "backend", target: "datadashboard", value: 1 },
      { source: "intro", target: "masters", value: 1 },
      { source: "masters", target: "bachelors", value: 1 },
      { source: "bachelors", target: "courses", value: 1 },
      { source: "masters", target: "neuralnet", value: 1 },
      { source: "ai", target: "neuralnet", value: 1 },
      { source: "ai", target: "dataviz", value: 1 },
      { source: "interactive", target: "animation", value: 1 },
      { source: "interactive", target: "visualizer", value: 1 },
      { source: "music", target: "visualizer", value: 1 },
      { source: "space", target: "dataviz", value: 1 },
      { source: "intro", target: "portfolio", value: 1 },
      { source: "portfolio", target: "datadashboard", value: 1 },
      { source: "portfolio", target: "visualizer", value: 1 },
      { source: "portfolio", target: "neuralnet", value: 1 }
    ]
  };

