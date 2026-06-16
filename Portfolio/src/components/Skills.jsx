import { useState, useEffect } from 'react';

function Skills() {
  const [counters, setCounters] = useState({});
  
  const skillCategories = [
    {
      category: "Frontend Development",
      skills: [
        { name: "React.js", level: 92, icon: "⚛️" },
        { name: "JavaScript", level: 88, icon: "📜" },
        { name: "HTML/CSS", level: 90, icon: "🎨" },
        { name: "Tailwind CSS", level: 85, icon: "💨" }
        ,{name: "Nodejs"}
      ]
    },
    {
      category: "Tools & Others",
      skills: [
        { name: "Git & GitHub", level: 87, icon: "📊" },
        { name: "VS Code", level: 95, icon: "💻" },
        { name: "Figma", level: 78, icon: "🎨" },
        { name: "Node.js", level: 75, icon: "🚀" }
      ]
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          skillCategories.forEach(category => {
            category.skills.forEach(skill => {
              let start = 0;
              const increment = skill.level / 50;
              const timer = setInterval(() => {
                start += increment;
                if (start >= skill.level) {
                  clearInterval(timer);
                  start = skill.level;
                }
                setCounters(prev => ({
                  ...prev,
                  [skill.name]: Math.floor(start)
                }));
              }, 20);
            });
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('skills');
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">My Skills</span>
          <h2>What I Bring to the Table</h2>
          <div className="section-line"></div>
        </div>
        
        <div className="skills-container">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="skill-category">
              <h3 className="category-title">{category.category}</h3>
              <div className="skills-grid">
                {category.skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-icon">{skill.icon}</span>
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{counters[skill.name] || 0}%</span>
                    </div>
                    <div className="skill-progress-bar">
                      <div 
                        className="skill-progress-fill"
                        style={{ width: `${counters[skill.name] || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;