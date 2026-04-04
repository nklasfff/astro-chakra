// localStorage-backed reflection / journal entries.
const KEY = 'astrochakra_reflections';

export function loadReflections() {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveReflections(entries) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function addReflection(entry) {
  const all = loadReflections();
  const withId = {
    id: `r-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...entry,
  };
  const next = [withId, ...all];
  saveReflections(next);
  return next;
}

export function deleteReflection(id) {
  const all = loadReflections();
  const next = all.filter((r) => r.id !== id);
  saveReflections(next);
  return next;
}
