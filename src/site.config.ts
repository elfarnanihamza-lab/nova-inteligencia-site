/**
 * Configuration centrale de Nova Inteligencia Group.
 * Modifiez les valeurs ICI : elles sont reprises partout (en-tête, pied de page,
 * page contact, bouton WhatsApp, données structurées Schema.org).
 * Tant qu'une valeur vaut TBD, elle s'affiche en « [À COMPLÉTER] » (surligné) ou est masquée.
 */
export const TBD = '[À COMPLÉTER]';

/**
 * Contenus provisoires « [À COMPLÉTER] » / « [Proposition – à valider] ».
 * Par défaut : MASQUÉS (site final, aucun texte provisoire visible).
 * Pour les afficher en jaune pendant la relecture : `PUBLIC_SHOW_PLACEHOLDERS=true npm run dev`
 * (PowerShell : `$env:PUBLIC_SHOW_PLACEHOLDERS='true'; npm run dev`).
 */
export const SHOW_PLACEHOLDERS: boolean = import.meta.env.PUBLIC_SHOW_PLACEHOLDERS === 'true';

/**
 * Mode démonstration (PUBLIC_DEMO_MODE=true) : site de prévisualisation, NON indexable.
 *  - `noindex, nofollow` sur toutes les pages HTML (voir components/common/Metadata.astro) ;
 *  - pas de sitemap, `robots.txt` sans « Disallow » (pour que les moteurs lisent la directive noindex) ;
 *  - formulaires désactivés tant qu'aucun webhook n'est configuré (aucune demande n'est envoyée).
 * Ce mode n'est PAS une protection d'accès : pour un contenu confidentiel, activez la protection du
 * déploiement chez l'hébergeur (voir docs/deploiement-vercel.md).
 */
export const DEMO_MODE: boolean = import.meta.env.PUBLIC_DEMO_MODE === 'true';

/**
 * Variante de couleur du pied de page : 'nuit' (bleu nuit profond → bleu numérique) ou 'indigo' (bleu électrique profond).
 * Modifiable sans toucher au code avec PUBLIC_FOOTER_VARIANT.
 */
export const FOOTER_VARIANT: 'nuit' | 'indigo' = import.meta.env.PUBLIC_FOOTER_VARIANT === 'indigo' ? 'indigo' : 'nuit';

/**
 * Barre d'annonce affichée en haut de toutes les pages (composant nova/AnnouncementBar.astro).
 * `enabled: false` la masque. Changez `id` à chaque nouveau message : les visiteurs qui avaient fermé
 * l'ancien message verront le nouveau. Ne mettez que des informations exactes (dates, offres confirmées).
 */
export const ANNOUNCEMENT = {
  enabled: true,
  id: 'defilant-2026-b',
  /** Messages qui défilent en boucle (chacun avec son lien). */
  items: [
    {
      text: "IA Junior Academy : une première approche de l'IA pour les 5 à 17 ans.",
      cta: 'Découvrir',
      href: '/formations/ia-junior-academy',
    },
    {
      text: "Programmes d'entrepreneuriat et d'innovation gratuits.",
      cta: 'Voir les programmes',
      href: '/formations?categorie=innovation',
    },
    { text: 'Une formation sur mesure pour vos équipes ?', cta: 'Parlons-en', href: '/entreprises' },
    {
      text: 'Marketing digital pour entreprises : boostez vos ventes.',
      cta: 'Voir nos services',
      href: '/services-marketing',
    },
  ],
};

/**
 * Bandeau « Nos références » (logos fournis par Nova, affichés en bas de toutes les pages).
 * Les libellés sont ceux que vous confirmerez : vérifiez-les avant la mise en ligne.
 */
export const REFERENCES = {
  enabled: true,
  title: 'Nos références et affiliations',
  items: [
    { logo: 'amiia', name: "AMIIA : Association Marocaine pour l'Innovation en Intelligence Artificielle" },
    { logo: 'ministere', name: "Ministère de la Transition numérique et de la Réforme de l'administration" },
    { logo: 'aaai', name: 'AAAI : Association for the Advancement of Artificial Intelligence' },
    { logo: 'aaia', name: 'AAIA : American AI Association' },
    { logo: 'novaNm', name: 'NOVA New Mexico, USA' },
  ],
};

