// localStorage-backed friend/relationship list for synastry.
const KEY = 'astrochakra_friends';

export function loadFriends() {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFriends(friends) {
  localStorage.setItem(KEY, JSON.stringify(friends));
}

export function addFriend(friend) {
  const all = loadFriends();
  const withId = {
    id: `f-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...friend,
  };
  const next = [withId, ...all];
  saveFriends(next);
  return next;
}

export function deleteFriend(id) {
  const all = loadFriends();
  const next = all.filter((f) => f.id !== id);
  saveFriends(next);
  return next;
}
