import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const track = z.enum(['cs', 'security']);
const postType = z.enum(['series-post', 'til', 'essay', 'build-log']);

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        type: postType,
        track,
        publishedAt: z.coerce.date(),
        updatedAt: z.coerce.date().optional(),
        draft: z.boolean().default(false),
        tags: z.array(z.string()).default([]),
        hero: image().optional(),
        series: reference('series').optional(),
        seriesOrder: z.number().int().positive().optional(),
        motion: z
          .object({
            src: z.string(),
            srtPath: z.string(),
            durationSeconds: z.number().positive(),
            caption: z.string(),
          })
          .optional(),
        demoIsConceptual: z.boolean().optional(),
      })
      .refine((p) => p.type !== 'series-post' || (p.series && p.seriesOrder), {
        message: 'series-post requires series + seriesOrder',
      })
      .refine((p) => p.track !== 'security' || p.demoIsConceptual !== false, {
        message: 'security content cannot set demoIsConceptual: false',
      }),
});

const series = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    track,
    status: z.enum(['ongoing', 'completed']).default('ongoing'),
  }),
});

const algorithms = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/algorithms' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    track: z.literal('cs'),
    publishedAt: z.coerce.date(),
    draft: z.boolean().default(false),
    viz: z.string(),
    listInFeed: z.boolean().default(false),
    relatedPosts: z.array(reference('posts')).default([]),
    series: reference('series').optional(),
    seriesOrder: z.number().int().positive().optional(),
  }),
});

export const collections = { posts, series, algorithms };
