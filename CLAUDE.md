# CLAUDE.md — Cahier des charges du projet

PROJET : portfolio professionnel et site vitrine freelance de [Idriss jbilou], ingénieur en informatique et réseaux basé au Maroc (kenitra). Objectifs : trouver des clients freelance (PME, cabinets, écoles, cliniques) et des opportunités d'emploi.

STACK : HTML5 + Tailwind CSS (dernière version stable, config personnalisée : couleurs, polices, espacements), JavaScript vanilla, site 100% statique (aucun backend). Tailwind CLI utilisé uniquement pour compiler le CSS final (build step léger, pas de framework front JS). Pas de framework front (React/Vue/Astro...), pas de Bootstrap.

DESIGN : style "tech épuré" haut de gamme, niveau agence, pas un template Bootstrap basique.
- Palette : fond clair (blanc / gris très clair), couleur d'accent bleu indigo, accent secondaire vert (utilisé avec parcimonie), texte ardoise foncé. Mode clair par défaut.
- Typographies : Space Grotesk pour les titres, Inter pour le texte, JetBrains Mono pour les éléments techniques. Polices auto-hébergées.
- Beaucoup d'espace blanc, grille cohérente (utilitaires Tailwind), coins arrondis subtils, bordures fines, légers effets de lueur sur l'accent.
- Design system Tailwind personnalisé (fichier de config : palette, polices, espacements, rayons) pour un rendu sur-mesure, jamais l'aspect "template par défaut".
- Animations subtiles et performantes : apparition au défilement (Intersection Observer), transitions CSS douces entre les états, survols élégants. Respecter prefers-reduced-motion.
- Élément signature : fond animé de nœuds réseau connectés (canvas) dans la section hero, qui réagit au curseur.

LANGUES : français (par défaut) et anglais, avec sélecteur de langue. Pages dupliquées par dossier : `/fr/...` et `/en/...`, chaque page étant un fichier HTML complet et autonome par langue (pas de traduction dynamique côté JS).

PAGES (à dupliquer en /fr et /en) : Accueil, Services, Réalisations (liste + page par étude de cas), À propos, Contact, page 404 personnalisée. (Pages "Articles" et "Infrastructure" retirées pour l'instant, faute de contenu à publier — pourront être réintroduites plus tard.)

CONTACT : formulaire via Web3Forms (clé d'accès publique côté client — ne jamais exposer de clé secrète, uniquement l'access key publique prévue pour cet usage), bouton WhatsApp flottant vers wa.me/212767117161, e-mail idrissfr14@gmail.com. Liens : LinkedIn https://www.linkedin.com/in/idriss-jbilou-b93b87297/, GitHub https://github.com/idrissjb.

QUALITÉ EXIGÉE : responsive parfait (mobile d'abord), accessibilité (contraste, navigation clavier, attributs ARIA), score Lighthouse visé ≥ 95 partout, SEO complet (meta, Open Graph, sitemap.xml, robots.txt, données structurées JSON-LD), composants HTML réutilisables (inclusions via JS ou duplication maîtrisée du header/footer), code propre et commenté.

SEO TECHNIQUE (en place) : `robots.txt` + `sitemap.xml` à la racine, balises canonical/hreflang (fr/en/x-default), Open Graph + Twitter Card sur chaque page, JSON-LD (Person sur l'accueil, CreativeWork généré dynamiquement sur chaque page projet). ⚠️ Toutes les URLs utilisent actuellement le placeholder `https://idriss-jbilou.vercel.app` — à remplacer partout (canonical, hreflang, og:url, og:image, sitemap.xml, robots.txt) par l'URL réelle une fois le site déployé sur Vercel.

GESTION DES PROJETS (Réalisations) : pas de panneau admin ni de backend. Les projets vivent dans un fichier `projects.json` (un par langue ou structure multilingue interne) contenant pour chaque projet : titre, résumé, client/secteur, stack technique, images, date, statut (brouillon/publié), lien démo/repo, contenu de l'étude de cas. Un script JS côté client charge ce JSON et génère dynamiquement les cartes sur la page Réalisations ainsi que le contenu de la page d'étude de cas (via un paramètre d'URL ou une génération par identifiant). Ajout ou modification d'un projet = éditer `projects.json` puis commit/push ; site 100% statique, aucune régénération de build nécessaire.

RÈGLES DE TRAVAIL : avancer étape par étape, proposer un plan avant chaque grosse modification, vérifier que le site s'ouvre et fonctionne correctement (pages, liens, responsive) après chaque étape.
