#!/usr/bin/env node
// Imports posts from the old Blogger blogs into src/content/writing/.
//
//   node scripts/import-blogger.mjs plan     → fetches all blogs, writes scripts/import/manifest.csv for review
//   node scripts/import-blogger.mjs import   → converts every row marked "import" in manifest.csv
//                                              (posts that already exist are left alone; add --force to overwrite)
//
// Edit manifest.csv (Numbers / Excel / any editor) between the two steps:
//   action  = import | skip
//   section = essay | lab | notes | margins
//   tags    = comma-separated, e.g. "Node.js, Testing"
// Running "plan" again keeps your edits for rows that already exist.

import fs from 'node:fs/promises';
import path from 'node:path';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const BLOGS = [
  { id: 'nodejseveryday', host: 'nodejseveryday.blogspot.com' },
  { id: 'eshwartechtalks', host: 'eshwartechtalks.blogspot.com' },
  { id: 'yes-prasad', host: 'yes-prasad.blogspot.com' },
];

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const WORK = path.join(ROOT, 'scripts/import');
const CACHE = path.join(WORK, 'cache');
const MANIFEST = path.join(WORK, 'manifest.csv');
const OUT = path.join(ROOT, 'src/content/writing');
const COLUMNS = ['id', 'action', 'section', 'date', 'title', 'tags', 'words', 'flags', 'url'];

// ---------- Fetching ----------

