import React, { useState } from 'react';
import '../Login/Login.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check for empty fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    
    // Add your signup logic here (API call, etc.)
    console.log('Signing up with:', formData);
    
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
            {/* Full Name */}
            <div className="input-group">
              <input 
                type="text" 
                name="fullName"
                placeholder="Full Name" 
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'error-input' : ''}
              />
              <span className="icon">👤</span>
              {errors.fullName && <div className="error-message">{errors.fullName}</div>}
            </div>

            {/* Email */}
            <div className="input-group">
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error-input' : ''}
              />
              <span className="icon">📧</span>
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            {/* Username */}
            <div className="input-group">
              <input 
                type="text" 
                name="username"
                placeholder="Username" 
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error-input' : ''}
              />
              <span className="icon">👥</span>
              {errors.username && <div className="error-message">{errors.username}</div>}
            </div>

            {/* Password */}
            <div className="input-group">
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error-input' : ''}
              />
              <span className="icon">🔒</span>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm Password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error-input' : ''}
              />
              <span className="icon">✅</span>
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
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