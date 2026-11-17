const MAP = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd',
  е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'i', к: 'k', л: 'l', м: 'm', н: 'n',
  о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch',
  ш: 'sh', щ: 'sch', ъ: '', ы: 'y',
  ь: '', э: 'e', ю: 'yu', я: 'ya',
};

const RESERVED = new Set(['section', 'admin', 'login', 'blog']);

export function blogSlug(name) {
  const raw = String(name || '')
    .toLowerCase()
    .split('')
    .map((char) => (Object.prototype.hasOwnProperty.call(MAP, char) ? MAP[char] : char))
    .join('')
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  if (!raw || RESERVED.has(raw)) return '';
  return raw;
}
