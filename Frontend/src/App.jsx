import { useState, useEffect } from 'react';
import './App.css';
import AdminProfileManager from './Pages/AdminProfileManager';
import PublicProfileView from './Pages/ProfileView';
import ProfileSummary from './Pages/ProfileSummary';
import NavBar from './Component/NavBar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MapView from './Pages/MapView';
import { getProfiles } from '@/Store/profileStore';

function App() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const loadProfiles = () => {
    const loadedProfiles = getProfiles();
    
    setProfiles(loadedProfiles);
  };

  useEffect(() => {
    loadProfiles();

    const handleStorageChange = (e) => {
      if (e.key === 'userProfiles') {
        loadProfiles();
      }
    };
    const syncProfiles = () => loadProfiles();
    window.addEventListener("storage", syncProfiles);
    
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadProfiles, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen w-screen m-0 p-0 overflow-x-hidden">
        {window.location.pathname !== '/map' && <NavBar />}
        <div className={window.location.pathname !== '/map' ? "pt-16" : ""}>
          <Routes>
            <Route path="/" element={<Navigate to="/profile" replace />} />
            <Route path="/admin/profile" element={<AdminProfileManager />} />
            <Route 
              path="/profile" 
              element={<PublicProfileView onSelectProfile={setSelectedProfile} />} 
            />
            <Route 
              path="/profile/summary" 
              element={
                selectedProfile ? 
                <ProfileSummary profile={selectedProfile} /> : 
                <Navigate to="/profile" replace />
              } 
            />
            <Route path="/map" element={<MapView profiles={profiles} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;