import React, { useState, useRef, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const videoRef = useRef(null);

  // Try to autoplay the video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add search logic here
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div className="home-container">
      {/* Background Video - The Matrix clip (safe for work) */}
      <video
        ref={videoRef}
        className="home-background-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source 
          src="https://assets.mixkit.co/videos/preview/mixkit-abstract-digital-grid-5382-large.mp4" 
          type="video/mp4" 
        />
        {/* Fallback image if video doesn't load */}
        <img 
          src="https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Cinema background" 
        />
      </video>

      {/* Dark overlay for better text visibility */}
      <div className="video-overlay"></div>

      {/* Navbar */}
      <nav className="home-navbar">
        <div className="navbar-left">
          <h1 className="navbar-logo">🎬 MovieFinder</h1>
        </div>
        <div className="navbar-center">
          {isSearchVisible && (
            <form className="navbar-search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search movies, actors, directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar-search-input"
                autoFocus
              />
              <button type="submit" className="navbar-search-submit">
                🔍
              </button>
            </form>
          )}
        </div>
        <div className="navbar-right">
          <button className="navbar-btn" onClick={toggleSearch}>
            🔍 Search
          </button>
          <button className="navbar-btn">👤 Profile</button>
          <button className="navbar-btn">🚪 Logout</button>
        </div>
      </nav>

      {/* Main content with movie-themed interactive elements */}
      <div className="home-main-content">
        <h1 className="main-title">Discover Cinematic Magic</h1>
        <p className="main-subtitle">Find movies that speak to your soul</p>
        
        {/* Interactive movie elements */}
        <div className="interactive-elements">
          <div className="floating-movie">
            <span className="movie-icon">🎬</span>
            <p className="movie-tag">Action</p>
          </div>
          <div className="floating-movie">
            <span className="movie-icon">❤️</span>
            <p className="movie-tag">Romance</p>
          </div>
          <div className="floating-movie">
            <span className="movie-icon">👻</span>
            <p className="movie-tag">Horror</p>
          </div>
          <div className="floating-movie">
            <span className="movie-icon">🚀</span>
            <p className="movie-tag">Sci-Fi</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <h3>10,000+</h3>
            <p>Movies</p>
          </div>
          <div className="stat-card">
            <h3>5,000+</h3>
            <p>Actors</p>
          </div>
          <div className="stat-card">
            <h3>50+</h3>
            <p>Genres</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;