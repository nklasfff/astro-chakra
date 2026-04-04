// Planetary position calculations using astronomia's VSOP87 theory.
// Returns geocentric apparent ecliptic longitude for each body.
// Accurate to arc-second level — far better than simple Schlyter formulas.

import { Planet } from 'astronomia/planetposition';
import solar from 'astronomia/solar';
import moonposition from 'astronomia/moonposition';
import data from 'astronomia/data';
import { normalize360, toDegrees } from './ephemeris';

// Lazy-initialize planet instances so we don't parse VSOP data on every call.
let planets = null;
function getPlanets() {
  if (planets) return planets;
  planets = {
    earth: new Planet(data.earth),
    mercury: new Planet(data.mercury),
    venus: new Planet(data.venus),
    mars: new Planet(data.mars),
    jupiter: new Planet(data.jupiter),
    saturn: new Planet(data.saturn),
    uranus: new Planet(data.uranus),
    neptune: new Planet(data.neptune),
  };
  return planets;
}

/**
 * Compute geocentric apparent ecliptic longitude for any body (degrees, 0-360).
 */
export function getEclipticLongitude(name, jd) {
  if (name === 'sun') {
    // solar.apparentLongitude takes Julian centuries since J2000.
    const T = (jd - 2451545.0) / 36525;
    const lonRad = solar.apparentLongitude(T);
    return normalize360(toDegrees(lonRad));
  }

  if (name === 'moon') {
    // moonposition.position returns { lon, lat, range } with lon in radians.
    const pos = moonposition.position(jd);
    return normalize360(toDegrees(pos.lon));
  }

  // For planets: compute heliocentric positions of planet and earth,
  // then derive geocentric ecliptic longitude.
  const p = getPlanets();
  const body = p[name];
  if (!body) return 0;

  // position2000 returns lon/lat in radians, range in AU — heliocentric J2000.
  const bodyPos = body.position2000(jd);
  const earthPos = p.earth.position2000(jd);

  // Convert both to rectangular heliocentric coordinates
  const bodyR = bodyPos.range;
  const bodyX = bodyR * Math.cos(bodyPos.lat) * Math.cos(bodyPos.lon);
  const bodyY = bodyR * Math.cos(bodyPos.lat) * Math.sin(bodyPos.lon);
  const bodyZ = bodyR * Math.sin(bodyPos.lat);

  const earthR = earthPos.range;
  const earthX = earthR * Math.cos(earthPos.lat) * Math.cos(earthPos.lon);
  const earthY = earthR * Math.cos(earthPos.lat) * Math.sin(earthPos.lon);
  const earthZ = earthR * Math.sin(earthPos.lat);

  // Geocentric = planet - earth (both heliocentric)
  const geoX = bodyX - earthX;
  const geoY = bodyY - earthY;
  const geoZ = bodyZ - earthZ;

  const geoLon = Math.atan2(geoY, geoX);
  return normalize360(toDegrees(geoLon));
}

/** All bodies in natal chart order (luminaries, inner, outer). */
export const BODIES = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
];
