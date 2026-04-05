// Unified reflection store. All user writing across the app lives here —
// journal entries, notes after practices, thoughts about relationships.
// Each entry is tagged with the chakra active when written, age, spiral,
// source (what part of the app it came from), and up to 2 themes.

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

/**
 * Add a reflection. Entry expects:
 *   text: string (required)
 *   source: 'journal' | 'practice' | 'relations' (required)
 *   chakraId, chakraName, age, spiral (contextual, attach when calling)
 *   themes: string[] (0-2 theme ids)
 *   sourceMeta: object (e.g. { friendName } or { practiceTitle, chakraId })
 *   prompt: string (original prompt if journal)
 */
export function addReflection(entry) {
  const all = loadReflections();
  const withId = {
    id: `r-${Date.now()}`,
    createdAt: new Date().toISOString(),
    themes: [],
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

/** Entries sorted oldest-first for timeline plotting. */
export function getReflectionsChronological() {
  return [...loadReflections()].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
}

/** Count entries per chakra — returns {root: 3, sacral: 1, ...} */
export function getChakraCounts() {
  const counts = {};
  for (const r of loadReflections()) {
    if (r.chakraId) counts[r.chakraId] = (counts[r.chakraId] || 0) + 1;
  }
  return counts;
}

/** Top themes across all entries, sorted by count. */
export function getThemeCounts() {
  const counts = {};
  for (const r of loadReflections()) {
    for (const t of r.themes || []) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);
}
