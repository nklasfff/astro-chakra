// Natal chart computation — brings ephemeris, planets, and zodiac together.
//
// Input: birth date, time (optional), location (optional).
// Output: list of planets in signs with degree, plus metadata.
//
// If no birth time is provided, noon local is used ("solar chart").
// If no location, UTC is assumed for now — we'll add timezone lookup later.

import { julianDay } from './ephemeris';
import { getEclipticLongitude, BODIES } from './planetPositions';
import { getSignFromLongitude } from './zodiac';
import { PLANETS, getPlanet } from './planets';

/**
 * Compute a natal chart.
 * @param {object} profile — { birthDate: {year, month, day}, birthTime?: {hour, minute}, birthLocation?: {...} }
 * @returns {object} { julianDay, hasTime, planets: [...], sun, moon }
 */
export function computeNatalChart(profile) {
  if (!profile?.birthDate) return null;

  const { year, month, day } = profile.birthDate;
  const hasTime = Boolean(profile.birthTime);
  const hour = profile.birthTime?.hour ?? 12;
  const minute = profile.birthTime?.minute ?? 0;

  // For a first pass, treat birth time as UTC.
  // TODO: convert to UTC using birthLocation.timezone when we have coordinates.
  const jd = julianDay(year, month, day, hour, minute);

  const planets = BODIES.map((id) => {
    const longitude = getEclipticLongitude(id, jd);
    const { sign, signIndex, degreeInSign } = getSignFromLongitude(longitude);
    const meta = getPlanet(id);
    return {
      id,
      name: meta.name,
      glyph: meta.glyph,
      chakra: meta.chakra,
      domain: meta.domain,
      longitude,
      sign,
      signIndex,
      degreeInSign,
    };
  });

  const sun = planets.find((p) => p.id === 'sun');
  const moon = planets.find((p) => p.id === 'moon');

  return {
    julianDay: jd,
    hasTime,
    planets,
    sun,
    moon,
  };
}

export { PLANETS };
