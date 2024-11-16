// src/store/profileStore.js
const STORAGE_KEY = 'userProfiles';

export const getProfiles = () => {
  const profiles = localStorage.getItem(STORAGE_KEY);
  return profiles ? JSON.parse(profiles) : [];
};

export const saveProfiles = (profiles) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

export const addProfile = (profile) => {
  const profiles = getProfiles();
  profiles.push(profile);
  saveProfiles(profiles);
  return profiles;
};

export const updateProfile = (updatedProfile) => {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.id === updatedProfile.id);
  if (index !== -1) {
    profiles[index] = updatedProfile;
    saveProfiles(profiles);
  }
  return profiles;
};

export const deleteProfile = (id) => {
  const profiles = getProfiles();
  const filteredProfiles = profiles.filter(p => p.id !== id);
  saveProfiles(filteredProfiles);
  return filteredProfiles;
};