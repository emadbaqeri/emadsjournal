export const TRACKS = {
  cs: { id: 'cs', glyph: 'λ', label: 'cs' },
  security: { id: 'security', glyph: '§', label: 'sec' },
} as const;

export type TrackId = keyof typeof TRACKS;

export function getTrack(id: TrackId) {
  return TRACKS[id];
}
