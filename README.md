# Site Nova Inteligencia Group

Site vitrine de **Nova Inteligencia Group** (centre de formation en IA, Casablanca), construit avec [Astro](https://astro.build) et Tailwind CSS à partir du template open source AstroWind. Tout le contenu est en français.

## 1. Lancer le site en local

Prérequis : [Node.js](https://nodejs.org) 22.22 ou plus récent.

```bash
npm install        # une seule fois
npm run dev        # site de développement : http://localhost:4321
npm run build      # génère le site final dans le dossier dist/
npm run preview    # prévisualise le build
```

## 2. Où modifier quoi ?

| Je veux modifier…                                                                                | Fichier                                                                                                                                          |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Téléphone, WhatsApp, horaires, adresse, réseaux sociaux, webhook du formulaire, mentions légales | `src/site.config.ts` (**un seul fichier**)                                                                                                       |
| Nom du site, URL, titre et description SEO par défaut, langue                                    | `src/config.yaml`                                                                                                                                |
| Couleurs et polices                                                                              | `src/components/CustomStyles.astro` et `src/assets/styles/tailwind.css` (voir « Direction artistique »)                                          |
| Menu et pied de page                                                                             | `src/navigation.ts`                                                                                                                              |
| Textes de l'accueil, À propos, Entreprises, Contact                                              | `src/pages/index.astro`, `a-propos.astro`, `entreprises.astro`, `contact.astro`                                                                  |
| Logo                                                                                             | `src/assets/brand/` (fichiers générés depuis le logo officiel) et `src/components/Logo.astro` ; favicon dans `src/assets/favicons/` et `public/` |
| Image de partage (réseaux sociaux)                                                               | `src/assets/images/default.png` (1200×630)                                                                                                       |

Les textes « **[À COMPLÉTER]** » et « **[Proposition – à valider]** » sont masqués sur le site final ; ils s'affichent surlignés en jaune en mode relecture (voir plus bas). Recherchez ces deux chaînes dans le code pour les retrouver (`À COMPLÉTER`).

### Contenus provisoires (« [À COMPLÉTER] »)

Par défaut, **aucun texte provisoire n'est affiché** : les champs inconnus des fiches, le téléphone, les horaires, etc. sont simplement masqués.
Pour les voir surlignés en jaune pendant une relecture :

- Git Bash / Mac / Linux : `PUBLIC_SHOW_PLACEHOLDERS=true npm run dev`
- PowerShell : `$env:PUBLIC_SHOW_PLACEHOLDERS='true'; npm run dev`

Le réglage se trouve dans `src/site.config.ts` (`SHOW_PLACEHOLDERS`).

### Crédibilité : ce qui n'est affiché qu'une fois vérifié

Dans `src/site.config.ts` :

- `affiliationsVerified` (false) : les affiliations AAAI, AAIA, AMIIA ne sont affichées nulle part (ni dans les données structurées) tant qu'elles ne sont pas prouvées.
- `SPHERES` : seules les sphères `verified: true` (adossées à des formations du catalogue) apparaissent sur l'accueil. Expertise linguistique, accompagnement académique et conseil légal restent masqués en attendant la confirmation de Nova.
- La section « Témoignages » n'apparaît qu'avec de vrais avis (nom, profil, accord écrit) ; les exemples de mise en page ne s'affichent qu'en développement local.

### Direction artistique et animations

- Palette : bleu nuit `#0B1F3A`, bleu électrique `#2D6BFF`, violet `#7B3FF2`, blanc, blanc cassé `#F5F7FB`, gris clair `#E8EDF5`, gris texte `#68758A` (légèrement assombri en `#637086` pour le contraste AA). Aucun orange.
- Variables : `src/components/CustomStyles.astro` ; utilitaires et boutons : `src/assets/styles/tailwind.css`.
- Réseau neuronal animé du héro : `src/components/nova/NeuralNetwork.astro` (Canvas 2D, sans dépendance, démarrage différé, 30 i/s sur mobile, pause hors écran, image fixe si l'utilisateur a demandé moins d'animations).
- Révélations au défilement : ajouter l'attribut `data-reveal` (et `style="--reveal-delay:120ms"` pour décaler) à n'importe quel élément. Script : `src/components/nova/Motion.astro`.
- Logo : le logo officiel est utilisé avec ses couleurs d'origine (seule exception à la règle « pas d'orange ») ; sur fond sombre, seul le texte marine passe en blanc. `npm run brand` régénère ces fichiers.

### Activer le bouton WhatsApp

Renseignez la variable d'environnement `PUBLIC_WHATSAPP_NUMBER` (fichier `.env` en local, réglages de l'hébergeur en production), au format international sans `+` ni espaces. Tant qu'elle est vide, le bouton flottant et les liens WhatsApp sont masqués.

