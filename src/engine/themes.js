// Twelve chakra-aligned themes. Users can tag reflections with 0-2 of these.
// Each theme has a chakra it belongs to — drives color on the constellation.

export const THEMES = [
  // Root
  { id: 'ground', label: 'ground', chakraId: 'root' },
  { id: 'belonging', label: 'belonging', chakraId: 'root' },
  { id: 'fear', label: 'fear', chakraId: 'root' },
  // Sacral
  { id: 'desire', label: 'desire', chakraId: 'sacral' },
  { id: 'pleasure', label: 'pleasure', chakraId: 'sacral' },
  { id: 'change', label: 'change', chakraId: 'sacral' },
  // Solar
  { id: 'will', label: 'will', chakraId: 'solar' },
  { id: 'direction', label: 'direction', chakraId: 'solar' },
  // Heart
  { id: 'love', label: 'love', chakraId: 'heart' },
  { id: 'grief', label: 'grief', chakraId: 'heart' },
  // Throat
  { id: 'voice', label: 'voice', chakraId: 'throat' },
  { id: 'truth', label: 'truth', chakraId: 'throat' },
  { id: 'silence', label: 'silence', chakraId: 'throat' },
  // Third eye
  { id: 'seeing', label: 'seeing', chakraId: 'thirdeye' },
  { id: 'pattern', label: 'pattern', chakraId: 'thirdeye' },
  // Crown
  { id: 'meaning', label: 'meaning', chakraId: 'crown' },
  { id: 'presence', label: 'presence', chakraId: 'crown' },
  { id: 'mystery', label: 'mystery', chakraId: 'crown' },
];

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || null;
}

export function getThemesByChakra(chakraId) {
  return THEMES.filter((t) => t.chakraId === chakraId);
}
