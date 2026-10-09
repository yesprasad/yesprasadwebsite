import rss from '@astrojs/rss';
import { getPosts } from '../lib/content';
import { site } from '../data/site';

export async function GET(context) {
  const posts = (await getPosts()).filter((p) => !p.data.draft);
  return rss({
    title: site.brand,
    description: site.description,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.summary,
      categories: p.data.tags,
      link: `/writing/${p.id}/`,
    })),
  });
}
