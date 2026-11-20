/**
 * Audit SEO du site généré (dist/) et production de seo-report.md.
 * Usage : npm run build && node scripts/seo-audit.mjs
 * Vérifie pour chaque page : title (50–60 car.), meta description (140–160 car.), H1 unique,
 * canonical, Open Graph / Twitter (image), données structurées, attributs alt, indexation.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
})(DIST);

const decode = (s = '') =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
const strip = (s = '') =>
  decode(s.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
const meta = (h, attr, name) => {
  const re = new RegExp(`<meta[^>]*${attr}="${name}"[^>]*>`, 'i');
  const tag = h.match(re)?.[0];
  return tag ? decode(tag.match(/content="([^"]*)"/i)?.[1] ?? '') : '';
};

const rows = [];
for (const f of files.sort()) {
  const h = fs.readFileSync(f, 'utf8');
  let url =
    '/' +
    path
      .relative(DIST, f)
      .replace(/\\/g, '/')
      .replace(/index\.html$/, '')
      .replace(/\.html$/, '');
  if (url !== '/' && url.endsWith('/')) url = url.slice(0, -1);
  const title = decode(h.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '');
  const desc = meta(h, 'name', 'description');
  const robots = meta(h, 'name', 'robots');
  const noindex = /noindex/i.test(robots);
  const h1s = [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1]));
  const canonical =
    h.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1] ??
    h.match(/<link[^>]*href="([^"]*)"[^>]*rel="canonical"/i)?.[1] ??
    '';
  const ogImage = meta(h, 'property', 'og:image');
  const twCard = meta(h, 'name', 'twitter:card');
  const twImage = meta(h, 'name', 'twitter:image');
  const types = [...h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((m) => {
      try {
        const j = JSON.parse(m[1]);
        return (Array.isArray(j) ? j : [j]).flatMap((o) => [o['@type']].flat());
      } catch {
        return ['JSON-LD invalide'];
      }
    })
    .filter(Boolean);
  const imgs = [...h.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\balt(=|\s|>)/.test(t)).length;
  // Hiérarchie : un H3 avant tout H2 = saut de niveau
  const levels = [...h.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  let skip = false;
  for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) skip = true;
  if (url === '/404') continue;
  rows.push({
    url,
    title,
    desc,
    noindex,
    h1s,
    canonical,
    ogImage,
    twCard,
    twImage,
    types: [...new Set(types)],
    noAlt,
    skip,
  });
}

const ok = (n, a, b) => (n >= a && n <= b ? '✅' : '⚠️');
const indexable = rows.filter((r) => !r.noindex);
const issues = [];
for (const r of indexable) {
  if (r.title.length < 50 || r.title.length > 60) issues.push(`${r.url} : title ${r.title.length} car.`);
  if (r.desc.length < 140 || r.desc.length > 160) issues.push(`${r.url} : description ${r.desc.length} car.`);
}
for (const r of rows) {
  if (r.h1s.length !== 1) issues.push(`${r.url} : ${r.h1s.length} balise(s) H1`);
  if (!r.canonical) issues.push(`${r.url} : canonical manquante`);
  if (!r.ogImage) issues.push(`${r.url} : og:image manquante`);
  if (!r.twCard || !r.twImage) issues.push(`${r.url} : Twitter Card incomplète`);
  if (r.noAlt) issues.push(`${r.url} : ${r.noAlt} image(s) sans alt`);
  if (r.skip) issues.push(`${r.url} : saut de niveau de titre (Hn)`);
}
const titles = new Map();
for (const r of indexable) titles.set(r.title, [...(titles.get(r.title) || []), r.url]);
for (const [t, urls] of titles) if (urls.length > 1) issues.push(`Title en double « ${t} » : ${urls.join(', ')}`);

const esc = (s) => s.replace(/\|/g, '\\|');
let md = `# Rapport SEO — Nova Inteligencia Group

Généré automatiquement par \`node scripts/seo-audit.mjs\` à partir du site construit (\`dist/\`), le ${new Date().toLocaleDateString('fr-FR')}.

Cibles : title 50–60 caractères, meta description 140–160 caractères, une seule balise H1 par page.
Mots-clés visés : formation intelligence artificielle Casablanca, formation IA Maroc, formation ChatGPT, formation IA entreprise, automatisation IA.

## Synthèse

- Pages indexables : **${indexable.length}** · pages non indexées (noindex) : **${rows.length - indexable.length}**
- Problèmes détectés : **${issues.length}**
${issues.length ? issues.map((i) => `  - ${i}`).join('\n') : '  - Aucun : toutes les pages respectent les règles ci-dessus.'}

## Pages indexables

| Page | Title | Car. | Meta description | Car. | H1 | Données structurées |
|---|---|---|---|---|---|---|
${indexable
  .map(
    (r) =>
      `| \`${r.url}\` | ${esc(r.title)} | ${r.title.length} ${ok(r.title.length, 50, 60)} | ${esc(r.desc)} | ${r.desc.length} ${ok(r.desc.length, 140, 160)} | ${esc(r.h1s.join(' / ') || '—')} | ${r.types.join(', ')} |`
  )
  .join('\n')}

## Pages non indexées (noindex)

| Page | Title | H1 |
|---|---|---|
${rows
  .filter((r) => r.noindex)
  .map((r) => `| \`${r.url}\` | ${esc(r.title)} | ${esc(r.h1s.join(' / ') || '—')} |`)
  .join('\n')}

## Contrôles techniques

| Contrôle | Résultat |
|---|---|
| Une seule H1 par page | ${rows.every((r) => r.h1s.length === 1) ? '✅ toutes les pages' : '⚠️ voir la synthèse'} |
| Hiérarchie H2/H3 sans saut | ${rows.every((r) => !r.skip) ? '✅' : '⚠️ voir la synthèse'} |
| URL canonique | ${rows.every((r) => r.canonical) ? '✅ toutes les pages' : '⚠️'} |
| Open Graph (image dédiée) | ${rows.every((r) => r.ogImage) ? '✅ toutes les pages' : '⚠️'} |
| Twitter Card (summary_large_image + image) | ${rows.every((r) => r.twCard && r.twImage) ? '✅ toutes les pages' : '⚠️'} |
| Textes alternatifs des images | ${rows.every((r) => !r.noAlt) ? '✅ aucune image sans alt' : '⚠️'} |
| Sitemap | \`/sitemap-index.xml\` (pages noindex exclues) |
| robots.txt | \`/robots.txt\` (référence le sitemap) |
`;
fs.writeFileSync('seo-report.md', md);
console.log(`Pages : ${rows.length} (${indexable.length} indexables) — problèmes : ${issues.length}`);
issues.forEach((i) => console.log(' -', i));
