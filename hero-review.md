# Revue du Hero — accueil Nova Inteligencia Group

Branche locale `feat/nova-site` · **aucun commit, aucun push, aucun déploiement**. Rien n'est commité tant que le Hero n'est pas validé.

## 1. État de départ et sauvegardes

| Repère                                               | Contenu                                                                                |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Étiquette `sauvegarde-avant-hero` (commit `1a9974e`) | Site avant toute refonte du Hero (arbre propre à ce moment-là)                         |
| Remise Git `stash@{0}`                               | « Hero v1 (Canvas 2D) non validé » : première refonte (12 fichiers), conservée intacte |
| `screenshots/hero-2026/v1-canvas2d/`                 | Captures de la v1, pour comparaison                                                    |

## 2. Diagnostic : pourquoi la v1 était trop simple

- Un seul objet : une sphère de 104 points, rendue en 2D, sans volume réel.
- Des anneaux réduits à des traits d'un pixel ; aucune hiérarchie de profondeur.
- Un sol plat, et un décor quasi vide derrière le texte.
- Des étiquettes posées sur la scène, sans lien avec le noyau.
- Un mouvement uniforme : tout tournait à la même vitesse.

## 3. Direction artistique retenue : « laboratoire IA 2040 »

- **Noyau d'énergie** dessiné par un shader : plasma qui tourbillonne lentement, filaments, anneau de « distorsion » lumineux, pulsation lente. Autour : trois coques de particules sur des axes et à des vitesses différents, quatre orbites 3D en pointillés avec tête de comète (une seule en orange, accent rare), et des particules qui plongent vers le noyau puis repartent.
- **Réseau neuronal** : nœuds qui dérivent et se regroupent en grappes qui se forment puis se défont ; connexions qui naissent et disparaissent selon la distance ; impulsions lumineuses qui s'enchaînent de nœud en nœud ; liaisons ponctuelles entre le réseau et le noyau.
- **Espace profond** : fond bleu nuit presque noir sur plusieurs profondeurs ; poussière de particules sur plusieurs plans, avec parallaxe ; trois polyèdres filaires presque transparents ; traits de données qui traversent la scène de temps en temps ; sol en perspective discret ; faisceaux de lumière volumétrique en CSS ; éclairage diffus derrière le titre ; ligne d'horizon et brume bleue vers la section suivante.
- **Modules holographiques** (ChatGPT, Agents IA, Automatisation, Prompt engineering, soit les thèmes réels du catalogue) : panneaux de verre fins, orientés vers le noyau, en parallaxe, reliés au noyau par des flux lumineux, avec un balayage lumineux unique à l'apparition.
- **Palette** : bleu nuit dominant, bleu numérique et bleu lumineux pour la lumière et le réseau, orange réservé au CTA principal et à une seule tête de comète, blanc pour le texte. Logo officiel inchangé.

## 4. H1 : trois propositions

|                  | Titre                                                 | Sous-titre proposé                                                                                                                                                             | Bénéfice commercial                                                                                  |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **A (en place)** | « L'intelligence artificielle, maîtrisée. »           | Des formations concrètes en intelligence artificielle, en automatisation et en compétences numériques : de vos premiers prompts aux agents IA et aux workflows professionnels. | Promesse d'expertise, positionnement haut de gamme, mot-clé « intelligence artificielle » dans le H1 |
| B                | « Formez-vous à l'IA. Prenez une longueur d'avance. » | Trois niveaux de progression, du premier prompt aux workflows professionnels, et des parcours IA appliqués à votre métier.                                                     | Orienté action et avantage concurrentiel, invite directement à l'inscription                         |
| C                | « Transformez votre potentiel grâce à l'IA. »         | Des formations en intelligence artificielle, en automatisation et en compétences numériques, pour les professionnels, les entreprises et les porteurs de projet.               | Aspirationnel, cohérent avec la signature « Transformer » du logo                                    |

**Recommandation : A.** Il est le plus court (3 lignes qui tiennent à 1366 × 600), contient le mot-clé principal en toutes lettres et porte le registre premium voulu. L'effet de « décodage » sur « maîtrisée. » renforce le message. B est l'alternative si la priorité devient la conversion directe : il est plus long (deux phrases) et utilise l'abréviation « IA ». C est plus générique et moins différenciant.

## 5. Choix techniques

