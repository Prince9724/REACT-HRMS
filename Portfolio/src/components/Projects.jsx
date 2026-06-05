import { useState } from 'react';

function Projects() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "web",
      image: "🛒",
      description: "Full-featured online store with cart, wishlist, and payment gateway",
      tech: ["React", "Redux", "Stripe", "Firebase"],
      features: ["User Authentication", "Product Filtering", "Order Tracking"],
      link: "#",
      github: "#"
    },
    {
      id: 2,
      title: "AI Image Generator",
      category: "ai",
      image: "🎨",
      description: "Generate stunning images using OpenAI's DALL-E API",
      tech: ["React", "OpenAI API", "Tailwind"],
      features: ["Text to Image", "Image Variations", "Download Option"],
      link: "#",
      github: "#"
    },
    {
      id: 3,
      title: "Task Management App",
      category: "web",
      image: "✅",
      description: "Collaborative task management with real-time updates",
      tech: ["React", "Socket.io", "MongoDB", "Express"],
      features: ["Drag & Drop", "Real-time Sync", "Team Collaboration"],
      link: "#",
      github: "#"
    },
    {
      id: 4,
      title: "Weather Dashboard",
      category: "web",
      image: "🌤️",
      description: "Real-time weather updates with beautiful visualizations",
      tech: ["React", "Chart.js", "Weather API"],
      features: ["5-day Forecast", "Interactive Maps", "Location Search"],
      link: "#",
      github: "#"
    },
    {
      id: 5,
      title: "Social Media Dashboard",
      category: "web",
      image: "📊",
      description: "Analytics dashboard for social media metrics",
      tech: ["React", "D3.js", "Firebase"],
      features: ["Real-time Data", "Custom Reports", "Data Export"],
      link: "#",
      github: "#"
    },
    {
      id: 6,
      title: "Portfolio Template",
      category: "design",
      image: "🎯",
      description: "Modern portfolio template for creative professionals",
      tech: ["React", "Framer Motion", "Styled Components"],
      features: ["Animations", "Responsive", "Dark Mode"],
      link: "#",
      github: "#"
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">My Portfolio</span>
          <h2>Featured Projects</h2>
          <div className="section-line"></div>
        </div>
        
        <div className="project-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Projects
          </button>
          <button 
            className={`filter-btn ${filter === 'web' ? 'active' : ''}`}
            onClick={() => setFilter('web')}
          >
            Web Apps
          </button>
          <button 
            className={`filter-btn ${filter === 'ai' ? 'active' : ''}`}
            onClick={() => setFilter('ai')}
          >
            AI Projects
          </button>
          <button 
            className={`filter-btn ${filter === 'design' ? 'active' : ''}`}
            onClick={() => setFilter('design')}
          >
            UI/UX Design
          </button>
        </div>
        
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <div className="project-emoji">{project.image}</div>
                <div className="project-overlay">
                  <button 
                    className="preview-btn"
                    onClick={() => setSelectedProject(project)}
                  >
                    Quick View
                  </button>
                </div>
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.tech.slice(0, 3).map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.578C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </a>
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    Live Demo →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedProject && (
          <div className="modal" onClick={() => setSelectedProject(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedProject(null)}>×</button>
              <div className="modal-emoji">{selectedProject.image}</div>
              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.description}</p>
              <div className="modal-features">
                <h4>Key Features:</h4>
                <ul>
                  {selectedProject.features.map((feature, i) => (
                    <li key={i}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
              <div className="modal-tech">
                {selectedProject.tech.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;