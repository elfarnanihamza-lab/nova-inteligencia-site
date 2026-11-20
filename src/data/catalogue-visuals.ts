/**
 * Habillage visuel du catalogue (src/pages/formations/index.astro, CatalogueCard.astro).
 * - Une couleur d'accent par spécialité réelle du catalogue (pas au hasard) : fondamentaux = bleu électrique,
 *   productivité et agents IA = cyan, automatisation et workflows = turquoise, IA par métier = indigo,
 *   Digital Master Program = bleu nuit (liseré cyan → orange), entrepreneuriat et innovation = orange Nova,
 *   Junior = vert profond. L'orange reste aussi la couleur des boutons. Pas de couleur « juridique » ni « finance » :
 *   le catalogue ne contient aucune formation de ce type.
 * - Une photo par formation (src/assets/images/photos/<nom>.jpg, crédits dans CREDITS.md). Ce ne sont pas des photos
 *   de Nova : le nombre de photos libres de droits étant limité, certaines sont réutilisées avec un cadrage différent.
 *   À remplacer par de vraies photos de vos formations.
 */
import { ACCENTS, type SessionAccent } from '~/data/sessions';

export type CategoryKey = 'ia' | 'ia-metier' | 'parcours' | 'innovation' | 'junior';

/** Couleur des boutons de filtre (par catégorie). */
export const CATEGORY_ACCENT: Record<CategoryKey, SessionAccent> = {
  ia: 'bleu',
  'ia-metier': 'indigo',
  parcours: 'nuit',
  innovation: 'orange',
  junior: 'vert',
};

/** Couleur de chaque formation (par spécialité). */
export const FORMATION_ACCENT: Record<string, SessionAccent> = {
  'level-1-ai-foundations': 'bleu',
  'level-2-ai-productivity-automation': 'cyan',
  'level-3-ai-professional-workflows': 'turquoise',
  'level-1-fondamentaux-ia-metier': 'indigo',
  'level-2-ia-metier-techniques-avancees': 'indigo',
  'level-3-ai-metier-professionnel': 'indigo',
  'nova-digital-master-program': 'nuit',
  'formation-entrepreneuriale-developpement-competences': 'orange',
  'de-l-idee-au-projet': 'orange',
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
  'level-1-ai-foundations': { name: 'espace-etude', position: '50% 50%' },
  'level-2-ai-productivity-automation': { name: 'apprenant-portable', position: '30% 40%' },
  'level-3-ai-professional-workflows': { name: 'atelier-formation', position: '60% 35%' },
  'level-1-fondamentaux-ia-metier': { name: 'professionnelle-sourire', position: '25% 40%' },
  'level-2-ia-metier-techniques-avancees': { name: 'equipe-marketing', position: '40% 40%' },
  'level-3-ai-metier-professionnel': { name: 'portrait-bureau', position: '75% 45%' },
  'nova-digital-master-program': { name: 'atelier-marketing', position: '60% 45%' },
  'formation-entrepreneuriale-developpement-competences': { name: 'brainstorm-notes', position: '50% 40%' },
  'de-l-idee-au-projet': { name: 'brainstorm-notes', position: '85% 50%' },
  'startup-booster': { name: 'equipe-marketing', position: '90% 50%' },
  'innovation-ia-solutions-technologiques': { name: 'atelier-formation', position: '70% 70%' },
  'ia-junior-academy': { name: 'atelier-junior', position: '40% 40%' },
};
