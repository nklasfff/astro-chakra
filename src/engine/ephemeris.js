// Core astronomical time utilities — Julian day and time conversions.
// Based on Jean Meeus, "Astronomical Algorithms" (1998), chapter 7.

/**
 * Compute Julian Day from a UTC date.
 * Accepts individual time components or a Date object.
 */
export function julianDay(year, month, day, hour = 0, minute = 0, second = 0) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const dayFrac = day + (hour + minute / 60 + second / 3600) / 24;
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    dayFrac +
    b -
    1524.5
  );
}

export function julianDayFromDate(date) {
  return julianDay(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

/** Days since J2000.0 (2000 Jan 1.5 UT) — handy for Schlyter-style formulas. */
export function daysSinceJ2000(jd) {
  return jd - 2451545.0;
}

/** Julian centuries since J2000.0 — used in Meeus formulas. */
export function julianCenturies(jd) {
  return (jd - 2451545.0) / 36525.0;
}

/** Normalize an angle to 0-360 degrees. */
export function normalize360(angle) {
  return ((angle % 360) + 360) % 360;
}

/** Degree → radian. */
export function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

/** Radian → degree. */
export function toDegrees(rad) {
  return (rad * 180) / Math.PI;
}

/** Solve Kepler's equation E - e·sin(E) = M for E (all angles in radians). */
export function solveKepler(M, e, tolerance = 1e-8, maxIter = 20) {
  let E = M + e * Math.sin(M) * (1 + e * Math.cos(M));
  for (let i = 0; i < maxIter; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < tolerance) break;
  }
  return E;
}
