import React, { useState } from 'react';
import { PILOT_DATA as pilotData } from '../pilot/pilotData';
import TopBar from './TopBar';
import PropertyExplorer from './PropertyExplorer';
import Scene3D from './Scene3D';
import PropertyInspector from './PropertyInspector';
import ProcessingTimeline from './ProcessingTimeline';
import './MainWorkspace.css';

const MainWorkspace = () => {
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('PENDING'); // PENDING, VERIFIED, EDITED, REJECTED

  // Initialize with first parcel and building for pilot
  React.useEffect(() => {
    const firstParcel = pilotData.parcels[0];
    setSelectedParcel(firstParcel);

    const firstBuilding = pilotData.buildings.find(b => b.parcel_id === firstParcel.id);
    setSelectedBuilding(firstBuilding);

    const firstFloor = pilotData.floors.find(f => f.building_id === firstBuilding.id);
    setSelectedFloor(firstFloor);

    // Reset review status
    setReviewStatus('PENDING');
  }, []);

  const handleParcelSelect = (parcel) => {
    setSelectedParcel(parcel);
    // Reset building and floor selection
    const building = pilotData.buildings.find(b => b.parcel_id === parcel.id);
    setSelectedBuilding(building || null);
    if (building) {
      const floor = pilotData.floors.find(f => f.building_id === building.id);
      setSelectedFloor(floor || null);
    } else {
      setSelectedBuilding(null);
      setSelectedFloor(null);
    }
    // Reset review status when parcel changes
    setReviewStatus('PENDING');
  };

  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
    // Reset floor selection
    if (!building) {
      setSelectedFloor(null);
      return;
    }
    const floor = pilotData.floors.find(f => f.building_id === building.id);
    setSelectedFloor(floor || null);
    // Reset review status when building changes
    setReviewStatus('PENDING');
  };

  const handleFloorSelect = (floor) => {
    setSelectedFloor(floor);
    // Reset review status when floor changes
    setReviewStatus('PENDING');
  };

  const handleReviewAction = (action) => {
    let newStatus = reviewStatus;
    if (action === 'APPROVE') {
      newStatus = 'VERIFIED';
    } else if (action === 'EDIT') {
      newStatus = 'EDITED';
    } else if (action === 'REJECT') {
      newStatus = 'REJECTED';
    }
    setReviewStatus(newStatus);
  };

  const [timelineEntries, setTimelineEntries] = useState([
    { id: 1, type: 'processing', label: 'Loading real pilot dataset...', timestamp: '2026-09-25 18:00:00', status: 'complete' },
    { id: 2, type: 'processing', label: 'Parcel KA-BLR-SY-42-1 loaded', timestamp: '2026-09-25 18:00:05', status: 'complete' },
    { id: 3, type: 'processing', label: 'Building B01 extracted from OSM way/238491823', timestamp: '2026-09-25 18:00:10', status: 'complete' },
  ]);

  const addTimelineEntry = (type, label) => {
    const newEntry = {
      id: Date.now(),
      type,
      label,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      status: 'pending'
    };
    setTimelineEntries(prev => [...prev, newEntry]);

    // Auto-complete after a short delay
    setTimeout(() => {
      setTimelineEntries(prev =>
        prev.map(entry =>
          entry.id === newEntry.id ? {...entry, status: 'complete'} : entry
        )
      );
    }, 1500);
  };

  const handleReviewActionWithTimeline = (action) => {
    let newStatus = reviewStatus;
    if (action === 'APPROVE') {
      newStatus = 'VERIFIED';
    } else if (action === 'EDIT') {
      newStatus = 'EDITED';
    } else if (action === 'REJECT') {
      newStatus = 'REJECTED';
    }
    setReviewStatus(newStatus);
    addTimelineEntry('review', `Review action: ${action}`);
  };

  if (!selectedParcel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-workspace">
      <TopBar />
      <div className="workspace-container">
        <PropertyExplorer
          onParcelSelect={handleParcelSelect}
          onBuildingSelect={handleBuildingSelect}
          onFloorSelect={handleFloorSelect}
        />
        <div className="workspace-center">
          <Scene3D
            onBuildingSelect={handleBuildingSelect}
            onFloorSelect={handleFloorSelect}
          />
          <PropertyInspector
            selectedParcel={selectedParcel}
            selectedBuilding={selectedBuilding}
            selectedFloor={selectedFloor}
            reviewStatus={reviewStatus}
            onReviewAction={handleReviewActionWithTimeline}
          />
        </div>
      </div>
      <ProcessingTimeline entries={timelineEntries} />
    </div>
  );
};

export default MainWorkspace;