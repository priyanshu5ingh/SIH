import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Animated background is handled by App.js */}
      <div className="home-content">
        <header className="hero glass-panel">
          <div className="hero-content">
            <h1 className="metallic-gradient float">
              Ultimate 3D ULPIN System
            </h1>
            <p className="hero-subtitle fade-in-up">
              Advanced 3D Cadastral System for Smart India Hackathon 2026
            </p>
            <div className="hero-buttons fade-in-up">
              <Link to="/parcels" className="btn btn-primary shimmer">
                View Parcels
              </Link>
              <Link to="/map" className="btn btn-secondary">
                Explore 3D Map
              </Link>
            </div>
          </div>
        </header>

        <section className="features">
          <h2 className="section-title fade-in">Key Features</h2>
          <div className="features-grid bento-grid bento-grid-3">
            {/* Feature Card 1 */}
            <div className="feature-card bento-item glass-panel metallic-border">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L2 17L12 22L20 17L12 12L20 7L12 2Z" fill="#6a11cb"/>
                  <path d="M2 12L12 17L20 12L12 7L2 12Z" fill="rgba(106,17,203,0.2)"/>
                </svg>
              </div>
              <h3>3D ULPIN Generation</h3>
              <p className="feature-text">
                Generate unique spatial identifiers for surface parcels,
                multi-storey buildings, and underground infrastructure.
              </p>
              <div className="feature-footer">
                <span className="tag">AI-Powered</span>
                <span className="tag">Spatial Analytics</span>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="feature-card bento-item glass-panel metallic-border">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15 5L18 5L12 10L6 5L9 5Z" fill="#2575fc"/>
                  <path d="M12 15L8 18L8 21L11 21L12 18L13 21L13 18L9 18Z" fill="#2575fc"/>
                </svg>
              </div>
              <h3>Advanced 3D Visualization</h3>
              <p className="feature-text">
                Interactive 3D maps with LiDAR/drone data integration
                and vertical property slicing.
              </p>
              <div className="feature-footer">
                <span className="tag">Three.js</span>
                <span className="tag">Real-time</span>
              </div>
            </div>

            {/* Feature Card 3 - Spans two rows */}
            <div className="feature-card bento-item glass-panel metallic-border" style={{ gridRow: 'span 2' }}>
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="none" stroke="#6a11cb" stroke-width="2"/>
                  <path d="M12 8V12L15 15" stroke="#6a11cb" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <h3>AI/ML Powered Processing</h3>
              <p className="feature-text">
                Automated building extraction, floor segmentation,
                and topology validation using machine learning.
              </p>
              <div className="feature-footer">
                <span className="tag">Machine Learning</span>
                <span className="tag">Computer Vision</span>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="feature-card bento-item glass-panel metallic-border">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20V20H4V4Z" fill="none" stroke="#2575fc" stroke-width="2"/>
                  <path d="M8 8H16V16H8V8Z" fill="none" stroke="#2575fc" stroke-width="2"/>
                  <path d="M12 12H12V12H12V12Z" fill="#2575fc"/>
                </svg>
              </div>
              <h3>Scalable Framework</h3>
              <p className="feature-text">
                Designed to handle nationwide cadastral data
                with high performance and reliability.
              </p>
              <div className="feature-footer">
                <span className="tag">Cloud Ready</span>
                <span className="tag">Microservices</span>
              </div>
            </div>

            {/* Feature Card 5 */}
            <div className="feature-card bento-item glass-panel metallic-border">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L2 17L12 22L20 17L12 12L20 7L12 2Z" fill="rgba(106,17,203,0.1)"/>
                  <path d="M2 12L12 17L20 12L12 7L2 12Z" fill="#6a11cb"/>
                </svg>
              </div>
              <h3>Data Integration & Processing</h3>
              <p className="feature-text">
                Import and process drone, LiDAR, satellite,
                and survey data seamlessly.
              </p>
              <div className="feature-footer">
                <span className="tag">GIS Support</span>
                <span className="tag">Multi-format</span>
              </div>
            </div>

            {/* Feature Card 6 */}
            <div className="feature-card bento-item glass-panel metallic-border">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20V20H4V4Z" fill="none" stroke="#6a11cb" stroke-width="2"/>
                  <path d="M8 8H16V16H8V8Z" fill="none" stroke="#6a11cb" stroke-width="2"/>
                  <path d="M12 12H12V12H12V12Z" fill="#6a11cb"/>
                </svg>
              </div>
              <h3>Security & Compliance</h3>
              <p className="feature-text">
                Enterprise-grade security with audit trails
                and role-based access control.
              </p>
              <div className="feature-footer">
                <span className="tag">RBAC</span>
                <span className="tag">GDPR Ready</span>
              </div>
            </div>
          </div>
        </section>

        <section className="stats">
          <h2 className="section-title fade-in">System Statistics</h2>
          <div className="stats-grid bento-grid bento-grid-4">
            <div className="stat-card bento-item glass-panel metallic-border">
              <h3>12,486</h3>
              <p>Total Parcels</p>
            </div>
            <div className="stat-card bento-item glass-panel metallic-border">
              <h3>4,238</h3>
              <p>Buildings</p>
            </div>
            <div className="stat-card bento-item glass-panel metallic-border">
              <h3>18,642</h3>
              <p>Vertical Units</p>
            </div>
            <div className="stat-card bento-item glass-panel metallic-border">
              <h3>11,920</h3>
              <p>ULPIN Issued (95.2%)</p>
            </div>
          </div>
        </section>

        {/* New section for advanced capabilities */}
        <section className="advanced-capabilities">
          <h2 className="section-title fade-in">Advanced Capabilities</h2>
          <div className="advanced-grid bento-grid bento-grid-3">
            {/* Advanced Capability Card 1 */}
            <div className="feature-card bento-item glass-panel metallic-border">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L2 17L12 22L20 17L12 12L20 7L12 2Z" fill="#ff6b6b"/>
                  <path d="M2 12L12 17L20 12L12 7L2 12Z" fill="rgba(255,107,107,0.2)"/>
                </svg>
              </div>
              <h3>Real-time Analytics Dashboard</h3>
              <p className="feature-text">
                Live analytics with interactive charts, heatmaps,
                and performance metrics for cadastral data.
              </p>
              <div className="feature-footer">
                <span className="tag">Analytics</span>
                <span className="tag">Real-time</span>
              </div>
            </div>

            {/* Advanced Capability Card 2 */}
            <div className="feature-card bento-item glass-panel metallic-border">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15 5L18 5L12 10L6 5L9 5Z" fill="#4ecdc4"/>
                  <path d="M12 15L8 18L8 21L11 21L12 18L13 21L13 18L9 18Z" fill="#4ecdc4"/>
                </svg>
              </div>
              <h3>Advanced Measurement Tools</h3>
              <p className="feature-text">
                Precision distance, area, and volume measurement
                tools with elevation profiling and line-of-sight analysis.
              </p>
              <div className="feature-footer">
                <span className="tag">Measurement</span>
                <span className="tag">Analysis</span>
              </div>
            </div>

            {/* Advanced Capability Card 3 - Spans two rows */}
            <div className="feature-card bento-item glass-panel metallic-border" style={{ gridRow: 'span 2' }}>
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="none" stroke="#45b7d1" stroke-width="2"/>
                  <path d="M12 8V12L15 15" stroke="#45b7d1" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <h3>AI-Powered Insights</h3>
              <p className="feature-text">
                Predictive analytics, change detection, and automated
                report generation for urban planning and development.
              </p>
              <div className="feature-footer">
                <span className="tag">AI Insights</span>
                <span className="tag">Predictive</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;