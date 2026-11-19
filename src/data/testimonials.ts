/**
 * Témoignages de la page d'accueil (section « Ils nous font confiance », src/components/nova/Testimonials.astro).
 *
 * À ce jour, AUCUN témoignage authentique n'a été fourni : seuls six témoignages FICTIFS de démonstration sont affichés
 * (voir plus bas ; à retirer avant la production).
 *
 * Pour ajouter un VRAI témoignage : copiez un bloc, remplissez les champs et retirez `demo`.
 * N'ajoutez que des avis réels, avec l'accord écrit de la personne (et pour la photo, une autorisation d'usage).
 * `rating` : seulement si la note provient d'une évaluation réelle ; sinon, laissez le champ absent (pas d'étoiles).
 *
 * Les entrées `demo: true` sont des exemples FICTIFS : elles disparaissent quand SHOW_FICTIONAL_TESTIMONIALS vaut false.
 */
export interface Testimonial {
  /** Prénom et nom (ou prénom + initiale), avec l'accord de la personne. */
  name: string;
  /** Métier ou profil, s'il est confirmé. */
  role?: string;
  company?: string;
  /** Citation (2 à 4 phrases). */
  quote: string;
  /** Note sur 5 : uniquement issue d'une évaluation réelle. */
  rating?: 1 | 2 | 3 | 4 | 5;
  /** Photo autorisée : chemin dans /public (ex. '/temoignages/prenom.jpg'). À défaut, les initiales sont affichées. */
  photo?: string;
  /** Formation suivie (titre exact du catalogue). */
  formation?: string;
  /** Exemple de mise en page, affiché seulement en développement local. */
  demo?: boolean;
}

/**
 * ⚠ TÉMOIGNAGES FICTIFS (démonstration) : noms, profils et textes inventés pour visualiser le carrousel.
 * Ils sont signalés « Témoignages illustratifs — exemples fictifs » sur la page, sans photo ni note.
 * À RETIRER avant la mise en production : passez SHOW_FICTIONAL_TESTIMONIALS à false (ou supprimez ces six entrées)
 * et ajoutez de vrais avis. Tant qu'il n'existe aucun vrai avis, la section disparaît alors du site.
 */
export const testimonials: Testimonial[] = [
  {
    name: 'Salma El Amrani',
    role: 'Entrepreneure — Casablanca',
    quote: "Cette formation m'a permis de mieux comprendre comment intégrer l'IA dans mon activité et d'identifier des tâches que je peux automatiser.",
    demo: true,
  },
  {
    name: 'Youssef Benali',
    role: 'Responsable marketing — Rabat',
    quote: "J'ai découvert de nouvelles façons d'utiliser l'IA pour préparer mes contenus, structurer mes campagnes et gagner du temps au quotidien.",
    demo: true,
  },
  {
    name: 'Imane Alaoui',
    role: 'Consultante indépendante — Marrakech',
    quote: "Le programme m'a aidée à mieux comprendre les outils d'IA et à imaginer des applications concrètes pour mon travail.",
    demo: true,
  },
  {
    name: 'Mehdi Berrada',
    role: 'Entrepreneur — Tanger',
    quote: "J'ai particulièrement apprécié la dimension pratique et les exemples d'utilisation de l'intelligence artificielle dans un contexte professionnel.",
    demo: true,
  },
  {
    name: 'Sara Bennani',
    role: 'Professionnelle de la finance — Casablanca',
    quote: "J'ai découvert plusieurs possibilités pour faciliter certaines tâches d'analyse et améliorer mon organisation grâce à l'IA.",
    demo: true,
  },
  {
    name: 'Amine Tazi',
    role: 'Développeur web — Fès',
    quote: "Cette découverte de l'IA m'a permis d'explorer de nouveaux outils et de réfléchir à leur intégration dans mes projets numériques.",
    demo: true,
  },
];

/**
 * Interrupteur local des témoignages fictifs. Désactivé par défaut (false) : aucun faux avis n'est affiché.
 * Pour les voir en local : mettre true ET lancer `npm run dev`.
 * Garde-fou : même avec true, ils ne s'affichent JAMAIS dans un build (`npm run build`, démo Vercel ou production),
 * car l'affichage exige aussi import.meta.env.DEV.
 */
export const SHOW_FICTIONAL_TESTIMONIALS = false;

/** Témoignages réellement affichés : les vrais, plus les exemples fictifs seulement en développement local et si l'interrupteur est actif. */
const realOrDev = testimonials.filter((t) => !t.demo || (SHOW_FICTIONAL_TESTIMONIALS && import.meta.env.DEV));

/**
 * Outil de test « break-ui » : PUBLIC_BREAK_UI=worst|one|many|empty remplace les avis par des cas extrêmes (src/data/testimonials.worst.ts).
 * La variable n'existe jamais en production : la branche est supprimée du build (le fichier de test n'est pas embarqué).
 */
const breakMode = import.meta.env.PUBLIC_BREAK_UI as 'worst' | 'one' | 'many' | 'empty' | undefined;
const breakSets = breakMode ? await import('./testimonials.worst') : undefined;
export const visibleTestimonials: Testimonial[] = breakSets
  ? { worst: breakSets.worstCase, one: breakSets.oneCase, many: breakSets.manyCase, empty: breakSets.emptyCase }[breakMode!] ?? realOrDev
  : realOrDev;
