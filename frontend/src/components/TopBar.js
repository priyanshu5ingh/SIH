import React from 'react';
import './TopBar.css';

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <div className="brand">
          <h2>VertiMap</h2>
        </div>
        <div className="status-items">
          <div className="status-item">
            <span className="label">Environment:</span>
            <span className="value">PILOT DATA: REAL SOURCES</span>
          </div>
          <div className="status-item">
            <span className="label">System:</span>
            <span className="value status-online">ONLINE</span>
          </div>
          <div className="status-item">
            <span className="label">Dataset:</span>
            <span className="value">CENTRAL BENGALURU PILOT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;