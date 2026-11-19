# Checklist de validation après mise en ligne (démo)

> **État : AUCUN test de production n'a été exécuté.** Ce document est une liste de contrôles à dérouler dès que l'URL de démo est fournie.
> Les cases restent vides tant que le site n'est pas réellement accessible. Ne cochez rien « par déduction ».
> Les résultats locaux (serveur `astro preview`) figurent dans `deployment-report.md` : ils ne remplacent pas ces tests.

- URL de démo testée : `https://________________` (à renseigner)
- Date / heure : `________` · Testeur : `________` · Navigateurs : `________`
- Déploiement (commit / identifiant Vercel) : `________`

Dans les commandes ci-dessous, remplacez `$BASE` par l'URL de démo, sans barre finale :

```bash
BASE="https://votre-demo.vercel.app"
```

## 0. Prérequis

- [ ] Le build Vercel est « Ready » (aucune erreur dans les logs de build).
- [ ] Les variables d'environnement de la démo sont bien celles attendues (Settings → Environment Variables) : `PUBLIC_DEMO_MODE=true`, `PUBLIC_SHOW_PLACEHOLDERS=false`, `PUBLIC_WHATSAPP_NUMBER=212667944611`, `PUBLIC_FORM_WEBHOOK` vide.
- [ ] Le build a été relancé **après** la dernière modification d'une variable `PUBLIC_*` (elles sont figées au build).
- [ ] Le domaine `novaconsort.com` n'est pas rattaché au projet et aucun DNS n'a été modifié.

## 1. URL du catalogue (code HTTP, redirections, paramètres, résultats)

Pour chaque ligne : code HTTP initial, redirection éventuelle (et paramètres conservés), nombre de formations affichées, comportement après actualisation (F5), puis navigation retour/avant.

| # | URL | HTTP attendu | Redirection attendue | Filtre actif attendu | Résultats attendus | Après F5 | Retour / avant | Résultat |
|---|---|---|---|---|---|---|---|---|
| 1 | `/formations` | 200 | aucune | aucun | 12 | identique | OK | ☐ |
| 2 | `/formations?categorie=ia` | 200 | aucune | Intelligence artificielle | 3 | identique | OK | ☐ |
| 3 | `/formations?categorie=parcours` | 200 | aucune | Parcours digital | 1 | identique | OK | ☐ |
| 4 | `/formations/?categorie=ia` | 308 (ou 301) puis 200 | vers `/formations?categorie=ia` **avec le paramètre conservé** | Intelligence artificielle | 3 | identique | OK | ☐ |
| 5 | `/formations?categorie=ia&niveau=2` | 200 | aucune | IA + niveau 2 | 1 | identique | OK | ☐ |

Commandes (code HTTP, redirections, adresse finale) :

```bash
for u in "/formations" "/formations?categorie=ia" "/formations?categorie=parcours" "/formations/?categorie=ia" "/formations?categorie=ia&niveau=2"; do
  echo "== $u"
  curl -s -o /dev/null -w "HTTP %{http_code} | redirection : %{redirect_url}\n" "$BASE$u"
  curl -sL -o /dev/null -w "HTTP final %{http_code} | URL finale : %{url_effective}\n" "$BASE$u"
done
```

Points d'attention :

- [ ] Le cas n° 4 est celui qui **échoue en local** (`astro preview` répond 404 sur `/formations/` car `trailingSlash` vaut `false`). Sur Vercel, `vercel.json` (`trailingSlash: false`) doit rediriger vers `/formations` : **vérifier que la chaîne de requête `?categorie=ia` est conservée**. Sinon, ajouter une règle `redirects` explicite dans `vercel.json`.
- [ ] Les filtres sont lus côté navigateur à partir de l'URL : contrôler dans le navigateur (et pas seulement avec `curl`) le nombre de cartes visibles (compteur « n formations »), le filtre sélectionné dans les listes, puis F5, puis Retour/Avant.
- [ ] Une valeur inconnue (`?categorie=inconnue`) affiche tout le catalogue (12), sans erreur.

## 2. Navigation et liens

