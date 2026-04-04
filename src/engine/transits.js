// Transits — planetary positions at any given moment (usually "now"),
// compared to a natal chart. Aspects are the angular relationships between
// a transiting planet and a natal one that tell you what is moving.

import { julianDayFromDate } from './ephemeris';
import { getEclipticLongitude, BODIES } from './planetPositions';
import { getSignFromLongitude } from './zodiac';
import { getPlanet } from './planets';

/**
 * Compute the current sky — planet positions for a given date (defaults to now).
 * Returns the same shape as a natal chart so existing components can render it.
 */
export function computeCurrentSky(date = new Date()) {
  const jd = julianDayFromDate(date);

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

  return {
    julianDay: jd,
    date,
    planets,
    sun: planets.find((p) => p.id === 'sun'),
    moon: planets.find((p) => p.id === 'moon'),
  };
}

// Aspect definitions — the angular relationships that matter in astrology.
// Orb = tolerance (how far from exact the angle can be and still count).
const ASPECTS = [
  { id: 'conjunction', name: 'Conjunction', angle: 0,   orb: 6, flavor: 'fusing' },
  { id: 'sextile',     name: 'Sextile',     angle: 60,  orb: 4, flavor: 'supporting' },
  { id: 'square',      name: 'Square',      angle: 90,  orb: 5, flavor: 'challenging' },
  { id: 'trine',       name: 'Trine',       angle: 120, orb: 6, flavor: 'flowing' },
  { id: 'opposition',  name: 'Opposition',  angle: 180, orb: 6, flavor: 'polarising' },
];

/** Smallest angle between two longitudes (0-180°). */
function angularDistance(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/**
 * Compute transits — list of aspects between transit-planets and natal-planets.
 * Only returns aspects within orb.
 */
export function computeTransits(currentSky, natalChart) {
  if (!currentSky || !natalChart) return [];

  const results = [];
  for (const transit of currentSky.planets) {
    for (const natal of natalChart.planets) {
      // Skip same-body transits (transit Sun to natal Sun would just be "solar return")
      // Actually keep them — conjunctions of same planet are meaningful (return)
      const dist = angularDistance(transit.longitude, natal.longitude);
      for (const aspect of ASPECTS) {
        const diff = Math.abs(dist - aspect.angle);
        if (diff <= aspect.orb) {
          results.push({
            aspect,
            transit,
            natal,
            orb: diff,
            exact: diff < 1,
          });
        }
      }
    }
  }
  // Sort by exactness — tightest orbs first
  results.sort((a, b) => a.orb - b.orb);
  return results;
}

/**
 * Moon phase for a given Julian day.
 * Returns { phase (0-1), name, illumination (0-1) }.
 * Phase: 0 = new moon, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter.
 */
export function getMoonPhase(jd) {
  const sunLon = getEclipticLongitude('sun', jd);
  const moonLon = getEclipticLongitude('moon', jd);
  // Elongation: moon's angular distance from sun, 0-360
  let elongation = (moonLon - sunLon + 360) % 360;
  const phase = elongation / 360;
  const illumination = (1 - Math.cos((elongation * Math.PI) / 180)) / 2;

  let name;
  if (phase < 0.03 || phase >= 0.97) name = 'New Moon';
  else if (phase < 0.22) name = 'Waxing Crescent';
  else if (phase < 0.28) name = 'First Quarter';
  else if (phase < 0.47) name = 'Waxing Gibbous';
  else if (phase < 0.53) name = 'Full Moon';
  else if (phase < 0.72) name = 'Waning Gibbous';
  else if (phase < 0.78) name = 'Last Quarter';
  else name = 'Waning Crescent';

  return { phase, name, illumination, elongation };
}
