import { Fragment, type ReactNode } from 'react';
import { parseMarkdown, safeContentUrl } from '@/lib/posts';

function inline(text: string, depth = 0): ReactNode[] {
  if (depth > 5) return [text];
  const pattern = /!\[([^\]]*)\]\(([^\s)]+)\)|\[([^\]]+)\]\(([^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*\n]+)\*|_([^_\n]+)_/g;
  const nodes: ReactNode[] = []; let cursor = 0; let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const key = `${match.index}-${depth}`;
    if (match[1] !== undefined) { const url = safeContentUrl(match[2], true); nodes.push(url ? <img key={key} src={url} alt={match[1]} loading="lazy" /> : <span key={key}>{match[1] || match[0]}</span>); }
    else if (match[3] !== undefined) { const url = safeContentUrl(match[4]); nodes.push(url ? <a key={key} href={url} {...(/^https?:/i.test(url) ? {target:'_blank',rel:'noopener noreferrer'} : {})}>{inline(match[3], depth + 1)}</a> : <span key={key}>{inline(match[3], depth + 1)}</span>); }
    else if (match[5] !== undefined) nodes.push(<code key={key}>{match[5]}</code>);
    else if (match[6] !== undefined || match[7] !== undefined) nodes.push(<strong key={key}>{inline(match[6] ?? match[7], depth + 1)}</strong>);
    else nodes.push(<em key={key}>{inline(match[8] ?? match[9], depth + 1)}</em>);
    cursor = pattern.lastIndex;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export default function Markdown({ body }: {body:string}) {
  return <>{parseMarkdown(body).map((block, index) => {
    switch (block.type) {
      case 'heading': { const Heading = `h${Math.max(2, block.level)}` as 'h2'|'h3'|'h4'; return <Heading id={block.id} key={block.id}><a className="heading-anchor" href={`#${block.id}`} aria-label={block.text}>{inline(block.text)}</a></Heading>; }
      case 'paragraph': return <p key={index}>{inline(block.text)}</p>;
      case 'quote': return <blockquote key={index}><p>{inline(block.text)}</p></blockquote>;
      case 'code': return <div className="code-block" key={index}>{block.language && <span className="code-language">{block.language}</span>}<pre tabIndex={0}><code>{block.text}</code></pre></div>;
      case 'list': { const List = block.ordered ? 'ol' : 'ul'; return <List key={index}>{block.items.map((item, i) => <li key={i}>{inline(item)}</li>)}</List>; }
      case 'rule': return <hr key={index} />;
      case 'table': return <div className="table-scroll" tabIndex={0} key={index}><table><thead><tr>{block.headers.map((cell, i) => <th key={i}>{inline(cell)}</th>)}</tr></thead><tbody>{block.rows.map((row, i) => <tr key={i}>{block.headers.map((_, j) => <td key={j}>{inline(row[j] || '')}</td>)}</tr>)}</tbody></table></div>;
      default: return <Fragment key={index} />;
    }
  })}</>;
}