async function fetchBlog(blog) {
  const cacheFile = path.join(CACHE, `${blog.id}.json`);
  try {
    return JSON.parse(await fs.readFile(cacheFile, 'utf8'));
  } catch {}
  const entries = [];
  for (let start = 1; ; start += 150) {
    const url = `https://${blog.host}/feeds/posts/default?alt=json&max-results=150&start-index=${start}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
    const feed = (await res.json()).feed;
    const page = feed.entry ?? [];
    entries.push(...page);
    if (page.length < 150) break;
  }
  await fs.mkdir(CACHE, { recursive: true });
  await fs.writeFile(cacheFile, JSON.stringify(entries));
  return entries;
}

function toPost(blog, e) {
  const url = (e.link ?? []).find((l) => l.rel === 'alternate')?.href ?? '';
  const html = e.content?.$t ?? e.summary?.$t ?? '';
  const text = html.replace(/<(style|script)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
  const slug = (url.split('/').pop() ?? '').replace(/\.html$/, '') || slugify(e.title.$t);
  return {
    id: `${blog.id}/${slug}`,
    blog: blog.id,
    slug,
    url,
    title: decode(e.title.$t).trim(),
    date: e.published.$t,
    updated: e.updated?.$t,
    labels: (e.category ?? []).map((c) => c.term),
    html,
    words: text.split(/\s+/).filter(Boolean).length,
    hasStyle: /<style|<script(?![^>]*gist)/i.test(html),
    images: (html.match(/<img/gi) ?? []).length,
    gists: (html.match(/gist\.github\.com\/[^"']+\.js/gi) ?? []).length,
  };
}

// ---------- Suggestions ----------

const TAG_ALIASES = [
  [/^node(\.?js)?( |$)|nodejs|node weekly|nodejseveryday weekly|nodejs articles/i, 'Node.js'],
  [/mocha|chai|unit testing|tdd|bdd/i, 'Testing'],
  [/^es6|let keyword|var keyword|const/i, 'ES6'],
  [/javascript|closures|isnan|json\.parse|referenceerror|string literals|array\.from/i, 'JavaScript'],
  [/event ?loop/i, 'Event Loop'],
  [/ramda|functional programming/i, 'Functional Programming'],
  [/docker|containers/i, 'Docker'],
  [/^rag$/i, 'RAG'],
  [/^llm$/i, 'LLM'],
  [/^ai$|aiagents/i, 'AI'],
  [/fluent-?graph|featured project/i, 'Fluent-Graph'],
  [/servicenow/i, 'ServiceNow'],
  [/angular/i, 'Angular'],
  [/heroku/i, 'Heroku'],
  [/sql server|varchar/i, 'SQL Server'],
  [/sort/i, 'Algorithms'],
  [/python/i, 'Python'],
  [/agile|scrum|stand ?up|waterfall|development methodology/i, 'Agile'],
  [/^c#$|dotnet|asp\.net|linq/i, '.NET'],
  [/mongo|no ?sql/i, 'MongoDB'],
  [/elasticsearch/i, 'Elasticsearch'],
  [/android|mobile apps/i, 'Android'],
  [/clean code|coding standards|lets make our code talk/i, 'Clean Code'],
  [/html5|css3|jquery|localstorage/i, 'Web'],
  [/iot|internet of things|home automation|car automation/i, 'IoT'],
  [/vs ?code|software tools/i, 'Tools'],
  [/git(hub)?$/i, 'Git'],
  [/entrepreneur/i, 'Entrepreneurship'],
  [/rest(ful)?|noderestapi/i, 'REST APIs'],
];
// News, giveaways and filler that don't fit the brand. Suggested "skip"; you can override in the CSV.
const OFF_BRAND = /oneplus|give ?away|linkedin new look|facebook "hello"|flipkart|mobile friendly|i gussed it right|bing has code|^disclaimer$|^introduction post$|11 years of blogging|instant calculator|coming up$|random code snippets/i;
const DROP_TAGS = /yaddanapudi|eshwar|nodejseveryday$|programmer|^code$|blogging|offtopic|^handson$/i;

function cleanTags(labels, title) {
  const out = new Set();
  for (const raw of [...labels, title]) {
    if (DROP_TAGS.test(raw)) continue;
    for (const [re, tag] of TAG_ALIASES) if (re.test(raw)) out.add(tag);
  }
  return [...out].slice(0, 5);
}

function suggestSection(p) {
  const t = `${p.title} ${p.labels.join(' ')}`.toLowerCase();
  if (p.blog === 'yes-prasad') return 'notes';
  if (/\b(cto|why|what i (actually )?learned|lessons|tutorials don't|agentic rag|semantic intelligence|position)\b/.test(t)) return 'essay';
  if (/agile|scrum|stand ?up|waterfall|managementarticles|passion|compassion|video tutorials|thank|social media/.test(t)) return 'notes';
  return 'lab';
}

function flagsFor(p) {
  const f = [];
  if (p.hasStyle) f.push('custom-styling');
  if (p.words < 80) f.push('very-short');
  if (p.images) f.push(`${p.images}-images`);
  if (/youtube\.com\/embed|youtu\.be/.test(p.html)) f.push('video');
  if (p.gists) f.push(`${p.gists}-gist-code`);
  if (OFF_BRAND.test(p.title)) f.push('off-brand');
  return f;
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\b(in|the|a|an|and|of|to|keyword|keywords|vs|with|when|used|is)\b/g, ' ').split(/\s+/).filter(Boolean);
function similar(a, b) {
  const A = new Set(norm(a)), B = new Set(norm(b));
  const inter = [...A].filter((x) => B.has(x)).length;
  return inter / Math.max(1, Math.min(A.size, B.size));
}

// ---------- CSV ----------

const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((c) => c.trim()));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

// ---------- Plan ----------

async function plan() {
  const posts = [];
  for (const blog of BLOGS) {
    const entries = await fetchBlog(blog);
    posts.push(...entries.map((e) => toPost(blog, e)));
    console.log(`${blog.host}: ${entries.length} posts`);
  }
  posts.sort((a, b) => a.date.localeCompare(b.date));

  // Duplicates across blogs: keep the copy with more content (gist code counts); on a tie keep the earliest.
  const weight = (p) => p.words + p.gists * 100 + p.images * 10;
  for (let i = 0; i < posts.length; i++) {
    for (let j = 0; j < i; j++) {
      const a = posts[j], b = posts[i];
      if (a.duplicateOf || b.duplicateOf || a.blog === b.blog || similar(a.title, b.title) < 0.75) continue;
      if (weight(b) > weight(a)) a.duplicateOf = b.id; else b.duplicateOf = a.id;
    }
  }

  let previous = new Map();
  try {
    previous = new Map(parseCsv(await fs.readFile(MANIFEST, 'utf8')).map((r) => [r.id, r]));
  } catch {}

  const rows = posts.map((p) => {
    const flags = flagsFor(p);
    if (p.duplicateOf) flags.push(`duplicate-of:${p.duplicateOf}`);
    const suggestedSkip = p.duplicateOf || OFF_BRAND.test(p.title) || (p.words < 40 && !p.gists && !/youtube/.test(p.html));
    const prev = previous.get(p.id);
    return {
      id: p.id,
      action: prev?.action || (suggestedSkip ? 'skip' : 'import'),
      section: prev?.section || suggestSection(p),
      date: p.date.slice(0, 10),
      title: p.title,
      tags: prev?.tags ?? cleanTags(p.labels, p.title).join(', '),
      words: p.words,
      flags: flags.join(' '),
      url: p.url,
    };
  });

  await fs.mkdir(WORK, { recursive: true });
  await fs.writeFile(MANIFEST, [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(','))].join('\n') + '\n');

  const count = (k, v) => rows.filter((r) => r[k] === v).length;
  console.log(`\n${rows.length} posts → ${count('action', 'import')} import, ${count('action', 'skip')} skip`);
  console.log(`sections: essay ${count('section', 'essay')}, lab ${count('section', 'lab')}, notes ${count('section', 'notes')}`);
  console.log(`\nReview and edit: ${path.relative(ROOT, MANIFEST)}`);
}

// ---------- Import ----------

function slugify(s) {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}
function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#039;/g, "'").replace(/&nbsp;/g, ' ');
}

function guessLang(cls, code) {
  const m = /(?:brush:\s*|language-|lang-)([\w#+-]+)/i.exec(cls ?? '');
  if (m) return { jscript: 'js', javascript: 'js', csharp: 'csharp', 'c#': 'csharp', shell: 'bash', sh: 'bash', xml: 'html', plain: 'text' }[m[1].toLowerCase()] ?? m[1].toLowerCase();
  if (/^\s*(\$ |npm |npx |docker |git |cd |curl |sudo )/m.test(code)) return 'bash';
  if (/\b(def |import \w+$|print\(|self\.)/m.test(code)) return 'python';
  if (/\b(public|private) (static )?(void|class|string|int)\b|using System/.test(code)) return 'csharp';
  if (/\b(SELECT|INSERT|CREATE TABLE|UPDATE)\b/.test(code)) return 'sql';
  if (/\b(const|let|var|function|require\(|=>|console\.log)\b/.test(code)) return 'js';
  if (/^\s*[{[]/.test(code) && /"\w+"\s*:/.test(code)) return 'json';
  if (/<\/?[a-z][\s\S]*>/i.test(code)) return 'html';
  return '';
}

function makeTurndown() {
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-', emDelimiter: '*' });
  td.use(gfm);
  td.remove(['style', 'script', 'link', 'meta', 'noscript']);
  td.addRule('pre', {
    filter: (n) => n.nodeName === 'PRE',
    replacement: (_c, node) => {
      const code = decode((node.textContent ?? '').replace(/ /g, ' ')).replace(/\n+$/, '');
      const cls = `${node.getAttribute('class') ?? ''} ${node.querySelector?.('code')?.getAttribute('class') ?? ''}`;
      return `\n\n\`\`\`${guessLang(cls, code)}\n${code}\n\`\`\`\n\n`;
    },
  });
  td.addRule('iframe', {
    filter: 'iframe',
    replacement: (_c, node) => {
      const src = node.getAttribute('src') ?? '';
      return src ? `\n\n[Embedded content](${src.startsWith('//') ? 'https:' + src : src})\n\n` : '';
    },
  });
  return td;
}

