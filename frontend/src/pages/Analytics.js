import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = () => {
  const [stats, setStats] = useState({
    parcels: { total: 0, verified: 0, pending: 0, disputed: 0 },
    buildings: { total: 0, residential: 0, commercial: 0, industrial: 0 },
    verticalUnits: { total: 0, occupied: 0, vacant: 0, underConstruction: 0 },
    ulpin: { issued: 0, pendingVerification: 0, revoked: 0 }
  });
  const [chartsData, setChartsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        // Fetch analytics summary metrics
        setStats({
          parcels: { total: 12486, verified: 11920, pending: 456, disputed: 110 },
          buildings: { total: 4238, residential: 2856, commercial: 1024, industrial: 358 },
          verticalUnits: { total: 18642, occupied: 15846, vacant: 2198, underConstruction: 598 },
          ulpin: { issued: 11920, pendingVerification: 456, revoked: 22 }
        });

        // Simulate chart data
        setChartsData({
          parcelGrowth: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
              label: 'New Parcels',
              data: [65, 59, 80, 81, 56, 55, 40, 78, 72, 68, 75, 82],
              borderColor: '#6a11cb',
              backgroundColor: 'rgba(106, 17, 203, 0.2)'
            }]
          },
          buildingTypes: {
            labels: ['Residential', 'Commercial', 'Industrial', 'Other'],
            datasets: [{
              data: [2856, 1024, 358, 0],
              backgroundColor: [
                '#ff6384',
                '#36a2eb',
                '#ffce56',
                '#4bc0c0'
              ]
            }]
          },
          verticalDistribution: {
            labels: ['Ground', '1-5 Floors', '6-10 Floors', '11+ Floors', 'Basement'],
            datasets: [{
              data: [4238, 8912, 3876, 1216, 400],
              backgroundColor: [
                '#ff9a9e',
                '#fad0c4',
                '#fad0c4',
                '#a1c4fd',
                '#c2e9fb'
              ]
            }]
          }
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-header glass-panel">
          <div className="header-content">
            <h1>Analytics Dashboard</h1>
            <p className="subtitle">Advanced insights and metrics for cadastral data</p>
          </div>
        </div>
        <div className="loading-container glass-panel">
          <div className="loading-spinner"></div>
          <h3>Loading Analytics Dashboard...</h3>
          <p>Processing spatial data and generating insights</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-header glass-panel">
          <div className="header-content">
            <h1>Analytics Dashboard</h1>
            <p className="subtitle">Advanced insights and metrics for cadastral data</p>
          </div>
        </div>
        <div className="analytics-container">
          <div className="error-message">
            <h2>Error Loading Analytics</h2>
            <p>{error}</p>
            <button
              className="btn btn-outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header glass-panel">
        <div className="header-content">
          <h1>Analytics Dashboard</h1>
          <p className="subtitle">Advanced insights and metrics for cadastral data</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-outline"
            onClick={() => {
              // In a real app, this would refresh the data
              window.location.reload();
            }}
          >
            Refresh Data
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              // In a real app, this would export the report
              alert('Exporting analytics report...');
            }}
          >
            Export Report
          </button>
        </div>
      </div>

      <div className="analytics-container">
        {/* Key Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card glass-panel">
            <h3>{stats.parcels.total.toLocaleString()}</h3>
            <p>Total Parcels</p>
            <div className="metric-trend positive">+2.3% MoM</div>
          </div>
          <div className="metric-card glass-panel">
            <h3>{stats.buildings.total.toLocaleString()}</h3>
            <p>Total Buildings</p>
            <div className="metric-trend positive">+1.8% MoM</div>
          </div>
          <div className="metric-card glass-panel">
            <h3>{stats.verticalUnits.total.toLocaleString()}</h3>
            <p>Vertical Units</p>
            <div className="metric-trend positive">+3.1% MoM</div>
          </div>
          <div className="metric-card glass-panel">
            <h3>{stats.ulpin.issued.toLocaleString()}</h3>
            <p>ULPIN Issued</p>
            <div className="metric-trend positive">+95.2% Coverage</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-panel glass-panel">
            <h3>Monthly Parcel Growth</h3>
            <div className="chart-placeholder">
              {/* In a real app, this would render an actual chart */}
              <div className="chart-info">
                <p>Parcel registration trends over the past year</p>
                <span className="chart-label">Units: Number of Parcels</span>
              </div>
            </div>
          </div>

          <div className="chart-panel glass-panel">
            <h3>Building Type Distribution</h3>
            <div className="chart-placeholder">
              {/* In a real app, this would render an actual pie chart */}
              <div className="chart-info">
                <p>Distribution of buildings by usage type</p>
                <span className="chart-label">Total: {stats.buildings.total.toLocaleString()} Buildings</span>
              </div>
            </div>
          </div>

          <div className="chart-panel glass-panel">
            <h3>Vertical Unit Distribution</h3>
            <div className="chart-placeholder">
              {/* In a real app, this would render an actual bar chart */}
              <div className="chart-info">
                <p>Distribution of vertical units by floor level</p>
                <span className="chart-label">Total: {stats.verticalUnits.total.toLocaleString()} Units</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Tables Section */}
        <div className="tables-section">
          <div className="table-panel glass-panel">
            <h3>Recent Activity</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Details</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2026-09-20</td>
                    <td>New Parcel Registration</td>
                    <td>ULPIN-29-7845-1234-5678</td>
                    <td><span className="status-badge status-verified">Verified</span></td>
                  </tr>
                  <tr>
                    <td>2026-09-20</td>
                    <td>Building Footprint Update</td>
                    <td>Downtown Commercial District</td>
                    <td><span className="status-badge status-updated">Updated</span></td>
                  </tr>
                  <tr>
                    <td>2026-09-19</td>
                    <td>LiDAR Data Processing</td>
                    <td>Industrial Zone Alpha</td>
                    <td><span className="status-badge status-processed">Processed</span></td>
                  </tr>
                  <tr>
                    <td>2026-09-19</td>
                    <td>Underground Utility Mapping</td>
                    <td>Subway Line Extension</td>
                    <td><span className="status-badge status-completed">Completed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-panel glass-panel">
            <h3>Data Quality Metrics</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Target</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Data Completeness</td>
                    <td>98.7%</td>
                    <td>>= 95%</td>
                    <td><span className="status-badge status-good">Good</span></td>
                  </tr>
                  <tr>
                    <td>Spatial Accuracy</td>
                    <td>99.2%</td>
                    <td>>= 98%</td>
                    <td><span className="status-badge status-good">Good</span></td>
                  </tr>
                  <tr>
                    <td>Attribute Accuracy</td>
                    <td>97.5%</td>
                    <td>>= 95%</td>
                    <td><span className="status-badge status-good">Good</span></td>
                  </tr>
                  <tr>
                    <td>Topological Integrity</td>
                    <td>99.8%</td>
                    <td>>= 99%</td>
                    <td><span className="status-badge status-excellent">Excellent</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;