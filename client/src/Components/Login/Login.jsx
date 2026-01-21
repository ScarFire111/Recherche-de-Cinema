import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const TwinPeaksLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    // Add your login logic here (API call, etc.)
    console.log('Logging in with:', { username, password });
    
    // Navigate to home page after successful login
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="content-wrapper">
        <div className="login-card">
          <div className="card-header">
            <h3>Login</h3>
            <div className="underline"></div>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className="icon">👤</span>
            </div>

            <div className="input-group">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="icon">🔒</span>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          
          <div className="signup-link">
            <p>
              Don't have an account? <a href="/signup" className="signup-button">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwinPeaksLogin;