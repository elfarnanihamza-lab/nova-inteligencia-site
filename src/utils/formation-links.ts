/**
 * Règles de liens vers les formations (maillage interne).
 * - formationHref(slug) : lien vers une fiche ; le build échoue si la fiche n'existe pas (aucun lien cassé possible).
 * - categoryHref(key)   : catalogue filtré si la catégorie compte au moins 2 formations,
 *                         sinon lien direct vers l'unique fiche (jamais un catalogue presque vide).
 * Les comptes sont lus dans src/data/formations/*.md (formations en brouillon exclues).
 */
type Fm = { categorie: string; draft?: boolean; order?: number };
const modules = import.meta.glob<{ frontmatter: Fm }>('/src/data/formations/*.md', { eager: true });

const formations = Object.entries(modules)
  .map(([file, mod]) => ({ slug: file.split('/').pop()!.replace(/\.md$/, ''), ...mod.frontmatter }))
  .filter((f) => !f.draft)
  .sort((a, b) => (a.order ?? 100) - (b.order ?? 100));

export const formationsInCategory = (key: string) => formations.filter((f) => f.categorie === key);

export const formationHref = (slug: string) => {
  if (!formations.some((f) => f.slug === slug)) throw new Error(`Lien vers une formation inexistante : ${slug}`);
  return `/formations/${slug}`;
};

export const categoryHref = (key: string) => {
  const list = formationsInCategory(key);
  if (list.length === 0) throw new Error(`Catégorie sans formation : ${key}`);
  return list.length === 1 ? formationHref(list[0].slug) : `/formations?categorie=${key}`;
};