- **WebGL natif, sans Three.js.** Aucune bibliothèque 3D n'était installée. Three.js ajouterait environ 120 à 150 Ko compressés à analyser sur mobile, alors que la scène tient en quatre petits shaders. Moteur : `hero-gl.ts`, 19,8 Ko, soit environ 8,5 Ko compressés.
- **Chargement** : le script initial du Hero pèse 2,3 Ko. Le moteur n'est chargé qu'après l'événement `load`, deux images de rendu et un temps mort du navigateur (plus 0,9 s sur petit écran). Le titre et les CTA sont du HTML, affichés et cliquables immédiatement.
- **GPU plutôt que processeur** : les milliers de particules (poussière, coques, orbites, particules convergentes) sont animées dans le shader. Le processeur ne calcule que le réseau (62 nœuds sur ordinateur, 30 sur mobile) et quelques lignes ; les lignes fixes du sol sont précalculées une fois par redimensionnement.
- **Compilation des shaders non bloquante** (extension `KHR_parallel_shader_compile`, sinon délai laissé au GPU) : c'était la principale source de blocage lors de la première mesure.
- **Cadence** : 30 i/s sur mobile et appareils modestes (≤ 4 cœurs, ≤ 4 Go, mode économie de données), 60 i/s sinon. Pause hors écran (IntersectionObserver) et onglet masqué.
- **Repli** : sans WebGL ou en rendu logiciel (`failIfMajorPerformanceCaveat`), un décor CSS/SVG statique (halo et orbites) reste affiché et les modules sont visibles. En cas de perte du contexte : même repli.
- **Mouvement réduit** (`prefers-reduced-motion`) : une seule image fixe, noyau formé, modules visibles, aucune animation (vérifié : deux captures à 0,9 s d'intervalle sont identiques).
- **Interactions** : sur ordinateur, parallaxe selon la profondeur et légère inclinaison selon le curseur, nœuds qui s'écartent du pointeur ; le texte ne bouge jamais. Sur mobile, animation autonome, et adaptation à l'inclinaison seulement si le navigateur la fournit sans demande d'autorisation (Android). Rien sur iOS, qui exigerait une autorisation.
- **Navigation interne (View Transitions)** : nettoyage complet (observateurs, écouteurs, tampons, programmes) et libération du contexte WebGL, sans fuite ni double instance.

## 6. Fichiers modifiés

| Fichier                               | Nature                                                                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `src/components/nova/hero-gl.ts`      | **Nouveau** : moteur WebGL                                                                                               |
| `src/components/nova/HeroScene.astro` | **Nouveau** (remplace la v1 non commitée) : canevas, styles de la scène et des modules, chargement différé               |
| `src/pages/index.astro`               | Section Hero uniquement (et l'import correspondant) : badge, H1, sous-titre, CTA, zone du noyau, modules, décor de repli |

Composants inchangés : `NeuralNetwork.astro` (toujours utilisé par les bandeaux des pages internes et la 404), `TechGrid`, `Fx`, `Motion`.

**Casablanca** : retiré du Hero visible (badge et H1) ; conservé dans le title SEO, la meta description, les données structurées LocalBusiness, le bandeau de chiffres, la section « Nous trouver » et le pied de page.

## 7. Tests effectués (serveur local `astro preview`)

| Contrôle                                | 1366 × 600            | 1280 × 720  | 1440 × 900  | 375 × 667          |
| --------------------------------------- | --------------------- | ----------- | ----------- | ------------------ |
| H1 et deux CTA visibles sans défilement | ✅ (CTA à 551 px)     | ✅ (585 px) | ✅ (645 px) | ✅ (558 px)        |
| Débordement horizontal                  | aucun                 | aucun       | aucun       | aucun              |
| Modules sur le texte                    | non                   | non         | non         | non                |
| Noyau sur le texte                      | non (colonne séparée) | non         | non         | non (sous les CTA) |
| WebGL actif                             | oui                   | oui         | oui         | oui                |
| Erreurs JavaScript / console            | aucune                | aucune      | aucune      | aucune             |

- H1 unique, texte HTML réel : « L'intelligence artificielle, maîtrisée. » (espaces vérifiés dans le HTML final).
- CTA : « Voir les formations » → `/formations`, « Nous contacter » → `/contact`. Survol : élévation de 2 px, dégradé qui glisse, icône décalée de 3 px. Retour visuel au clic.
- Clavier : les deux CTA sont atteints à la tabulation, avec un contour de focus visible.
- Vérification dans le navigateur intégré (pas seulement le code) : scène active, aucun message en console.

## 8. Scores Lighthouse (accueil, mobile simulé, mesures alternées dans la même fenêtre de temps)

La machine de test est bruitée (antivirus, variations de ±8 points). Pour comparer honnêtement, les deux versions ont été mesurées en alternance, 5 passes chacune, et ce sont les médianes qui sont retenues. « Bonnes pratiques » est plafonné à 81 par un script injecté par l'antivirus Kaspersky du poste, sans lien avec le site.

| Version                   | Performance | TBT    | LCP    | CLS | Accessibilité | SEO |
| ------------------------- | ----------- | ------ | ------ | --- | ------------- | --- |
| Avant (commit `1a9974e`)  | 90          | 177 ms | 2,52 s | 0   | 100           | 100 |
| Hero v2, première version | 85          | 306 ms | 2,66 s | 0   | 100           | 100 |

Seconde fenêtre de mesure, avec la version livrée (compilation non bloquante, sol précalculé, démarrage différé sur mobile). La machine était plus chargée, d'où un « avant » plus bas :

| Version                  | Performance (5 passes)      | TBT    | LCP    | Accessibilité | SEO |
| ------------------------ | --------------------------- | ------ | ------ | ------------- | --- |
| Avant (commit `1a9974e`) | **83** (83, 83, 83, 84, 85) | 390 ms | 2,52 s | 100           | 100 |
| Hero v2 livré            | **81** (84, 81, 86, 79, 62) | 445 ms | 2,66 s | 100           | 100 |

Lecture : le nouveau Hero coûte **environ 2 à 5 points** de performance mobile simulée par rapport au Hero d'origine, surtout en temps de blocage (TBT) au démarrage de la scène. Une passe isolée à 62 reflète une perturbation de la machine (TBT de 2 s, absente des autres passes). Accessibilité et SEO restent à 100, CLS à 0.

Toute première version de la v2, avec une compilation des shaders bloquante : 67 sur mobile (TBT 1,2 s) et 94 sur ordinateur. Le problème venait de l'interrogation trop précoce de l'état de compilation ; il est corrigé.

**La cible de 90 sur mobile n'est pas atteinte de façon fiable sur ce poste**, et le site d'origine lui-même oscille entre 83 et 91 selon la fenêtre de mesure. Une mesure PageSpeed Insights sur l'URL de démo donnera un chiffre plus représentatif.

## 9. Livrables visuels (`screenshots/hero-2026/`)

- `hero-desktop-1366x600.png`, `hero-desktop-1280x720.png`, `hero-desktop-1440x900.png`, `hero-mobile-375x667.png`
- `hero-survol-noyau-1440x900.png` (parallaxe et écartement des nœuds), `hero-survol-cta-1440x900.png`
- `hero-mouvement-reduit-1366x600.png` (version statique)
- `hero-sequence-entree.png` (6 instants de la séquence d'entrée)
- `hero-animation.webp` (313 Ko) et `hero-animation.gif` (1,8 Mo) : environ 6,6 s, séquence d'entrée puis survol, capturés image par image dans Edge sans interface (environ 9 i/s ; la fluidité réelle est de 30 à 60 i/s)
- `hero-comparaison-v1-v2.png` : v1 et v2 côte à côte

## 10. Limites et points à valider

- **Coût de performance** : la scène reste plus coûteuse que le Hero d'origine sur mobile simulé (voir tableau). L'objectif de 90 n'est pas atteint de façon garantie. Pistes si nécessaire, sans changer le rendu sur ordinateur : version mobile encore allégée (moins de particules, pas de shader de plasma), ou démarrage de la scène mobile au premier défilement.
- **Mobile 375 × 667** : le titre et les deux CTA occupent l'écran ; le noyau commence juste en dessous, et seule la partie haute de la scène (modules, réseau très atténué) est visible sans défiler. C'est volontaire, le texte est prioritaire.
- **Ordre d'apparition** : le titre apparaît avant le noyau, pour ne jamais dépendre du démarrage de la scène. L'enchaînement environnement → réseau → noyau → modules est respecté une fois la scène lancée.
- **Distorsion** : la « déformation » autour du noyau est simulée par un anneau lumineux animé. Une vraie réfraction du décor demanderait un rendu en deux passes, plus coûteux.
- **Bouton WhatsApp** (composant existant, non modifié) : sur un écran mobile peu haut (moins de 600 px), sa bulle « Écrire sur WhatsApp » peut recouvrir brièvement le second CTA à l'ouverture de la page.
- **Rendu logiciel** : sur un appareil sans accélération graphique, la scène ne démarre pas volontairement et le décor statique s'affiche.
