import React, { useState } from 'react';
import './Preferences.css';
import { useNavigate } from 'react-router-dom';

const Preferences = () => {
  const navigate = useNavigate();
  
  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi',
    'Thriller', 'Western', 'War', 'Musical'
  ];

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState(['', '', '']);
  const [errors, setErrors] = useState({});

  const handleGenreToggle = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      if (selectedGenres.length < 5) {
        setSelectedGenres([...selectedGenres, genre]);
      }
    }
    // Clear genre error when user selects something
    if (errors.genres) {
      setErrors({...errors, genres: ''});
    }
  };

  const handleMovieChange = (index, value) => {
    const newMovies = [...favoriteMovies];
    newMovies[index] = value;
    setFavoriteMovies(newMovies);
    // Clear movie error when user types something
    if (errors.movies && value.trim()) {
      const newErrors = {...errors};
      delete newErrors.movies;
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate at least 1 genre selected
    if (selectedGenres.length === 0) {
      newErrors.genres = 'Please select at least one genre';
    }
    
    // Validate at least 1 movie entered
    const hasMovie = favoriteMovies.some(movie => movie.trim() !== '');
    if (!hasMovie) {
      newErrors.movies = 'Please enter at least one favorite movie';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Clear errors if validation passes
    setErrors({});
    
    console.log('Selected genres:', selectedGenres);
    console.log('Favorite movies:', favoriteMovies);
    
    // Navigate to home page
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="content-wrapper" style={{ marginTop: '20px' }}>
        <div className="login-card" style={{ width: '500px', padding: '40px' }}>
          <div className="card-header">
            <h3>Your Preferences</h3>
            <div className="underline"></div>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '20px', marginTop: '-30px', marginBottom: '20px' }}>
              Tell us what you like
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Favorite Genres */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '24px', color: '#333', marginBottom: '15px', textAlign: 'center' }}>
                Favorite Genres (choose at least 1, up to 5)
              </h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px', 
                justifyContent: 'center',
                marginBottom: '15px'
              }}>
                {genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    style={{
                      background: selectedGenres.includes(genre) ? '#314237' : 'rgba(180, 180, 180, 0.5)',
                      color: selectedGenres.includes(genre) ? '#d4b6b6' : '#333',
                      border: selectedGenres.includes(genre) ? '2px solid #314237' : '2px solid #666',
                      borderRadius: '8px',
                      padding: '8px 15px',
                      fontSize: '18px',
                      fontFamily: "'Indie Flower', cursive",
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleGenreToggle(genre)}
                    onMouseOver={(e) => {
                      if (!selectedGenres.includes(genre)) {
                        e.currentTarget.style.background = 'rgba(49, 66, 55, 0.3)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!selectedGenres.includes(genre)) {
                        e.currentTarget.style.background = 'rgba(180, 180, 180, 0.5)';
                      }
                    }}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              {errors.genres && (
                <p style={{ textAlign: 'center', color: '#ff4444', fontSize: '16px', fontWeight: 'bold' }}>
                  {errors.genres}
                </p>
              )}
              <p style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>
                Selected: {selectedGenres.length}/5
              </p>
            </div>

            {/* Favorite Movies */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '24px', color: '#333', marginBottom: '15px', textAlign: 'center' }}>
                Favorite Movies (at least 1)
              </h4>
              {favoriteMovies.map((movie, index) => (
                <div className="input-group" key={index} style={{ marginBottom: '20px' }}>
                  <input
                    type="text"
                    placeholder={`Favorite movie #${index + 1} ${index === 0 ? '(required)' : ''}`}
                    value={movie}
                    onChange={(e) => handleMovieChange(index, e.target.value)}
                    required={index === 0}
                  />
                  <span className="icon">🎬</span>
                </div>
              ))}
              {errors.movies && (
                <p style={{ textAlign: 'center', color: '#ff4444', fontSize: '16px', fontWeight: 'bold' }}>
                  {errors.movies}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-button" style={{ width: '100%' }}>
              Save & Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Preferences;