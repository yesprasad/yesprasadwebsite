import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Articles: essays, engineering lab posts, field notes and personal "margins".
const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      section: z.enum(['essay', 'lab', 'notes', 'margins']),
      tags: z.array(z.string()).default([]),
      summary: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      cover: image().optional(),
      youtube: z.string().optional(), // YouTube video id shown at the top of the article
      series: z.string().optional(), // id of a file in src/content/series/, e.g. "rag-from-scratch"
      part: z.number().int().min(0).optional(), // order within the series; 0 shows as "Prologue"
    }),
});

// Series: a curated reading path through several articles. The body is the series intro.
const series = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    order: z.number().default(99),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    next: z.object({ label: z.string(), text: z.string(), url: z.string() }).optional(),
  }),
});

// Flagship platforms (Fluent-Graph, deep-graph, ...).
const platforms = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/platforms' }),
  schema: z.object({
    name: z.string(),
    kicker: z.string(),
    tagline: z.string(),
    since: z.string(),
    order: z.number().default(99),
    command: z.string().optional(),
    stack: z.string().optional(),
    features: z.array(z.string()).default([]),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    caseStudy: z.string().optional(), // slug of a writing entry
  }),
});

// Paper notes: papers by other people that I've read, with my take.
// One file per paper in src/content/paper-notes/, e.g. meta-harness.md:
//   ---
//   title: "Meta-Harness: End-to-End Optimization of Model Harnesses"
//   authors: "Yoonho Lee et al."
//   venue: arXiv            # or a conference/journal name
//   year: 2026
//   url: https://arxiv.org/abs/2603.28052
//   topics: [Agents, Evaluation]
//   read: 2026-09-15        # when I read it
//   keyIdea: "One or two sentences on the paper's main idea."
//   related: { label: "Fluent-Graph", url: "/platforms/" }   # optional
//   ---
//   My take: why it matters and how it connects to my work (the body).
const paperNotes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/paper-notes' }),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    year: z.number().int(),
    url: z.string(),
    topics: z.array(z.string()).default([]),
    read: z.coerce.date(),
    keyIdea: z.string(),
    related: z.object({ label: z.string(), url: z.string() }).optional(),
  }),
});

// Papers, whitepapers, technical reports.
const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['paper', 'report']),
    label: z.string(), // e.g. "Position paper"
    authors: z.array(z.string()),
    shortAuthors: z.string(),
    venue: z.string(),
    date: z.coerce.date(),
    doi: z.string().optional(),
    pdf: z.string().optional(),
    url: z.string().optional(),
    bibtex: z.string().optional(),
  }),
});

// Conference talks and lightning sessions. Past/upcoming is decided by date at build time.
const talks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/talks' }),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: z.coerce.date(),
    dateLabel: z.string().optional(), // e.g. "Jul 2026" when the exact day isn't public
    format: z.string(),
    location: z.string().optional(),
    time: z.string().optional(),
    oneLiner: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
  }),
});

// Industry leadership: judging, speaking and award albums with photos.
const leadership = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/leadership' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      role: z.enum(['Judge', 'Speaker', 'Winner', 'Mentor']),
      category: z.enum(['judging', 'speaking', 'awards']),
      date: z.coerce.date(),
      dateLabel: z.string(),
      location: z.string().optional(),
      featured: z.boolean().default(false),
      facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      related: z.object({ label: z.string(), url: z.string() }).optional(),
      photos: z.array(z.object({ src: image(), caption: z.string() })).default([]),
    }),
});

export const collections = { writing, series, platforms, research, paperNotes, talks, leadership };
