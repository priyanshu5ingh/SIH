import React from 'react';
import { PILOT_DATA as pilotData } from '../pilot/pilotData';
import './PropertyExplorer.css';

const PropertyExplorer = ({ onParcelSelect, onBuildingSelect, onFloorSelect }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedParcelId, setSelectedParcelId] = React.useState(null);
  const [selectedBuildingId, setSelectedBuildingId] = React.useState(null);
  const [selectedFloorId, setSelectedFloorId] = React.useState(null);

  // Filter parcels based on search
  const filteredParcels = pilotData.parcels.filter(p =>
    p.parcel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ulpin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get buildings for selected parcel
  const getBuildingsForParcel = (parcelId) => {
    return pilotData.buildings.filter(b => b.parcel_id === parcelId);
  };

  // Get floors for selected building
  const getFloorsForBuilding = (buildingId) => {
    return pilotData.floors.filter(f => f.building_id === buildingId).sort((a, b) => a.floor_number - b.floor_number);
  };

  const buildings = selectedParcelId ? getBuildingsForParcel(selectedParcelId) : [];
  const floors = selectedBuildingId ? getFloorsForBuilding(selectedBuildingId) : [];

  return (
    <div className="property-explorer">
      <div className="explorer-header">
        <h3>Property Explorer</h3>
        <input
          type="text"
          placeholder="Search parcels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="explorer-body">
        <div className="section parcels">
          <h4>Parcels</h4>
          <ul className="parcel-list">
            {filteredParcels.map(parcel => (
              <li
                key={parcel.id}
                className={selectedParcelId === parcel.id ? 'active' : ''}
                onClick={() => {
                  setSelectedParcelId(parcel.id);
                  setSelectedBuildingId(null);
                  setSelectedFloorId(null);
                  onParcelSelect(parcel);
                }}
              >
                <div className="parcel-info">
                  <div className="ulpin">{parcel.ulpin}</div>
                  <div className="name">{parcel.parcel_name}</div>
                </div>
                <div className="area">{parcel.area_sqm} m²</div>
              </li>
            ))}
          </ul>
        </div>

        {selectedParcelId && (
          <div className="section buildings">
            <h4>Buildings</h4>
            <ul className="building-list">
              {buildings.map(building => (
                <li
                  key={building.id}
                  className={selectedBuildingId === building.id ? 'active' : ''}
                  onClick={() => {
                    setSelectedBuildingId(building.id);
                    setSelectedFloorId(null);
                    onBuildingSelect(building);
                  }}
                >
                  <div className="building-info">
                    <div className="name">{building.building_name}</div>
                    <div className="floors">{building.num_floors_above + building.num_floors_below} floors</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedBuildingId && (
          <div className="section floors">
            <h4>Floors</h4>
            <ul className="floor-list">
              {floors.map(floor => (
                <li
                  key={floor.id}
                  className={selectedFloorId === floor.id ? 'active' : ''}
                  onClick={() => {
                    setSelectedFloorId(floor.id);
                    onFloorSelect(floor);
                  }}
                >
                  <div className="floor-info">
                    <div className="label">{floor.floor_name}</div>
                    <div className="details">
                      Level {floor.floor_number} • {floor.area_sqm} m²
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyExplorer;