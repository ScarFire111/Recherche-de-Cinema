import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here if needed
    navigate('/login');
  };

  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <div className="twin-peaks-home">
      {/* Twin Peaks Background */}
      <div className="tp-background">
        <div className="tp-red-curtain left"></div>
        <div className="tp-red-curtain right"></div>
        <div className="tp-woods"></div>
        <div className="tp-black-lodge"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="tp-navbar">
        <div className="tp-nav-left">
          <h1 className="tp-logo">
            Recherche de Cinéma
            <span className="tp-logo-sub">Twin Peaks Edition</span>
          </h1>
        </div>
        
        <div className="tp-nav-right">
          <button className="tp-nav-btn search-btn" onClick={handleSearch}>
            🔍 Search
          </button>
          <button className="tp-nav-btn logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Main Content - Twin Peaks themed */}
      <main className="tp-main-content">
        <div className="tp-welcome-container">
          <h2 className="tp-welcome-title">Welcome to the Black Lodge</h2>
          <div className="tp-welcome-message">
            <p className="tp-quote">
              "Through the darkness of future past,<br />
              The magician longs to see.<br />
              One chants out between two worlds...<br />
              <span className="tp-fire">Fire walk with me.</span>"
            </p>
          </div>

          <div className="tp-instructions">
            <div className="tp-instruction">
              <div className="tp-icon">🦉</div>
              <p>Click <strong>Search</strong> to begin your cinematic journey</p>
            </div>
            <div className="tp-instruction">
              <div className="tp-icon">☕</div>
              <p>Remember: The owls are not what they seem</p>
            </div>
            <div className="tp-instruction">
              <div className="tp-icon">🎬</div>
              <p>Find movies that speak to your soul</p>
            </div>
          </div>
        </div>
      </main>
{/*wallahi comments that have been commented */}
      {/* Footer with Twin Peaks elements */}
      <footer className="tp-footer">
        <div className="tp-chevron-pattern"></div>
        <p className="tp-footer-text">
          A damn fine cinematic experience • That gum you like is coming back in style
        </p>
      </footer>
    </div>
  );
};

export default Home;