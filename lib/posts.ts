import generated from './posts.generated.json' with { type: 'json' };

export type Post = {
  slug: string; title: string; date: string; lang: 'en' | 'zh'; summary: string;
  category: string; tags: string[]; body: string; readingMinutes: number; draft: boolean;
};
export const posts = generated as Post[];
export const getPost = (slug: string) => posts.find(post => post.slug === slug);
export function formatPostDate(date: string, lang: 'en' | 'zh') {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}

export function safeContentUrl(input: string, image = false): string | null {
  const value = input.trim();
  if (!value || /[\u0000-\u0020\u007f\\]/.test(value) || value.startsWith('//')) return null;
  if (value.startsWith('/') || (!image && value.startsWith('#'))) return value;
  if (value.startsWith('./') && !value.includes(':')) return value;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' || url.protocol === 'http:' || (!image && url.protocol === 'mailto:')) return value;
  } catch { /* Unsupported relative links are rendered as text. */ }
  return null;
}

export type MarkdownBlock =
  | { type: 'heading'; level: number; text: string; id: string }
  | { type: 'paragraph' | 'quote'; text: string }
  | { type: 'code'; text: string; language: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'rule' };

function headingId(text: string, seen: Map<string, number>) {
  const base = text.replace(/[`*_]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/[\s-]+/g, '-') || 'section';
  const n = (seen.get(base) || 0) + 1; seen.set(base, n);
  return `section-${base}${n > 1 ? `-${n}` : ''}`;
}
const tableCells = (line: string) => line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
const isTableSeparator = (line: string) => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
const blockStart = (line: string) => /^(#{1,4})\s|^\s*```|^\s*>|^\s*[-*+]\s|^\s*\d+\.\s|^\s*(?:---+|\*\*\*+)\s*$/.test(line);

export function parseMarkdown(body: string): MarkdownBlock[] {
  const lines = body.replace(/\r\n?/g, '\n').split('\n'); const blocks: MarkdownBlock[] = []; const ids = new Map<string, number>();
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]; if (!line.trim()) { i++; continue; }
    const fence = line.match(/^\s*```([^\s`]*)\s*$/);
    if (fence) { const code: string[] = []; i++; while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) code.push(lines[i++]); if (i < lines.length) i++; blocks.push({ type: 'code', language: fence[1], text: code.join('\n') }); continue; }
    const heading = line.match(/^(#{1,4})\s+(.+?)\s*#*\s*$/);
    if (heading) { blocks.push({ type: 'heading', level: heading[1].length, text: heading[2], id: headingId(heading[2], ids) }); i++; continue; }
    if (/^\s*(?:---+|\*\*\*+)\s*$/.test(line)) { blocks.push({ type: 'rule' }); i++; continue; }
    if (i + 1 < lines.length && line.includes('|') && isTableSeparator(lines[i + 1])) { const headers = tableCells(line); const rows: string[][] = []; i += 2; while (i < lines.length && lines[i].trim() && lines[i].includes('|')) rows.push(tableCells(lines[i++])); blocks.push({ type: 'table', headers, rows }); continue; }
    if (/^\s*>/.test(line)) { const quote: string[] = []; while (i < lines.length && /^\s*>/.test(lines[i])) quote.push(lines[i++].replace(/^\s*>\s?/, '')); blocks.push({ type: 'quote', text: quote.join('\n') }); continue; }
    const list = line.match(/^\s*(?:([-*+])|(\d+)\.)\s+(.+)$/);
    if (list) { const ordered = !!list[2]; const items: string[] = []; while (i < lines.length) { const item = lines[i].match(/^\s*(?:([-*+])|(\d+)\.)\s+(.+)$/); if (!item || !!item[2] !== ordered) break; items.push(item[3]); i++; } blocks.push({ type: 'list', ordered, items }); continue; }
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim() && !blockStart(lines[i]) && !(i + 1 < lines.length && lines[i].includes('|') && isTableSeparator(lines[i + 1]))) paragraph.push(lines[i++]);
    blocks.push({ type: 'paragraph', text: paragraph.join('\n') });
  }
  return blocks;
}

export function getHeadings(body: string) {
  return parseMarkdown(body).filter((block): block is Extract<MarkdownBlock, {type:'heading'}> => block.type === 'heading');
}
