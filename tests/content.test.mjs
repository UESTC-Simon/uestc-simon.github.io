import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { parsePost, collectPosts, buildContent } from '../scripts/content.mjs';
import { safeContentUrl, getHeadings, parseMarkdown } from '../lib/posts.ts';

const source=(extra='',body='## Observation\n\nAn observation.')=>`---\ntitle: "A note"\nslug: a-note\ndate: 2026-11-08\nlang: en\nsummary: "A short summary"\ncategory: Notes\ntags: ["AI", "AI", "Research"]\n${extra}---\n${body}\n`;
test('drafts are private by default and explicit publication is respected',()=>{
  const draft=parsePost(source());assert.equal(draft.draft,true);assert.deepEqual(draft.tags,['AI','Research']);
  assert.equal(collectPosts([{filename:'a.md',source:source()}]).length,0);
  assert.equal(collectPosts([{filename:'a.md',source:source('draft: false\n')}]).length,1);
  assert.equal(collectPosts([{filename:'a.md',source:source()}],{includeDrafts:true}).length,1);
});
test('malformed date, language, unsafe slug and quoted draft values fail',()=>{
  for(const invalid of [source().replace('2026-11-08','2026-02-31'),source().replace('lang: en','lang: fr'),source().replace('slug: a-note','slug: ../private'),source('draft: "false"\n')])assert.throws(()=>parsePost(invalid));
});
test('duplicate slugs are rejected even when the colliding article is a draft',()=>{
  assert.throws(()=>collectPosts([{filename:'a.md',source:source('draft: false\n')},{filename:'b.md',source:source()}]),/Duplicate article slug/);
});
test('unknown metadata and duplicate fields fail with useful diagnostics',()=>{
  assert.throws(()=>parsePost(source('titel: typo\n'),'bad.md'),/bad.md: unsupported field/);
  assert.throws(()=>parsePost(source('title: duplicate\n')),/duplicate field/);
});
test('unsafe Markdown URLs are not linkable',()=>{
  for(const value of ['javascript:alert(1)','JaVaScRiPt:alert(1)','data:text/html,test','//evil.test/x','https:\\evil.test','java\nscript:alert(1)','file:///secret'])assert.equal(safeContentUrl(value),null,value);
  for(const value of ['https://example.com/a','/writing/a-note','#section-hello','mailto:hello@example.com','./image.png'])assert.equal(safeContentUrl(value),value);
  assert.equal(safeContentUrl('mailto:hello@example.com',true),null);
});
test('duplicate headings receive stable unique anchors, and fenced headings stay out of the TOC',()=>{
  const body='## Hello\n\n## Hello\n\n## 学习与记忆\n\n```md\n## Hidden\n```';
  assert.deepEqual(getHeadings(body).map(h=>h.id),['section-hello','section-hello-2','section-学习与记忆']);
  assert.equal(parseMarkdown(body).at(-1).type,'code');
});
test('raw HTML remains plain paragraph content and tables are structured data',()=>{
  const blocks=parseMarkdown('<script>alert(1)</script>\n\n| A | B |\n| --- | --- |\n| 1 | 2 |');
  assert.deepEqual(blocks[0],{type:'paragraph',text:'<script>alert(1)</script>'});
  assert.equal(blocks[1].type,'table');assert.deepEqual(blocks[1].rows,[['1','2']]);
});
test('build emits only published articles and --check semantics leave the manifest untouched',async()=>{
  const root=await mkdtemp(path.join(os.tmpdir(),'sl-content-'));
  try{await mkdir(path.join(root,'content','posts'),{recursive:true});await writeFile(path.join(root,'content','posts','a.md'),source('draft: false\n'));await writeFile(path.join(root,'content','posts','b.md'),source().replace('slug: a-note','slug: b-note'));const result=await buildContent({root});assert.equal(result.count,1);const manifest=path.join(root,'lib','posts.generated.json');const before=await readFile(manifest,'utf8');await buildContent({root,includeDrafts:true,check:true});assert.equal(await readFile(manifest,'utf8'),before);await buildContent({root,includeDrafts:true});assert.equal(JSON.parse(await readFile(manifest,'utf8')).length,2);}finally{assert.equal(path.dirname(path.resolve(root)),path.resolve(os.tmpdir()));assert.match(path.basename(root),/^sl-content-/);await rm(root,{recursive:true,force:true});}
});
