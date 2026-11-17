import { blogImageUrl } from '@/app/utils/blogView';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function richText(value) {
  let html = escapeHtml(value).replace(/\n/g, '<br>');
  html = html.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
  html = html.replace(/&lt;(\/?)(b|strong|i|em|u)&gt;/gi, '<$1$2>');
  html = html.replace(
    /&lt;a\s+href=&quot;(https?:\/\/[^"&]+)&quot;&gt;/gi,
    '<a href="$1" rel="noopener noreferrer">'
  );
  html = html.replace(/&lt;\/a&gt;/gi, '</a>');
  return html;
}

function sanitizeHtml(value) {
  const allowed = new Set(['p', 'br', 'b', 'strong', 'i', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'span']);
  return String(value || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\s*(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, tag, attrs) => {
      const name = tag.toLowerCase();
      if (!allowed.has(name)) return '';
      if (full.startsWith('</')) return `</${name}>`;
      if (name === 'br') return '<br>';
      if (name === 'a') {
        const href = /href\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(attrs);
        const url = href ? (href[1] || href[2] || '') : '';
        if (!/^https?:\/\//i.test(url)) return '<a>';
        return `<a href="${escapeHtml(url)}" rel="noopener noreferrer">`;
      }
      if (name === 'img') {
        const src = /src\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(attrs);
        const alt = /alt\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(attrs);
        const url = src ? (src[1] || src[2] || '') : '';
        if (!/^https?:\/\//i.test(url) && !url.startsWith('/uploads/')) return '';
        return `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt ? (alt[1] || alt[2] || '') : '')}">`;
      }
      return `<${name}>`;
    });
}

export default function ArticleBody({ blocks }) {
  if (!Array.isArray(blocks) || !blocks.length) return null;

  return (
    <div className="blog-body">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === 'h2') return <h2 key={key} dangerouslySetInnerHTML={{ __html: richText(block.text) }} />;
        if (block.type === 'h3') return <h3 key={key} dangerouslySetInnerHTML={{ __html: richText(block.text) }} />;
        if (block.type === 'quote') return <blockquote key={key} dangerouslySetInnerHTML={{ __html: richText(block.text) }} />;
        if (block.type === 'ul' || block.type === 'ol') {
          const Tag = block.type;
          const items = String(block.text || '').split('\n').map((item) => item.trim()).filter(Boolean);
          return (
            <Tag key={key}>
              {items.map((item, itemIndex) => <li key={`${key}-${itemIndex}`} dangerouslySetInnerHTML={{ __html: richText(item) }} />)}
            </Tag>
          );
        }
        if (block.type === 'image' && block.file) {
          return <img key={key} src={blogImageUrl(block.file)} alt={block.alt || ''} />;
        }
        if (block.type === 'table') {
          const headers = Array.isArray(block.headers) ? block.headers : [];
          const rows = Array.isArray(block.rows) ? block.rows : [];
          return (
            <div className="blog-table-wrap" key={key}>
              <table>
                {headers.some((cell) => String(cell || '').trim()) ? (
                  <thead>
                    <tr>{headers.map((cell, cellIndex) => <th key={cellIndex}>{cell}</th>)}</tr>
                  </thead>
                ) : null}
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {(Array.isArray(row) ? row : []).map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === 'html') {
          return <div key={key} dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.html) }} />;
        }
        return <p key={key} dangerouslySetInnerHTML={{ __html: richText(block.text) }} />;
      })}
    </div>
  );
}
