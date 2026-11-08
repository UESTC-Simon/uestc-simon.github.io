import { posts } from '@/lib/posts';
import { profile } from '@/lib/profile';

const xml=(value:string)=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
export const dynamic = "force-static";
export function GET(request:Request){
  let base=profile.siteUrl || new URL(request.url).origin;
  if(profile.siteUrl){try{const configured=new URL(profile.siteUrl);if(['https:','http:'].includes(configured.protocol))base=configured.origin;}catch{/* Local preview falls back to its request origin. */}}
  const published=posts.filter(post=>!post.draft);
  const items=published.map(post=>`<item><title>${xml(post.title)}</title><link>${base}/writing/${post.slug}</link><guid isPermaLink="true">${base}/writing/${post.slug}</guid><description>${xml(post.summary)}</description><pubDate>${new Date(post.date+'T00:00:00Z').toUTCString()}</pubDate><category>${xml(post.category)}</category></item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Shiteng Lu · Fieldnotes</title><link>${base}/writing</link><description>Research notes, reflections, and ideas in progress.</description><language>en</language><atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8','Cache-Control':'public, max-age=300'}});
}
