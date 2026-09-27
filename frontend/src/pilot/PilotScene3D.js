import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Edges, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

// Camera controller for smooth transitions and reset
function CameraController({ targetPosition, resetTrigger }) {
  const { camera, controls } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 5, 0));
  const targetCamPos = useRef(new THREE.Vector3(22, 18, 24));

  useEffect(() => {
    if (targetPosition) {
      targetLookAt.current.set(targetPosition[0], targetPosition[1] + 4, targetPosition[2]);
      targetCamPos.current.set(
        targetPosition[0] + 20,
        targetPosition[1] + 16,
        targetPosition[2] + 22
      );
    }
  }, [targetPosition, resetTrigger]);

  useFrame(() => {
    if (controls) {
      controls.target.lerp(targetLookAt.current, 0.08);
      camera.position.lerp(targetCamPos.current, 0.08);
      controls.update();
    }
  });

  return null;
}

// Single Floor Slab Component
function FloorSlab({
  floor,
  dimensions,
  isHero,
  isSelected,
  isHovered,
  onSelect,
  viewMode,
  highlightedGeometry,
  buildingOffset,
  explosionOffset
}) {
  const meshRef = useRef();
  const [hoveredLocal, setHoveredLocal] = useState(false);

  const isBasement = floor.code.startsWith('B');
  const height = floor.height_m || 3.5;
  const width = floor.is_overhang ? (dimensions.width * 1.25) : (dimensions.width || 6.0);
  const depth = dimensions.depth || 5.0;

  // Calculate vertical position based on mode
  const baseZ = (floor.z_min || 0) + height / 2;
  const adjustedZ = viewMode === 'VERTICAL_SLICE' 
    ? baseZ + explosionOffset 
    : baseZ;

  // Material and color determination
  const isTargetOfEvidence = highlightedGeometry === 'floor' && isSelected;
  
  let slabColor = floor.color || '#334155';
  let opacity = 0.92;
  let transparent = false;

  if (viewMode === 'SUBSURFACE') {
    if (isBasement) {
      slabColor = '#0284c7';
      opacity = 1.0;
    } else {
      slabColor = '#64748b';
      opacity = 0.35;
      transparent = true;
    }
  } else if (viewMode === 'VALIDATION') {
    if (floor.status === 'CONFLICT' || floor.is_overhang) {
      slabColor = '#ef4444';
    } else if (floor.status === 'REVIEW_REQUIRED') {
      slabColor = '#f59e0b';
    } else {
      slabColor = '#10b981';
    }
  } else if (viewMode === 'PROVENANCE') {
    slabColor = floor.evidence_type === 'OBSERVED' || floor.evidence_type === 'SOURCE_ATTRIBUTE'
      ? '#0284c7'
      : floor.evidence_type === 'VALIDATION_TEST_CASE'
      ? '#ef4444'
      : '#475569';
  } else {
    // Normal 3D / Vertical Slice
    if (isSelected) {
      slabColor = '#2563eb';
    } else if (hoveredLocal) {
      slabColor = '#38bdf8';
    } else if (isBasement) {
      slabColor = '#1e293b';
    }
  }

  // X offset shift if overhang
  const xOffset = floor.is_overhang ? buildingOffset[0] + dimensions.width * 0.125 : buildingOffset[0];
  const position = [xOffset, adjustedZ + buildingOffset[1], buildingOffset[2]];

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(floor);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredLocal(true);
        }}
        onPointerOut={() => setHoveredLocal(false)}
      >
        <boxGeometry args={[width, height * 0.92, depth]} />
        <meshStandardMaterial
          color={slabColor}
          roughness={0.2}
          metalness={0.1}
          transparent={transparent || opacity < 1.0}
          opacity={opacity}
        />
        <Edges
          scale={1.0}
          threshold={15}
          color={isSelected || isTargetOfEvidence ? '#38bdf8' : floor.is_overhang ? '#ef4444' : '#1e293b'}
        />
      </mesh>

      {/* Level Label Badge in Vertical Slice / Selection */}
      {(isSelected || viewMode === 'VERTICAL_SLICE' || hoveredLocal) && (
        <Html position={[width / 2 + 0.6, 0, 0]} distanceFactor={15}>
          <div className={`slab-html-badge ${isSelected ? 'selected' : ''} ${floor.is_overhang ? 'overhang' : ''}`}>
            <span className="badge-code">{floor.code}</span>
            <span className="badge-name">{floor.name.split('(')[0]}</span>
            {floor.is_overhang && <span className="badge-alert">! CANTILEVER OVERHANG</span>}
          </div>
        </Html>
      )}

      {/* Subsurface Indicator Arrow */}
      {isBasement && viewMode === 'SUBSURFACE' && (
        <Html position={[0, -height / 2 - 0.5, 0]} distanceFactor={12}>
          <div className="subsurface-indicator-pill">
            <span className="icon">⚓</span>
            <span>SUBSURFACE STRATUM (Z: {floor.z_min}m to {floor.z_max}m)</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// 2D Ground Cadastral Boundary Prism & Ground Grid Component
function CadastralGroundPlane({ parcel, isSelected, onSelect, viewMode, highlightedGeometry }) {
  const isTarget = highlightedGeometry === 'parcel' && isSelected;
  const isConflict = parcel.status === 'CONFLICT';
  const bounds = parcel.boundary_coords || [[-7, -6], [7, -6], [7, 6], [-7, 6]];

  // Convert 2D boundary to 3D line points
  const linePoints = useMemo(() => {
    const pts = bounds.map((pt) => new THREE.Vector3(pt[0], 0.05, pt[1]));
    pts.push(new THREE.Vector3(bounds[0][0], 0.05, bounds[0][1])); // close loop
    return pts;
  }, [bounds]);

  let borderColor = '#3b82f6';
  if (isConflict) borderColor = '#ef4444';
  else if (parcel.status === 'REVIEW_REQUIRED') borderColor = '#f59e0b';
  else if (isSelected) borderColor = '#38bdf8';

  return (
    <group position={[0, 0, 0]}>
      {/* 2D Cadastral Boundary Polyline */}
      <Line
        points={linePoints}
        color={borderColor}
        lineWidth={isSelected || isTarget ? 4 : 2}
      />

      {/* Boundary Corner Pins */}
      {bounds.map((pt, idx) => (
        <mesh key={idx} position={[pt[0], 0.1, pt[1]]}>
          <cylinderGeometry args={[0.15, 0.15, 0.2, 8]} />
          <meshStandardMaterial color={borderColor} emissive={borderColor} emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Ground Surface Fill */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(parcel);
        }}
      >
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#1e3a8a' : '#0f172a'}
          transparent
          opacity={isSelected ? 0.35 : 0.15}
        />
      </mesh>

      {/* Survey Pin Label */}
      <Html position={[bounds[0][0], 0.4, bounds[0][1]]} distanceFactor={16}>
        <div className={`parcel-pin-tag ${isSelected ? 'active' : ''}`}>
          <span className="pin-num">{parcel.survey_number}</span>
          <span className="pin-id">{parcel.source_parcel_id}</span>
        </div>
      </Html>
    </group>
  );
}

// 3D Airspace Boundary Envelope Prism
function AirspacePrism({ height = 45, width = 17, depth = 14 }) {
  return (
    <group position={[0, height / 2, 0]}>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.04}
          wireframe={false}
          side={THREE.DoubleSide}
        />
        <Edges scale={1.0} color="#38bdf8" threshold={15} />
      </mesh>
    </group>
  );
}

// QA Cantilever Overhang Conflict Zone Highlight Mesh
function ConflictZoneMesh({ position = [3.2, 10.5, 0], dimensions = { width: 3.5, height: 8.4, depth: 5.8 } }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial
          color="#ef4444"
          transparent
          opacity={0.45}
          roughness={0.1}
        />
        <Edges scale={1.0} color="#dc2626" />
      </mesh>
      <Html position={[0, dimensions.height / 2 + 0.5, 0]} distanceFactor={14}>
        <div className="conflict-zone-callout">
          <span className="icon">⚠️</span>
          <span>AIRSPACE BOUNDARY VIOLATION (3.8m Overhang)</span>
          <span className="sub">VALIDATION TEST CASE — NOT SURVEY DATA</span>
        </div>
      </Html>
    </group>
  );
}

// Context Environment Surrounding Buildings
function ContextBuilding({ bldg }) {
  const pos = bldg.position || [0, 0, 0];
  const height = bldg.height || 12;
  const width = bldg.width || 4;
  const depth = bldg.depth || 4;

  return (
    <group position={[pos[0], height / 2 + pos[2], pos[1]]}>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.4} />
        <Edges scale={1.0} color="#334155" />
      </mesh>
    </group>
  );
}

