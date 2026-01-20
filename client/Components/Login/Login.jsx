import React from 'react';
import './Login.css';

const TwinPeaksLogin = () => {
  return (
    <div className="login-container">

      
      <div className="content-wrapper">
    

        <div className="login-card">
          <div className="card-header">
            <h3>Login</h3>
            <div className="underline"></div>
          </div>

          <form className="login-form">
            <div className="input-group">
              <input type="text" placeholder="Username" />
              <span className="icon">👤</span>
            </div>

            <div className="input-group">
              <input type="password" placeholder="password" />
              <span className="icon">🔒</span>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TwinPeaksLogin;