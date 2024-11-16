import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, User, MapPin, Mail, Phone, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProfiles } from '../Store/profileStore';

const ProfileCard = ({ profile, onMapView, onSelectProfile }) => {
  const navigate = useNavigate();

  const handleSummaryClick = () => {
    if (onSelectProfile) {
      onSelectProfile(profile);
      navigate('/profile/summary');
    }
  };

  return (
    <Card className="h-full transform transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 mb-4">
            {profile.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-sm">
                <User className="w-10 h-10 text-blue-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-xl text-gray-900 truncate">
                {profile.name}
              </h3>
              <p className="text-sm text-gray-500">Member since {profile.createdAt}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{profile.phone}</span>
            </div>
            {profile.latitudeDegree && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>
                  {profile.latitudeDegree}° {profile.latitudeDirection} / 
                  {profile.longitudeDegree}° {profile.longitudeDirection}
                </span>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-left">Bio:</h4>
              <p className="text-sm text-gray-600 text-left">{profile.bio}</p>
            </div>
          )}

          {/* Education Section */}
          {profile.education && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-left">Education:</h4>
              <ul className="list-disc list-inside space-y-1 text-left text-sm text-gray-600">
                {profile.education.degree && (
                  <li>
                    <strong>Degree:</strong> {profile.education.degree}
                  </li>
                )}
                {profile.education.institution && (
                  <li>
                    <strong>Institution:</strong> {profile.education.institution}
                  </li>
                )}
                {profile.education.yearsAttended && (
                  <li>
                    <strong>Years Attended:</strong> {profile.education.yearsAttended}
                  </li>
                )}
                {profile.education.fieldOfStudy && (
                  <li>
                    <strong>Field of Study:</strong> {profile.education.fieldOfStudy}
                  </li>
                )}
                {profile.education.grade && (
                  <li>
                    <strong>Grade:</strong> {profile.education.grade}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto pt-4 border-t border-gray-100 space-y-2">
            {(profile.latitudeDegree && profile.longitudeDegree) && (
              <button 
                onClick={() => onMapView(profile.latitudeDegree, profile.longitudeDegree)}
                className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>View on Map</span>
              </button>
            )}
            <button 
              onClick={handleSummaryClick}
              className="w-full bg-green-50 text-green-600 py-2 px-4 rounded-md hover:bg-green-100 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>View Summary</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PublicProfileView = ({ onSelectProfile }) => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfiles = () => {
      const loadedProfiles = getProfiles();
      setProfiles(loadedProfiles);
      setFilteredProfiles(loadedProfiles);
    };

    loadProfiles();

    const handleStorageChange = (e) => {
      if (e.key === 'userProfiles') {
        loadProfiles();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadProfiles, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const filtered = profiles.filter((profile) => {
      const searchFields = [
        profile.name,
        profile.email,
        profile.phone,
        profile.bio,
        profile.latitudeDegree && `${profile.latitudeDegree}° ${profile.latitudeDirection}`,
        profile.longitudeDegree && `${profile.longitudeDegree}° ${profile.longitudeDirection}`
      ].filter(Boolean);

      return searchFields.some(field => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredProfiles(filtered);
  }, [searchTerm, profiles]);

  const openMap = (latitude, longitude) => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          User Profiles Directory
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 w-full"
              placeholder="Search by name, email, phone, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate('/map')}
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <MapPin className="w-4 h-4" />
            <span>View All on Map</span>
          </button>
        </div>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {filteredProfiles.map((profile) => (
          <ProfileCard 
            key={profile.id} 
            profile={profile} 
            onMapView={openMap}
            onSelectProfile={onSelectProfile}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProfiles.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No profiles found
            </h2>
            <p className="text-gray-600">
              Try adjusting your search terms or browse all profiles
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfileView;