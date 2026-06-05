import { useState, useEffect } from 'react';

function Home() {
  const [greeting, setGreeting] = useState('');
  const [currentRole, setCurrentRole] = useState(0);
  const roles = ['Frontend Developer', 'React Expert', 'UI/UX Enthusiast'];

  useEffect(() => {
    // Dynamic greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning!');
    else if (hour < 18) setGreeting('Good Afternoon!');
    else setGreeting('Good Evening!');

    // Rotating roles
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <div className="hero">
        <h1>{greeting}</h1>
        <h1>I'm John Doe</h1>
        <h2 className="role">{roles[currentRole]}</h2>
        <p>Building beautiful web experiences with React</p>
        <button className="cta-btn">View My Work</button>
      </div>
    </div>
  );
}

export default Home;