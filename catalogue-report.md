# Rapport — refonte du catalogue de formations

Branche locale `feat/nova-site` — aucun push, aucun déploiement.

## 1. Cause du dysfonctionnement des clics

Dans l'ancien catalogue, **seul le texte du titre était cliquable** : le lien « étiré » sur la carte ne couvrait pas le paragraphe ni la zone « Voir la formation » (clic sur ces zones = rien). Test réel avant correction : 12 cartes × 3 zones → 12 réussites sur 36.
Après correction (lien étiré en CSS propre, `z-index` au-dessus du contenu) : la carte entière ouvre la fiche. Les filtres, le guide « Comment choisir » et le bouton « Parler à un conseiller » fonctionnaient déjà.

## 2. Ce qui a changé

- Fond bleu nuit avec halos ; cartes en verre sombre ; photo immersive (ratio 16/10 identique) teintée de la couleur de la spécialité, zoom léger au survol ; badges catégorie, niveau (points) et GRATUIT.
- Couleur par spécialité réelle : fondamentaux = bleu électrique, productivité/agents IA = cyan, automatisation/workflows = turquoise, IA par métier = indigo, Digital Master Program = bleu nuit (liseré cyan → orange), entrepreneuriat et innovation = orange Nova, Junior = vert profond. Aucune couleur « juridique » ni « finance » : le catalogue n'a aucune formation de ce type.
- Filtres en vrais boutons (`aria-pressed`, clavier, mobile), compteurs, « Gratuit 4 », réinitialisation, message sans résultat ; l'URL reste partageable (`?categorie=&niveau=&tarif=`). Seules les catégories qui contiennent des formations sont affichées.
- Animations : apparition en cascade, élévation + bordure lumineuse au survol, zoom photo, transition à chaque filtre ; `prefers-reduced-motion` respecté. 4 colonnes à partir de 1536 px, 3 sur ordinateur, 2 sur tablette, 1 sur mobile.
- Durée et modalité : affichées si elles sont confirmées (aucune ne l'est aujourd'hui, donc rien n'est affiché).
- Fichiers : `src/components/nova/CatalogueCard.astro` (nouveau), `src/data/catalogue-visuals.ts` (nouveau), `src/pages/formations/index.astro`, `src/data/sessions.ts` (2 accents), `src/components/nova/ContactForm.astro` (suppression d'un `href="#"`), `scripts/seo-audit.mjs`.

## 3. Liens et boutons testés (44 contrôles, tous OK)

| Contrôle                                                                                                                                                                | Résultat |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 12 cartes : lien réel `<a href="/formations/…">`, route existante, HTTP 200, un seul lien par carte                                                                     | 12/12    |
| Clic souris au centre de la carte et sur le bouton « Découvrir » (cartes testées en lot)                                                                                | OK       |
| Liens du catalogue hors cartes (accueil, filtres, entreprises, à propos, blog, contact, mentions, confidentialité)                                                      | HTTP 200 |
| `href="#"`, liens vides, liens imbriqués dans le catalogue                                                                                                              | aucun    |
| 12 fiches : liens internes (17 par fiche), formulaire d'inscription présent, bouton « S'inscrire » → `/contact?formation=<slug>#formulaire` (route et ancre existantes) | 12/12    |
| Clavier : Tab atteint la carte avec contour de focus, Entrée ouvre la fiche, Tab + Espace active un filtre                                                              | OK       |
| Filtres au clic : catégorie, niveau, tarif, combinaisons, combinaison vide + réinitialisation, URL partagée, filtre inconnu ignoré                                      | OK       |
| Erreurs JavaScript console                                                                                                                                              | aucune   |

Limite : l'ouverture dans un nouvel onglet est garantie par le lien natif (vérifié : `<a href>` sans gestionnaire de clic ni `target`), mais le navigateur sans interface utilisé pour les tests n'ouvre pas réellement d'onglet ; à vérifier à la main (Ctrl+clic ou clic molette).

## 4. Gratuité et tarifs (règles globales)

Voir `audit-prix-gratuit.md` (commit précédent). Rappel : 4 formations gratuites (source : ancien site, `content-inventory.md`), badge GRATUIT sur cartes, fiches et section « Prochaines sessions » ; aucun prix en dollars (recherche finale : 0 occurrence de `$`, USD ou dollar dans les 39 fichiers publiés).

**Tarifs à valider commercialement (montant réel en DH requis, aujourd'hui « Tarif sur demande »)** : Level 1 AI Foundations (hérité : 100), Level 2 Productivité & automatisation (150), Level 3 Workflows (200), Level 1 IA + Métier (150), Level 2 IA + Métier (250), Level 3 IA + Métier (350), Nova Digital Master Program (500), IA Junior Academy (3 500). Pour publier : `prix` + `devise: MAD` dans la fiche.

## 5. Points à confirmer ou à fournir

- Photos : 9 photos libres de droits pour 12 formations (3 réutilisées avec un autre cadrage) ; ce ne sont pas des photos de Nova.
- Durée, modalité, niveau des 3 formations d'entrepreneuriat/innovation et conditions d'accès aux formations gratuites : `[À COMPLÉTER]` dans les fiches.
- Rubriques demandées « Programmes avancés » et « Productivité et automatisation » : le catalogue réel est organisé par catégorie (IA, IA + Métier, Parcours digital, Entrepreneuriat & innovation, Junior), par niveau (1 à 3) et par tarif ; je n'ai pas créé de rubriques qui ne correspondent à aucune donnée.
- Les cartes de formations proposées en bas des fiches (« formations similaires ») gardent l'ancien style clair.

## 6. Captures

`screenshots/catalogue-2026/` : `catalogue-AVANT-*.png`, `catalogue-desktop-1440x900.png`, `catalogue-laptop-1366x600.png`, `catalogue-mobile-375x667.png`, `catalogue-filtre-gratuit-1440x900.png`, `catalogue-comparaison-avant-apres.png`.
