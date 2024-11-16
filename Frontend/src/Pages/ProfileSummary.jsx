import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet's CSS
import L from "leaflet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Calendar,
  GraduationCap,
  FileText,
} from "lucide-react";

// Fix for default marker icons not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ProfileSummary = ({ profile }) => {
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested profile could not be found.
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profiles
          </Link>
        </div>
      </div>
    );
  }

  // Convert coordinate strings to numbers for the map
  const getLatitude = () => {
    if (!profile.latitudeDegree) return null;
    const degree = parseFloat(profile.latitudeDegree);
    return profile.latitudeDirection === "S" ? -degree : degree;
  };

  const getLongitude = () => {
    if (!profile.longitudeDegree) return null;
    const degree = parseFloat(profile.longitudeDegree);
    return profile.longitudeDirection === "W" ? -degree : degree;
  };

  const latitude = getLatitude();
  const longitude = getLongitude();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back Button */}
      <Link
        to="/profile"
        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Profiles
      </Link>

      {/* Profile Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {profile.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <User className="w-12 h-12 text-blue-400" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.name}
              </h1>
              <p className="text-gray-500 flex items-center mt-1">
                <Calendar className="w-4 h-4 mr-2" />
                Member since {profile.createdAt}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">{profile.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">{profile.phone}</span>
          </div>
          {profile.latitudeDegree && (
            <>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {profile.latitudeDegree}° {profile.latitudeDirection} /{" "}
                  {profile.longitudeDegree}° {profile.longitudeDirection}
                </span>
              </div>
              {latitude !== null && longitude !== null && (
                <div className="mt-4">
                  <MapContainer
                    center={[latitude, longitude]}
                    zoom={5}
                    className="w-full h-64 rounded-lg shadow"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    <Marker position={[latitude, longitude]}>
                      <Popup>
                        {profile.name}'s Location
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Bio Card */}
      {profile.bio && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap text-left">
              {profile.bio}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Education Card */}
      {profile.education && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {profile.education.degree && (
                <div>
                  <dt className="text-gray-500 text-sm">Degree</dt>
                  <dd className="text-gray-900 font-medium">
                    {profile.education.degree}
                  </dd>
                </div>
              )}
              {profile.education.institution && (
                <div>
                  <dt className="text-gray-500 text-sm">Institution</dt>
                  <dd className="text-gray-900 font-medium">
                    {profile.education.institution}
                  </dd>
                </div>
              )}
              {profile.education.yearsAttended && (
                <div>
                  <dt className="text-gray-500 text-sm">Years Attended</dt>
                  <dd className="text-gray-900 font-medium">
                    {profile.education.yearsAttended}
                  </dd>
                </div>
              )}
              {profile.education.fieldOfStudy && (
                <div>
                  <dt className="text-gray-500 text-sm">Field of Study</dt>
                  <dd className="text-gray-900 font-medium">
                    {profile.education.fieldOfStudy}
                  </dd>
                </div>
              )}
              {profile.education.grade && (
                <div>
                  <dt className="text-gray-500 text-sm">Grade</dt>
                  <dd className="text-gray-900 font-medium">
                    {profile.education.grade}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileSummary;
