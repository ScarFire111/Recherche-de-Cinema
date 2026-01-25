import React, { useState } from 'react';
import './Search.css';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const performSearch = (query) => {
    setIsLoading(true);
    // Mock search results - in real app, this would be an API call
    setTimeout(() => {
      const mockResults = [
        { id: 1, title: 'Twin Peaks: Fire Walk With Me', year: 1992, director: 'David Lynch', type: 'movie' },
        { id: 2, title: 'Mulholland Drive', year: 2001, director: 'David Lynch', type: 'movie' },
        { id: 3, title: 'Blue Velvet', year: 1986, director: 'David Lynch', type: 'movie' },
        { id: 4, title: 'Lost Highway', year: 1997, director: 'David Lynch', type: 'movie' },
        { id: 5, title: 'The Elephant Man', year: 1980, director: 'David Lynch', type: 'movie' },
        { id: 6, title: 'Eraserhead', year: 1977, director: 'David Lynch', type: 'movie' },
        { id: 7, title: 'The Straight Story', year: 1999, director: 'David Lynch', type: 'movie' },
        { id: 8, title: 'Inland Empire', year: 2006, director: 'David Lynch', type: 'movie' },
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.year.toString().includes(query) ||
        item.director.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="search-page">
      {/* Twin Peaks Background */}
      <div className="search-background">
        <div className="search-curtain left"></div>
        <div className="search-curtain right"></div>
        <div className="search-woods"></div>
      </div>

      {/* Simple Navigation */}
      <div className="search-header">
        <button className="back-button" onClick={handleBack}>
          ← Back to Home
        </button>
        <h1 className="search-page-title">Recherche de Cinéma</h1>
      </div>

      {/* Main Search Box */}
      <div className="search-container">
        <div className="search-box">
          <h2 className="search-title">Search Through The Darkness</h2>
          <div className="search-underline"></div>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Enter movie title, director, or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-textbox"
              />
              <button type="submit" className="search-submit-button">
                Search
              </button>
            </div>
            
            <p className="search-hint">
              Try searching for: "Lynch", "1990", "Twin Peaks"
            </p>
          </form>

          {/* Search Results */}
          <div className="results-container">
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-owl">🦉</div>
                <p className="loading-text">Searching the Black Lodge...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="search-results">
                <h3 className="results-title">Search Results ({searchResults.length})</h3>
                <div className="results-grid">
                  {searchResults.map((item) => (
                    <div key={item.id} className="result-card">
                      <div className="result-header">
                        <span className="result-type">{item.type}</span>
                        <span className="result-year">{item.year}</span>
                      </div>
                      <h4 className="result-movie-title">{item.title}</h4>
                      <p className="result-director">Directed by: {item.director}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchQuery ? (
              <div className="no-results">
                <div className="no-results-owl">🦉</div>
                <h3>No results found for "{searchQuery}"</h3>
                <p>The owls are not what they seem...</p>
              </div>
            ) : (
              <div className="search-prompt">
                <div className="prompt-icon">🎬</div>
                <p>Enter a search above to find movies</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;