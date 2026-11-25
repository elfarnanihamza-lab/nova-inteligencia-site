/**
 * Section « Prochaines sessions » de l'accueil (src/components/nova/SessionsSection.astro).
 *
 * Cette liste ne contient QUE le choix et l'ordre des formations mises en avant, avec leur badge, leur photo et leur
 * couleur d'accent. Les informations pratiques sont lues dans la fiche de chaque formation
 * (src/data/formations/<slug>.md), qui reste la source unique :
 *   - prochaineSession : date de la prochaine session (ex. « 12 novembre 2026 ») ;
 *   - duree            : durée (ex. « 4 semaines, 2 h par semaine ») ;
 *   - modalites        : format (présentiel, distanciel ou hybride) ;
 *   - niveau, prix     : niveau et tarif.
 * Tant qu'un champ vaut « [À COMPLÉTER] », il n'est pas affiché ; la date apparaît alors « À confirmer »
 * et la carte propose « Être informé de la prochaine session » (page contact, formation présélectionnée).
 *
 * Ajouter une carte : ajouter une ligne ci-dessous. Le slug doit exister (sinon le build échoue).
 * Badges : décrire le contenu réel de la formation, sans promesse absente du programme.
 * Photos : fichiers de src/assets/images/photos/ (crédits dans CREDITS.md) ; ce ne sont pas des photos de Nova.
 * Couleurs : l'orange reste la couleur principale du site ; ces accents ne servent qu'à distinguer les formations.
 */
export type SessionAccent = 'orange' | 'bleu' | 'cyan' | 'turquoise' | 'indigo' | 'vert' | 'rouge' | 'nuit';

/** `ac` : bordure, icônes et accents graphiques ; `ink` : texte (contraste ≥ 4,5:1 sur fond blanc). */
export const ACCENTS: Record<SessionAccent, { ac: string; ink: string }> = {
  orange: { ac: '#f36b12', ink: '#b8460a' },
  bleu: { ac: '#111111', ink: '#111111' },
  cyan: { ac: '#b8cc1a', ink: '#0a6fa3' },
  nuit: { ac: '#4d7ad6', ink: '#1e3f8f' },
  turquoise: { ac: '#0e9aa7', ink: '#0b717c' },
  indigo: { ac: '#5b4bdb', ink: '#4338ca' },
  vert: { ac: '#167a55', ink: '#0f6445' },
  rouge: { ac: '#d63a3a', ink: '#b42323' },
};

export interface SessionEntry {
  /** Nom du fichier de la formation, sans .md */
  slug: string;
  /** Badge de catégorie affiché sur la photo */
  badge: string;
  /** Photo de la carte : nom du fichier dans src/assets/images/photos/, sans .jpg */
  photo: string;
  /** Cadrage de la photo (object-position) */
  position?: string;
  accent: SessionAccent;
}

export const SESSIONS: SessionEntry[] = [
  {
    slug: 'maitriser-claude-chatgpt',
    badge: 'Claude & ChatGPT',
    photo: 'espace-etude',
    position: '70% 40%',
    accent: 'orange',
  },
  {
    slug: 'agents-ia-automatisation-n8n-make-claude',
    badge: 'Agents IA & automatisation',
    photo: 'apprenant-portable',
    position: '30% 50%',
    accent: 'bleu',
  },
  {
    slug: 'vibe-coding-site-web-ia',
    badge: 'Vibe coding',
    photo: 'atelier-formation',
    position: '60% 40%',
    accent: 'turquoise',
  },
  {
    slug: 'media-buyer-meta-google-tiktok-ads',
    badge: 'Publicité en ligne',
    photo: 'equipe-marketing',
    position: '40% 40%',
    accent: 'indigo',
  },
  {
    slug: 'media-buying-tracking-scaling-roas',
    badge: 'Tracking & ROAS',
    photo: 'atelier-marketing',
    position: '55% 50%',
    accent: 'rouge',
  },
  {
    slug: 'ia-junior-academy',
    badge: 'Junior · 5–17 ans',
    photo: 'equipe-marketing',
    position: '60% 50%',
    accent: 'vert',
  },
];
