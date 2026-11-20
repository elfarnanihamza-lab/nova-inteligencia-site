import { SHOW_PLACEHOLDERS } from '~/site.config';

const PH = /(\[À COMPLÉTER[^\]]*\]|\[Proposition[^\]]*\])/g;
const PH_SENTENCE = /\s*\[(?:À COMPLÉTER|Proposition)[^\]]*\][^.!?]*[.!?]?/g;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const hasPh = (value?: string | null) => !!value && /\[(?:À COMPLÉTER|Proposition)/.test(value);

/** Texte débarrassé des marqueurs quand le mode présentation (SHOW_PLACEHOLDERS=false) est actif. */
export const clean = (value?: string | number | null): string => {
  if (value === undefined || value === null) return '';
  const s = String(value);
  return SHOW_PLACEHOLDERS
    ? s
    : s
        .replace(PH_SENTENCE, '')
        .replace(/\s*:\s*$/, '')
        .trim();
};

/** true si la valeur doit être affichée (renseignée, ou mode « manques visibles »). */
export const visible = (value?: string | number | null) => clean(value) !== '';

/** Échappe le texte et surligne les marqueurs [À COMPLÉTER] / [Proposition – à valider]. */
export const ph = (value?: string | number | null): string => {
  const s = clean(value);
  if (!s) return '';
  return esc(s).replace(PH, '<mark class="ph">$1</mark>');
};

/**
 * Tarifs : la devise officielle du site est le dirham marocain (DH / MAD). Seul un montant déclaré en MAD est affiché.
 *  - `free`    : prix 0 → « Gratuit » ;
 *  - `paid`    : montant confirmé en dirhams → « 1 500 DH » ;
 *  - `pending` : montant connu mais pas en dirhams (ancien site en USD, équivalent DH non validé) → jamais affiché ;
 *  - `unknown` : aucun prix saisi.
 * Les montants numériques des fiches ne sont jamais convertis ni modifiés : pour publier un tarif, renseignez
 * `devise: MAD` avec le montant réel en dirhams dans la fiche de la formation.
 */
export type PriceKind = 'free' | 'paid' | 'pending' | 'unknown';
export const priceKind = (prix?: number | null, devise?: string | null): PriceKind => {
  if (prix === undefined || prix === null) return 'unknown';
  if (prix === 0) return 'free';
  return /^(MAD|DH)$/i.test(devise ?? '') ? 'paid' : 'pending';
};
export const formatPrice = (prix?: number | null, devise?: string | null) => {
  const kind = priceKind(prix, devise);
  if (kind === 'unknown') return '[À COMPLÉTER]';
  if (kind === 'free') return 'Gratuit';
  if (kind === 'pending') return 'Tarif sur demande';
  return `${new Intl.NumberFormat('fr-FR').format(prix as number)} DH`.replace(/[\u202f\u00a0]/g, ' ');
};
