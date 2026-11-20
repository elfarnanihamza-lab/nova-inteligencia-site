import { priceKind } from '~/utils/placeholders';
import { SITE_CONFIG, isTbd } from '~/site.config';

const base = SITE_CONFIG.url;

const sameAs = () => Object.values(SITE_CONFIG.social).filter(Boolean);

const address = () => {
  const a = SITE_CONFIG.contact.address;
  return {
    '@type': 'PostalAddress',
    streetAddress: a.street,
    addressLocality: a.city,
    addressRegion: a.region,
    ...(a.postalCode ? { postalCode: a.postalCode } : {}),
    addressCountry: a.country,
  };
};

/** Organization + EducationalOrganization + LocalBusiness (un seul nœud multi-typé) + WebSite. */
export const organizationSchema = () => {
  const c = SITE_CONFIG.contact;
  return [
    {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'EducationalOrganization', 'LocalBusiness'],
      '@id': `${base}/#organization`,
      name: SITE_CONFIG.name,
      url: base,
      logo: `${base}/logo.png`,
      image: `${base}/og-default.png`,
      description: SITE_CONFIG.description,
      slogan: SITE_CONFIG.slogan,
      email: c.email,
      ...(isTbd(c.phone) ? {} : { telephone: c.phone }),
      ...(isTbd(c.hours) ? {} : { openingHours: c.hours }),
      address: address(),
      ...(c.geo ? { geo: { '@type': 'GeoCoordinates', latitude: c.geo.lat, longitude: c.geo.lng } } : {}),
      areaServed: { '@type': 'Country', name: 'Maroc' },
      knowsAbout: ['Intelligence artificielle', 'Formation professionnelle', 'Automatisation', 'Stratégie digitale'],
      ...(SITE_CONFIG.affiliationsVerified
        ? {
            memberOf: SITE_CONFIG.affiliations.map((a) => ({
              '@type': 'Organization',
              name: a.fullName,
              alternateName: a.name,
            })),
          }
        : {}),
      ...(sameAs().length ? { sameAs: sameAs() } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${base}/#website`,
      url: base,
      name: SITE_CONFIG.name,
      inLanguage: 'fr',
      publisher: { '@id': `${base}/#organization` },
    },
  ];
};

export const courseSchema = (f: {
  title: string;
  description: string;
  url: string;
  prix?: number;
  devise?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: f.title,
  description: f.description,
  url: f.url,
  inLanguage: 'fr',
  provider: {
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': `${base}/#organization`,
    name: SITE_CONFIG.name,
    sameAs: base,
  },
  // Offre publiée seulement si le tarif est gratuit ou confirmé en dirhams (MAD) : jamais de montant en USD.
  ...(priceKind(f.prix, f.devise) === 'free' || priceKind(f.prix, f.devise) === 'paid'
    ? {
        offers: {
          '@type': 'Offer',
          category: f.prix === 0 ? 'Free' : 'Paid',
          price: f.prix,
          priceCurrency: 'MAD',
          url: f.url,
        },
      }
    : {}),
});

export const faqSchema = (items: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({
    '@type': 'Question',
    name: i.question,
    acceptedAnswer: { '@type': 'Answer', text: i.answer },
  })),
});

export const breadcrumbSchema = (crumbs: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
});
