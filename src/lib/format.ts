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
