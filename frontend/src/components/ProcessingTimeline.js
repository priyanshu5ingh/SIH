import React from 'react';
import './ProcessingTimeline.css';

const ProcessingTimeline = ({ entries }) => {
  return (
    <div className="processing-timeline">
      <div className="timeline-content">
        {entries.map((entry, index) => (
          <div key={entry.id} className={`timeline-entry ${entry.type} ${entry.status} fade-in-up`}>
            <div className="timeline-icon">
              {entry.type === 'processing' && <span>⚙️</span>}
              {entry.type === 'evidence' && <span>🔍</span>}
              {entry.type === 'audit' && <span>📜</span>}
              {entry.type === 'review' && <span>✅</span>}
            </div>
            <div className="timeline-label">{entry.label}</div>
            <div className="timeline-timestamp">{entry.timestamp}</div>
            <div className={`timeline-status ${entry.status}`}>
              {entry.status === 'pending' ? '⏳' : '✓'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingTimeline;