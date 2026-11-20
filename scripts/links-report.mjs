/**
 * Inventaire de tous les liens vers /formations dans le site construit (dist/).
 * Usage : npm run build && node scripts/links-report.mjs [--json fichier.json]
 * Classe chaque lien : fiche formation, catalogue filtré (?categorie=…) ou catalogue complet,
 * et signale les catalogues filtrés qui n'affichent qu'une seule formation.
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

// nombre de formations par catégorie (depuis les fichiers de contenu)
const counts = {};
for (const f of fs.readdirSync('src/data/formations').filter((f) => f.endsWith('.md'))) {
  const src = fs.readFileSync(path.join('src/data/formations', f), 'utf8');
  if (/^draft:\s*true/m.test(src)) continue;
  const c = src.match(/^categorie:\s*(\S+)/m)?.[1];
  counts[c] = (counts[c] || 0) + 1;
}

const strip = (s) =>
  s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const rows = [];
for (const f of files) {
  const page =
    '/' +
    path
      .relative(DIST, f)
      .replace(/\\/g, '/')
      .replace(/index\.html$/, '')
      .replace(/\/$/, '');
  const h = fs.readFileSync(f, 'utf8');
  // zone : en-tête, pied de page ou contenu
  const zoneOf = (i) => {
    const before = h.slice(0, i);
    if (before.lastIndexOf('<header') > before.lastIndexOf('</header>')) return 'menu';
    if (before.lastIndexOf('<footer') > before.lastIndexOf('</footer>')) return 'pied de page';
    const sec = before.lastIndexOf('<section');
    if (sec > before.lastIndexOf('</section>') && /marquee-band/.test(before.slice(sec, before.indexOf('>', sec))))
      return 'bande défilante';
    return 'contenu';
  };
  for (const m of h.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = m[1].match(/href="([^"]*)"/)?.[1];
    if (!href || !/^\/formations(\/|\?|$)/.test(href)) continue;
    if (/tabindex="-1"/.test(m[1])) continue; // copie décorative de la bande défilante
    const text = strip(m[2]) || (m[1].match(/aria-label="([^"]*)"/)?.[1] ?? '(sans texte)');
    const url = new URL(href, 'https://x');
    let type = 'catalogue';
    let detail = '';
    if (url.pathname.replace(/\/$/, '') !== '/formations') type = 'fiche';
    else if (url.searchParams.get('categorie')) {
      const c = url.searchParams.get('categorie');
      type = 'catégorie';
      detail = `${counts[c] ?? 0} formation(s)`;
    }
    rows.push({ page: page || '/', zone: zoneOf(m.index), text: text.slice(0, 70), href, type, detail });
  }
}
rows.sort((a, b) => a.page.localeCompare(b.page) || a.zone.localeCompare(b.zone));

const out = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
if (out) fs.writeFileSync(out, JSON.stringify({ counts, rows }, null, 1));
const by = (k) => rows.reduce((o, r) => ((o[r[k]] = (o[r[k]] || 0) + 1), o), {});
console.log('Liens vers /formations :', rows.length, JSON.stringify(by('type')));
const single = rows.filter((r) => r.type === 'catégorie' && r.detail.startsWith('1 '));
console.log('Catalogues filtrés à 1 formation :', single.length);
const home = rows.filter((r) => r.page === '/');
console.log(
  'Accueil :',
  home.length,
  JSON.stringify(home.reduce((o, r) => ((o[r.type] = (o[r.type] || 0) + 1), o), {}))
);
