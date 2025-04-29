// src/components/sections/InteractivePortfolio/data.js

// Sample data structure - you can replace this with your actual data later
export const sampleData = {
    nodes: [
      { id: "intro", name: "Introduction", category: "main", size: 25, content: "Hello! I'm [Your Name], a [Your Profession] with a passion for creating innovative solutions." },
      { id: "education1", name: "Education", category: "education", size: 18, content: "Bachelor's Degree in Computer Science" },
      { id: "experience1", name: "Experience", category: "experience", size: 20, content: "Senior Developer at XYZ Company (2020-Present)" },
      { id: "experience2", name: "Experience", category: "experience", size: 16, content: "Web Developer at ABC Agency (2018-2020)" },
      { id: "skills1", name: "Frontend", category: "skills", size: 15, content: "React, Vue, JavaScript, CSS" },
      { id: "skills2", name: "Backend", category: "skills", size: 15, content: "Node.js, Express, Python, SQL" },
      { id: "project1", name: "E-commerce", category: "projects", size: 17, content: "Full-stack e-commerce platform with payment integration" },
      { id: "project2", name: "Dashboard", category: "projects", size: 14, content: "Real-time analytics dashboard for business metrics" },
      { id: "skills3", name: "Tools", category: "skills", size: 12, content: "Git, Docker, AWS, Figma" },
      { id: "skills4", name: "Design", category: "skills", size: 13, content: "UI/UX, Responsive Design, Accessibility" },
      { id: "achievements", name: "Achievements", category: "achievements", size: 16, content: "Award-winning developer with multiple recognitions" },
      { id: "languages", name: "Languages", category: "skills", size: 14, content: "JavaScript, Python, TypeScript, Java" },
      { id: "contact", name: "Contact", category: "contact", size: 18, content: "Email: your.email@example.com | LinkedIn: linkedin.com/in/yourprofile" }
    ],
    links: [
      { source: "intro", target: "education1", value: 1 },
      { source: "intro", target: "experience1", value: 1 },
      { source: "intro", target: "skills1", value: 1 },
      { source: "experience1", target: "experience2", value: 1 },
      { source: "experience1", target: "project1", value: 1 },
      { source: "skills1", target: "skills2", value: 1 },
      { source: "skills1", target: "skills3", value: 1 },
      { source: "skills1", target: "skills4", value: 1 },
      { source: "skills2", target: "project1", value: 1 },
      { source: "skills2", target: "project2", value: 1 },
      { source: "skills2", target: "languages", value: 1 },
      { source: "intro", target: "achievements", value: 1 },
      { source: "intro", target: "contact", value: 1 }
    ]
  };
  
  // Define category colors for nodes
  export const categoryColors = {
    main: "#60a5fa",       // Blue
    education: "#a78bfa",  // Purple
    experience: "#f472b6", // Pink
    skills: "#34d399",     // Green
    projects: "#f59e0b",   // Amber
    achievements: "#ec4899", // Hot pink
    contact: "#6366f1"     // Indigo
  };