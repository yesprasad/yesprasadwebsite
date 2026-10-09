// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Friendly title-bar labels when a code block has no title="..."
const LANG_LABELS = {
  bash: 'terminal', sh: 'terminal', shell: 'terminal', zsh: 'terminal',
  js: 'javascript', ts: 'typescript', py: 'python', csharp: 'c#', yml: 'yaml',
  text: '', plaintext: '', txt: '',
};

/**
 * Wraps every code block in an editor-style window:
 * a title bar with window buttons and the file name (```ts title="app.ts") or language.
 * @type {import('shiki').ShikiTransformer}
 */
const codeWindow = {
  name: 'code-window',
  root(root) {
    const pre = root.children.find((n) => n.type === 'element' && n.tagName === 'pre');
    if (!pre) return;
    const meta = this.options.meta?.__raw ?? '';
    const lang = String(this.options.lang ?? '');
    const title = /title=["']([^"']+)["']/.exec(meta)?.[1] ?? LANG_LABELS[lang] ?? lang;
    const el = (tagName, className, children = []) => ({ type: 'element', tagName, properties: { className }, children });
    root.children = [
      el('figure', ['code-window'], [
        el('div', ['code-bar'], [
          el('span', ['dot', 'dot-r']), el('span', ['dot', 'dot-y']), el('span', ['dot', 'dot-g']),
          el('span', ['code-title'], [{ type: 'text', value: title }]),
        ]),
        pre,
      ]),
    ];
  },
};

export default defineConfig({
  site: 'https://yesprasad.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // Code always sits in a dark editor window, in light and dark mode alike.
      theme: 'github-dark-default',
      wrap: false,
      transformers: [codeWindow],
    },
  },
});
