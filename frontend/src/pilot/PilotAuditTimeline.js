import React, { useState } from 'react';

export default function PilotAuditTimeline({ events = [] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`pilot-timeline ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="timeline-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="timeline-title">
          <span className="icon">🕒</span>
          <span>AUDIT TRAIL & SPATIAL PROCESSING PIPELINE</span>
          <span className="event-count-badge">{events.length} EVENTS</span>
        </div>
        <div className="collapse-toggle">
          {isCollapsed ? '▲ EXPAND' : '▼ COLLAPSE'}
        </div>
      </div>

      {!isCollapsed && (
        <div className="timeline-events-container">
          <div className="timeline-track">
            {events.map((evt, idx) => {
              const isLatest = idx === events.length - 1;
              return (
                <div
                  key={evt.id || idx}
                  className={`timeline-node ${isLatest ? 'latest-node' : ''} status-${(evt.status || 'success').toLowerCase()}`}
                >
                  <div className="node-marker">
                    <div className="marker-dot" />
                    {idx < events.length - 1 && <div className="marker-line" />}
                  </div>
                  <div className="node-content">
                    <div className="node-top">
                      <span className="node-title">{evt.title}</span>
                      <span className="node-time">{evt.timestamp ? evt.timestamp.split(' ')[1] : ''}</span>
                    </div>
                    <div className="node-details">{evt.details}</div>
                    <div className="node-actor">Actor: {evt.actor}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