- [ ] Menu principal : Formations (et sous-menus), Entreprises, À propos, Blog, Contact : tous répondent 200.
- [ ] Une catégorie à une seule formation (Parcours digital, Junior) mène **directement à la fiche** ; les catégories à plusieurs formations mènent au catalogue filtré.
- [ ] Les 12 fiches formation répondent 200 et affichent titre, tarif, niveau et bouton d'inscription :

  ```bash
  for s in level-1-ai-foundations level-2-ai-productivity-automation level-3-ai-professional-workflows level-1-fondamentaux-ia-metier level-2-ia-metier-techniques-avancees level-3-ai-metier-professionnel nova-digital-master-program formation-entrepreneuriale-developpement-competences de-l-idee-au-projet startup-booster innovation-ia-solutions-technologiques ia-junior-academy; do
    printf "%s " "$s"; curl -s -o /dev/null -w "%{http_code}\n" "$BASE/formations/$s"
  done
  ```

- [ ] La bande défilante de l'accueil (mots-clés) mène aux bonnes fiches ; « Inscriptions ouvertes » mène à l'ancre `#inscription` de l'accueil.
- [ ] Aucun lien interne cassé : relancer `node scripts/links-report.mjs` en local, puis contrôler à la main un échantillon sur la démo (accueil, À propos, Entreprises, Contact, pied de page).
- [ ] Page 404 : `curl -s -o /dev/null -w "%{http_code}" "$BASE/page-inexistante"` renvoie 404 avec la page d'erreur du site.
- [ ] Mentions légales et politique de confidentialité s'ouvrent (200).

## 3. Mode démo : SEO et indexation

```bash
curl -s "$BASE/" | grep -io '<meta[^>]*name="robots"[^>]*>'          # attendu : content="noindex, nofollow"
curl -s "$BASE/formations" | grep -io '<meta[^>]*name="robots"[^>]*>'
curl -s "$BASE/formations/level-1-ai-foundations" | grep -io '<meta[^>]*name="robots"[^>]*>'
curl -s "$BASE/contact" | grep -io '<meta[^>]*name="robots"[^>]*>'
curl -s "$BASE/robots.txt"                                           # attendu : Allow: /, aucun Disallow, aucune ligne Sitemap
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/sitemap-index.xml"   # attendu : 404
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/sitemap-0.xml"       # attendu : 404
```

- [ ] `noindex, nofollow` présent sur **toutes** les pages HTML contrôlées (accueil, catalogue, 2 fiches, À propos, Entreprises, Contact, un article de blog, 404).
- [ ] `robots.txt` n'interdit rien (les moteurs doivent pouvoir lire la directive `noindex`) et ne cite aucun sitemap.
- [ ] Aucun sitemap publié (`/sitemap-index.xml` et `/sitemap-0.xml` : 404).
- [ ] Les liens canoniques et les URL des images de partage (`og:image`) pointent vers **l'URL de démo**, pas vers `novaconsort.com` :
  `curl -s "$BASE/" | grep -oE '(rel="canonical"|property="og:image"|property="og:url")[^>]*'`
- [ ] Les données structurées (`application/ld+json`) citent l'URL de démo et un logo accessible (`$BASE/logo.png` répond 200, type `image/png`).
- [ ] Rappel : le mode démo **n'est pas une protection d'accès**. Si le contenu est confidentiel, vérifier la protection du déploiement (Vercel → Settings → Deployment Protection) et tester dans une fenêtre de navigation privée.

## 4. Formulaires en mode démo (aucune requête réelle)

- [ ] `/contact`, `/entreprises` (devis), accueil (version courte) : un encart « Version de démonstration » explique qu'**aucune demande n'est envoyée** et indique l'e-mail de contact.
- [ ] Le bouton d'envoi est désactivé ; aucun message « Merci », aucune confirmation d'envoi n'apparaît.
- [ ] Pied de page : le champ et le bouton de newsletter sont désactivés, avec le message « inscription désactivée ».
- [ ] Onglet Réseau des outils de développement : **aucune requête POST** n'est émise en tentant d'utiliser les formulaires. (Ne remplissez aucun vrai formulaire ; ne saisissez aucune donnée réelle.)
- [ ] `PUBLIC_FORM_WEBHOOK` est bien vide : `curl -s "$BASE/contact" | grep -o 'data-endpoint="[^"]*"'` renvoie `data-endpoint=""`.

## 5. WhatsApp