export const SITE_CONFIG = {
  name: 'Nova Inteligencia Group',
  shortName: 'Nova',
  slogan: "L'excellence académique à l'ère digitale",
  description:
    'Nova Inteligencia Group est un centre de formation en intelligence artificielle, stratégie digitale et leadership entrepreneurial basé à Casablanca, au Maroc.',
  /**
   * URL publique du site (sans slash final) : reprise de `site` (src/config.yaml), que la variable de build
   * SITE_URL peut remplacer (ex. URL de démonstration Vercel). À confirmer avec le nom de domaine définitif.
   */
  url: ((import.meta.env.SITE as string | undefined) || 'https://novainteligenciagroup.ma').replace(/\/$/, ''),

  contact: {
    email: 'contact@novainteligencia.group',
    /** Format affiché, ex. « +212 6 00 00 00 00 ». TBD tant que non fourni. */
    phone: TBD,
    /** Numéro WhatsApp : lu depuis PUBLIC_WHATSAPP_NUMBER (.env ou hébergeur), format international sans « + » ni espaces. Vide = bouton WhatsApp masqué. */
    whatsapp: (import.meta.env.PUBLIC_WHATSAPP_NUMBER as string | undefined) || '',
    whatsappMessage: 'Bonjour, je souhaite avoir des informations sur vos formations.',
    hours: TBD,
    address: {
      street: '207-209 Boulevard de la Résistance, Niveau 3, Suite 5',
      city: 'Casablanca',
      region: 'Casablanca-Settat',
      postalCode: '',
      country: 'MA',
      countryName: 'Maroc',
    },
    /**
     * Coordonnées GPS (Schema.org LocalBusiness).
     * Valeur APPROXIMATIVE : Boulevard de la Résistance (Mers Sultan) d'après OpenStreetMap, au niveau de la rue.
     * À remplacer par les coordonnées exactes du bâtiment (fiche Google Business Profile).
     */
    geo: { lat: 33.5868394, lng: -7.6049455 } as null | { lat: number; lng: number },
  },

  /** Laissez '' pour masquer l'icône. */
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
    x: '',
    linkedin: '',
    tiktok: '',
  },

  /**
   * Formulaire de contact / inscription.
   * endpoint : URL d'un webhook (Make, Zapier, n8n, Formspree, Web3Forms, API CRM…) qui reçoit un POST JSON.
   * Vide = le formulaire ouvre le client mail du visiteur (mailto) en secours.
   */
  form: {
    /** Numéro WhatsApp Business qui reçoit les demandes des formulaires (format international sans « + »). */
    whatsapp: ((import.meta.env.PUBLIC_FORM_WHATSAPP as string | undefined) || '212667944611').replace(/\D/g, ''),
    /** Renseigné par la variable d'environnement PUBLIC_FORM_WEBHOOK (fichier .env ou réglages de l'hébergeur). */
    endpoint: (import.meta.env.PUBLIC_FORM_WEBHOOK as string | undefined) || '',
    /** Démo sans webhook : l'envoi est désactivé et un message l'explique (aucune demande n'est transmise). */
    get disabled() {
      return DEMO_MODE && !this.endpoint;
    },
  },

  /**
   * Affiliations citées sur l'ancien site, SANS justificatif à ce jour.
   * Tant que `affiliationsVerified` vaut false, elles ne sont affichées nulle part (ni dans les données structurées).
   * Passez-le à true une fois les preuves obtenues (et ajoutez les logos officiels).
   */
  affiliationsVerified: false,
  affiliations: [
    { name: 'AAAI', fullName: 'Association for the Advancement of Artificial Intelligence' },
    { name: 'AAIA', fullName: 'American AI Association' },
    { name: 'AMIIA', fullName: "Association Marocaine pour l'Innovation en Intelligence Artificielle" },
  ],

  legal: {
    companyName: 'Nova Inteligencia Group',
    legalForm: TBD,
    capital: TBD,
    ice: TBD,
    rc: TBD,
    if: TBD,
    publicationDirector: TBD,
    host: TBD,
    lastUpdate: '17 octobre 2026',
  },
};

/**
 * Sphères d'influence (accueil). Seules celles marquées `verified: true` sont affichées :
 * elles correspondent à des formations réellement présentes au catalogue.
 * Les autres proviennent de l'ancien site mais restent à confirmer par Nova (voir questions-client.md).
 */
export const SPHERES = [
  {
    key: 'ia',
    icon: 'tabler:brain',
    title: 'Cursus en IA',
    text: "Formation à l'intelligence artificielle pour un usage opérationnel immédiat : Claude, ChatGPT, agents IA et automatisation.",
    category: 'ia',
    verified: true,
  },
  {
    key: 'digital',
    icon: 'tabler:target-arrow',
    title: 'Marketing digital',
    text: 'Lancer, suivre et optimiser des campagnes publicitaires, et créer les contenus qui les accompagnent.',
    category: 'marketing-digital',
    verified: true,
  },
  {
    key: 'business',
    icon: 'tabler:building-skyscraper',
    title: "Ingénierie d'affaire",
    text: 'Accompagnement stratégique pour bâtir des entreprises performantes : incubation, accélération et solutions technologiques.',
    category: 'innovation',
    verified: true,
  },
  {
    key: 'langues',
    icon: 'tabler:language',
    title: 'Expertise linguistique',
    text: 'Immersion linguistique de haut niveau pour les marchés mondiaux.',
    verified: false,
  },
  {
    key: 'academique',
    icon: 'tabler:school',
    title: 'Accompagnement académique',
    text: 'Tutorat pour maîtriser les concepts complexes.',
    verified: false,
  },
  {
    key: 'legal',
    icon: 'tabler:scale',
    title: 'Conseil légal',
    text: 'Expertise juridique pour protéger les innovations.',
    verified: false,
  },
];

export const CATEGORIES: Record<string, { label: string; description: string; icon: string }> = {
  ia: {
    icon: 'tabler:brain',
    label: 'Intelligence artificielle',
    description: "Maîtriser l'IA, ses outils, ses agents et l'automatisation.",
  },
  'marketing-digital': {
    icon: 'tabler:target-arrow',
    label: 'Marketing digital',
    description: 'Publicité en ligne, suivi des conversions et pilotage des campagnes.',
  },
  'vibe-coding': {
    icon: 'tabler:code',
    label: 'Vibe coding',
    description: "Créer un site ou une application en décrivant son besoin à l'IA.",
  },
  innovation: {
    icon: 'tabler:bulb',
    label: 'Entrepreneuriat & innovation',
    description: 'Du projet à la startup : compétences entrepreneuriales et technologiques.',
  },
  junior: { icon: 'tabler:school', label: 'Junior', description: "L'IA pour les enfants et adolescents." },
};

export const whatsappLink = (message?: string) => {
  const n = SITE_CONFIG.contact.whatsapp.replace(/\D/g, '');
  if (!n) return '/contact';
  const text = encodeURIComponent(message ?? SITE_CONFIG.contact.whatsappMessage);
  return `https://wa.me/${n}?text=${text}`;
};

export const isTbd = (v?: string | null) => !v || v.includes('À COMPLÉTER');
