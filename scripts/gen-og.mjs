/**
 * Génère une image de partage (Open Graph / Twitter, 1200×630) par page dans src/assets/images/og/.
 * Usage : node scripts/gen-og.mjs  (à relancer après l'ajout d'une formation ou d'un article)
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'src/assets/images/og';
fs.mkdirSync(OUT, { recursive: true });

const fm = (file) => {
  const src = fs.readFileSync(file, 'utf8');
  const block = src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const get = (k) => block.match(new RegExp(`^${k}:\\s*"?(.+?)"?\\s*$`, 'm'))?.[1];
  return { title: get('title'), categorie: get('categorie'), category: get('category') };
};
const CAT = {
  ia: 'Intelligence artificielle',
  'marketing-digital': 'Marketing digital',
  'vibe-coding': 'Vibe coding',
  innovation: 'Entrepreneuriat & innovation',
  junior: 'Junior',
};

const pages = [
  { key: 'accueil', eyebrow: 'Casablanca, Maroc', title: 'Formation en intelligence artificielle à Casablanca' },
  { key: 'formations', eyebrow: 'Catalogue', title: 'Nos formations en IA et en digital' },
  { key: 'a-propos', eyebrow: 'À propos', title: "Transformer l'intelligence en impact" },
  { key: 'entreprises', eyebrow: 'Entreprises', title: "Formez vos équipes à l'IA, sur mesure" },
  { key: 'contact', eyebrow: 'Contact', title: 'Parlons de votre projet de formation' },
  { key: 'blog', eyebrow: 'Blog', title: 'Conseils et ressources en intelligence artificielle' },
];
for (const f of fs.readdirSync('src/data/formations').filter((f) => f.endsWith('.md'))) {
  const d = fm(path.join('src/data/formations', f));
  pages.push({
    key: `formation-${f.replace(/\.md$/, '')}`,
    eyebrow: `Formation · ${CAT[d.categorie] ?? ''}`,
    title: d.title,
  });
}
for (const f of fs.readdirSync('src/data/post').filter((f) => /\.mdx?$/.test(f))) {
  const d = fm(path.join('src/data/post', f));
  pages.push({ key: `blog-${f.replace(/\.mdx?$/, '')}`, eyebrow: `Blog · ${d.category ?? ''}`, title: d.title });
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const wrap = (text, max) => {
  const lines = [];
  let cur = '';
  for (const w of text.split(/\s+/)) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
};

const logo = await sharp('src/assets/brand/logo-light.png').resize({ width: 300 }).toBuffer();

for (const p of pages) {
  let size = 68;
  let lines = wrap(p.title, 26);
  if (lines.length > 3) {
    size = 56;
    lines = wrap(p.title, 32).slice(0, 4);
  }
  const y0 = 352 - ((lines.length - 1) * size * 1.12) / 2;
  const text = lines
    .map(
      (l, i) =>
        `<text x="80" y="${Math.round(y0 + i * size * 1.12)}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${size}" fill="#ffffff">${esc(l)}</text>`
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs>
<linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#F36B12"/><stop offset="1" stop-color="#FF9B32"/></linearGradient>
<radialGradient id="r" cx=".88" cy=".15" r=".75"><stop offset="0" stop-color="#0757C8" stop-opacity=".55"/><stop offset="1" stop-color="#071B49" stop-opacity="0"/></radialGradient>
<pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#ffffff" fill-opacity=".07"/></pattern>
</defs>
<rect width="1200" height="630" fill="#071B49"/><rect width="1200" height="630" fill="url(#r)"/><rect width="1200" height="630" fill="url(#dots)"/>
<g stroke="#7FD0FF" stroke-opacity=".25" stroke-width="1.5" fill="#08A9F7"><path d="M900 120L1010 200L1120 140L1060 290M1010 200L1060 290L960 380" fill="none"/><circle cx="900" cy="120" r="5"/><circle cx="1010" cy="200" r="7"/><circle cx="1120" cy="140" r="5"/><circle cx="1060" cy="290" r="8" fill="#F36B12"/><circle cx="960" cy="380" r="5"/></g>
<text x="80" y="${Math.round(y0 - size - 18)}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="22" letter-spacing="4" fill="#7FD0FF">${esc(p.eyebrow.toUpperCase())}</text>
${text}
<rect x="80" y="540" width="160" height="5" rx="2.5" fill="url(#g)"/>
<text x="1120" y="552" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#C3CEE2">novaconsort.com</text>
</svg>`;
  await sharp(Buffer.from(svg))
    .composite([{ input: logo, left: 80, top: 56 }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, `${p.key}.png`));
}
console.log(`${pages.length} images générées dans ${OUT}`);
