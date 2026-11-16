import type { Post } from './content';

export const POST_TYPE_LABELS: Record<Post['data']['type'], string> = {
  'series-post': 'SERIES',
  til: 'TIL',
  essay: 'ESSAY',
  'build-log': 'BUILD LOG',
};

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Calendar date as `Nov 05`. UTC so a date-only frontmatter value does not shift a day. */
export function formatShortDate(date: Date): string {
  const month = SHORT_MONTHS[date.getUTCMonth()] ?? '';
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${month} ${day}`;
}

export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

export function formatMonth(date: Date): string {
  return date.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
}

export function readingTimeMinutes(source: string): number {
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function groupPostsByMonth<T extends { data: { publishedAt: Date } }>(
  posts: T[],
): { month: string; posts: T[] }[] {
  const groups: { month: string; posts: T[] }[] = [];
  for (const post of posts) {
    const month = formatMonth(post.data.publishedAt);
    const last = groups[groups.length - 1];
    if (last && last.month === month) last.posts.push(post);
    else groups.push({ month, posts: [post] });
  }
  return groups;
}
