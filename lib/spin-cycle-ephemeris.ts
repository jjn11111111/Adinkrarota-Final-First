import * as Astronomy from "astronomy-engine";

const ZODIAC = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export type ZodiacName = (typeof ZODIAC)[number];

export interface PlanetLongitudeRow {
  name: string;
  longitudeDeg: number;
  sign: ZodiacName;
  degreeInSign: number;
  retrograde: boolean;
}

export interface AspectRow {
  from: string;
  to: string;
  aspect: "Conjunction" | "Sextile" | "Square" | "Trine" | "Opposition";
  orb: number;
}

function norm360(lon: number): number {
  let x = lon % 360;
  if (x < 0) x += 360;
  return x;
}

function signFromLongitude(lon: number): { sign: ZodiacName; degreeInSign: number } {
  const L = norm360(lon);
  const idx = Math.min(11, Math.floor(L / 30));
  return { sign: ZODIAC[idx], degreeInSign: L - idx * 30 };
}

function eclipticLongitudeGeocentric(body: Astronomy.Body, date: Date): number {
  if (body === Astronomy.Body.Sun) {
    return Astronomy.SunPosition(date).elon;
  }
  const v = Astronomy.GeoVector(body, date, true);
  return Astronomy.Ecliptic(v).elon;
}

/** Short-term longitude change; negative ⇒ apparent retrograde (meaningless for Sun). */
function isRetrograde(body: Astronomy.Body, date: Date): boolean {
  if (body === Astronomy.Body.Sun || body === Astronomy.Body.Moon) return false;
  const t0 = date.getTime();
  const lon0 = norm360(eclipticLongitudeGeocentric(body, new Date(t0)));
  const lon1 = norm360(eclipticLongitudeGeocentric(body, new Date(t0 + 36 * 3600 * 1000)));
  let delta = lon1 - lon0;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta < 0;
}

const ROW_BODIES: { name: string; body: Astronomy.Body }[] = [
  { name: "Sun", body: Astronomy.Body.Sun },
  { name: "Moon", body: Astronomy.Body.Moon },
  { name: "Mercury", body: Astronomy.Body.Mercury },
  { name: "Venus", body: Astronomy.Body.Venus },
  { name: "Mars", body: Astronomy.Body.Mars },
  { name: "Jupiter", body: Astronomy.Body.Jupiter },
  { name: "Saturn", body: Astronomy.Body.Saturn },
  { name: "Uranus", body: Astronomy.Body.Uranus },
  { name: "Neptune", body: Astronomy.Body.Neptune },
  { name: "Pluto", body: Astronomy.Body.Pluto },
];

export function computePlanetRows(date: Date): PlanetLongitudeRow[] {
  return ROW_BODIES.map(({ name, body }) => {
    const longitudeDeg = norm360(eclipticLongitudeGeocentric(body, date));
    const { sign, degreeInSign } = signFromLongitude(longitudeDeg);
    return {
      name,
      longitudeDeg,
      sign,
      degreeInSign,
      retrograde: isRetrograde(body, date),
    };
  });
}

export function formatEphemerisBlock(label: string, date: Date, rows: PlanetLongitudeRow[]): string {
  const iso = date.toISOString();
  const lines = rows.map(
    (r) =>
      `  ${r.name}: ${r.sign} ${r.degreeInSign.toFixed(1)}°${r.retrograde ? " Rx" : ""} (${r.longitudeDeg.toFixed(2)}°)`,
  );
  return `[${label} — tropical, geocentric — ${iso}]\n${lines.join("\n")}`;
}

function shortestAngleDistance(a: number, b: number): number {
  let d = Math.abs(a - b) % 360;
  if (d > 180) d = 360 - d;
  return d;
}

const ASPECTS: { name: AspectRow["aspect"]; degrees: number; orb: number }[] = [
  { name: "Conjunction", degrees: 0, orb: 6 },
  { name: "Sextile", degrees: 60, orb: 4 },
  { name: "Square", degrees: 90, orb: 5 },
  { name: "Trine", degrees: 120, orb: 5 },
  { name: "Opposition", degrees: 180, orb: 6 },
];

export function computeCrossAspects(
  leftRows: PlanetLongitudeRow[],
  rightRows: PlanetLongitudeRow[],
): AspectRow[] {
  const out: AspectRow[] = [];
  for (const l of leftRows) {
    for (const r of rightRows) {
      const d = shortestAngleDistance(l.longitudeDeg, r.longitudeDeg);
      for (const a of ASPECTS) {
        const orb = Math.abs(d - a.degrees);
        if (orb <= a.orb) {
          out.push({
            from: l.name,
            to: r.name,
            aspect: a.name,
            orb,
          });
          break;
        }
      }
    }
  }
  return out.sort((x, y) => x.orb - y.orb);
}

export function formatAspectBlock(label: string, aspects: AspectRow[]): string {
  if (aspects.length === 0) {
    return `[${label}]\n  (No major aspects found within configured orbs.)`;
  }
  const lines = aspects.slice(0, 24).map(
    (a) => `  ${a.from} ${a.aspect} ${a.to} (orb ${a.orb.toFixed(1)}°)`,
  );
  return `[${label}]\n${lines.join("\n")}`;
}