### Brancher le formulaire (webhook / CRM)

Dans `src/site.config.ts`, renseignez `form.endpoint` avec l'URL d'un webhook (Make, Zapier, n8n, Formspree, Web3Forms, API de votre CRM…). Le formulaire y envoie un `POST` JSON : `prenom, nom, email, telephone, entreprise, sujet, formation, message, page, date, source`. Sans endpoint, le formulaire ouvre le client mail du visiteur (solution de secours).

## 3. Ajouter ou modifier une formation (sans toucher au code)

Chaque formation est un fichier Markdown dans `src/data/formations/`. Pour en ajouter une :

1. Dupliquez un fichier existant, par exemple `level-1-ai-foundations.md`.
2. Renommez-le : le nom du fichier devient l'adresse de la page (`mon-cours.md` → `/formations/mon-cours`).
3. Modifiez les champs en tête de fichier :

```yaml
---
title: 'Nom de la formation'
categorie: ia # ia | ia-metier | parcours | innovation | junior
niveau: 'Niveau 1 — Fondations'
niveauNum: 1 # 1, 2 ou 3 (filtre du catalogue), facultatif
prix: 1500 # 0 = gratuit ; supprimer la ligne si inconnu
devise: MAD # le tarif n'est publié qu'en dirhams (MAD) ; sans MAD, « Tarif sur demande » s'affiche
resume: 'Description courte.'
objectifs: ['Objectif 1', 'Objectif 2']
programme:
  - titre: 'Module 1'
    points: ['Point A', 'Point B']
public: "À qui s'adresse la formation"
duree: '2 jours (14 h)'
modalites: 'Présentiel à Casablanca'
prerequis: 'Aucun'
formateur: 'Nom du formateur'
prochaineSession: '12 janvier 2027'
featured: true # true = affichée sur l'accueil
order: 5 # ordre d'affichage
seoTitle: 'Titre Google (≤ 60 caractères)'
seoDescription: 'Description Google (≤ 155 caractères)'
---
```

4. Enregistrez : la formation apparaît dans le catalogue, sur sa propre page, dans le sitemap et dans les données structurées `Course`.

Pour masquer une formation sans la supprimer : `draft: true`. Les champs omis affichent « [À COMPLÉTER] ». Pour valider un texte « proposition », retirez le nom de la section de la liste `aValider`.

Catégories : à modifier dans `CATEGORIES` (`src/site.config.ts`).

## 4. Blog

Un article = un fichier Markdown dans `src/data/post/` (titre, `excerpt`, `category`, `tags`, `publishDate`, `author`). Les trois articles actuels sont des **résumés** des anciens articles, à relire avant mise en ligne.

## 5. SEO et performances

- Titre et description uniques par page, balises Open Graph, `sitemap-index.xml` et `robots.txt` générés au build.
- Données structurées Schema.org : `Organization` + `EducationalOrganization` + `LocalBusiness` (toutes les pages), `Course` (fiches formation), `FAQPage` (accueil, seulement pour les réponses complétées), `BreadcrumbList`.
- Lighthouse (build local, mobile) : performance 92–99, accessibilité 100, SEO 100 sur les pages testées.
- ⚠️ Le score « Bonnes pratiques » local peut être abaissé par un antivirus qui injecte un script ; à re-mesurer sur le site en ligne.
- Avant la mise en ligne : mettre l'URL définitive dans `src/config.yaml` (`site`) — ou dans la variable de build `SITE_URL` — ; `src/site.config.ts` (`url`) et la ligne `Sitemap` de `robots.txt` en sont déduits au build.

## Variables d'environnement

À définir dans un fichier `.env` (voir `.env.example`) ou dans les réglages de l'hébergeur (Vercel, Netlify…).

| Variable                   | Rôle                                                                                                                                                                                                                        | Par défaut                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `PUBLIC_FORM_WEBHOOK`      | URL qui reçoit les formulaires (contact, inscription, devis, newsletter) en JSON : Make, Zapier, n8n, Formspree, CRM…                                                                                                       | vide : ouverture de la messagerie du visiteur |
| `PUBLIC_DEMO_MODE`         | `true` : **mode démonstration** : `noindex, nofollow` sur toutes les pages, pas de sitemap, `robots.txt` sans `Disallow`, formulaires désactivés tant qu'aucun webhook n'est configuré. Ce n'est pas une protection d'accès | `false`                                       |
| `PUBLIC_SHOW_PLACEHOLDERS` | `true` : affiche les contenus provisoires « [À COMPLÉTER] » surlignés                                                                                                                                                       | `false`                                       |
| `PUBLIC_WHATSAPP_NUMBER`   | numéro WhatsApp au format international sans `+` (vide : bouton masqué)                                                                                                                                                     | vide                                          |
| `SITE_URL`                 | (build, non publique) URL publique du site pour les liens canoniques, images de partage et sitemap                                                                                                                          | `site` de `src/config.yaml`                   |
| `PUBLIC_FOOTER_VARIANT`    | `nuit` (bleu nuit → bleu numérique) ou `indigo` (bleu électrique profond)                                                                                                                                                   | `nuit`                                        |

