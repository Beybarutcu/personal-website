// src/components/sections/InteractivePortfolio/data.js

// Updated data structure using translation keys instead of hardcoded content
export const sampleData = {
    nodes: [
      { id: "intro", name: "insight.nodes.main.label", category: "main", size: 25, contentKey: "insight.nodes.main" },
      { id: "frontend", name: "insight.nodes.frontend.label", category: "skills", size: 18, contentKey: "insight.nodes.frontend" },
      { id: "design", name: "insight.nodes.design.label", category: "skills", size: 20, contentKey: "insight.nodes.design" },
      { id: "backend", name: "insight.nodes.backend.label", category: "skills", size: 16, contentKey: "insight.nodes.backend" },
      { id: "dataviz", name: "insight.nodes.dataviz.label", category: "skills", size: 15, contentKey: "insight.nodes.dataviz" },
      { id: "animation", name: "insight.nodes.animation.label", category: "skills", size: 15, contentKey: "insight.nodes.animation" },
      { id: "masters", name: "insight.nodes.masters.label", category: "education", size: 17, contentKey: "insight.nodes.masters" },
      { id: "bachelors", name: "insight.nodes.bachelors.label", category: "education", size: 14, contentKey: "insight.nodes.bachelors" },
      { id: "courses", name: "insight.nodes.courses.label", category: "education", size: 12, contentKey: "insight.nodes.courses" },
      { id: "portfolio", name: "insight.nodes.portfolio.label", category: "projects", size: 13, contentKey: "insight.nodes.portfolio" },
      { id: "datadashboard", name: "insight.nodes.datadashboard.label", category: "projects", size: 16, contentKey: "insight.nodes.datadashboard" },
      { id: "visualizer", name: "insight.nodes.visualizer.label", category: "projects", size: 14, contentKey: "insight.nodes.visualizer" },
      { id: "neuralnet", name: "insight.nodes.neuralnet.label", category: "projects", size: 18, contentKey: "insight.nodes.neuralnet" },
      { id: "ai", name: "insight.nodes.ai.label", category: "interests", size: 16, contentKey: "insight.nodes.ai" },
      { id: "interactive", name: "insight.nodes.interactive.label", category: "interests", size: 15, contentKey: "insight.nodes.interactive" },
      { id: "music", name: "insight.nodes.music.label", category: "interests", size: 14, contentKey: "insight.nodes.music" },
      { id: "space", name: "insight.nodes.space.label", category: "interests", size: 15, contentKey: "insight.nodes.space" }
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

