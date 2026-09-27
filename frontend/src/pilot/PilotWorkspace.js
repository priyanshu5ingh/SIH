import React, { useState, useMemo, useCallback } from 'react';
import { PILOT_DATA, REAL_PILOT_METADATA, generateVPID, getEvidenceTraceForFloor } from './pilotData';
import PilotScene3D from './PilotScene3D';
import PilotPropertyExplorer from './PilotPropertyExplorer';
import PilotPropertyInspector from './PilotPropertyInspector';
import PilotReviewPanel from './PilotReviewPanel';
import PilotAuditTimeline from './PilotAuditTimeline';
import './pilot.css';

export default function PilotWorkspace() {
  // Master state initialized from real ingested pilot dataset
  const [parcels, setParcels] = useState(PILOT_DATA.parcels);
  const [buildings, setBuildings] = useState(PILOT_DATA.buildings);
  const [floors, setFloors] = useState(PILOT_DATA.floors);
  
  // Selection state — defaults to P01 / B01 / F03 on startup
  const [selectedParcelId, setSelectedParcelId] = useState('p1');
  const [selectedBuildingId, setSelectedBuildingId] = useState('b1');
  const [selectedFloorId, setSelectedFloorId] = useState('f_03');

  // 3D View Modes: '3D_VIEW' | 'VERTICAL_SLICE' | 'PROVENANCE' | 'SUBSURFACE' | 'VALIDATION'
  const [viewMode, setViewMode] = useState('3D_VIEW');

  // Highlight geometry linked to evidence / validation
  const [highlightedGeometry, setHighlightedGeometry] = useState(null);

  // Review Drawer state
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Data Sources / Provenance Modal state
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);

  // Audit timeline events (application generated)
  const [auditEvents, setAuditEvents] = useState(PILOT_DATA.initial_audit_events);

  // Current entity lookups
  const selectedParcel = useMemo(
    () => parcels.find((p) => p.id === selectedParcelId) || parcels[0],
    [parcels, selectedParcelId]
  );

  const selectedBuilding = useMemo(
    () => buildings.find((b) => b.id === selectedBuildingId) || buildings[0],
    [buildings, selectedBuildingId]
  );

  const activeBuildingFloors = useMemo(
    () => floors.filter((f) => f.building_id === selectedBuilding?.id),
    [floors, selectedBuilding]
  );

  const selectedFloor = useMemo(
    () => activeBuildingFloors.find((f) => f.id === selectedFloorId) || activeBuildingFloors[0] || null,
    [activeBuildingFloors, selectedFloorId]
  );

  // Source comparison data for selected building
  const currentSourceComparison = useMemo(() => {
    if (selectedBuilding?.id && PILOT_DATA.source_comparisons[selectedBuilding.id]) {
      return PILOT_DATA.source_comparisons[selectedBuilding.id];
    }
    return PILOT_DATA.source_comparisons['b1'] || null;
  }, [selectedBuilding]);

  // Active evidence & validations
  const currentEvidenceList = useMemo(() => {
    if (selectedFloor && selectedParcel && selectedBuilding) {
      return getEvidenceTraceForFloor(selectedFloor, selectedParcel, selectedBuilding);
    }
    return PILOT_DATA.evidence_traces['f_03'] || [];
  }, [selectedFloor, selectedParcel, selectedBuilding]);

  const currentValidations = useMemo(() => {
    if (selectedBuilding?.id && PILOT_DATA.validations[selectedBuilding.id]) {
      return PILOT_DATA.validations[selectedBuilding.id];
    }
    return PILOT_DATA.validations['b1'] || [];
  }, [selectedBuilding]);

  // Parcel selection handler
  const handleParcelSelect = useCallback((parcel) => {
    setSelectedParcelId(parcel.id);
    const targetBldg = buildings.find((b) => b.parcel_id === parcel.id);
    if (targetBldg) {
      setSelectedBuildingId(targetBldg.id);
      const bldgFloors = floors.filter((f) => f.building_id === targetBldg.id);
      if (bldgFloors.length > 0) {
        const targetFloor = parcel.id === 'p1' ? bldgFloors.find((f) => f.id === 'f_03') || bldgFloors[0] : bldgFloors[0];
        setSelectedFloorId(targetFloor.id);
      }
    }
    setHighlightedGeometry(null);
  }, [buildings, floors]);

  // Building selection handler
  const handleBuildingSelect = useCallback((building) => {
    setSelectedBuildingId(building.id);
    setSelectedParcelId(building.parcel_id);
    const bldgFloors = floors.filter((f) => f.building_id === building.id);
    if (bldgFloors.length > 0) {
      setSelectedFloorId(bldgFloors[0].id);
    }
    setHighlightedGeometry(null);
  }, [floors]);

  // Floor selection handler
  const handleFloorSelect = useCallback((floor) => {
    setSelectedFloorId(floor.id);
    setSelectedBuildingId(floor.building_id);
    const bldg = buildings.find((b) => b.id === floor.building_id);
    if (bldg) {
      setSelectedParcelId(bldg.parcel_id);
    }
    setHighlightedGeometry(null);
  }, [buildings]);

  // Toggle validation mode
  const handleToggleValidationMode = useCallback(() => {
    setViewMode((prev) => (prev === 'VALIDATION' ? '3D_VIEW' : 'VALIDATION'));
  }, []);

  // Review Actions — RUNTIME EVENT GENERATION
  const handleApproveReview = useCallback(() => {
    // Mutate parcel status to VERIFIED
    setParcels((prev) =>
      prev.map((p) =>
        p.id === selectedParcel.id
          ? { ...p, status: 'VERIFIED', review_reason: 'Approved by Cadastral Reviewer' }
          : p
      )
    );

    // Mutate floor status to VERIFIED
    if (selectedFloor) {
      setFloors((prev) =>
        prev.map((f) =>
          f.id === selectedFloor.id ? { ...f, status: 'VERIFIED' } : f
        )
      );
    }

    // Add immutable audit log event at runtime
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST';
    const newEvent = {
      id: Date.now(),
      type: 'review',
      title: 'REVISION 01 — REVIEW APPROVED',
      details: `Cadastral Reviewer signed off vertical unit ${generateVPID(selectedParcel.source_parcel_id, selectedBuilding.code, selectedFloor?.code || 'F01')}`,
      actor: 'Cadastral Reviewer',
      timestamp,
      status: 'VERIFIED'
    };
    setAuditEvents((prev) => [...prev, newEvent]);
    setIsReviewOpen(false);
  }, [selectedParcel, selectedBuilding, selectedFloor]);

  const handleEditReview = useCallback((editData) => {
    if (selectedFloor) {
      setFloors((prev) =>
        prev.map((f) =>
          f.id === selectedFloor.id
            ? { ...f, height_m: editData.height_m, use_type: editData.use_type, status: 'VERIFIED' }
            : f
        )
      );
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST';
    const newEvent = {
      id: Date.now(),
      type: 'edit',
      title: 'PROPERTY PARAMETERS ADJUSTED',
      details: `Updated storey height to ${editData.height_m}m (${editData.use_type}) with reviewer sign-off`,
      actor: 'Cadastral Reviewer',
      timestamp,
      status: 'SUCCESS'
    };
    setAuditEvents((prev) => [...prev, newEvent]);
    setIsReviewOpen(false);
  }, [selectedFloor]);

  const handleRejectReview = useCallback(() => {
    setParcels((prev) =>
      prev.map((p) =>
        p.id === selectedParcel.id
          ? { ...p, status: 'REJECTED', review_reason: 'Inference rejected by reviewer; dispatched to physical ground survey' }
          : p
      )
    );

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST';
    const newEvent = {
      id: Date.now(),
      type: 'review',
      title: 'INFERENCE REJECTED',
      details: `Vertical inference rejected for ${selectedParcel.source_parcel_id} / ${selectedBuilding.code}; flagged for physical survey`,
      actor: 'Cadastral Reviewer',
      timestamp,
      status: 'REJECTED'
    };
    setAuditEvents((prev) => [...prev, newEvent]);
    setIsReviewOpen(false);
  }, [selectedParcel, selectedBuilding]);

  return (
    <div className="vertimap-app-root">
      {/* Top Bar Header */}
      <header className="vertimap-topbar">
        <div className="topbar-left">
          <div className="brand-logo">
            <span className="brand-icon">📐</span>
            <div className="brand-titles">
              <span className="brand-name">VertiMap</span>
              <span className="brand-sub">3D CADASTRE & PROPERTY INTELLIGENCE</span>
            </div>
          </div>
        </div>

        {/* Center View Mode Switchers */}
        <div className="topbar-center">
          <div className="view-mode-selector">
            <button
              className={`mode-btn ${viewMode === '3D_VIEW' ? 'active' : ''}`}
              onClick={() => setViewMode('3D_VIEW')}
            >
              3D VIEW
            </button>
            <button
              className={`mode-btn ${viewMode === 'VERTICAL_SLICE' ? 'active' : ''}`}
              onClick={() => setViewMode('VERTICAL_SLICE')}
            >
              VERTICAL SLICE
            </button>
            <button
              className={`mode-btn ${viewMode === 'PROVENANCE' ? 'active' : ''}`}
              onClick={() => setViewMode('PROVENANCE')}
            >
              DATA PROVENANCE
            </button>
            <button
              className={`mode-btn ${viewMode === 'SUBSURFACE' ? 'active' : ''}`}
              onClick={() => setViewMode('SUBSURFACE')}
            >
              SUBSURFACE
            </button>
            <button
              className={`mode-btn ${viewMode === 'VALIDATION' ? 'active-conflict' : ''}`}
              onClick={() => setViewMode('VALIDATION')}
            >
              VALIDATION MODE
            </button>
          </div>
          <button
            className="real-data-tag-pill"
            onClick={() => setIsSourcesModalOpen(true)}
            title="Click to view Data Provenance & Sources"
          >
            PILOT DATA: REAL SOURCES (EPSG:32643) ℹ
          </button>
        </div>

        {/* Topbar Right Meta */}
        <div className="topbar-right">
          <div className="meta-block">
            <span className="meta-label">SYSTEM STATUS</span>
            <span className="meta-val status-online">● ONLINE</span>
          </div>
          <div className="meta-block">
            <span className="meta-label">PILOT SECTOR</span>
            <span className="meta-val">BENGALURU CENTRAL</span>
          </div>
        </div>
      </header>

      {/* Main Workspace 3-Column Split */}
      <main className="vertimap-workspace-body">
        {/* Left Column: Explorer */}
        <aside className="workspace-col explorer-col">
          <PilotPropertyExplorer
            parcels={parcels}
            buildings={buildings}
            selectedParcel={selectedParcel}
            selectedBuilding={selectedBuilding}
            selectedFloor={selectedFloor}
            onSelectParcel={handleParcelSelect}
            onSelectBuilding={handleBuildingSelect}
            onSelectFloor={handleFloorSelect}
          />
        </aside>

        {/* Center Column: 3D Viewport */}
        <section className="workspace-col viewport-col">
          <PilotScene3D
            selectedParcel={selectedParcel}
            selectedBuilding={selectedBuilding}
            selectedFloor={selectedFloor}
            onFloorSelect={handleFloorSelect}
            viewMode={viewMode}
            highlightedGeometry={highlightedGeometry}
            allParcels={parcels}
            surroundingBuildings={PILOT_DATA.surrounding_buildings}
            floors={activeBuildingFloors}
          />
        </section>

        {/* Right Column: Inspector */}
        <aside className="workspace-col inspector-col">
          <PilotPropertyInspector
            selectedParcel={selectedParcel}
            selectedBuilding={selectedBuilding}
            selectedFloor={selectedFloor}
            floors={activeBuildingFloors}
            evidenceList={currentEvidenceList}
            validations={currentValidations}
            sourceComparisonData={currentSourceComparison}
            viewMode={viewMode}
            onFloorSelect={handleFloorSelect}
            onToggleValidationMode={handleToggleValidationMode}
            onHighlightGeometry={setHighlightedGeometry}
            onOpenReview={() => setIsReviewOpen(true)}
          />
        </aside>
      </main>

      {/* Bottom Processing / Audit Timeline */}
      <footer className="vertimap-footer">
        <PilotAuditTimeline events={auditEvents} />
      </footer>

      {/* Review Drawer Modal */}
      <PilotReviewPanel
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        selectedParcel={selectedParcel}
        selectedBuilding={selectedBuilding}
        selectedFloor={selectedFloor}
        onApprove={handleApproveReview}
        onEdit={handleEditReview}
        onReject={handleRejectReview}
      />

      {/* Data Sources & Provenance Modal */}
      {isSourcesModalOpen && (
        <div className="sources-modal-backdrop" onClick={() => setIsSourcesModalOpen(false)}>
          <div className="sources-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span className="icon">🌐</span>
                <span>REAL DATA SOURCES & PROVENANCE REGISTRY</span>
              </div>
              <button className="btn-close-modal" onClick={() => setIsSourcesModalOpen(false)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Pilot Geo & CRS Metadata */}
              <div className="provenance-section">
                <div className="prov-title">PILOT GEOGRAPHY & PROJECTION SYSTEM</div>
                <div className="prov-grid">
                  <div className="prov-item">
                    <span className="prov-lbl">PILOT SECTOR:</span>
                    <span className="prov-val">{REAL_PILOT_METADATA.pilot_name}</span>
                  </div>
                  <div className="prov-item">
                    <span className="prov-lbl">ADMINISTRATIVE:</span>
                    <span className="prov-val">{REAL_PILOT_METADATA.district}, {REAL_PILOT_METADATA.state}, {REAL_PILOT_METADATA.country}</span>
                  </div>
                  <div className="prov-item">
                    <span className="prov-lbl">WGS84 BOUNDS (LON/LAT):</span>
                    <span className="prov-val code-pill">[{REAL_PILOT_METADATA.bbox_wgs84.join(', ')}]</span>
                  </div>
                  <div className="prov-item">
                    <span className="prov-lbl">PROCESSING CRS (METRIC):</span>
                    <span className="prov-val code-pill">{REAL_PILOT_METADATA.projected_crs}</span>
                  </div>
                  <div className="prov-item full-span">
                    <span className="prov-lbl">PIPELINE VERSION:</span>
                    <span className="prov-val code-pill">{REAL_PILOT_METADATA.pipeline_version}</span>
                  </div>
                </div>
              </div>

              {/* Ingested Datasets Table */}
              <div className="provenance-section">
                <div className="prov-title">INGESTED PUBLIC GEOSPATIAL DATASETS</div>
                <div className="sources-table-wrap">
                  <table className="sources-table">
                    <thead>
                      <tr>
                        <th>Provider</th>
                        <th>Dataset Role</th>
                        <th>License</th>
                        <th>Retrieved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REAL_PILOT_METADATA.sources.map((src, idx) => (
                        <tr key={idx}>
                          <td><strong>{src.name}</strong></td>
                          <td>{src.role}</td>
                          <td><span className="license-tag">{src.license}</span></td>
                          <td><code className="timestamp-code">{src.retrieval_date}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mandatory System Disclaimers */}
              <div className="disclaimer-callout">
                <strong>SEMANTIC IDENTITY DISCLAIMER:</strong> Vertical property identifiers displayed in this system (e.g. <code>KA-BLR-SY-42-1-B01-F03-U00</code>) are <strong>Proposed VPIDs</strong> derived deterministically for vertical parcel stratification. They are NOT official government 3D ULPINs. Official 2D ULPINs are marked as "Not available in source dataset" where absent in public state records.
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-close" onClick={() => setIsSourcesModalOpen(false)}>CLOSE REGISTRY</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
