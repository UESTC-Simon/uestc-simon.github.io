import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const allowedKeys = new Set(['title', 'slug', 'date', 'lang', 'summary', 'category', 'tags', 'draft']);

function scalar(value, key, filename) {
  if (key === 'draft') {
    if (value !== 'true' && value !== 'false') throw new Error(`${filename}: draft must be true or false (unquoted).`);
    return value === 'true';
  }
  if (key === 'tags') {
    let tags;
    try { tags = JSON.parse(value); } catch { throw new Error(`${filename}: tags must be a JSON array, e.g. ["Research", "AI"].`); }
    if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string' || !tag.trim()) || tags.length > 12) throw new Error(`${filename}: tags must contain up to 12 non-empty strings.`);
    return [...new Set(tags.map(tag => tag.trim()))];
  }
  if (value.startsWith('"')) {
    try { const parsed = JSON.parse(value); if (typeof parsed !== 'string') throw new Error(); return parsed; }
    catch { throw new Error(`${filename}: ${key} contains an invalid quoted string.`); }
  }
  if (value.startsWith("'")) {
    if (!value.endsWith("'")) throw new Error(`${filename}: ${key} has an unclosed quote.`);
    return value.slice(1, -1).replaceAll("''", "'");
  }
  return value;
}

export function parsePost(source, filename = 'post.md') {
  const normalized = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/);
  if (!match) throw new Error(`${filename}: expected frontmatter between two --- lines.`);
  const meta = {};
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const entry = line.match(/^([a-zA-Z][a-zA-Z0-9_]*)\s*:\s*(.*)$/);
    if (!entry) throw new Error(`${filename}: invalid frontmatter line: ${line}`);
    const [, key, value] = entry;
    if (!allowedKeys.has(key)) throw new Error(`${filename}: unsupported field "${key}".`);
    if (Object.hasOwn(meta, key)) throw new Error(`${filename}: duplicate field "${key}".`);
    meta[key] = scalar(value, key, filename);
  }
  for (const key of ['title', 'slug', 'date', 'lang', 'summary', 'category']) {
    if (typeof meta[key] !== 'string' || !meta[key].trim()) throw new Error(`${filename}: ${key} is required and must be non-empty.`);
    meta[key] = meta[key].trim();
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug)) throw new Error(`${filename}: slug must contain lowercase letters, numbers and single hyphens only.`);
  if (!['en', 'zh'].includes(meta.lang)) throw new Error(`${filename}: lang must be en or zh.`);
  const parsedDate = new Date(`${meta.date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date) || Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== meta.date) throw new Error(`${filename}: date must be a real YYYY-MM-DD calendar date.`);
  if (meta.title.length > 200 || meta.summary.length > 600) throw new Error(`${filename}: title or summary is too long.`);
  const body = match[2].trim();
  if (!body) throw new Error(`${filename}: article body must not be empty.`);
  const cjkCount = (body.match(/[\u3400-\u9fff]/g) || []).length;
  const wordCount = (body.replace(/[\u3400-\u9fff]/g, ' ').match(/[\p{L}\p{N}]+/gu) || []).length;
  return { ...meta, tags: meta.tags || [], draft: meta.draft ?? true, body, readingMinutes: Math.max(1, Math.ceil(cjkCount / 350 + wordCount / 200)) };
}

export function collectPosts(entries, { includeDrafts = false } = {}) {
  const parsed = entries.map(entry => parsePost(entry.source, entry.filename));
  const slugs = new Set();
  for (const post of parsed) {
    if (slugs.has(post.slug)) throw new Error(`Duplicate article slug: ${post.slug}`);
    slugs.add(post.slug);
  }
  return parsed.filter(post => includeDrafts || !post.draft).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export async function buildContent({ includeDrafts = false, check = false, root = projectRoot } = {}) {
  const contentDir = path.join(root, 'content', 'posts');
  await mkdir(contentDir, { recursive: true });
  const filenames = (await readdir(contentDir)).filter(name => name.endsWith('.md')).sort();
  const entries = await Promise.all(filenames.map(async filename => ({ filename, source: await readFile(path.join(contentDir, filename), 'utf8') })));
  const posts = collectPosts(entries, { includeDrafts });
  if (!check) {
    const output = path.join(root, 'lib', 'posts.generated.json');
    const json = JSON.stringify(posts, null, 2) + '\n';
    let existing = '';
    try { existing = await readFile(output, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (existing !== json) { await mkdir(path.dirname(output), { recursive: true }); await writeFile(output, json, 'utf8'); }
  }
  return { count: posts.length, sourceCount: filenames.length, includeDrafts, posts };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const args = process.argv.slice(2);
  if (args.some(arg => !['--check', '--drafts'].includes(arg))) { console.error('Usage: node scripts/content.mjs [--check] [--drafts]'); process.exitCode = 1; }
  else {
    try { const result = await buildContent({ includeDrafts: args.includes('--drafts'), check: args.includes('--check') }); console.log(`Content ${args.includes('--check') ? 'validated' : 'generated'}: ${result.count} visible / ${result.sourceCount} source articles${result.includeDrafts ? ' (including drafts)' : ''}.`); }
    catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
