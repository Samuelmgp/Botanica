import React from 'react';

const AboutUs = ({ onGetStarted }) => {
  return (
    <div className="about-us">
      <div className="hero-section">
        <div className="hero-content">
          <h1>🌱 Welcome to Botanica</h1>
          <h2>Your Smart Plant Care Companion</h2>
          <p className="hero-description">
            Never forget to water your plants again! Botanica uses real weather data 
            and plant science to create personalized care schedules for your green friends.
          </p>
          <button onClick={onGetStarted} className="btn-hero">
            Get Started →
          </button>
        </div>
        <div className="hero-plants">
          <div className="plant-icon">🌿</div>
          <div className="plant-icon">🌸</div>
          <div className="plant-icon">🌺</div>
          <div className="plant-icon">🌻</div>
          <div className="plant-icon">🪴</div>
        </div>
      </div>

      <div className="features-section">
        <h3>Why Choose Botanica?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h4>Smart Care Schedules</h4>
            <p>Just tell us your plant type - we'll create the perfect watering and feeding schedule automatically.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌤️</div>
            <h4>Weather Integration</h4>
            <p>Real-time weather data adjusts care recommendations for your outdoor plants automatically.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h4>Plant Knowledge Base</h4>
            <p>Get fascinating facts and expert care tips for tomatoes, herbs, houseplants, and more.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h4>Simple & Beautiful</h4>
            <p>Clean, intuitive interface that makes plant care enjoyable, not overwhelming.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h4>Never Miss Care</h4>
            <p>Visual reminders and status indicators help you stay on top of watering and feeding.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h4>Grow with Confidence</h4>
            <p>Perfect for beginners and experts alike - from seedlings to full gardens.</p>
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <h3>How It Works</h3>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Add Your Plants</h4>
              <p>Simply enter your plant's name and type - we handle the rest!</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Set Your Location</h4>
              <p>Weather-based recommendations for your outdoor plants.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Follow the Schedule</h4>
              <p>Get personalized care reminders and watch your plants thrive!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h3>Ready to Start Your Plant Journey?</h3>
        <p>Join thousands of plant parents who trust Botanica to keep their plants healthy and happy.</p>
        <button onClick={onGetStarted} className="btn-cta">
          🌱 Start Growing Today
        </button>
      </div>
    </div>
  );
};

export default AboutUs;