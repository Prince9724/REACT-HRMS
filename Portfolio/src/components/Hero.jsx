import { useState, useEffect } from 'react';

function Hero() {
  const [text, setText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const roles = [
    'Frontend Developer',
    'React Expert',
    'UI/UX Designer',
    'Creative Coder'
  ];

  useEffect(() => {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setText(currentRole.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        setRoleIndex((roleIndex + 1) % roles.length);
      }
    } else {
      if (charIndex < currentRole.length) {
        const timeout = setTimeout(() => {
          setText(currentRole.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsDeleting(true), 2000);
        return () => clearTimeout(timeout);
      }
    }
  }, [charIndex, isDeleting, roleIndex]);

  return (
    <section id="hero" className="hero">
      <div className="hero-bg">
        <div className="gradient-circle circle1"></div>
        <div className="gradient-circle circle2"></div>
        <div className="gradient-circle circle3"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text">
          <div className="greeting">👋 Hello, I'm</div>
          <h1 className="name">
            John <span className="highlight">Doe</span>
          </h1>
          <div className="role-container">
            <span className="role-prefix">I'm a </span>
            <span className="dynamic-text">{text}</span>
            <span className="cursor-blink">|</span>
          </div>
          <p className="description">
            Crafting beautiful and performant web experiences with modern technologies.
            Let's bring your ideas to life!
          </p>
          <div className="hero-buttons">
            <button 
              className="btn-primary"
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            >
              Hire Me
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button 
              className="btn-secondary"
              onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
            >
              View Work
            </button>
          </div>
        </div>
        
        <div className="hero-stats">
          <div className="stat">
            <h3>3+</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat">
            <h3>20+</h3>
            <p>Projects Done</p>
          </div>
          <div className="stat">
            <h3>15+</h3>
            <p>Happy Clients</p>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <div className="mouse"></div>
        <p>Scroll Down</p>
      </div>
    </section>
  );
}

export default Hero;