import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { parsePost } from './content.mjs';

const configured = process.env.SMOKE_URL || process.argv[2] || 'http://127.0.0.1:5173';
let base;
try {
  base = new URL(configured);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password) throw new Error();
} catch {
  console.error('SMOKE_URL must be an http(s) URL without embedded credentials.');
  process.exit(1);
}

const plain = value => value
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#(?:39|x27);/gi, "'")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
  .replace(/\s+/g, ' ').trim();

async function get(route, expected = 200) {
  const response = await fetch(new URL(route, base), {
    redirect: 'manual', signal: AbortSignal.timeout(20000),
    headers: { 'User-Agent': 'Shiteng-Website-Smoke/1.0', 'Accept': '*/*' },
  });
  if (response.status !== expected) throw new Error(`HTTP ${response.status}, expected ${expected}`);
  return response;
}

const checks = [];
function check(label, run) { checks.push({ label, run }); }

const routes = [
  { path: '/', heading: /Shiteng Lu/, markers: ['RESEARCH', 'FIELDNOTES'] },
  { path: '/research', heading: /Questions, made concrete\./, markers: ['ICSE 2027', 'FALCON'] },
  { path: '/projects', heading: /A workshop for ideas\./, markers: ['CAD', 'NISB', 'Looped'] },
  { path: '/writing', heading: /A notebook, left open\./, markers: ['Research notes, longer reflections'] },
  { path: '/about', heading: /Hello, I’m Shiteng\./, markers: ['UESTC', 'Ziyin Liu'] },
  { path: '/cv', heading: /Shiteng Lu/, markers: ['CURRICULUM VITAE', 'FALCON'] },
];

for (const route of routes) check(route.path, async () => {
  const response = await get(route.path);
  if (!/text\/html/i.test(response.headers.get('content-type') || '')) throw new Error('Expected an HTML response');
  const html = await response.text();
  const heading = plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  if (!route.heading.test(heading)) throw new Error('Expected page heading was not rendered');
  const text = plain(html);
  if (route.markers.some(marker => !text.includes(marker))) throw new Error('Expected page content was not rendered');
});

check('/favicon.svg', async () => {
  const response = await get('/favicon.svg');
  if (!/image\/svg\+xml/i.test(response.headers.get('content-type') || '')) throw new Error('Expected image/svg+xml');
  if (!/<svg\b/i.test(await response.text())) throw new Error('Missing SVG content');
});

check('/images/shiteng-hiking.png', async () => {
  const response = await get('/images/shiteng-hiking.png');
  if (!/image\/png/i.test(response.headers.get('content-type') || '')) throw new Error('Expected image/png');
  const data = new Uint8Array(await response.arrayBuffer());
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (signature.some((byte, index) => data[index] !== byte)) throw new Error('Invalid PNG signature');
});

const contentDir = fileURLToPath(new URL('../content/posts/', import.meta.url));
let drafts;
try {
  const files = (await readdir(contentDir)).filter(filename => filename.endsWith('.md'));
  const all = await Promise.all(files.map(async filename => parsePost(await readFile(path.join(contentDir, filename), 'utf8'), filename)));
  drafts = all.filter(post => post.draft);
} catch (error) {
  console.error(`Could not inspect content sources: ${error.message}`);
  process.exit(1);
}

check('/feed.xml', async () => {
  const response = await get('/feed.xml');
  if (!/(?:application|text)\/(?:rss\+)?xml/i.test(response.headers.get('content-type') || '')) throw new Error('Expected XML content type');
  const xml = await response.text();
  if (!/^<\?xml\b/.test(xml) || !/<rss\b[^>]*>[\s\S]*<channel>[\s\S]*<\/channel>[\s\S]*<\/rss>\s*$/.test(xml)) throw new Error('Missing RSS XML document structure');
  const feedText = plain(xml);
  if (drafts.some(post => xml.includes(`/writing/${post.slug}`) || feedText.includes(post.title))) throw new Error('A draft article was exposed in RSS');
});

check('Unknown route → 404', async () => { await get(`/__smoke_missing_${randomUUID()}`, 404); });
for (const draft of drafts) check(`/writing/${draft.slug} → 404`, async () => { await get(`/writing/${draft.slug}`, 404); });

console.log(`HTTP smoke tests: ${base.origin} (published mode)`);
const results = await Promise.all(checks.map(async ({label,run}) => {
  try { await run(); return {label,ok:true}; }
  catch (error) { return {label,ok:false,error:error.name === 'TimeoutError' ? 'Request timed out' : error.message}; }
}));
for (const result of results) console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.label}${result.ok ? '' : ` — ${result.error}`}`);
const failures = results.filter(result => !result.ok).length;
console.log(`${results.length - failures}/${results.length} passed.`);
if (failures) process.exitCode = 1;
