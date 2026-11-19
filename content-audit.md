# Audit de contenu — site Nova vs référence novaconsort.com

Date : 18 octobre 2026 · Branche `feat/nova-site`

**Sources consultées**
- `https://www.novaconsort.com/` (HTML brut récupéré le 18/10/2026, site Wix).
- `https://www.novaconsort.com/about-us` : **renvoie une erreur 404** à cette date. Les informations « À propos » (société de conseil, de technologie et d'innovation ; mission ; vision ; valeurs) proviennent de l'inventaire initial (`content-inventory.md`), relevé quand la page était en ligne.
- Le logo officiel 2026 (`src/assets/brand/logo-source-2026.jpg`) : signature « Apprendre • Innover • Transformer » et « Former les talents de l'IA de demain ».
- Le catalogue des 12 formations (`src/data/formations/*.md`) : titres, tarifs, durées et niveaux inchangés.

**Règle appliquée** : on n'ajoute que ce qui figure dans une de ces sources. Tout le reste est listé en « Validation nécessaire » et n'est pas publié.

| Section | Contenu actuel | Information de référence | Amélioration proposée | Validation nécessaire |
|---|---|---|---|---|
| Accueil — hero | H1 « Formation en intelligence artificielle à Casablanca », CTA « Voir les formations » / « Nous contacter » | Accueil Wix : « L'excellence académique à l'ère digitale », « IA · Stratégie digitale · Innovation · Leadership entrepreneurial » | Inchangé : le H1 SEO et les CTA sont conservés, la ligne des 4 domaines est déjà reprise. | Non |
| Accueil — appel final | Surtitre « Passez à l'action » | Logo 2026 : « Apprendre • Innover • Transformer » | **Fait** : le surtitre reprend la signature officielle du logo. | Non |
| Accueil — chiffres | 12 formations · 3 niveaux · 4 programmes gratuits · Casablanca | Catalogue | Inchangé. Ce sont des chiffres tirés du catalogue, pas des statistiques commerciales. | Non |
| Accueil — sphères | 3 sphères vérifiées (Cursus IA, Culture digitale, Ingénierie d'affaire) | 6 « Sphères d'influence » sur Wix | Inchangé. Langues, accompagnement académique et conseil légal restent masqués : aucun programme correspondant au catalogue. | **Oui** : existe-t-il une offre réelle pour ces 3 sphères ? |
| À propos — histoire, mission, vision, valeurs | Texte issu de la page « About » | Page About (aujourd'hui en 404) | Inchangé, déjà fidèle à la source. | Date de fondation et étapes clés (déjà en `[À COMPLÉTER]`) |
| À propos — approche pédagogique | Absente | Logo (signature) + catalogue (3 niveaux, mise en pratique, programmes entrepreneuriat gratuits, IA + Métier, sur mesure) | **Fait** : section « Apprendre · Innover · Transformer » (3 piliers, chacun relié à des programmes réels). | Non |
| À propos — publics | Une phrase dans le hero | Catalogue : professionnels, entreprises, entrepreneurs, carrière digitale (salarié/freelance/entrepreneur), 5–17 ans | **Fait** : section « Pour qui ? » (5 publics, chacun relié à la fiche ou à la catégorie). | Non |
| À propos — formateurs | Masqué (placeholder) | Profils Wix = contenu de démonstration | Inchangé, reste masqué. | **Oui** : vrais profils de formateurs |
| À propos — accréditations | Masqué (`affiliationsVerified: false`) | Titre « Nos Accréditations » sur Wix, sans contenu vérifiable | Rien n'est publié. | **Oui** : nature et preuve de chaque accréditation |
| Formations — catalogue | 12 fiches, filtres catégorie, niveau et tarif | Catalogue | **Fait** : guide « Comment choisir votre formation ? » (7 situations, chacune vers une fiche ou une catégorie existante). | Non |
| Formations — objectifs et compétences | Contenus des fiches existantes | Catalogue | Inchangé : aucun objectif ni compétence inventé. | Prérequis, durées et modalités encore `[À COMPLÉTER]` sur certaines fiches |
| Entreprises — thématiques | 4 thématiques (IA générative, agents, automatisation, IA + Métier) | Catalogue (modules Level 2/3, IA + Métier) | Inchangé. | Non |
| Entreprises — au-delà de la formation | Absent | Fiches « Innovation, IA et Solutions Technologiques » (conseil en transformation digitale et en innovation), « StartUp Booster », « Nova Digital Master Program » | **Fait** : section « Innover et transformer votre organisation » (3 programmes réels, liens vers les fiches). | Non |
| Entreprises — démarche | Masquée (« Proposition – à valider ») | Aucune | Inchangé, reste masqué. | **Oui** : démarche, formats (intra, sur site, en ligne), tailles de groupe, tarifs |
| Infrastructures | Non affichées | Wix : « Auditoriums connectés », « Hubs de co-création », « Study Lounges », « Espaces séminaires VIP » | Rien n'est publié : aucune preuve que ces espaces existent à l'adresse de Casablanca. | **Oui** : photos réelles et confirmation |
| Formations « IA et finance » | Aucune | Wix : « formations exclusives en IA et finance » | Rien n'est publié : aucun programme finance au catalogue. | **Oui** |
| Contact — CTA | « Parlons de votre projet de formation », formulaire, WhatsApp | E-mail `contact@novainteligencia.group` (Secrétariat général) | Inchangé. Le numéro WhatsApp est lu depuis `.env` (configuré localement). | Téléphone fixe : `[À COMPLÉTER]` |
| Photos | 9 photos Unsplash (`CREDITS.md`) | — | Conservées, voile recoloré bleu nuit → bleu. Elles ne sont pas présentées comme des photos de Nova. | **Oui** : photos réelles des locaux et des sessions, si disponibles |
| Témoignages | Exemples fictifs visibles seulement en mode démo | — | Inchangé. | **Oui** : vrais témoignages avec accord écrit |
