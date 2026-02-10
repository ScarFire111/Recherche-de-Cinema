import React from 'react';
import './Search.css';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();

  return (
    <div className="search-page">
      <div className="search-background">
        <div className="search-curtain left"></div>
        <div className="search-curtain right"></div>
      </div>
      
      <nav className="search-navbar">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <input type="text" placeholder="Search" className="Searchtext"/>
      </nav>
      
      <div className="search-content">
        <h2>Search Page - Work In Progress</h2>
        <p>This page is currently under construction.</p>
        <p>Come back soon for amazing movie search features!</p>
      </div>
    </div>
  );
};

export default Search;
