import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar glass-panel-dark metallic-border">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="metallic-gradient">Ultimate 3D ULPIN System</span>
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="nav-link float">Home</Link>
          <Link to="/parcels" className="nav-link float">Parcels</Link>
          <Link to="/map" className="nav-link float">3D Map</Link>
          <Link to="/datasources" className="nav-link float">Data Sources</Link>
          <Link to="/analytics" className="nav-link float">Analytics</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;