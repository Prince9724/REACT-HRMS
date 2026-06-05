function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Portfolio.</h3>
            <p>Creating digital excellence</p>
          </div>
          <div className="footer-links">
            <a href="#hero">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-copyright">
            <p>© {currentYear} John Doe. All rights reserved.</p>
            <p>Built with React & ❤️</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;