// Replaces a GitHub Gist <script> embed with the gist's files as fenced code blocks.
async function fetchGist(src) {
  const m = /gist\.github\.com\/(?:[\w-]+\/)?([0-9a-f]+)\.js(?:\?file=([^"'&]+))?/i.exec(src);
  if (!m) return null;
  const cacheFile = path.join(CACHE, `gist-${m[1]}.json`);
  let gist;
  try {
    gist = JSON.parse(await fs.readFile(cacheFile, 'utf8'));
  } catch {
    const res = await fetch(`https://api.github.com/gists/${m[1]}`, { headers: { 'User-Agent': 'yesprasad-importer' } });
    if (!res.ok) return null;
    gist = await res.json();
    await fs.writeFile(cacheFile, JSON.stringify(gist));
  }
  const files = Object.values(gist.files ?? {}).filter((f) => !m[2] || f.filename === decodeURIComponent(m[2]));
  return files.map((f) => {
    const lang = guessLang(`language-${(f.language ?? '').toLowerCase()}`, f.content ?? '');
    return `<pre class="language-${lang}">${(f.content ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
  }).join('\n');
}

async function download(url, dir, n) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const type = res.headers.get('content-type') ?? '';
    const ext = /png/.test(type) ? 'png' : /gif/.test(type) ? 'gif' : /webp/.test(type) ? 'webp' : /svg/.test(type) ? 'svg' : 'jpg';
    const file = `image-${n}.${ext}`;
    const bytes = Buffer.from(await res.arrayBuffer());
    if (ext === 'gif' || ext === 'svg') {
      // GIFs and SVGs skip Astro's image optimizer (it would drop GIF animation): serve them as-is from /public.
      const pub = path.join(ROOT, 'public/images/writing', path.basename(dir));
      await fs.mkdir(pub, { recursive: true });
      await fs.writeFile(path.join(pub, file), bytes);
      return `/images/writing/${path.basename(dir)}/${file}`;
    }
    await fs.writeFile(path.join(dir, file), bytes);
    return `./${file}`;
  } catch {
    return null;
  }
}

async function importPosts() {
  const rows = parseCsv(await fs.readFile(MANIFEST, 'utf8')).filter((r) => r.action === 'import');
  const all = new Map();
  for (const blog of BLOGS) for (const e of await fetchBlog(blog)) { const p = toPost(blog, e); all.set(p.id, p); }

  const td = makeTurndown();
  const used = new Set();
  let done = 0, skipped = 0, imgOk = 0, imgFail = 0;

  for (const row of rows) {
    const p = all.get(row.id);
    if (!p) { console.warn(`! not found in feeds: ${row.id}`); continue; }
    let slug = slugify(p.title) || p.slug;
    while (used.has(slug)) slug += '-2';
    used.add(slug);
    const dir = path.join(OUT, slug);
    // Never overwrite a post that's already been imported (it may have been edited by hand) unless --force.
    if (!FORCE && (await fs.stat(path.join(dir, 'index.md')).catch(() => null))) { skipped++; continue; }
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });

    let html = p.html.replace(/<!--[\s\S]*?-->/g, '');
    for (const g of html.match(/<script[^>]+gist\.github\.com[^>]*>\s*<\/script>/gi) ?? []) {
      const code = await fetchGist(g);
      html = html.replace(g, code ?? `<p><a href="${/src="([^"]+)"/.exec(g)?.[1].replace(/\.js.*$/, '')}">View the code on GitHub</a></p>`);
    }
    html = html
      .replace(/<(style|script)[\s\S]*?<\/\1>/gi, '')
      .replace(/(<br\s*\/?>\s*){2,}/gi, '</p><p>');

    // YouTube: first embed becomes the article's video; iframes are dropped from the body.
    const yt = /(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)([\w-]{11})/.exec(html)?.[1];
    if (yt) html = html.replace(new RegExp(`<iframe[^>]*${yt}[^>]*>\\s*</iframe>`, 'i'), '');

    // Images: prefer the full-size link Blogger wraps around thumbnails, then download.
    let n = 0;
    const imgs = [...html.matchAll(/(?:<a[^>]+href="([^"]+)"[^>]*>\s*)?<img[^>]+src="([^"]+)"[^>]*>(?:\s*<\/a>)?/gi)];
    for (const m of imgs) {
      const href = m[1] && /\.(jpe?g|png|gif|webp)$|blogger\.googleusercontent|bp\.blogspot/i.test(m[1]) ? m[1] : null;
      let src = (href ?? m[2]).replace(/^\/\//, 'https://');
      src = src.replace(/\/s\d+(-h)?\//, '/s1600/').replace(/=s\d+(-h)?$/, '=s1600');
      const alt = /alt="([^"]*)"/i.exec(m[0])?.[1] ?? '';
      const file = await download(src, dir, ++n);
      file ? imgOk++ : imgFail++;
      html = html.replace(m[0], `<img src="${file ?? src}" alt="${alt.replace(/"/g, '')}">`);
    }

    // Blogger puts captioned images in layout tables: turn them into image + italic caption.
    html = html.replace(/<table[^>]*tr-caption-container[^>]*>([\s\S]*?)<\/table>/gi, (_m, inner) => {
      const img = /<img[^>]*>/i.exec(inner)?.[0] ?? '';
      const cap = /<td[^>]*tr-caption[^>]*>([\s\S]*?)<\/td>/i.exec(inner)?.[1]?.replace(/<[^>]+>/g, '').trim();
      return `<p>${img}</p>${cap ? `<p><em>${cap}</em></p>` : ''}`;
    });
    // A one-cell table is how Word pastes a code snippet: make it a real code block.
    html = html.replace(/<table\b[^>]*>(?:(?!<\/table>)[\s\S])*<\/table>/gi, (t) => {
      if ((t.match(/<td\b/gi) ?? []).length !== 1) return t;
      const code = t
        .replace(/<\/?(table|tbody|tr|td)\b[^>]*>/gi, '')
        .replace(/<br\s*\/?>|<\/(div|p)>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;|\u00a0/g, ' ')
        .replace(/\n[ \t]*(?=\n)/g, '') // Word adds an empty line between every code line
        .trim();
      return `<pre>${code}</pre>`;
    });
    // Tables pasted from Word: drop inline styling so they take the site's table style.
    html = html
      .replace(/<(table|thead|tbody|tr|td|th|colgroup|col)\b[^>]*?(\s(?:colspan|rowspan)="\d+")?[^>]*>/gi, '<$1$2>')
      .replace(/<\/?o:p>/gi, '')
      .replace(/<\/?span\b[^>]*>/gi, '')
      // Drop Word/Blogger styling attributes everywhere except code blocks (their class carries the language).
      .replace(/<(?!pre\b|code\b)(\w+)(\s[^>]*)>/g, (_m, tag, attrs) => `<${tag}${attrs.replace(/\s(?:style|class|lang)="[^"]*"/gi, '')}>`);

    let md = td.turndown(html).replace(/\n{3,}/g, '\n\n').trim();
    // One H1 per page (the title), so shift headings down if the post uses H1.
    if (/^# /m.test(md)) md = md.replace(/^(#{1,5}) /gm, '#$1 ');
    const plain = md.replace(/```[\s\S]*?```/g, '').replace(/[#>*_`\[\]()!-]/g, ' ').replace(/\s+/g, ' ').trim();
    const summary = plain.length > 180 ? plain.slice(0, 177).replace(/\s\S*$/, '') + '…' : plain;
    const tags = row.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const flags = row.flags ?? '';

    const front = [
      '---',
      `title: ${JSON.stringify(p.title)}`,
      `date: ${p.date.slice(0, 10)}`,
      `section: ${row.section}`,
      `tags: ${JSON.stringify(tags)}`,
      `summary: ${JSON.stringify(summary)}`,
      yt && `youtube: ${yt}`,
      flags.includes('custom-styling') && '# NOTE: the original post had custom styling; check this one by hand.',
      '---',
    ].filter(Boolean).join('\n');

    await fs.writeFile(path.join(dir, 'index.md'), `${front}\n\n${md}\n`);
    done++;
  }
  console.log(`Imported ${done} posts into ${path.relative(ROOT, OUT)} (images: ${imgOk} downloaded, ${imgFail} kept remote or failed)`);
  if (skipped) console.log(`Skipped ${skipped} posts that already exist. Use --force to overwrite them.`);
}

// ---------- Main ----------

const cmd = process.argv[2];
const FORCE = process.argv.includes('--force');
if (cmd === 'plan') await plan();
else if (cmd === 'import') await importPosts();
else console.log('Usage: node scripts/import-blogger.mjs plan | import');
