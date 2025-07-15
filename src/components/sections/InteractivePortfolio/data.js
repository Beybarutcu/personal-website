// src/components/sections/InteractivePortfolio/data.js

// Updated data structure using translation keys from your new content
export const sampleData = {
    nodes: [
      { id: "intro", name: "insight.nodes.main.label", category: "main", size: 25, contentKey: "insight.nodes.main" },
      { id: "frontend", name: "insight.nodes.frontend.label", category: "skills", size: 18, contentKey: "insight.nodes.frontend" },
      { id: "design", name: "insight.nodes.design.label", category: "skills", size: 20, contentKey: "insight.nodes.design" },
      { id: "backend", name: "insight.nodes.backend.label", category: "skills", size: 16, contentKey: "insight.nodes.backend" },
      { id: "animation", name: "insight.nodes.animation.label", category: "skills", size: 15, contentKey: "insight.nodes.animation" },
      { id: "bachelors", name: "insight.nodes.bachelors.label", category: "education", size: 17, contentKey: "insight.nodes.bachelors" },
      { id: "courses", name: "insight.nodes.courses.label", category: "education", size: 14, contentKey: "insight.nodes.courses" },
      { id: "ai", name: "insight.nodes.ai.label", category: "interests", size: 16, contentKey: "insight.nodes.ai" },
      { id: "freelance", name: "insight.nodes.freelance.label", category: "experience", size: 15, contentKey: "insight.nodes.freelance" },
      { id: "vision", name: "insight.nodes.vision.label", category: "interests", size: 18, contentKey: "insight.nodes.vision" },
      { id: "datascience", name: "insight.nodes.datascience.label", category: "interests", size: 16, contentKey: "insight.nodes.datascience" },
      { id: "emergingtech", name: "insight.nodes.emergingtech.label", category: "interests", size: 15, contentKey: "insight.nodes.emergingtech" },
      { id: "thesis", name: "insight.nodes.thesis.label", category: "projects", size: 17, contentKey: "insight.nodes.thesis" },
      { id: "research", name: "insight.nodes.research.label", category: "interests", size: 16, contentKey: "insight.nodes.research" },
      { id: "languages", name: "insight.nodes.languages.label", category: "skills", size: 16, contentKey: "insight.nodes.languages" }
    ],
    links: [
      { source: "intro", target: "design", value: 1 },
      { source: "intro", target: "languages", value: 1 },
      { source: "intro", target: "research", value: 1 },
      { source: "frontend", target: "backend", value: 1 },
      { source: "frontend", target: "animation", value: 1 },
      { source: "design", target: "frontend", value: 1 },
      { source: "design", target: "animation", value: 1 },
      { source: "intro", target: "bachelors", value: 1 },
      { source: "bachelors", target: "courses", value: 1 },
      { source: "ai", target: "vision", value: 1 },
      { source: "ai", target: "datascience", value: 1 },
      { source: "freelance", target: "frontend", value: 1 },
      { source: "freelance", target: "backend", value: 1 },
      { source: "intro", target: "freelance", value: 1 },
      { source: "intro", target: "ai", value: 1 },
      { source: "intro", target: "vision", value: 1 },
      { source: "vision", target: "ai", value: 1 },
      { source: "datascience", target: "thesis", value: 1 },
      { source: "emergingtech", target: "ai", value: 1 },
      { source: "thesis", target: "bachelors", value: 1 },
      { source: "research", target: "bachelors", value: 1 },
      { source: "research", target: "vision", value: 1 },
      { source: "research", target: "languages", value: 1 }
    ]
  };