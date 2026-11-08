export interface SrtCue {
  startSeconds: number;
  endSeconds: number;
  text: string;
}

export interface MotionMedia {
  mp4: string;
  webm: string;
  poster: string;
}

export function parseTimestamp(raw: string): number {
  const match = raw.trim().match(/^(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})$/);
  if (!match) {
    throw new Error(`Couldn't read "${raw}" as an SRT timestamp.`);
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  const fraction = match[4].padEnd(3, '0');
  return hours * 3600 + minutes * 60 + seconds + Number(fraction) / 1000;
}

export function parseSrt(raw: string): SrtCue[] {
  const blocks = raw.replace(/^\uFEFF/, '').trim().split(/\n\s*\n/);
  const cues: SrtCue[] = [];
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) continue;
    const timed = lines[0].includes('-->') ? lines[0] : lines[1];
    const textLines = lines[0].includes('-->') ? lines.slice(1) : lines.slice(2);
    const parts = timed.split('-->');
    if (parts.length !== 2) {
      throw new Error(`Couldn't read this SRT cue:\n${block}`);
    }
    const text = textLines.join(' ').replace(/<[^>]+>/g, '').trim();
    if (!text) continue;
    cues.push({
      startSeconds: parseTimestamp(parts[0]),
      endSeconds: parseTimestamp(parts[1].trim().split(/\s+/)[0]),
      text,
    });
  }
  return cues;
}

export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}

export function cutSeconds(durationSeconds: number): 45 | 90 {
  return durationSeconds <= 45 ? 45 : 90;
}

export function mediaFromSrc(src: string): MotionMedia {
  const base = src.replace(/\.(mp4|webm)$/i, '');
  return {
    mp4: `${base}.mp4`,
    webm: `${base}.webm`,
    poster: `${base}-poster.png`,
  };
}

export function publicFilePath(urlPath: string): string {
  return urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
}
