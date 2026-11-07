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

export function getPostPath(post: Post): string {
  return `/posts/${post.id}`;
}

export function getAlgorithmPath(algorithm: Algorithm): string {
  return `/algorithms/${algorithm.id}`;
}

export function getSeriesPath(series: SeriesEntry): string {
  return `/series/${series.id}`;
}
