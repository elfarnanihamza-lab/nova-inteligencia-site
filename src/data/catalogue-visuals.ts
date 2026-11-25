/**
 * Habillage visuel du catalogue (src/pages/formations/index.astro, CatalogueCard.astro).
 * - Une couleur d'accent par spécialité réelle du catalogue (pas au hasard) : fondamentaux = bleu électrique,
 *   productivité et agents IA = cyan, automatisation et workflows = turquoise,
 *   entrepreneuriat et innovation = orange Nova,
 *   Junior = vert profond. L'orange reste aussi la couleur des boutons. Pas de couleur « juridique » ni « finance » :
 *   le catalogue ne contient aucune formation de ce type.
 * - Une photo par formation (src/assets/images/photos/<nom>.jpg, crédits dans CREDITS.md). Ce ne sont pas des photos
 *   de Nova : le nombre de photos libres de droits étant limité, certaines sont réutilisées avec un cadrage différent.
 *   À remplacer par de vraies photos de vos formations.
 */
import { ACCENTS, type SessionAccent } from '~/data/sessions';

export type CategoryKey = 'ia' | 'marketing-digital' | 'vibe-coding' | 'innovation' | 'junior';

/** Couleur des boutons de filtre (par catégorie). */
export const CATEGORY_ACCENT: Record<CategoryKey, SessionAccent> = {
  ia: 'bleu',
  'marketing-digital': 'bleu',
  'vibe-coding': 'bleu',
  innovation: 'orange',
  junior: 'vert',
};

/** Couleur de chaque formation (par spécialité). */
export const FORMATION_ACCENT: Record<string, SessionAccent> = {
  'maitriser-claude-chatgpt': 'bleu',
  'agents-ia-automatisation-n8n-make-claude': 'cyan',
  'media-buyer-meta-google-tiktok-ads': 'bleu',
  'media-buying-tracking-scaling-roas': 'cyan',
  'vibe-coding-site-web-ia': 'bleu',
  'vibe-coding-applications-outils-metier': 'turquoise',
  'startup-booster': 'orange',
  'innovation-ia-solutions-technologiques': 'orange',
  'ia-junior-academy': 'vert',
};

const style = (k: SessionAccent) => {
  const a = ACCENTS[k];
  const line = k === 'nuit' ? 'linear-gradient(90deg,#b8cc1a,#f36b12)' : a.ac;
  return `--ac:${a.ac};--ink:${a.ink};--line:${line}`;
};
export const accentStyle = (cat: string) => style(CATEGORY_ACCENT[cat as CategoryKey] ?? 'bleu');
export const formationAccentStyle = (slug: string, cat: string) =>
  style(FORMATION_ACCENT[slug] ?? CATEGORY_ACCENT[cat as CategoryKey] ?? 'bleu');

/** Photo et cadrage (object-position) de chaque formation. */
export const PHOTOS: Record<string, { name: string; position: string }> = {
  'maitriser-claude-chatgpt': { name: 'espace-etude', position: '50% 50%' },
  'agents-ia-automatisation-n8n-make-claude': { name: 'apprenant-portable', position: '30% 40%' },
  'media-buyer-meta-google-tiktok-ads': { name: 'atelier-marketing', position: '35% 45%' },
  'media-buying-tracking-scaling-roas': { name: 'equipe-marketing', position: '65% 45%' },
  'vibe-coding-site-web-ia': { name: 'atelier-formation', position: '60% 35%' },
  'vibe-coding-applications-outils-metier': { name: 'portrait-bureau', position: '60% 45%' },
  'startup-booster': { name: 'equipe-marketing', position: '90% 50%' },
  'innovation-ia-solutions-technologiques': { name: 'atelier-formation', position: '70% 70%' },
  'ia-junior-academy': { name: 'atelier-junior', position: '40% 40%' },
};
