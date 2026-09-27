import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { PILOT_DATA as pilotData } from '../pilot/pilotData';
import './Scene3D.css';

// Helper to parse simple POLYGON WKT (assuming no holes, no multi-polygon)
const parseWKT = (wkt) => {
  const match = wkt.match(/POLYGON\(\((.*)\)\)/);
  if (!match) return [];
  const coordsStr = match[1];
  // Split by comma and space
  const points = coordsStr.split(',').map(pair => {
    const [x, y] = pair.trim().split(' ');
    return { x: parseFloat(x), y: parseFloat(y) };
  });
  // Close the polygon if not already closed
  if (points[0] && points[points.length - 1] &&
      (points[0].x !== points[points.length - 1].x || points[0].y !== points[points.length - 1].y)) {
    points.push({ ...points[0] });
  }
  return points;
};

const Building = ({ building, floors, selectedBuildingId, selectedFloorId, onBuildingSelect, onFloorSelect }) => {
  const meshRef = useRef();
  const isSelected = selectedBuildingId === building.id;
  const isHovered = useRef(false);

  // Color based on selection and validation status (building b3 has a validation test case)
  const getColor = () => {
    if (isSelected) return 0x4cc9f0; // cyan
    if (building.id === 'b3') return 0xff6b6b; // red (validation test case)
    return 0x88c057; // green
  };

  const color = new THREE.Color(getColor());

  useFrame(() => {
    if (meshRef.current) {
      // Pulse effect when hovered
      const pulse = isHovered ? Math.sin(Date.now() * 0.005) * 0.02 + 1 : 1;
      meshRef.current.scale.z = pulse;

      // Slow rotation when selected
      if (isSelected) {
        meshRef.current.rotation.y += 0.005;
      }
    }
  });

  const footprint = parseWKT(building.footprint_wkt);

  // If footprint is invalid, return null to avoid rendering errors
  if (footprint.length < 3) {
    return null;
  }

  return (
    <mesh ref={meshRef}
          onPointerOver={() => (isHovered.current = true)}
          onPointerOut={() => (isHovered.current = false)}
          onClick={() => onBuildingSelect(building)}
          castShadow
          receiveShadow>
      <extrudeGeometry
        args={[
          new THREE.Shape(footprint.map(p => new THREE.Vector2(p.x, p.y))),
          { depth: 0.1, bevelEnabled: false }
        ]}
      >
        <meshLambertMaterial color={color} />
      </extrudeGeometry>
    </mesh>
  );
};

const Floor = ({ floor, selectedFloorId, onFloorSelect, isIsolated }) => {
  const meshRef = useRef();
  const isSelected = selectedFloorId === floor.id;
  const isHovered = useRef(false);

  // Color: if isolated, brighter; else normal
  const getColor = () => {
    if (isIsolated) return 0xffff00; // yellow when isolated
    if (isSelected) return 0x4cc9f0; // cyan when selected
    return 0x88c057; // green default
  };

  const color = new THREE.Color(getColor());

  useFrame(() => {
    if (meshRef.current) {
      // Float up/down animation for selected floor
      if (isSelected || isIsolated) {
        meshRef.current.position.z = Math.sin(Date.now() * 0.002) * 0.5;
      } else {
        meshRef.current.position.z = 0;
      }
    }
  });

  const footprint = parseWKT(pilotData.buildings.find(b => b.id === floor.building_id).footprint_wkt);

  // If footprint is invalid, return null to avoid rendering errors
  if (footprint.length < 3) {
    return null;
  }

  return (
    <mesh ref={meshRef}
          onPointerOver={() => (isHovered.current = true)}
          onPointerOut={() => (isHovered.current = false)}
          onClick={() => onFloorSelect(floor)}
          castShadow
          receiveShadow>
      <extrudeGeometry
        args={[
          new THREE.Shape(footprint.map(p => new THREE.Vector2(p.x, p.y))),
          { depth: 0.1, bevelEnabled: false }
        ]}
      >
        <meshLambertMaterial color={color} />
      </extrudeGeometry>
    </mesh>
  );
};

const Scene3D = ({ onBuildingSelect, onFloorSelect }) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [isIsolated, setIsIsolated] = useState(false);

  // Pass selection changes up
  React.useEffect(() => {
    onBuildingSelect(selectedBuildingId ? pilotData.buildings.find(b => b.id === selectedBuildingId) : null);
  }, [selectedBuildingId, onBuildingSelect]);

  React.useEffect(() => {
    onFloorSelect(selectedFloorId ? pilotData.floors.find(f => f.id === selectedFloorId) : null);
  }, [selectedFloorId, onFloorSelect]);

  return (
    <Canvas
      style={{ height: '100%', width: '100%', background: '#0f172a' }}
      camera={{ position: [10, -10, 8], fov: 60 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />

      {/* Ground */}
      <mesh receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={0x2a2a40} />
      </mesh>

      {/* Parcels as wireframes */}
      {pilotData.parcels.map(parcel => {
        const boundary = parseWKT(parcel.boundary_wkt);
        return (
          <mesh key={parcel.id}>
            <latheGeometry
              args={[
                boundary.map(p => new THREE.Vector2(p.x, p.y)),
                12,
                0,
                Math.PI * 2,
                false
              ]}
            >
              <meshBasicMaterial color={0x4cc9f0} wireframe linewidth={1} />
            </latheGeometry>
          </mesh>
        );
      })}

      {/* Buildings */}
      {pilotData.buildings.map(building => {
        const floors = pilotData.floors.filter(f => f.building_id === building.id).sort((a, b) => a.floor_number - b.floor_number);
        return (
          <group key={building.id}>
            <Building
              building={building}
              floors={floors}
              selectedBuildingId={selectedBuildingId}
              selectedFloorId={selectedFloorId}
              onBuildingSelect={setSelectedBuildingId}
              onFloorSelect={setSelectedFloorId}
            />
            {/* Floors */}
            {floors.map(floor => (
              <Floor
                key={floor.id}
                floor={floor}
                selectedFloorId={selectedFloorId}
                onFloorSelect={setSelectedFloorId}
                isIsolated={isIsolated && selectedFloorId === floor.id}
              />
            ))}
          </group>
        );
      })}

      {/* Controls */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      {/* Axes for debugging */}
      {/* <AxesHelper size={10} /> */}
    </Canvas>
  );
};

export default Scene3D;