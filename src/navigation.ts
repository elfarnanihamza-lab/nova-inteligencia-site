import { getPermalink, getBlogPermalink } from './utils/permalinks';
import { SITE_CONFIG, CATEGORIES } from './site.config';
import { categoryHref } from './utils/formation-links';

export const headerData = {
  links: [
    {
      text: 'Programmes',
      links: [
        { text: 'Tous nos programmes', href: getPermalink('/formations') },
        ...Object.entries(CATEGORIES).map(([key, c]) => ({
          text: c.label,
          href: categoryHref(key),
        })),
      ],
    },
    { text: 'Notre approche', href: getPermalink('/notre-approche') },
    { text: 'Marketing digital', href: getPermalink('/services-marketing') },
    { text: 'Entreprises', href: getPermalink('/entreprises') },
    { text: 'Le journal', href: getBlogPermalink() },
  ],
  actions: [{ variant: 'primary' as const, text: 'Nous rencontrer', href: getPermalink('/contact') }],
};

const social = SITE_CONFIG.social;
const socialDefs: Array<[keyof typeof social, string, string]> = [
  ['facebook', 'Facebook', 'tabler:brand-facebook'],
  ['instagram', 'Instagram', 'tabler:brand-instagram'],
  ['youtube', 'YouTube', 'tabler:brand-youtube'],
  ['x', 'X', 'tabler:brand-x'],
  ['linkedin', 'LinkedIn', 'tabler:brand-linkedin'],
  ['tiktok', 'TikTok', 'tabler:brand-tiktok'],
];

export const footerData = {
  links: [
    {
      title: 'À propos',
      links: [
        { text: 'Notre approche', href: getPermalink('/notre-approche') },
        { text: 'Entreprises', href: getPermalink('/entreprises') },
        { text: 'Marketing digital', href: getPermalink('/services-marketing') },
        { text: 'Le journal', href: getBlogPermalink() },
      ],
    },
    {
      title: 'Formations',
      links: [
        { text: 'Tout le catalogue', href: getPermalink('/formations') },
        ...Object.entries(CATEGORIES).map(([key, c]) => ({ text: c.label, href: categoryHref(key) })),
      ],
    },
    {
      title: 'Liens utiles',
      links: [
        { text: 'Contact', href: getPermalink('/contact') },
        { text: 'Demander un devis', href: getPermalink('/entreprises') + '#devis' },
        { text: 'Mentions légales', href: getPermalink('/mentions-legales') },
        { text: 'Politique de confidentialité', href: getPermalink('/politique-de-confidentialite') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Mentions légales', href: getPermalink('/mentions-legales') },
    { text: 'Politique de confidentialité', href: getPermalink('/politique-de-confidentialite') },
  ],
  socialLinks: socialDefs
    .filter(([k]) => !!social[k])
    .map(([k, label, icon]) => ({ ariaLabel: label, icon, href: social[k] })),
  footNote: `© ${new Date().getFullYear()} ${SITE_CONFIG.name}. Tous droits réservés.`,
};
