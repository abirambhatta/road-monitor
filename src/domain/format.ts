import type { DetectionClass, GeoPoint, Provenance, Quantity, SurfaceType } from './types';

export const CLASS_LABEL: Record<DetectionClass, string> = {
  pothole: 'Pothole',
  patch: 'Patch / repair',
  manhole_cover: 'Manhole cover',
  drain_cover: 'Drain cover',
  speed_bump: 'Speed bump',
  crack: 'Crack',
  puddle: 'Puddle',
  shadow: 'Shadow',
};

export const SURFACE_LABEL: Record<SurfaceType, string> = {
  asphalt: 'Asphalt',
  concrete: 'Concrete',
  gravel: 'Gravel',
  earth: 'Unpaved / earth',
  unknown: 'Unknown',
};

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  measured: 'Measured',
  estimate: 'Model estimate',
  assumption: 'Assumption',
  price: 'Price input',
  unavailable: 'Not available',
};

export const isPothole = (cls: DetectionClass) => cls === 'pothole';

export function formatPercent(fraction: number | null): string {
  if (fraction == null) return '—';
  return `${Math.round(fraction * 100)}%`;
}

/** 27.71720° N, 85.32400° E */
export function formatCoord(p: GeoPoint): string {
  const lat = `${Math.abs(p.latitude).toFixed(5)}° ${p.latitude >= 0 ? 'N' : 'S'}`;
  const lon = `${Math.abs(p.longitude).toFixed(5)}° ${p.longitude >= 0 ? 'E' : 'W'}`;
  return `${lat}, ${lon}`;
}

export function formatQuantity(q: Quantity): string {
  if (q.value == null) return 'Not available';
  const digits = q.unit === 'm³' ? 4 : q.unit === 'NPR' ? 0 : 2;
  const v = q.value.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
  return q.unit === 'NPR' ? `NPR ${v}` : `${v} ${q.unit}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Great-circle distance in metres (haversine). */
export function distanceM(a: GeoPoint, b: GeoPoint): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function googleMapsUrl(p: GeoPoint): string {
  return `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`;
}
