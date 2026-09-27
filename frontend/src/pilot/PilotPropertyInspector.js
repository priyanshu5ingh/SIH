import React, { useState } from 'react';
import PilotEvidencePanel from './PilotEvidencePanel';
import PilotValidationPanel from './PilotValidationPanel';
import PilotSourceComparisonPanel from './PilotSourceComparisonPanel';
import { generateVPID } from './pilotData';

export default function PilotPropertyInspector({
  selectedParcel,
  selectedBuilding,
  selectedFloor,
  floors = [],
  evidenceList = [],
  validations = [],
  sourceComparisonData = null,
  viewMode,
  onFloorSelect,
  onToggleValidationMode,
  onHighlightGeometry,
  onOpenReview
}) {
  const [activeTab, setActiveTab] = useState('EVIDENCE'); // 'EVIDENCE' | 'VALIDATION' | 'COMPARE'

  if (!selectedParcel || !selectedBuilding) {
    return (
      <div className="pilot-inspector empty-state">
        <div className="empty-message">Initializing Cadastral Records...</div>
      </div>
    );
  }

  const vpid = selectedFloor?.proposed_vpid || generateVPID(
    selectedParcel.source_parcel_id,
    selectedBuilding.code,
    selectedFloor?.code || 'F01',
    'U00'
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'status-verified';
      case 'CONFLICT':
        return 'status-conflict';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return 'status-review';
    }
  };

  const getEvidenceBadge = (evType) => {
    switch (evType) {
      case 'OBSERVED':
      case 'SOURCE_ATTRIBUTE':
        return <span className="status-badge-inline observed">● SOURCE ATTRIBUTE (OSM TAG)</span>;
      case 'ESTIMATED':
        return <span className="status-badge-inline estimated">~ ESTIMATED (HEIGHT-DERIVED: H/3.5m)</span>;
      case 'VALIDATION_TEST_CASE':
        return <span className="status-badge-inline testcase">! VALIDATION TEST CASE (QA OVERHANG)</span>;
      default:
        return <span className="status-badge-inline derived">● DERIVED</span>;
    }
  };

  return (
    <div className="pilot-inspector">
      {/* Header */}
      <div className="inspector-top">
        <div className="inspector-title">
          <span className="icon">🏛️</span>
          <span>PROPERTY INSPECTOR</span>
        </div>
        <div className={`status-badge-lg ${getStatusClass(selectedParcel.status)}`}>
          {selectedParcel.status === 'REVIEW_REQUIRED' ? 'REVIEW REQUIRED' : selectedParcel.status}
        </div>
      </div>

      {/* Primary Identity Card */}
      <div className="inspector-card identity-card">
        <div className="card-label">CADASTRE & SPATIAL IDENTITY</div>
        <div className="id-grid">
          <div className="id-row">
            <span className="field-lbl">Source Parcel ID:</span>
            <span className="field-val highlight-val">{selectedParcel.source_parcel_id} ({selectedParcel.survey_number})</span>
          </div>
          <div className="id-row">
            <span className="field-lbl">Official ULPIN:</span>
            <span className="field-val muted-val">{selectedParcel.official_ulpin}</span>
          </div>
          <div className="id-row">
            <span className="field-lbl">Source Structure:</span>
            <span className="field-val">{selectedBuilding.name} <code className="code-chip">{selectedBuilding.source_feature_id}</code></span>
          </div>
          <div className="id-row">
            <span className="field-lbl">Selected Level:</span>
            <span className="field-val">
              {selectedFloor ? `${selectedFloor.code} (${selectedFloor.name})` : 'Whole Structure'}
            </span>
          </div>
          {selectedFloor && (
            <div className="id-row">
              <span className="field-lbl">Vertical Evidence:</span>
              <span className="field-val">{getEvidenceBadge(selectedFloor.evidence_type)}</span>
            </div>
          )}
          <div className="id-row vpid-row">
            <span className="field-lbl">PROPOSED VPID:</span>
            <span className="field-val vpid-chip">{vpid}</span>
          </div>
        </div>
      </div>

      {/* Spatial Metrics Row */}
      <div className="inspector-card metrics-card">
        <div className="card-label">DERIVED SPATIAL METRICS (EPSG:32643)</div>
        <div className="metrics-grid">
          <div className="metric-box">
            <span className="metric-val">{selectedBuilding.height_m}m</span>
            <span className="metric-lbl">Total Height (H)</span>
          </div>
          <div className="metric-box">
            <span className="metric-val">{selectedFloor?.area_sqm || selectedBuilding.footprint_sqm} m²</span>
            <span className="metric-lbl">Unit Footprint</span>
          </div>
          <div className="metric-box">
            <span className="metric-val">{selectedFloor?.volume_cum || Math.round(selectedBuilding.footprint_sqm * selectedBuilding.height_m)} m³</span>
            <span className="metric-lbl">Spatial Volume</span>
          </div>
          <div className="metric-box">
            <span className="metric-val">
              {selectedParcel.ground_elevation_msl_m}m MSL
            </span>
            <span className="metric-lbl">SRTM Ground Datum</span>
          </div>
        </div>
      </div>

      {/* Vertical Stack Hierarchy Navigator */}
      <div className="inspector-card hierarchy-card">
        <div className="card-label">VERTICAL STRATIFICATION HIERARCHY</div>
        <div className="hierarchy-tree">
          <div className="tree-node parcel-node">
            <span className="tree-icon">📍</span>
            <span className="node-title">{selectedParcel.source_parcel_id} ({selectedParcel.village_ward})</span>
          </div>
          <div className="tree-branch">
            <div className="tree-node bldg-node">
              <span className="tree-icon">🏢</span>
              <span className="node-title">{selectedBuilding.code} ({selectedBuilding.name})</span>
            </div>
            <div className="floor-nodes-list">
              {floors.map((fl) => {
                const isFlSelected = selectedFloor?.id === fl.id;
                return (
                  <div
                    key={fl.id}
                    className={`tree-node floor-node ${isFlSelected ? 'selected-floor-node' : ''}`}
                    onClick={() => onFloorSelect(fl)}
                  >
                    <span className="tree-bullet">└</span>
                    <span className="floor-code-chip">{fl.code}</span>
                    <span className="floor-title">{fl.name}</span>
                    <span className="floor-status-dot" style={{ backgroundColor: fl.status === 'VERIFIED' ? '#10b981' : fl.status === 'CONFLICT' ? '#ef4444' : '#f59e0b' }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3-Way Tabs: Evidence vs Validation vs Compare Sources */}
      <div className="inspector-tabs">
        <button
          className={`tab-btn ${activeTab === 'EVIDENCE' ? 'active' : ''}`}
          onClick={() => setActiveTab('EVIDENCE')}
        >
          EVIDENCE TRACE ({evidenceList.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'VALIDATION' ? 'active' : ''}`}
          onClick={() => setActiveTab('VALIDATION')}
        >
          VALIDATION LAB ({validations.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'COMPARE' ? 'active' : ''}`}
          onClick={() => setActiveTab('COMPARE')}
        >
          COMPARE SOURCES ⧉
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="tab-content-area">
        {activeTab === 'EVIDENCE' && (
          <PilotEvidencePanel
            evidenceList={evidenceList}
            confidenceScore={selectedParcel.confidence_score || 76}
            confidenceClass={selectedParcel.confidence_class || 'MEDIUM'}
            onHighlightGeometry={onHighlightGeometry}
          />
        )}
        {activeTab === 'VALIDATION' && (
          <PilotValidationPanel
            validations={validations}
            viewMode={viewMode}
            onToggleValidationMode={onToggleValidationMode}
            onHighlightGeometry={onHighlightGeometry}
          />
        )}
        {activeTab === 'COMPARE' && (
          <PilotSourceComparisonPanel
            comparisonData={sourceComparisonData}
          />
        )}
      </div>

      {/* Primary Action Button */}
      <div className="inspector-actions">
        <button
          className="btn-review-property"
          onClick={onOpenReview}
        >
          <span className="btn-icon">⚡</span>
          <span>HUMAN REVIEW WORKFLOW</span>
        </button>
      </div>
    </div>
  );
}
