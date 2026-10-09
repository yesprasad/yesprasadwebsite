import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'writing'>;

// Drafts show while running `npm run dev`, never in the production build.
export async function getPosts(opts: { includeMargins?: boolean } = {}) {
  const posts = await getCollection('writing', ({ data }) => {
    if (data.draft && !import.meta.env.DEV) return false;
    if (data.section === 'margins' && !opts.includeMargins) return false;
    return true;
  });
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getTalks() {
  const now = Date.now();
  const all = await getCollection('talks');
  const upcoming = all.filter((t) => t.data.date.valueOf() >= now).sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  const past = all.filter((t) => t.data.date.valueOf() < now).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return { upcoming, past, all };
}

export async function getPlatforms() {
  return (await getCollection('platforms')).sort((a, b) => a.data.order - b.data.order);
}

export async function getResearch() {
  return (await getCollection('research')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getLeadership() {
  return (await getCollection('leadership')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', { timeZone: 'UTC', ...o });
export const monthYear = (d: Date) => fmt(d, { month: 'short', year: 'numeric' });
export const monthDay = (d: Date) => fmt(d, { month: 'short', day: '2-digit' });
export const fullDate = (d: Date) => fmt(d, { month: 'short', day: 'numeric', year: 'numeric' });
export const day = (d: Date) => fmt(d, { day: 'numeric' });
export const monthShort = (d: Date) => fmt(d, { month: 'short' });
export const year = (d: Date) => d.getUTCFullYear();

export const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function readingTime(body = '') {
  const words = body.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
