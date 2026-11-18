/* =========================================================
   TOUT LE CONTENU DU SITE EST ICI.
   Tu modifies ce fichier → le site se met à jour.
   Les liens YouTube peuvent être collés en entier
   (https://youtu.be/..., https://www.youtube.com/watch?v=..., https://www.youtube.com/shorts/...).
   ========================================================= */

const SITE = {
  pseudo: "Meleon",
  metier: "Monteur vidéo",
  niveau: "07",                       // affiché dans la barre du haut : "XP: MONTAGE LVL 07"
  avatar: "assets/avatar.webp",       // ta photo de profil
  derniereMaj: "18 nov 2026",

  // Bio : à réécrire (garde des phrases courtes, style "fiche joueur")
  bio: {
    hello: "Salut !! Moi c'est Meleon, je monte des vidéos !",
    role: "Montage, motion design, sound design",
    mission: "Donner du rythme à tes vidéos et garder les gens jusqu'à la fin.",
    statut: "Dispo pour de nouveaux projets.",
  },

  // Logiciels affichés dans la fenêtre "Armes"
  // style : "rose", "gris" ou "verrouille" (affiché comme pas encore débloqué). Sans style = noir/vert.
  logiciels: [
    { nom: "Premiere Pro", style: "rose" },
    { nom: "DaVinci", style: "gris" },
    { nom: "CapCut", style: "verrouille" },
  ],

  // Compétences (0 à 100) affichées en barres d'XP
  stats: [
    { nom: "Rythme / cuts", valeur: 95 },
    { nom: "Motion design", valeur: 75 },
    { nom: "Sound design", valeur: 75 },
    { nom: "Étalonnage", valeur: 45 },
  ],

  contacts: {
    youtube: "https://www.youtube.com/@MeLeoon",
    discordPseudo: "meleoon",                   // copié au clic
    discordServeur: "",                         // lien d'invitation (optionnel) : https://discord.gg/...
    email: "",                                  // optionnel
  },

  // Tes montages : colle les liens YouTube.
  // format : "long" (vidéo classique, en haut) ou "short" (vertical, dans la grille des shorts)
  // chaine (optionnel) : la chaîne pour qui tu as monté la vidéo
  // vues / likes (optionnel) : chiffres affichés sur la carte — relevés sur YouTube le 18 nov 2026, à mettre à jour à la main
  montages: [
    { format: "long",  lien: "https://www.youtube.com/watch?v=eFQUxnCRSOY", chaine: "Azurhys", titre: "Comment construire un bon RANDOMIZER ?", desc: "Vidéo longue montée pour Azurhys.", tags: ["Vidéo longue"] },

    { format: "short", lien: "https://www.youtube.com/shorts/dcV1B0Rk53A", chaine: "Kapy", vues: 754868, likes: 22488, titre: "Tu savais que tu pouvais faire ça dans Minecraft ??", desc: "Short pour Kapy.", tags: ["Minecraft"] },
    { format: "short", lien: "https://www.youtube.com/shorts/dOJ0rMGVsGo", chaine: "JOSEPH", vues: 385910, likes: 10788, titre: "Le Koopa qui tue", desc: "Short pour JOSEPH.", tags: ["Mario"] },
    { format: "short", lien: "https://www.youtube.com/shorts/ix84ni1XxVo", chaine: "Kapy", vues: 344882, likes: 6200, titre: "Cette orbe d'XP est GIGANTESQUE !!", desc: "Short pour Kapy.", tags: ["Minecraft"] },
    { format: "short", lien: "https://www.youtube.com/shorts/V1ksCjZy4Bc", chaine: "cl3o", vues: 288835, likes: 9513, titre: "Qui marie les femmes de Rudeus dans la timeline sans Rudeus ?", desc: "Short pour cl3o.", tags: ["Anime"] },
    { format: "short", lien: "https://www.youtube.com/shorts/6mLLCHNnQ4I", chaine: "cl3o Films", vues: 266364, likes: 13067, titre: "Pourquoi Spider-Man est le seul à souffrir lors du snap ?", desc: "Short pour cl3o Films.", tags: ["Ciné"] },
    { format: "short", lien: "https://www.youtube.com/shorts/jUuSU0N0RFo", chaine: "Kapy", vues: 260468, likes: 7421, titre: "Le secret pour trouver du diamant facilement", desc: "Short pour Kapy.", tags: ["Minecraft"] },
    { format: "short", lien: "https://www.youtube.com/shorts/2OZVVHKWic4", chaine: "cl3o", vues: 237307, likes: 8804, titre: "Qui sont les personnages les plus forts de Rick et Morty ?", desc: "Short pour cl3o.", tags: ["Rick et Morty"] },
    { format: "short", lien: "https://www.youtube.com/shorts/YMCTgJ-_HLw", chaine: "azurayte", vues: 16306, likes: 566, titre: "Le métier des Mugiwara dans la vraie vie", desc: "Short pour azurayte.", tags: ["One Piece"] },
  ],

  // Playlists portfolio : colle le lien de la playlist (avec list=...)
  playlists: [
    { lien: "https://www.youtube.com/watch?v=75HPL-Dz1yA&list=PLJPI45nGplvY", titre: "Shorts", desc: "Tous mes formats verticaux à la suite." },
  ],

  // Avis clients : UNIQUEMENT de vrais avis, avec l'accord de la personne.
  // afficherAvis: false → la section « Avis » est masquée sur le site.
  afficherAvis: false,
  // Tant que "aRemplacer" est à true, la carte s'affiche comme un emplacement vide.
  avis: [
    { nom: "Nom du client", chaine: "@chaine", note: 5, texte: "Avis à remplacer par un vrai retour client.", aRemplacer: true },
    { nom: "Nom du client", chaine: "@chaine", note: 5, texte: "Avis à remplacer par un vrai retour client.", aRemplacer: true },
    { nom: "Nom du client", chaine: "@chaine", note: 5, texte: "Avis à remplacer par un vrai retour client.", aRemplacer: true },
  ],
};
