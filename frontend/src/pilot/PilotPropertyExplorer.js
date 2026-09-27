import React, { useState } from 'react';

export default function PilotPropertyExplorer({
  parcels,
  buildings,
  selectedParcel,
  selectedBuilding,
  selectedFloor,
  onSelectParcel,
  onSelectBuilding,
  onSelectFloor
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParcels = parcels.filter(
    (p) =>
      (p.source_parcel_id && p.source_parcel_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.survey_number && p.survey_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const reviewQueue = parcels.filter((p) => p.status === 'REVIEW_REQUIRED' || p.status === 'CONFLICT');

  return (
    <div className="pilot-explorer">
      <div className="explorer-header">
        <div className="explorer-title">
          <span className="icon">📁</span>
          <span>PROPERTY EXPLORER</span>
        </div>
        <div className="dataset-tag">PILOT CADASTRE (EPSG:32643)</div>
      </div>

      {/* Search Input */}
      <div className="explorer-search">
        <input
          type="text"
          placeholder="Search Survey No / Parcel / Building..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="explorer-sections">
        {/* Parcels Section */}
        <div className="explorer-section">
          <div className="section-label">
            <span>CADASTRAL SURVEY PARCELS</span>
            <span className="count-badge">{filteredParcels.length}</span>
          </div>

          <div className="item-list">
            {filteredParcels.map((parcel) => {
              const isSelected = selectedParcel?.id === parcel.id;
              return (
                <div
                  key={parcel.id}
                  className={`explorer-item parcel-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectParcel(parcel)}
                >
                  <div className="item-main">
                    <div className="item-code">
                      <span className="parcel-id-chip">{parcel.survey_number}</span>
                      <span className="ulpin-text">{parcel.source_parcel_id}</span>
                    </div>
                    <div className="item-sub">
                      <span>{parcel.area_sqm} m² &bull; {parcel.village_ward}</span>
                      <span
                        className="status-pill"
                        style={{
                          color: parcel.status_color,
                          borderColor: `${parcel.status_color}40`,
                          backgroundColor: `${parcel.status_color}15`
                        }}
                      >
                        {parcel.status === 'REVIEW_REQUIRED' ? 'REVIEW' : parcel.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Associated Buildings */}
        <div className="explorer-section">
          <div className="section-label">
            <span>REAL STRUCTURES (OSM VECTORS)</span>
            <span className="count-badge">{buildings.length}</span>
          </div>

          <div className="item-list">
            {buildings.map((bldg) => {
              const isSelected = selectedBuilding?.id === bldg.id;
              return (
                <div
                  key={bldg.id}
                  className={`explorer-item building-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectBuilding(bldg)}
                >
                  <div className="item-main">
                    <div className="item-code">
                      <span className="building-icon">🏢</span>
                      <span className="building-name">{bldg.name}</span>
                    </div>
                    <div className="item-sub">
                      <span>{bldg.height_m}m &bull; {bldg.num_floors_above + bldg.num_floors_below} Levels</span>
                      <span className="tag-clean">{bldg.source_feature_id}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action / Review Queue */}
        <div className="explorer-section review-queue-section">
          <div className="section-label">
            <span>ACTION QUEUE</span>
            <span className="queue-alert-badge">{reviewQueue.length}</span>
          </div>

          <div className="queue-list">
            {reviewQueue.map((item) => (
              <div
                key={item.id}
                className={`queue-item status-${item.status.toLowerCase()} ${
                  selectedParcel?.id === item.id ? 'active-queue' : ''
                }`}
                onClick={() => onSelectParcel(item)}
              >
                <div className="queue-header">
                  <span className="queue-dot" style={{ backgroundColor: item.status_color }} />
                  <span className="queue-ulpin">{item.source_parcel_id} ({item.survey_number})</span>
                </div>
                <div className="queue-reason">{item.review_reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
