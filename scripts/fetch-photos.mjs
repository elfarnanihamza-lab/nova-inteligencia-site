/**
 * Télécharge les photos du site (Unsplash, licence gratuite) dans src/assets/images/photos/.
 * Astro les optimise ensuite au build (AVIF/WebP, tailles responsives).
 * Usage : node scripts/fetch-photos.mjs   — Crédits : src/assets/images/photos/CREDITS.md
 */
import fs from 'node:fs';
import path from 'node:path';

export const PHOTOS = [
  {
    file: 'apprenante-code-classe',
    id: 'photo-1558301204-e3226482a77b',
    page: 'https://unsplash.com/photos/wr6eqJyxWy8',
    author: 'FLASHCOM INDONESIA',
  },
  {
    file: 'professionnels-ecran',
    id: 'photo-1531482615713-2afd69097998',
    page: 'https://unsplash.com/photos/IgUR1iX0mqM',
    author: '@disruptxn',
  },
  {
    file: 'equipe-ordinateurs',
    id: 'photo-1522071820081-009f0129c71c',
    page: 'https://unsplash.com/photos/QckxruozjRg',
    author: 'Annie Spratt',
  },
  {
    file: 'formation-entreprise',
    id: 'photo-1758691736545-5c33b6255dca',
    page: 'https://unsplash.com/photos/LzBMjkvZfh8',
    author: 'Vitaly Gariev',
  },
  {
    file: 'code-lumiere-bleue',
    id: 'photo-1607799279861-4dd421887fb3',
    page: 'https://unsplash.com/photos/8qEB0fTe9Vw',
    author: 'Mohammad Rahmani',
  },
  {
    file: 'casablanca-mosquee-hassan-ii',
    id: 'photo-1740602550091-0943d7cfb720',
    page: 'https://unsplash.com/photos/_Faweyea_10',
    author: 'Maria Krasnova',
  },
  {
    file: 'professionnelle-poste-travail',
    id: 'photo-1640163561331-1b68a6474957',
    page: 'https://unsplash.com/photos/rxVeUtYFOUg',
    author: 'RUT MIIT',
  },
  {
    file: 'equipe-projet',
    id: 'photo-1521737604893-d14cc237f11d',
    page: 'https://unsplash.com/photos/hCb3lIB8L8E',
    author: 'Annie Spratt',
  },
  {
    file: 'enseignant-eleves',
    id: 'photo-1778489769184-45868633c527',
    page: 'https://unsplash.com/photos/ereEoYDIl20',
    author: 'Poddar Group of Institutions',
  },
];

const OUT = 'src/assets/images/photos';
if (process.argv[1] && process.argv[1].endsWith('fetch-photos.mjs')) {
  fs.mkdirSync(OUT, { recursive: true });
  for (const p of PHOTOS) {
    const dest = path.join(OUT, `${p.file}.jpg`);
    if (fs.existsSync(dest)) continue;
    const res = await fetch(`https://images.unsplash.com/${p.id}?w=1800&q=80&fm=jpg&fit=max`);
    if (!res.ok) throw new Error(`${p.file} : HTTP ${res.status}`);
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    console.log('✓', dest);
  }
  const md = `# Crédits photos

Toutes les photos proviennent d'[Unsplash](https://unsplash.com) et sont publiées sous la [Licence Unsplash](https://unsplash.com/license) :
utilisation gratuite, y compris commerciale, sans obligation d'attribution (crédits indiqués ici par courtoisie).
Ce ne sont pas des photos de Nova Inteligencia Group : à remplacer par de vraies photos de vos formations dès qu'elles sont disponibles.

| Fichier | Auteur | Source |
|---|---|---|
${PHOTOS.map((p) => `| \`${p.file}.jpg\` | ${p.author} | ${p.page} |`).join('\n')}
`;
  fs.writeFileSync(path.join(OUT, 'CREDITS.md'), md);
}
