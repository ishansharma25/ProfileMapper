import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { getProfiles } from '../Store/profileStore';
import "leaflet/dist/leaflet.css";

const MapView = () => {
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const navigate = useNavigate();

  // Add real-time update functionality
  useEffect(() => {
    const loadProfiles = () => {
      const loadedProfiles = getProfiles();
      // Filter only profiles with valid coordinates
      const profilesWithCoordinates = loadedProfiles.filter(
        profile => profile.latitudeDegree && profile.longitudeDegree
      );
      setProfiles(profilesWithCoordinates);
    };

    // Initial load
    loadProfiles();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'userProfiles') {
        loadProfiles();
      }
    };

    // Set up polling and storage event listeners
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadProfiles, 2000);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Styles
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50
  };

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    backgroundColor: 'white',
    borderRadius: '50%',
    padding: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    outline: 'none'
  };

  // Calculate map bounds or default center
  const getMapBounds = () => {
    if (profiles.length === 0) {
      return {
        center: [0, 0],
        zoom: 2
      };
    }

    const lats = profiles.map(p => parseFloat(p.latitudeDegree));
    const lngs = profiles.map(p => parseFloat(p.longitudeDegree));
    
    const center = [
      (Math.max(...lats) + Math.min(...lats)) / 2,
      (Math.max(...lngs) + Math.min(...lngs)) / 2
    ];

    return {
      center,
      zoom: 4
    };
  };

  const { center, zoom } = getMapBounds();

  return (
    <div style={containerStyle}>
      <button
        onClick={() => navigate('/profile')}
        style={closeButtonStyle}
        aria-label="Close map"
      >
        <X size={24} />
      </button>

      <MapContainer
        center={center}
        zoom={zoom}
        style={mapContainerStyle}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {profiles.map((profile) => (
          <Marker
            key={profile.id}
            position={[
              parseFloat(profile.latitudeDegree),
              parseFloat(profile.longitudeDegree)
            ]}
            eventHandlers={{
              click: () => {
                setActiveProfile(profile);
              },
            }}
          />
        ))}

        {activeProfile && (
          <Popup
            position={[
              parseFloat(activeProfile.latitudeDegree),
              parseFloat(activeProfile.longitudeDegree)
            ]}
            onClose={() => setActiveProfile(null)}
          >
            <div className="p-2">
              <h3 className="font-bold mb-2">{activeProfile.name}</h3>
              <p className="text-sm mb-1">Email: {activeProfile.email}</p>
              <p className="text-sm mb-1">Phone: {activeProfile.phone}</p>
              {activeProfile.bio && (
                <p className="text-sm mb-1">Bio: {activeProfile.bio}</p>
              )}
              <p className="text-sm">
                Location: {activeProfile.latitudeDegree}° {activeProfile.latitudeDirection},
                {activeProfile.longitudeDegree}° {activeProfile.longitudeDirection}
              </p>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;