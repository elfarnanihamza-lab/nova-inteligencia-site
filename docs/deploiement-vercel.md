# Déploiement de démonstration sur Vercel — procédure

> **Rien de ce qui suit n'a été exécuté.** Aucun dépôt distant n'a été créé, aucun code n'a été poussé, aucun déploiement n'a été lancé, et aucun paramètre de compte Vercel ni aucun DNS n'a été modifié. Chaque étape ci-dessous est à lancer **après autorisation explicite**.
>
> Ne pas utiliser le domaine `novaconsort.com` : il sert encore l'ancien site (Wix). Ne pas toucher à ses DNS.

## 1. État du dépôt (constaté avant tout push)

| Point                      | Constat                                                                                                                                                                                                                                 | Action                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Branche de travail         | `feat/nova-site` (24 commits, dont 1 hérité du thème AstroWind)                                                                                                                                                                         | Pousser **cette seule branche**                                                                            |
| Remote `origin`            | **Pointe sur `https://github.com/onwidget/astrowind.git`, le dépôt du thème, pas le vôtre**                                                                                                                                             | **À renommer avant tout `git push`** (étape 2.2) ; un push vers ce remote ne doit jamais avoir lieu        |
| `.env`                     | Ignoré par Git (`.gitignore` l'exclut), jamais présent dans l'historique                                                                                                                                                                | Rien à faire                                                                                               |
| `.env.example`             | Versionné, sans valeur sensible                                                                                                                                                                                                         | Rien à faire                                                                                               |
| Secrets dans l'historique  | Aucune clé d'API, jeton, clé privée ni URL de webhook réelle trouvés (motifs `sk-`, `AKIA`, `ghp_`, `xox*`, `AIza`, clés privées, Make/Zapier/Slack/Formspree/Web3Forms) ; le numéro WhatsApp n'apparaît pas non plus dans l'historique | Compléter si possible avec un scanner dédié (étape 2.1)                                                    |
| Adresse e-mail des commits | `brahimelfarnani3@gmail.com` sur 23 commits                                                                                                                                                                                             | Sans conséquence pour un dépôt **privé** ; à anonymiser (adresse `noreply` GitHub) avant toute publication |
| Dossier `screenshots/`     | 17 Mo de captures versionnées                                                                                                                                                                                                           | Facultatif : à retirer du dépôt si vous voulez l'alléger (n'est pas nécessaire au build)                   |
| `.vercel/`                 | Ajouté à `.gitignore` (créé par `vercel link`)                                                                                                                                                                                          | Rien à faire                                                                                               |

Aucun commit n'est supprimé, l'historique n'est pas réécrit.

## 2. Procédure à lancer après autorisation

Remplacez `VOTRE-COMPTE` par le compte ou l'organisation GitHub. Les commandes s'exécutent depuis `C:\Users\BO\nova-site` (Git Bash ou PowerShell).

### 2.1 Dernières vérifications locales

```bash
git status --short                      # doit être vide (tout est commité)
git check-ignore -v .env                # doit afficher la règle .gitignore
git ls-files | grep -E '(^|/)\.env($|\.)'   # ne doit lister que .env.example
npm ci && npm run build                 # build de production (mode normal)
PUBLIC_DEMO_MODE=true PUBLIC_SHOW_PLACEHOLDERS=false npm run build   # build du mode démo
npm run seo                             # audit SEO (doit annoncer 0 problème)
```

Scan de secrets (recommandé, outil à installer séparément) : `gitleaks detect --source . --log-opts="--all"`.

### 2.2 Neutraliser le remote du thème, puis créer le dépôt GitHub privé

```bash
git remote rename origin upstream       # garde le dépôt du thème sous le nom « upstream » (ou : git remote remove origin)
gh auth status                          # vérifier la connexion (sinon : gh auth login)
gh repo create VOTRE-COMPTE/nova-site --private --description "Site Nova Inteligencia Group (démo)"
git remote add origin https://github.com/VOTRE-COMPTE/nova-site.git
git remote -v                           # origin doit pointer sur VOTRE dépôt
```

### 2.3 Pousser la branche

```bash
git push -u origin feat/nova-site
```

Seule `feat/nova-site` est poussée. La branche `main` locale correspond au thème d'origine : ne la poussez pas telle quelle (voir étape 2.5 pour la branche de production).

### 2.4 Créer le projet Vercel (tableau de bord, recommandé)

1. Vercel → **Add New… → Project** → importer `VOTRE-COMPTE/nova-site`.
2. Framework Preset : **Astro** (détecté automatiquement). Réglages à vérifier :
   - Install Command : `npm ci` (ou `npm install`)
   - Build Command : `npm run build` (équivaut à `astro build`)
   - Output Directory : `dist`
   - Node.js Version : **22.x** (le projet exige `>=22.22.3`, voir `package.json` → `engines`)
