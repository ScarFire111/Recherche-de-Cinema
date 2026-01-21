import React from 'react';
import '../Login/Login.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    
    // After successful signup, navigate to preferences page
    navigate('/preferences');
  };

  return (
    <div className="login-container">
      <div className="content-wrapper" style={{ marginTop: '30px' }}>
        <div className="login-card">
          <div className="card-header">
            <h3>Sign Up</h3>
            <div className="underline"></div>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="text" placeholder="Full Name" />
              <span className="icon">👤</span>
            </div>

            <div className="input-group">
              <input type="email" placeholder="Email" />
              <span className="icon">📧</span>
            </div>

            <div className="input-group">
              <input type="text" placeholder="Username" />
              <span className="icon">👥</span>
            </div>

            <div className="input-group">
              <input type="password" placeholder="Password" />
              <span className="icon">🔒</span>
            </div>

            <div className="input-group">
              <input type="password" placeholder="Confirm Password" />
              <span className="icon">✅</span>
            </div>

            <button type="submit" className="login-button">
              Create Account
            </button>
          </form>

          <div className="signup-link">
            <p>
              Already have an account? <a href="/login" className="signup-button">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;