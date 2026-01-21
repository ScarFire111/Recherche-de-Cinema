import React, { useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search', { state: { query: searchQuery } });
    }
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
        
        {/* Centered Search Bar */}
        <div className="tp-nav-center">
          <form className="tp-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search through the darkness..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tp-search-input"
            />
            <button type="submit" className="tp-search-btn">
              🔍
            </button>
          </form>
        </div>
        
        <div className="tp-nav-right">
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
              <p>Use the search bar above to find movies</p>
            </div>
            <div className="tp-instruction">
              <div className="tp-icon">☕</div>
              <p>Remember: The owls are not what they seem</p>
            </div>
            <div className="tp-instruction">
              <div className="tp-icon">🎬</div>
              <p>Discover surreal cinematic experiences</p>
            </div>
          </div>
        </div>
      </main>

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