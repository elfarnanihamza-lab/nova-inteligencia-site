/**
 * Génère les variantes du logo officiel Nova Inteligencia Group (src/assets/brand/logo-source-2026.jpg) :
 *  - logo-full.png        : logo complet (phénix, cerveau, NOVA, signatures), fond transparent, couleurs d'origine ;
 *  - logo-full-light.png  : même logo pour fond bleu marine : seul le texte marine passe en blanc
 *                           (phénix, circuits, cerveau, sphère et orange inchangés) ;
 *  - logo.png / logo-light.png : version compacte horizontale pour l'en-tête — le symbole et le nom
 *                           sont recadrés dans l'original et juxtaposés à la même échelle (aucune déformation) ;
 *  - favicon (symbole phénix + cerveau) et image de partage par défaut.
 * Usage : npm run brand
 */
import sharp from 'sharp';
import fs from 'node:fs';

const SRC = 'src/assets/brand/logo-source-2026.jpg';
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

// Zones mesurées sur le fichier source (1254 × 1254)
const SYMBOL = { left: 166, top: 18, width: 870, height: 690 }; // phénix + cerveau + circuits
const WORDMARK = { left: 166, top: 702, width: 926, height: 382 }; // NOVA + INTELIGENCIA + GROUP
const FULL = { left: 160, top: 14, width: 934, height: 1196 }; // logo complet avec signatures
const SPHERE = { x0: 415, x1: 640, y0: 700, y1: 910 }; // le « O » de NOVA : couleurs conservées

const dark = Buffer.alloc(W * H * 4);
const light = Buffer.alloc(W * H * 4);
for (let p = 0, i = 0; p < W * H; p++, i += 3) {
  const r = data[i],
    g = data[i + 1],
    b = data[i + 2];
  let a = Math.max(255 - r, 255 - g, 255 - b) / 255;
  if (a < 0.05) a = 0; // bruit JPEG du fond blanc
  let R = r,
    G = g,
    B = b;
  if (a > 0) {
    R = Math.max(0, Math.min(255, Math.round(255 - (255 - r) / a)));
    G = Math.max(0, Math.min(255, Math.round(255 - (255 - g) / a)));
    B = Math.max(0, Math.min(255, Math.round(255 - (255 - b) / a)));
  }
  const o = p * 4;
  dark[o] = R;
  dark[o + 1] = G;
  dark[o + 2] = B;
  dark[o + 3] = Math.round(a * 255);
  // Version claire : texte marine (zone du nom et des signatures, hors sphère) -> blanc
  const x = p % W,
    y = (p / W) | 0;
  const inText = y >= 700 && !(x >= SPHERE.x0 && x <= SPHERE.x1 && y >= SPHERE.y0 && y <= SPHERE.y1);
  const isNavy = a > 0 && B >= R + 25 && Math.max(R, G, B) < 175;
  if (inText && isNavy) {
    light[o] = 255;
    light[o + 1] = 255;
    light[o + 2] = 255;
  } else {
    light[o] = R;
    light[o + 1] = G;
    light[o + 2] = B;
  }
  light[o + 3] = dark[o + 3];
}
const raw = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 4 } });
const crop = (buf, box) => raw(buf).extract(box).png().toBuffer();
// PNG indexé (palette 256 couleurs, tramage léger) : net, transparent, 3 à 6 fois plus léger. Les variantes WebP/AVIF
// affichées dans le site sont produites au build par astro:assets à partir de ces PNG.
const opt = (img) =>
  img.png({ palette: true, quality: 92, effort: 10, colours: 256, dither: 0.6, compressionLevel: 9 });

fs.mkdirSync('src/assets/brand', { recursive: true });
// Logo complet : affiché à 176 px de haut au maximum (pied de page) → 576 px de haut suffisent, même en écran 3x.
await opt(sharp(await crop(dark, FULL)).resize({ height: 576 })).toFile('src/assets/brand/logo-full.png');
await opt(sharp(await crop(light, FULL)).resize({ height: 576 })).toFile('src/assets/brand/logo-full-light.png');
// /logo.png : référencé par les données structurées (Schema.org) ; ≥ 112 px exigés par Google, 336 px de large ici.
await opt(sharp(await crop(dark, FULL)).resize({ width: 336 })).toFile('public/logo.png');

