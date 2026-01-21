import React from 'react';
import '../Login/Login.css';
import { Link } from 'react-router-dom'; // Add this import

const Signup = () => {
  return (
    <div className="login-container">
      <div className="content-wrapper" style={{ marginTop: '0px' }}>
        <div className="login-card">
          <div className="card-header">
            <h3>Sign Up</h3>
            <div className="underline"></div>
          </div>

          <form className="login-form">
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

          {/* Already have an account link */}
          <div className="signup-link">
            <p>
              Already have an account? <Link to="/login" className="signup-button">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;