Contenu JSON envoyé au webhook : `type` (contact, inscription, newsletter), `nom`, `telephone` (format +212…), `email`, `ville`, `profil`, `formation` (identifiant), `formationTitre`, `message`, `consentement`, `page`, `date`, `source`.

## Témoignages

Fichier `src/data/testimonials.ts` : un bloc par témoignage (nom, profil, citation, formation suivie ; note sur 5 et photo seulement si elles sont réelles et autorisées).
Aucun témoignage authentique n'est saisi à ce jour. Six témoignages **fictifs** (`demo: true`, noms et profils inventés, sans photo ni note) servent aux tests visuels : ils ne s'affichent que si `SHOW_FICTIONAL_TESTIMONIALS = true` (désactivé par défaut) **et** en développement local (`import.meta.env.DEV`), jamais dans un build. Sans vrai avis, la section disparaît du site construit.
Carrousel : défilement continu (une seule boucle `requestAnimationFrame`, propriété `transform`), pause au survol, au focus et avec le bouton dédié, balayage tactile, arrêt hors écran ; statique avec `prefers-reduced-motion`.

## Effets visuels (réutilisables)

Attributs à poser sur n'importe quel élément :

- `data-reveal` (+ `style="--reveal-delay:120ms"`) : apparition au défilement ;
- `class="spotlight" data-spotlight` : bordure lumineuse qui suit le curseur ; ajouter `class="tilt" data-tilt` pour l'inclinaison 3D (souris uniquement) ;
- `data-count="12"` : compteur animé ;
- `decode="mot"` sur le composant `Section` : mot-clé du titre « décodé » à l'apparition (à réserver à 2 ou 3 titres) ;
- `data-glow` sur une section sombre : halo lumineux qui suit la souris.
  Tout est désactivé si l'utilisateur a demandé moins d'animations (`prefers-reduced-motion`).

## SEO : outils

- `npm run seo` (après `npm run build`) : audit de toutes les pages et mise à jour de `seo-report.md` (title, description, H1, Open Graph, Twitter, données structurées, alt).
- `npm run og` : régénère les images de partage (une par page) dans `src/assets/images/og/` — à lancer après l'ajout d'une formation ou d'un article.
- `npm run brand` : régénère le logo (version claire), le favicon et l'image de partage par défaut à partir du logo officiel.
- Title et description d'une formation : champs `seoTitle` (50–60 caractères) et `seoDescription` (140–160) du fichier Markdown.

## 6. Déployer

Le build produit un site statique dans `dist/`.

**Vercel** : importez le dépôt Git sur vercel.com → framework « Astro » détecté → _Build command_ `npm run build`, _Output_ `dist`. Ajoutez votre domaine dans _Settings → Domains_. Procédure complète de démonstration (dépôt privé, variables, mode démo sans indexation) : `docs/deploiement-vercel.md` ; tests après mise en ligne : `deployment-checklist.md`.

**Netlify** : « Add new site » → dépôt Git → _Build command_ `npm run build`, _Publish directory_ `dist` (le fichier `netlify.toml` est déjà fourni).

**VPS Hostinger** :

```bash
# sur le serveur (Ubuntu) : installer Node 22 et Nginx, puis
git clone <votre-dépôt> nova-site && cd nova-site
npm install && npm run build
sudo cp -r dist/* /var/www/nova/
```

Configurez Nginx pour servir `/var/www/nova` (exemple dans `nginx/`), puis activez HTTPS avec `sudo certbot --nginx -d votre-domaine.ma`. Alternative sans Node sur le serveur : exécutez `npm run build` sur votre PC et envoyez le contenu de `dist/` par SFTP dans `public_html`.

Après chaque modification de contenu : relancer `npm run build` et redéployer (automatique avec Vercel/Netlify à chaque `git push`).

## 7. Contenu restant à fournir

Voir `questions-client.md` (liste à envoyer à Nova) et `content-inventory.md` (inventaire du site d'origine).
