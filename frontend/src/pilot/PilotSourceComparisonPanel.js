import React from 'react';

export default function PilotSourceComparisonPanel({ comparisonData }) {
  if (!comparisonData) {
    return (
      <div className="empty-compare-state">
        <p>No secondary footprint data available for comparison.</p>
      </div>
    );
  }

  const { source_a, source_b, metrics } = comparisonData;
  const isAgreement = metrics.status === 'SOURCE_AGREEMENT';

  return (
    <div className="pilot-source-compare-panel">
      {/* Overview Status Card */}
      <div className={`compare-status-card ${isAgreement ? 'status-agree' : 'status-discrepancy'}`}>
        <div className="status-header">
          <span className="status-icon">{isAgreement ? '✓' : '⚠️'}</span>
          <div className="status-text-group">
            <span className="status-main">{metrics.status_label}</span>
            <span className="status-sub">Spatial Boundary IoU Match: {metrics.spatial_iou_overlap_pct}%</span>
          </div>
        </div>
        <div className="compare-bar-track">
          <div
            className="compare-bar-fill"
            style={{ width: `${Math.min(100, Math.max(10, metrics.spatial_iou_overlap_pct))}%` }}
          />
        </div>
      </div>

      {/* Side-by-Side Dataset Matrix */}
      <div className="compare-matrix-grid">
        {/* Source A */}
        <div className="source-card source-a-card">
          <div className="source-card-header">
            <span className="src-tag tag-a">SOURCE A (PRIMARY)</span>
            <span className="src-name">{source_a.provider}</span>
          </div>
          <div className="source-card-body">
            <div className="src-metric-row">
              <span className="src-lbl">Feature ID:</span>
              <span className="src-val code-val">{source_a.feature_id}</span>
            </div>
            <div className="src-metric-row">
              <span className="src-lbl">Footprint Area:</span>
              <span className="src-val highlight">{source_a.footprint_area_m2} m²</span>
            </div>
            <div className="src-metric-row">
              <span className="src-lbl">Vertex Complexity:</span>
              <span className="src-val">{source_a.vertex_count} vertices</span>
            </div>
            <div className="src-metric-row">
              <span className="src-lbl">License:</span>
              <span className="src-val license-pill">{source_a.license}</span>
            </div>
          </div>
        </div>

        {/* Source B */}
        <div className="source-card source-b-card">
          <div className="source-card-header">
            <span className="src-tag tag-b">SOURCE B (SECONDARY)</span>
            <span className="src-name">{source_b.provider}</span>
          </div>
          <div className="source-card-body">
            <div className="src-metric-row">
              <span className="src-lbl">Feature ID:</span>
              <span className="src-val code-val">{source_b.feature_id}</span>
            </div>
            <div className="src-metric-row">
              <span className="src-lbl">Footprint Area:</span>
              <span className="src-val highlight">{source_b.footprint_area_m2} m²</span>
            </div>
            <div className="src-metric-row">
              <span className="src-lbl">Vertex Complexity:</span>
              <span className="src-val">{source_b.vertex_count} vertices</span>
            </div>
            <div className="src-metric-row">
              <span className="src-lbl">License:</span>
              <span className="src-val license-pill cdla">{source_b.license}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Differential Breakdown */}
      <div className="diff-breakdown-card">
        <div className="diff-title">GEOMETRIC CROSS-VALIDATION METRICS</div>
        <div className="diff-grid">
          <div className="diff-item">
            <span className="diff-lbl">Area Delta (Δ):</span>
            <span className="diff-val">{metrics.area_difference_m2} m² ({metrics.area_difference_pct}%)</span>
          </div>
          <div className="diff-item">
            <span className="diff-lbl">Intersection IoU:</span>
            <span className="diff-val">{metrics.spatial_iou_overlap_pct}% Overlap</span>
          </div>
          <div className="diff-item full-width">
            <span className="diff-lbl">Cadastral Significance:</span>
            <span className="diff-note">
              {isAgreement
                ? 'High spatial concordance (<2% area variance) confirms reliable exterior building perimeter for vertical envelope derivation.'
                : 'Discrepancy detected between vector sources. Field cadastral validation recommended before final parcel bounds certification.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
