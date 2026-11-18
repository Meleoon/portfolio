# Portfolio montage vidéo — instructions pour Claude Code

## Le projet
Site portfolio statique (HTML / CSS / JS, sans framework, sans build) pour un monteur vidéo.
Hébergé sur GitHub, déployé automatiquement par Netlify (dossier de publication : `.`, pas de commande de build).

## Structure
- `index.html` — squelette des sections (ne contient pas de contenu perso)
- `js/data.js` — **TOUT le contenu** : pseudo, bio, photo, logiciels, stats, contacts, montages, playlists, avis
- `js/main.js` — génère le site à partir de `data.js`
- `css/style.css` — toute la DA
- `assets/avatar.svg` — avatar provisoire → à remplacer par la vraie photo de profil (`assets/avatar.png`)
- `assets/refs/` — les 2 images de référence de la DA (à regarder avant toute modif visuelle)

## V2 en test (`v2/`)
Deuxième version du site, en ligne sur `/v2/` pour comparer avec la V1 (racine). Elle lit le **même** `js/data.js`
(chemins d'assets préfixés `../` dans `v2/app.js`). Mise en page « bureau » (gros nom, fenêtres déplaçables, cartes
avec gros chiffres, rangée de stats) + effets vidéo : amorce mire/compte à rebours, viseur caméra, timecode REC,
timelines V2/V1/A1, coupes franches RVB sur les titres, OSD magnéto au survol, grain. Texte courant en IBM Plex Mono
pour la lisibilité. Quand le choix est fait : soit supprimer `v2/`, soit déplacer son contenu à la racine.

## Direction artistique (à respecter)
Mélange de deux références :
1. **Zine vert/noir** (`ref-zine-vert.jpg`) : vert lime + noir, bordures noires épaisses, ombres dures décalées,
   étiquettes style `>> TITRE !!`, blocs légèrement penchés, étoiles, stickers, grille en fond.
2. **Jeu rétro pixel néon** (`ref-pixel-neon.jpg`) : fond noir étoilé, HUD en haut (XP / PLAYER 01 / barre de vie),
   gros titre pixel rose avec ombre verte, bouton START qui clignote, bandeaux défilants lavande,
   sections "Level 01, 02…", fenêtres rétro rose pâle, console portable rose, sol en pixels.

Règles :
- Palette dans `:root` de `style.css` (noir, lime, rose néon, vert menthe, lavande, jaune étoile). Ne pas en ajouter sans raison.
- Polices : Jersey 10 (gros titres pixel), Sedgwick Ave Display (tags graffiti : pseudo, nom), Silkscreen (étiquettes),
  Pixelify Sans (texte), Sedgwick Ave (annotations au marqueur). Ne pas revenir à Press Start 2P / VT323 / Inter / Space Mono : trop génériques.
- Animations "saccadées" (`steps()`), jamais de dégradés doux ou d'ombres floues façon template moderne.
- Pas de personnages sous copyright (Transformers, Nintendo, etc.) : uniquement des éléments pixel originaux.
- Toujours responsive mobile + respecter `prefers-reduced-motion`.

## Couche VFX (css/fx.css + js/fx.js)
Effets déjà en place, à garder cohérents :
- écran de boot façon cartouche (1 fois par visite, clic pour passer)
- scanlines CRT, vignette, grain animé, flicker
- HUD : ● REC + timecode 60 fps lié au scroll + barre d'XP = progression de la page
- timelines de montage (pistes V2 / V1 / A1) avec tête de lecture qui suit le scroll
- glitch RGB sur les titres, bandeau « LEVEL 0X — START ! » à chaque section
- survol des vidéos en mode VHS (PLAY SP, lignes de tracking)
- particules pixel au clic + traînée au curseur, curseur pixel
- touches « fait main » : scotch, annotations au marqueur, gribouillis, tampon DISPO, sticker NEW!
- parallax du hero, lettres qui sautent, ciel pixel + soleil rayé
- cheat code : ↑↑↓↓←→←→BA (ou 5 taps sur la photo de profil)
Tout est coupé si `prefers-reduced-motion`. Le style doit rester « fait main / monteur », jamais lisse ou générique.

## Avis clients
N'afficher que de **vrais** avis, avec l'accord des personnes. Ne jamais inventer d'avis.
Un avis avec `aRemplacer: true` s'affiche comme un emplacement vide.

## À faire au premier démarrage
1. Me demander : pseudo, bio, liens YouTube des montages (titre + description + tags), liens des playlists,
   lien de la chaîne YouTube, pseudo Discord (+ lien serveur), e-mail éventuel, vrais avis clients.
2. Remplir `js/data.js`.
3. Remplacer l'avatar par ma photo (je la mettrai dans `assets/`), et mettre à jour `SITE.avatar`.
4. Lancer un serveur local (`python3 -m http.server 8000`) pour que je voie le résultat.
5. Une fois validé : `git init`, commit, créer le dépôt GitHub `portfolio` (via `gh` si connecté) et push.

## Workflow habituel
- Modifier → je vérifie en local → commit avec un message clair → push sur `main` → Netlify republie seul.
- Pour ajouter une vidéo : ajouter une entrée dans `SITE.montages` de `data.js`, rien d'autre.