- [ ] Le bouton flottant est visible (ordinateur et mobile), fond bleu nuit, libellé au survol sur ordinateur.
- [ ] Le lien est `https://wa.me/212667944611?text=…` (message pré-rempli) et s'ouvre dans un nouvel onglet :
  `curl -s "$BASE/" | grep -oE 'https://wa\.me/[0-9]+[^"]*' | sort -u`
- [ ] Un seul numéro apparaît dans tout le site (aucun numéro dupliqué ou factice) :
  `for p in / /contact /entreprises /a-propos; do curl -s "$BASE$p" | grep -oE 'wa\.me/[0-9]+' ; done | sort | uniq -c`
- [ ] Le bouton se masque pendant la saisie dans un champ sur mobile, et pendant l'ouverture du menu mobile.

## 6. Logo, favicon et images de partage

- [ ] En-tête : logo compact net (écran standard et Retina), non déformé, sur fond blanc.
- [ ] Pied de page : logo complet clair sur fond bleu nuit, avec les deux slogans lisibles.
- [ ] `curl -sI "$BASE/logo.png"` → 200, `content-type: image/png`, poids < 100 Ko.
- [ ] `curl -sI "$BASE/favicon.ico"` → 200 ; l'onglet du navigateur affiche le phénix ; icône `apple-touch-icon` présente dans le HTML.
- [ ] `og:image` de l'accueil et d'une fiche formation : l'image se télécharge (200) et affiche le bon logo (tester avec un outil d'aperçu de partage ; la mise en cache des réseaux sociaux peut retarder la mise à jour).
- [ ] Les images `_astro/*` sont servies avec `cache-control: public, max-age=31536000, immutable`.

## 7. Erreurs JavaScript et réseau

- [ ] Console du navigateur sans erreur ni avertissement bloquant sur : accueil, catalogue, une fiche, À propos, Entreprises, Contact (ordinateur **et** mobile).
- [ ] Onglet Réseau : aucune requête en erreur (4xx/5xx), hors extensions du navigateur.
- [ ] Navigation interne (View Transitions) : aller de l'accueil au catalogue puis à une fiche, revenir, avancer : les animations, le bouton WhatsApp, les compteurs et le réseau animé se réinitialisent sans erreur.

## 8. Responsive (largeurs 360, 390, 768, 1024, 1440 px)

- [ ] Aucun défilement horizontal de la page.
- [ ] En-tête et menu mobile : ouverture/fermeture, liens, bouton « Demander un devis ».
- [ ] Hero : titre sur 3 lignes maximum, deux boutons visibles sans défilement sur mobile.
- [ ] Catalogue : filtres utilisables au doigt, cartes lisibles, bandeau de chiffres en grille 2 × 2 sur mobile.
- [ ] Pied de page : colonnes empilées, logo complet non rogné.
- [ ] Respect de « réduire les animations » (préférence système) : pas de mouvement superflu.

## 9. Performance : PageSpeed Insights (à lancer sur l'URL de démo)

Lancer sur https://pagespeed.web.dev/ (mobile **et** ordinateur), au moins deux fois par page, et noter la médiane.

| Page | Mobile : Perf. | Mobile : LCP | Mobile : CLS | Ordinateur : Perf. | Accessibilité | Bonnes pratiques | SEO |
|---|---|---|---|---|---|---|---|
| `/` | ____ | ____ | ____ | ____ | ____ | ____ | ____ |
| `/formations` | ____ | ____ | ____ | ____ | ____ | ____ | ____ |

- [ ] Objectif indicatif : performance mobile ≥ 90 (selon la variabilité de la mesure), accessibilité 100.
- [ ] Le score « SEO » peut afficher un avertissement « La page est bloquée pour l'indexation » : **c'est attendu en démo** (noindex).
- [ ] Comparer avec les mesures locales de `deployment-report.md` (même ordre de grandeur attendu ; l'écart vient du réseau et du CDN).

## 10. Clôture

- [ ] Anomalies relevées consignées (page, navigateur, capture) : `________`
- [ ] Décision : démo validée ☐ · corrections nécessaires ☐
- [ ] Avant tout passage en production : `PUBLIC_DEMO_MODE=false`, nom de domaine définitif (`SITE_URL`/`site`), webhook de formulaire configuré, contenus `[À COMPLÉTER]` traités, nouveau build et nouvelle série de tests.
