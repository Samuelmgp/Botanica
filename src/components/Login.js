import React, { useState } from 'react';

const Login = ({ onLogin, onBackToAbout }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      onLogin({
        name: formData.name.trim(),
        email: formData.email.trim(),
        joinDate: new Date().toISOString()
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🌱 Welcome to Botanica</h1>
          <p>Let's get your plant care journey started!</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
            <small>We'll use this to save your plant data securely</small>
          </div>

          <button type="submit" className="btn-primary login-btn">
            🌿 Start My Plant Journey
          </button>
        </form>

        <div className="login-features">
          <h4>What you'll get:</h4>
          <ul>
            <li>✓ Personalized plant care schedules</li>
            <li>✓ Weather-based watering recommendations</li>
            <li>✓ Expert plant care tips and facts</li>
            <li>✓ Beautiful, easy-to-use dashboard</li>
          </ul>
        </div>

        <button onClick={onBackToAbout} className="btn-link">
          ← Back to About
        </button>
      </div>
    </div>
  );
};

export default Login;