// Variante compacte : symbole à gauche, nom à droite, même hauteur, proportions conservées
const lockup = async (buf, file) => {
  const h = 180; // affiché à 58 px de haut au maximum (en-tête) : 180 px couvrent un écran 3x
  const sym = await sharp(await crop(buf, SYMBOL))
    .resize({ height: h })
    .png()
    .toBuffer();
  const word = await sharp(await crop(buf, WORDMARK))
    .resize({ height: Math.round(h * 0.86) })
    .png()
    .toBuffer();
  const sw = (await sharp(sym).metadata()).width,
    ww = (await sharp(word).metadata()).width;
  const gap = 17;
  const merged = await sharp({
    create: { width: sw + gap + ww, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: sym, left: 0, top: 0 },
      { input: word, left: sw + gap, top: Math.round(h * 0.07) },
    ])
    .png()
    .toBuffer();
  await opt(sharp(merged)).toFile(file);
};
await lockup(dark, 'src/assets/brand/logo.png');
await lockup(light, 'src/assets/brand/logo-light.png');

// Favicon : symbole sur carré blanc arrondi
const symPng = await crop(dark, SYMBOL);
const icon = async (size, pad, file) => {
  const inner = Math.round(size * (1 - pad * 2));
  const s = await sharp(symPng)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="#ffffff"/></svg>`
  );
  await opt(sharp(bg).composite([{ input: s, gravity: 'center' }])).toFile(file);
};
await icon(512, 0.08, 'public/favicon.png');
await icon(180, 0.08, 'src/assets/favicons/apple-touch-icon.png');
fs.copyFileSync('public/favicon.png', 'src/assets/favicons/favicon.png');
const png32 = await sharp('public/favicon.png')
  .resize(32, 32)
  .png({ palette: true, quality: 92, effort: 10 })
  .toBuffer();
const hdr = Buffer.alloc(22);
hdr.writeUInt16LE(0, 0);
hdr.writeUInt16LE(1, 2);
hdr.writeUInt16LE(1, 4);
hdr[6] = 32;
hdr[7] = 32;
hdr.writeUInt16LE(1, 10);
hdr.writeUInt16LE(32, 12);
hdr.writeUInt32LE(png32.length, 14);
hdr.writeUInt32LE(22, 18);
fs.writeFileSync('src/assets/favicons/favicon.ico', Buffer.concat([hdr, png32]));
fs.copyFileSync('src/assets/favicons/favicon.ico', 'public/favicon.ico');

// Image de partage par défaut (les images par page sont produites par npm run og)
const logoLight = await sharp('src/assets/brand/logo-full-light.png').resize({ height: 470 }).toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs>
<radialGradient id="r" cx=".2" cy=".5" r=".7"><stop offset="0" stop-color="#0757C8" stop-opacity=".55"/><stop offset="1" stop-color="#071B49" stop-opacity="0"/></radialGradient>
<linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#F36B12"/><stop offset="1" stop-color="#FF9B32"/></linearGradient></defs>
<rect width="1200" height="630" fill="#071B49"/><rect width="1200" height="630" fill="url(#r)"/>
<text x="560" y="260" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="50" fill="#ffffff">Formation en</text>
<text x="560" y="322" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="50" fill="#ffffff">intelligence artificielle</text>
<text x="560" y="384" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="50" fill="#ffffff">à Casablanca</text>
<rect x="560" y="420" width="140" height="5" rx="2.5" fill="url(#g)"/>
<text x="560" y="480" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#C9D6EE">Apprendre · Innover · Transformer</text></svg>`;
await opt(sharp(Buffer.from(svg)).composite([{ input: logoLight, left: 90, top: 80 }])).toFile(
  'src/assets/images/default.png'
);
fs.copyFileSync('src/assets/images/default.png', 'public/og-default.png');
console.log('ok');