3. **Avant de lancer le premier déploiement**, renseigner les variables d'environnement (étape 2.6).
4. Ne pas ajouter de domaine personnalisé (l'adresse `*.vercel.app` suffit pour la démo).

Équivalent en ligne de commande (facultatif) :

```bash
npx vercel login
npx vercel link                         # associe le dossier au projet (crée .vercel/, ignoré par Git)
```

### 2.5 Branche de production

Vercel considère `main` comme branche de production. `main` ne contient pas encore le site Nova. Deux options :

- **A (recommandée pour la démo)** : Project → Settings → Git → **Production Branch = `feat/nova-site`**.
- **B** : fusionner `feat/nova-site` dans `main` (décision à prendre séparément ; non réalisée ici).

### 2.6 Variables d'environnement (démo)

| Variable                   | Valeur (démo)  | Remarque                                                                                                                                         |
| -------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PUBLIC_DEMO_MODE`         | `true`         | `noindex, nofollow`, pas de sitemap, formulaires désactivés sans webhook (aucun témoignage d'exemple : ils sont réservés au développement local) |
| `PUBLIC_SHOW_PLACEHOLDERS` | `false`        | masque tous les « [À COMPLÉTER] »                                                                                                                |
| `PUBLIC_WHATSAPP_NUMBER`   | `212667944611` | affiché dans le lien `wa.me` (public par nature)                                                                                                 |
| `PUBLIC_FORM_WEBHOOK`      | _(vide)_       | tant qu'aucun traitement n'est configuré, l'envoi reste désactivé                                                                                |
| `SITE_URL`                 | _(facultatif)_ | URL exacte de la démo ; sinon, en démo, `VERCEL_PROJECT_PRODUCTION_URL` est utilisée automatiquement                                             |

Tableau de bord : Project → Settings → Environment Variables (cocher Production, et Preview si besoin).
En ligne de commande :

```bash
npx vercel env add PUBLIC_DEMO_MODE production            # saisir : true
npx vercel env add PUBLIC_SHOW_PLACEHOLDERS production    # saisir : false
npx vercel env add PUBLIC_WHATSAPP_NUMBER production      # saisir : 212667944611
# PUBLIC_FORM_WEBHOOK : ne pas la créer (vide)
```

> ⚠ Les variables `PUBLIC_*` sont **copiées dans le code envoyé au navigateur** lors du build. N'y stockez jamais de secret. Une modification de variable n'a d'effet qu'après un **nouveau build**.

### 2.7 Lancer le déploiement (uniquement quand vous l'autorisez)

Le premier déploiement part à l'import du projet. Pour les suivants, un `git push origin feat/nova-site` déclenche un build. Déploiement manuel en ligne de commande :

```bash
npx vercel deploy --prod
```

Communiquer ensuite l'URL de démo : le déroulé de `deployment-checklist.md` peut alors être exécuté.

## 3. Configuration Vercel du projet

### 3.1 Génération et publication des pages

- Site 100 % statique (`output: 'static'`) : aucun adaptateur Vercel nécessaire. `astro build` produit `dist/` (35 pages, images optimisées dans `dist/_astro/`).
- Scripts utiles (`package.json`) : `build`, `preview`, `seo`, `og`, `brand`. `npm run og` et `npm run brand` régénèrent les images de partage et le logo : à lancer en local, jamais pendant le build Vercel.

### 3.2 URL avec ou sans barre finale

`vercel.json` : `cleanUrls: true` et `trailingSlash: false`.

- `/formations` → page du catalogue (`formations.html` servi sans extension).
- `/formations/` → redirection (308) vers `/formations`. Vercel conserve normalement la chaîne de requête : `/formations/?categorie=ia` doit aboutir à `/formations?categorie=ia`. **À vérifier sur la démo** (ligne 4 de la checklist).
- En local, `astro preview` répond 404 sur `/formations/` : c'est normal, il n'applique pas les règles de `vercel.json`.

### 3.3 Paramètres de requête du catalogue et actualisation

- La page `/formations` est unique ; les filtres (`?categorie=`, `?niveau=`, `?tarif=`) sont lus **dans le navigateur** à partir de l'URL, au chargement, après actualisation et après navigation interne. Le serveur n'a donc rien à configurer.
- Une valeur de filtre inconnue est ignorée (catalogue complet).
- Aucune règle de réécriture ne doit supprimer la chaîne de requête.

### 3.4 En-têtes HTTP

`vercel.json` pose : cache longue durée (`immutable`) pour `/_astro/*`, et des en-têtes de sécurité de base (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`). Pas de Content-Security-Policy : le site utilise des scripts et styles en ligne et une carte Google Maps intégrée ; en ajouter une demanderait un test dédié.

### 3.5 Mode démo sans indexation

| Mécanisme                                          | Effet                                                                                              | Où                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `<meta name="robots" content="noindex, nofollow">` | sur **toutes** les pages HTML, y compris fiches formation, blog, pages légales et 404              | `src/components/common/Metadata.astro`              |
| Pas de sitemap                                     | `@astrojs/sitemap` n'est pas chargé ; `/sitemap-index.xml` n'existe pas                            | `astro.config.ts`                                   |
| `robots.txt`                                       | `Allow: /`, aucun `Disallow`, aucune ligne `Sitemap` : les moteurs peuvent lire le `noindex`       | `vendor/integration/index.ts`                       |
| URL canoniques / `og:image` / données structurées  | construites avec l'URL de la démo (`SITE_URL` ou URL du projet Vercel), pas avec `novaconsort.com` | `vendor/integration/index.ts`, `src/site.config.ts` |
| Formulaires                                        | désactivés sans webhook, message explicite, aucune requête envoyée                                 | `ContactForm.astro`, `Footer.astro`                 |

**Ce n'est pas une protection d'accès.** `noindex` demande poliment aux moteurs de ne pas référencer les pages ; toute personne qui connaît l'URL peut les lire. Si le contenu doit rester confidentiel, activer au niveau de l'hébergement l'authentification du déploiement (Vercel → Settings → Deployment Protection ; les options disponibles dépendent de l'offre) et la vérifier en navigation privée.

Retour en production : `PUBLIC_DEMO_MODE=false` (ou variable supprimée), `SITE_URL` ou `site` du domaine définitif, webhook de formulaire renseigné, nouveau build.
