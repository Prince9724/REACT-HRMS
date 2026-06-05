import { useState } from 'react';

function About() {
  const [activeTab, setActiveTab] = useState('experience');

  const tabs = {
    experience: {
      items: [
        { year: '2023 - Present', title: 'Senior Frontend Developer', company: 'Tech Corp', desc: 'Leading React development team' },
        { year: '2021 - 2023', title: 'React Developer', company: 'Web Solutions', desc: 'Built 10+ client projects' },
        { year: '2020 - 2021', title: 'Junior Developer', company: 'Startup Hub', desc: 'Learned and grew rapidly' }
      ]
    },
    education: {
      items: [
        { year: '2018 - 2020', title: 'Master in CS', company: 'Tech University', desc: 'Specialized in Web Technologies' },
        { year: '2014 - 2018', title: 'Bachelor in IT', company: 'Engineering College', desc: 'First class with distinction' }
      ]
    }
  };

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Get to know me</span>
          <h2>About Me</h2>
          <div className="section-line"></div>
        </div>
        
        <div className="about-content">
          <div className="about-left">
            <div className="about-card">
              <div className="about-icon">💡</div>
              <h3>My Philosophy</h3>
              <p>
                I believe in writing clean, maintainable code that not only works 
                but also provides an exceptional user experience. Every project 
                is an opportunity to learn and innovate.
              </p>
            </div>
            <div className="about-card">
              <div className="about-icon">🎯</div>
              <h3>My Approach</h3>
              <p>
                User-centered design, attention to detail, and continuous 
                improvement are at the core of my development process. 
                I always stay updated with latest technologies.
              </p>
            </div>
          </div>
          
          <div className="about-right">
            <div className="tabs">
              <button 
                className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                onClick={() => setActiveTab('experience')}
              >
                Experience
              </button>
              <button 
                className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                onClick={() => setActiveTab('education')}
              >
                Education
              </button>
            </div>
            
            <div className="timeline">
              {tabs[activeTab].items.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-year">{item.year}</span>
                    <h4>{item.title}</h4>
                    <span className="timeline-company">{item.company}</span>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;