// Main 3D Canvas Container Component
export default function PilotScene3D({
  selectedParcel,
  selectedBuilding,
  selectedFloor,
  onFloorSelect,
  viewMode,
  highlightedGeometry,
  allParcels = [],
  surroundingBuildings = [],
  floors = []
}) {
  const [resetCameraTrigger, setResetCameraTrigger] = useState(0);

  // Position lookup for selected building
  const heroPosition = useMemo(() => {
    if (!selectedBuilding) return [0, 0, 0];
    return selectedBuilding.position || [0, 0, 0];
  }, [selectedBuilding]);

  const heroDimensions = useMemo(() => {
    if (!selectedBuilding) return { width: 6.8, depth: 5.6 };
    return selectedBuilding.dimensions || { width: 6.8, depth: 5.6 };
  }, [selectedBuilding]);

  return (
    <div className="scene-3d-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Viewport Floating Info Bar */}
      <div className="viewport-overlay-controls">
        <div className="hud-badge-group">
          <span className="hud-pill crs-pill">CRS: EPSG:32643 (UTM 43N)</span>
          <span className="hud-pill mode-pill">MODE: {viewMode}</span>
          {highlightedGeometry && (
            <span className="hud-pill highlight-pill">HIGHLIGHT: {highlightedGeometry.toUpperCase()}</span>
          )}
        </div>

        <button
          className="btn-reset-cam"
          onClick={() => setResetCameraTrigger((prev) => prev + 1)}
          title="Reset Camera View"
        >
          <span>🎥 RESET CAMERA</span>
        </button>
      </div>

      {/* Viewport Subsurface Ground Grid Disclaimer Notice */}
      {viewMode === 'SUBSURFACE' && (
        <div className="subsurface-view-banner">
          <span className="icon">⛏️</span>
          <span>SUBSURFACE CADASTRAL DISCLOSURE: Ground baseline set at SRTM MSL Datum ({selectedParcel?.ground_elevation_msl_m || 921.5}m MSL). Subsurface level evidence rendered strictly from source attributes.</span>
        </div>
      )}

      {/* Three.js R3F Canvas */}
      <Canvas
        camera={{ position: [24, 20, 26], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#070a11']} />
        
        {/* Lighting Setup */}
        <ambientLight intensity={0.65} />
        <directionalLight position={[30, 50, 20]} intensity={1.1} castShadow />
        <pointLight position={[-20, 20, -20]} intensity={0.4} color="#38bdf8" />

        {/* Orbit Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          maxPolarAngle={Math.PI / 2 + 0.1} // Allow looking slightly under horizon for subsurface
          minDistance={5}
          maxDistance={120}
        />

        {/* Camera Transition Helper */}
        <CameraController targetPosition={heroPosition} resetTrigger={resetCameraTrigger} />

        {/* Base Grid Floor */}
        <gridHelper args={[200, 50, '#1e293b', '#0f172a']} position={[0, -0.05, 0]} />

        {/* Cadastral Parcel Bounds */}
        {allParcels.map((parcel) => (
          <CadastralGroundPlane
            key={parcel.id}
            parcel={parcel}
            isSelected={selectedParcel?.id === parcel.id}
            onSelect={() => {}}
            viewMode={viewMode}
            highlightedGeometry={highlightedGeometry}
          />
        ))}

        {/* Vertical Airspace Prism Bounding Box */}
        {viewMode === 'VALIDATION' && <AirspacePrism height={selectedBuilding?.height_m || 42} />}

        {/* QA Cantilever Overhang Highlight Mesh (B03 / P03) */}
        {(selectedBuilding?.id === 'b3' || viewMode === 'VALIDATION') && (
          <ConflictZoneMesh />
        )}

        {/* Active Hero Building Floor Stack */}
        {floors.map((fl, idx) => {
          // Explosion vertical gap calculation for Vertical Slice mode
          const explosionOffset = idx * 1.8;
          return (
            <FloorSlab
              key={fl.id}
              floor={fl}
              dimensions={heroDimensions}
              isHero={true}
              isSelected={selectedFloor?.id === fl.id}
              isHovered={false}
              onSelect={onFloorSelect}
              viewMode={viewMode}
              highlightedGeometry={highlightedGeometry}
              buildingOffset={heroPosition}
              explosionOffset={explosionOffset}
            />
          );
        })}

        {/* Surrounding Context Buildings */}
        {surroundingBuildings.map((sb) => (
          <ContextBuilding key={sb.id} bldg={sb} />
        ))}
      </Canvas>
    </div>
  );
}
