# Audit des prix (DH) et des formations gratuites

Branche locale `feat/nova-site` — rien n'est commité, poussé ni déployé.

## 1. Règle appliquée

La devise officielle du site est le dirham marocain (DH / MAD). **Seul un montant déclaré en MAD est affiché.**
Les montants numériques des fiches n'ont **pas été modifiés ni convertis**.

| Cas | Condition (fiche de formation) | Affichage | Données structurées (JSON-LD) |
|---|---|---|---|
| Gratuit | `prix: 0` | Badge « GRATUIT » | `price: 0`, `priceCurrency: MAD`, `category: Free` |
| Tarif confirmé | `prix: N` + `devise: MAD` | « 1 500 DH » (espace entre milliers) | `price: N`, `priceCurrency: MAD` |
| Tarif non confirmé en DH | `prix: N` sans `devise: MAD` (cas actuel) | « Tarif sur demande » | aucune offre publiée |
| Aucun prix | pas de `prix` | « [À COMPLÉTER] » (masqué) | aucune offre |

Pour publier un tarif : renseigner dans la fiche `prix: <montant réel en dirhams>` et `devise: MAD`.

## 2. Formatage centralisé

`src/utils/placeholders.ts` : `priceKind()` et `formatPrice()` sont désormais l'unique point de formatage, utilisé par la carte de formation, la fiche, la section « Prochaines sessions », la FAQ et `schema.ts`.

## 3. Prix en dollars détectés

Tous proviennent de l'ancien site (voir `content-inventory.md`, colonne prix) et sont stockés sans devise (défaut technique `USD`).

| Fiche (`src/data/formations/`) | Montant stocké | Traitement | À confirmer |
|---|---|---|---|
| `level-1-ai-foundations.md` | 100 | masqué → « Tarif sur demande » | prix en DH |
| `level-2-ai-productivity-automation.md` | 150 | masqué | prix en DH |
| `level-3-ai-professional-workflows.md` | 200 | masqué | prix en DH |
| `level-1-fondamentaux-ia-metier.md` | 150 | masqué | prix en DH |
| `level-2-ia-metier-techniques-avancees.md` | 250 | masqué | prix en DH |
| `level-3-ai-metier-professionnel.md` | 350 | masqué | prix en DH |
| `nova-digital-master-program.md` | 500 | masqué | prix en DH |
| `ia-junior-academy.md` | 3 500 | masqué ; note `prixNote` reformulée sans symbole `$` | prix en DH et périmètre |

Autres occurrences corrigées :
- `src/pages/index.astro` (FAQ « Combien coûte une formation ? ») : « de 100 $ à 500 $ » remplacé par un texte sans montant (nombre de programmes gratuits, tarif en DH sur demande).
- `src/utils/schema.ts` : `priceCurrency` valait `USD` par défaut ; seules les offres gratuites ou en MAD sont désormais publiées.
- `README.md` : modèle de fiche mis à jour (`devise: MAD`).
- Documents internes (`questions-client.md`, `content-inventory.md`) : conservés tels quels (non publiés) ; ils décrivent l'origine des montants.

## 4. Vérification finale

Recherche de `$`, `USD`, `US$`, « dollar(s) » dans **tous** les fichiers publiés (`dist/` : 39 fichiers HTML, XML, JSON-LD, hors scripts et styles) : **0 occurrence**. Les offres JSON-LD des fiches : 4 × `"price":0` avec `"priceCurrency":"MAD"`, aucune autre.

## 5. Formations réellement gratuites

Source : `prix: 0` dans la fiche, issu de l'ancien site (`content-inventory.md`, tableau des formations : lignes 8, 9, 11 et 12, « Gratuit »), repris dans `questions-client.md` (question 16).

| Formation | Fiche |
|---|---|
| Formation Entrepreneuriale et Développement des Compétences | `formation-entrepreneuriale-developpement-competences.md` |
| De l'Idée au Projet : Formation Entrepreneuriale & Compétences | `de-l-idee-au-projet.md` |
| StartUp Booster : Incuber, Accélérer, Développer | `startup-booster.md` |
| Innovation, Intelligence Artificielle et Solutions Technologiques | `innovation-ia-solutions-technologiques.md` |

Aucun programme gratuit n'a été ajouté. Les autres formations ne sont **pas** présentées comme gratuites.

À confirmer manuellement : la gratuité provient uniquement de l'ancien site ; les conditions d'accès (durée, public, éventuels frais annexes) sont encore « [À COMPLÉTER] » dans les fiches (`questions-client.md`, n° 16).

## 6. Où la gratuité est signalée

- **Catalogue** (`FormationCard.astro`) : pastille verte « GRATUIT » avec icône à la place du tarif.
- **Fiche formation** (`formations/[id].astro`) : grande pastille « GRATUIT » et phrase « Formation gratuite : aucun paiement n'est demandé pour s'inscrire » ; bouton du formulaire « Demander mon inscription gratuite ».
- **Prochaines sessions** (`SessionsSection.astro`) : pastille « GRATUIT » sur la photo ; la ligne « Tarif » n'apparaît que pour un tarif gratuit ou confirmé en DH.
- **Filtre du catalogue** « Tarif » : inchangé (Gratuit / Payant).
- **FAQ** : « 4 programmes d'entrepreneuriat et d'innovation sont gratuits » (nombre calculé).

## 7. Section chiffres

Deux directions de refonte ont été testées (cartes en verre, puis constellation). Elles n'ont pas été retenues : **la section d'origine (`StatsBand`, quatre cartes) est conservée telle quelle**, pour ne pas allonger la page. Seul le calcul du nombre de programmes gratuits utilise désormais `priceKind()` (même résultat : 4). Les captures « avant » n'ont pas été conservées.

## 8. Fichiers modifiés

`src/utils/placeholders.ts`, `src/utils/schema.ts`, `src/content.config.ts` (commentaire), `src/components/nova/FormationCard.astro`, `src/components/nova/SessionsSection.astro`, `src/pages/formations/[id].astro`, `src/pages/index.astro`, `src/data/formations/ia-junior-academy.md`, `README.md`, `audit-prix-gratuit.md`, captures `screenshots/prix-gratuit-2026/`.
