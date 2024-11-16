import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Edit2, Download, X, Upload } from 'lucide-react';
import { getProfiles, saveProfiles, addProfile, updateProfile, deleteProfile } from '../Store/profileStore';

const AdminProfileManager = () => {
  const initialFormState = {
    name: '',
    email: '',
    latitudeDegree: '',
    latitudeDirection: '',
    longitudeDegree: '',
    longitudeDirection: '',
    phone: '',
    bio: '',
    education: {
      degree: '',
      institution: '',
      yearsAttended: '',
      fieldOfStudy: '',
      grade: ''
    }, // Added field
    imageUrl: null
  };

  const [profiles, setProfiles] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState('');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('isAdmin') === 'true');
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      loadProfiles();
    }
  }, [isAdmin]);

  const loadProfiles = () => {
    const loadedProfiles = getProfiles();
    setProfiles(loadedProfiles);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) { // 5MB limit
        setAlert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'latitudeDirection' || name === 'longitudeDirection') {
      const uppercasedValue = value.toUpperCase();

      if (name === 'latitudeDirection' && (uppercasedValue === 'N' || uppercasedValue === 'S')) {
        setFormData(prev => ({
          ...prev,
          [name]: uppercasedValue
        }));
      } else if (name === 'longitudeDirection' && (uppercasedValue === 'E' || uppercasedValue === 'W')) {
        setFormData(prev => ({
          ...prev,
          [name]: uppercasedValue
        }));
      } else {
        setAlert('Invalid direction for Latitude (N/S) or Longitude (E/W)');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setAlert('Name and email are required fields');
      return;
    }

    if (editingId === null) {
      const newProfile = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toLocaleString(),
        status: 'active'
      };
      const updatedProfiles = addProfile(newProfile);
      setProfiles(updatedProfiles);
    } else {
      const updatedProfile = { ...formData, id: editingId };
      const updatedProfiles = updateProfile(updatedProfile);
      setProfiles(updatedProfiles);
      setEditingId(null);
    }

    setFormData(initialFormState);
    setImagePreview(null);
    setAlert('Profile saved successfully!');
  };

  const handleEdit = (profile) => {
    setFormData(profile);
    setEditingId(profile.id);
    setImagePreview(profile.imageUrl);
  };

  const handleDelete = (id) => {
    const updatedProfiles = deleteProfile(id);
    setProfiles(updatedProfiles);
    setAlert('Profile deleted successfully!');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(profiles, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'profiles.json';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginCredentials.username === 'admin' && loginCredentials.password === 'admin123') {
      setIsAdmin(true);
      setLoggedIn(true);
      localStorage.setItem('isAdmin', 'true');
      setAlert('Login successful');
    } else {
      setAlert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setLoggedIn(false);
    setLoginCredentials({ username: '', password: '' });
    localStorage.removeItem('isAdmin');
    setAlert('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {!loggedIn ? (
          <Card className="max-w-md mx-auto shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  name="username"
                  placeholder="Username"
                  className="w-full"
                  value={loginCredentials.username}
                  onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full"
                  value={loginCredentials.password}
                  onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                />
                <Button type="submit" className="w-full">Login</Button>
              </form>
              {alert && (
                <Alert className="mt-4">
                  <AlertDescription>{alert}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">

            {/**--------------------------------- */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Profile Management</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Input
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="phone"
                      type="number"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    <div className="flex space-x-2">
                      <Input
                        name="latitudeDegree"
                        type="number"
                        placeholder="Latitude"
                        value={formData.latitudeDegree}
                        onChange={handleInputChange}
                      />
                      <Input
                        name="latitudeDirection"
                        placeholder="N/S"
                        className="w-20"
                        value={formData.latitudeDirection}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        name="longitudeDegree"
                        type="number"
                        placeholder="Longitude"
                        value={formData.longitudeDegree}
                        onChange={handleInputChange}
                      />
                      <Input
                        name="longitudeDirection"
                        placeholder="E/W"
                        className="w-20"
                        value={formData.longitudeDirection}
                        onChange={handleInputChange}
                      />
                    </div>
                    <Input
                      name="bio"
                      placeholder="Short Bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                    />

                    {/**----------------------------------------------------------- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
  <Input
    name="degree"
    placeholder="Degree"
    value={formData.education.degree}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        education: { ...prev.education, degree: e.target.value },
      }))
    }
  />
  <Input
    name="institution"
    placeholder="Institution"
    value={formData.education.institution}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        education: { ...prev.education, institution: e.target.value },
      }))
    }
  />
<Input
  type="number" // Use "text" to prevent unwanted browser-native validation styling.
  name="yearsAttended"
  placeholder="Years Attended"
  value={formData.education.yearsAttended}
  onChange={(e) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        education: { ...prev.education, yearsAttended: value },
      }));
    }
  }}
/>

  <Input
    name="fieldOfStudy"
    placeholder="Field of Study"
    value={formData.education.fieldOfStudy}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        education: { ...prev.education, fieldOfStudy: e.target.value },
      }))
    }
  />
  <Input
  type="number"
    name="grade"
    placeholder="Grade"
    value={formData.education.grade}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        education: { ...prev.education, grade: e.target.value },
      }))
    }
  />
  
</div>
{/**----------------------------------------------------------- */}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border"
                      />
                    )}
                  </div>

                  <Button type="submit" className="w-full">{editingId ? 'Update Profile' : 'Add Profile'}</Button>
                    
                </form>
              </CardContent>
            </Card>
            <div className="flex flex-col space-y-4 mt-6">
  <Button onClick={handleExport} className="w-full flex justify-center items-center space-x-2">
    <Download /> <span>Export Data</span>
  </Button>

  <Button onClick={handleLogout} className="w-full flex justify-center items-center space-x-2">
    <X /> <span>Logout</span>
  </Button>
</div>
 {/**--------------------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map(profile => (
                <Card key={profile.id} className="shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      {profile.imageUrl ? (
                        <img src={profile.imageUrl} alt={profile.name} className="w-16 h-16 object-cover rounded-full border-2" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-500">{profile.name.charAt(0)}</span>
                        </div>
                      )}
                      <CardTitle className="truncate">{profile.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
  <div className="flex flex-col space-y-2 text-left">
    <p><span className="font-medium">Email:</span> {profile.email}</p>
    <p><span className="font-medium">Phone:</span> {profile.phone}</p>
    <p><span className="font-medium">Location:</span> {profile.latitudeDegree}°{profile.latitudeDirection}, {profile.longitudeDegree}°{profile.longitudeDirection}</p>
    <p><span className="font-medium">Bio:</span> {profile.bio}</p>
    <div>
      <span className="font-medium">Education:</span>
      {profile.education ? (
        <ul className="list-disc ml-5">
          {profile.education.degree && <li><strong>Degree:</strong> {profile.education.degree}</li>}
          {profile.education.institution && <li><strong>Institution:</strong> {profile.education.institution}</li>}
          {profile.education.yearsAttended && <li><strong>Years Attended:</strong> {profile.education.yearsAttended}</li>}
          {profile.education.fieldOfStudy && <li><strong>Field of Study:</strong> {profile.education.fieldOfStudy}</li>}
          {profile.education.grade && <li><strong>Grade:</strong> {profile.education.grade}</li>}
        </ul>
      ) : (
        <p>Not Provided</p>
      )}
    </div>
  </div>
  <div className="flex space-x-2 pt-4">
    <Button onClick={() => handleEdit(profile)}><Edit2 /> Edit</Button>
    <Button onClick={() => handleDelete(profile.id)}><Trash2 /> Delete</Button>
  </div>
</CardContent>

                </Card>
              ))}
            </div>

           {/* <Button onClick={handleExport} className="w-full flex justify-center items-center space-x-2">
              <Download /> <span>Export Data</span>
            </Button>

            <Button onClick={handleLogout} className="w-full flex justify-center items-center space-x-2">
              <X /> <span>Logout</span>
            </Button>*/}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfileManager;
