export interface OrderedPart {
  id: string;
  order?: number;
}

/** One ordered list for the series index and the post "n / N" rail. */
export function seriesParts<T extends OrderedPart>(posts: T[], algorithms: T[]): T[] {
  return [...posts, ...algorithms].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
