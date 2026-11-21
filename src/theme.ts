import type { DetectionClass, Provenance } from './domain/types';

// Road-survey instrument palette: asphalt neutrals + road-marking amber.
// Amber is reserved for the primary action and active state only.
export const color = {
  bg: '#0F1113',
  surface: '#181B1E',
  surfaceRaised: '#202428',
  line: '#2A2F34',
  text: '#ECE9E2',
  textMuted: '#9AA0A6',
  textFaint: '#666C73',
  accent: '#F2B632',
  accentInk: '#1C1504',
  danger: '#E5654B',
  ok: '#62B882',
  info: '#7FB0D6',
  teal: '#6FA8A3',
} as const;

export const classColor: Record<DetectionClass, string> = {
  pothole: color.danger,
  patch: '#B98D5E',
  manhole_cover: color.info,
  drain_cover: color.teal,
  speed_bump: '#CFC072',
  crack: '#A994C8',
  puddle: '#7C93A8',
  shadow: '#7D838A',
};

export const provenanceColor: Record<Provenance, string> = {
  measured: color.ok,
  estimate: color.accent,
  assumption: color.info,
  price: color.teal,
  unavailable: color.textFaint,
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 6, md: 10, lg: 14 } as const;

export const font = {
  mono: 'Menlo',
} as const;

export const type = {
  caption: { fontSize: 12, lineHeight: 16 },
  footnote: { fontSize: 13, lineHeight: 18 },
  body: { fontSize: 16, lineHeight: 22 },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
  label: { fontSize: 11, lineHeight: 14, fontWeight: '600' as const, letterSpacing: 0.8, textTransform: 'uppercase' as const },
} as const;
