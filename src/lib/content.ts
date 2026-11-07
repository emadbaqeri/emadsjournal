import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type SeriesEntry = CollectionEntry<'series'>;
export type Algorithm = CollectionEntry<'algorithms'>;

function byPublishedAtDesc<T extends { data: { publishedAt: Date } }>(
  a: T,
  b: T,
): number {
  return b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
}

export async function getPosts(
  options: { includeDrafts?: boolean } = {},
): Promise<Post[]> {
  const includeDrafts = options.includeDrafts ?? !import.meta.env.PROD;
  const posts = await getCollection(
    'posts',
    ({ data }) => includeDrafts || !data.draft,
  );
  return posts.sort(byPublishedAtDesc);
}

export async function getFeedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort(byPublishedAtDesc);
}

export async function getAlgorithms(
  options: { includeDrafts?: boolean } = {},
): Promise<Algorithm[]> {
  const includeDrafts = options.includeDrafts ?? !import.meta.env.PROD;
  const algorithms = await getCollection(
    'algorithms',
    ({ data }) => includeDrafts || !data.draft,
  );
  return algorithms.sort(byPublishedAtDesc);
}

export async function getSeriesEntries(): Promise<SeriesEntry[]> {
  return getCollection('series');
}

export async function getPostsInSeries(seriesId: string): Promise<Post[]> {
  const posts = await getFeedPosts();
  return posts
    .filter((post) => post.data.series?.id === seriesId)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}

export async function getPostsByType(
  type: Post['data']['type'],
): Promise<Post[]> {
  return (await getFeedPosts()).filter((post) => post.data.type === type);
}

export async function getMoreTils(current: Post, limit = 3): Promise<Post[]> {
  return (await getPostsByType('til'))
    .filter((post) => post.id !== current.id)
    .slice(0, limit);
}

export async function getFeaturedSeries(): Promise<{
  series: SeriesEntry;
  parts: Post[];
} | null> {
  const all = await getSeriesEntries();
  let best: { series: SeriesEntry; parts: Post[]; latest: number } | null =
    null;
  for (const series of all) {
    if (series.data.status !== 'ongoing') continue;
    const parts = await getPostsInSeries(series.id);
    if (parts.length === 0) continue;
    const latest = Math.max(
      ...parts.map((part) => part.data.publishedAt.valueOf()),
    );
    if (!best || latest > best.latest) best = { series, parts, latest };
  }
  return best ? { series: best.series, parts: best.parts } : null;
}

export function uniqueTags(posts: Post[]): string[] {
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

export function getPostPath(post: Post): string {
  return `/posts/${post.id}`;
}

export function getAlgorithmPath(algorithm: Algorithm): string {
  return `/algorithms/${algorithm.id}`;
}

export function getSeriesPath(series: SeriesEntry): string {
  return `/series/${series.id}`;
}
