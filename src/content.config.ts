import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    /** Alternative text for the cover image. Leave empty for decorative stock photos. */
    imageAlt: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

const TBD = '[À COMPLÉTER]';

/**
 * Collection « formations » : un fichier Markdown par formation dans src/data/formations/.
 * Les champs encore inconnus valent « [À COMPLÉTER] » et s'affichent surlignés sur le site.
 */
const formationCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/formations' }),
  schema: z.object({
    title: z.string(),
    /** ia | marketing-digital | vibe-coding | innovation | junior (voir CATEGORIES dans src/site.config.ts) */
    categorie: z.enum(['ia', 'marketing-digital', 'vibe-coding', 'innovation', 'junior']),
    /** Libellé du niveau affiché (ex. « Niveau 1 — Débutant »). */
    niveau: z.string().default(TBD),
    /** 1, 2 ou 3 : sert au filtre du catalogue. Laisser vide si non applicable. */
    niveauNum: z.number().optional(),
    /** Prix : nombre, 0 = gratuit. Laisser vide si inconnu. Un montant n'est affiché que si `devise` vaut MAD (dirhams). */
    prix: z.number().optional(),
    devise: z.string().default('USD'),
    prixNote: z.string().optional(),

    resume: z.string(),
    /** Texte long de la section « Description » de la fiche. Vide = section masquée. */
    description_detaillee: z.string().default(''),
    /** Outils affichés en pastilles (« Outils que vous allez apprendre »). Liste vide = section masquée. */
    outils: z.array(z.string()).default([]),
    objectifs: z.array(z.string()).default([TBD]),
    programme: z
      .array(z.object({ titre: z.string(), points: z.array(z.string()).optional() }))
      .default([{ titre: TBD }]),
    public: z.string().default(TBD),
    duree: z.string().default(TBD),
    modalites: z.string().default(TBD),
    prerequis: z.string().default(TBD),
    formateur: z.string().default(TBD),
    prochaineSession: z.string().default(TBD),
    /** Sections rédigées par nos soins, à relire : resume, objectifs, programme, public… */
    aValider: z.array(z.string()).default([]),

    brochure: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    draft: z.boolean().default(false),
    ancienneUrl: z.string().optional(),

    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = {
  post: postCollection,
  formations: formationCollection,
};
