import { createContext, useContext, useState, useEffect } from 'react';
import { loadProfile, saveProfile, clearProfile } from '../utils/localStorage';
import { getChakraPhase } from '../engine/chakraPhase';
import { calculateAge } from '../utils/dateUtils';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(() => loadProfile());
  const [theme, setTheme] = useState(() => localStorage.getItem('astrochakra-theme') || 'light');

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'light' ? 'dark' : 'light';
      localStorage.setItem('astrochakra-theme', next);
      return next;
    });
  };

  useEffect(() => {
    if (profile) {
      saveProfile(profile);
    }
  }, [profile]);

  const completeOnboarding = ({ birthDate, birthTime, birthLocation }) => {
    const newProfile = {
      birthDate,
      birthTime: birthTime || null,
      birthLocation: birthLocation || null,
      onboardedAt: new Date().toISOString(),
    };
    setProfile(newProfile);
    return newProfile;
  };

  const resetProfile = () => {
    clearProfile();
    setProfile(null);
  };

  const getDerivedData = () => {
    if (!profile) return null;
    const age = calculateAge(profile.birthDate.year, profile.birthDate.month, profile.birthDate.day);
    const phase = getChakraPhase(age);
    return { ...profile, age, phase };
  };

  return (
    <UserContext.Provider value={{
      profile,
      isOnboarded: !!profile,
      completeOnboarding,
      resetProfile,
      getDerivedData,
      theme,
      toggleTheme,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

export default UserContext;
