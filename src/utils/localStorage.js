const PROFILE_KEY = 'astrochakra_profile';
const FRIENDS_KEY = 'astrochakra_friends';
const REFLECTIONS_KEY = 'astrochakra_reflections';

export function loadProfile() {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
}

export function loadFriends() {
  try {
    const data = localStorage.getItem(FRIENDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFriends(friends) {
  localStorage.setItem(FRIENDS_KEY, JSON.stringify(friends));
}

export function loadReflections() {
  try {
    const data = localStorage.getItem(REFLECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveReflections(reflections) {
  localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections));
}
