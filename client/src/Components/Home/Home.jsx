import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add search logic here
  };

  return (
    <div className="home-container">
      {/* Background - plain dark background instead of video */}
      <div className="home-background"></div>

      {/* Navbar at the top */}
      <nav className="home-navbar">
        <div className="navbar-left">
          <h1 className="navbar-logo">MovieFinder</h1>
        </div>
        <div className="navbar-right">
          <button className="navbar-btn">Profile</button>
          <button className="navbar-btn">Logout</button>
        </div>
      </nav>

      {/* Main content card */}
      <div className="home-content-wrapper">
        <div className="home-card">
          <div className="home-card-header">
            <h1>Find Your Movie</h1>
            <div className="home-underline"></div>
            <p className="home-subtitle">Discover movies you'll love</p>
          </div>

          {/* Search bar */}
          <form className="home-search-form" onSubmit={handleSearch}>
            <div className="home-search-group">
              <input
                type="text"
                placeholder="Search for movies, actors, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="home-search-input"
              />
              <span className="home-search-icon">🎬</span>
            </div>

            <button type="submit" className="home-search-button">
              Search
            </button>
          </form>

          {/* Navbar Search button */}
          <div className="navbar-search-btn-container">
            <button className="navbar-search-btn">
              <span className="search-icon">🔍</span>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;