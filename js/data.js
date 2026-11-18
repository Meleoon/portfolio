/* =========================================================
   TOUT LE CONTENU DU SITE EST ICI.
   Tu modifies ce fichier → le site se met à jour.
   Les liens YouTube peuvent être collés en entier
   (https://youtu.be/..., https://www.youtube.com/watch?v=...).
   ========================================================= */

const SITE = {
  pseudo: "MeLeoon",
  metier: "Monteur vidéo",
  niveau: "07",                       // affiché dans la barre du haut : "XP: MONTAGE LVL 07"
  avatar: "assets/avatar.svg",        // remplace par assets/avatar.png (ta photo de profil)
  derniereMaj: "18 nov 2026",

  // Bio : à réécrire (garde des phrases courtes, style "fiche joueur")
  bio: {
    hello: "Salut !! Moi c'est MeLeoon, je monte des vidéos B)",
    role: "Montage, motion design, sound design",
    mission: "Donner du rythme à tes vidéos et garder les gens jusqu'à la fin.",
    statut: "Dispo pour de nouveaux projets.",
  },

  // Logiciels affichés dans la fenêtre "Armes"
  logiciels: ["Premiere Pro", "After Effects", "DaVinci", "Blender", "Photoshop"],

  // Compétences (0 à 100) affichées en barres d'XP
  stats: [
    { nom: "Rythme / cuts", valeur: 90 },
    { nom: "Motion design", valeur: 75 },
    { nom: "Sound design", valeur: 80 },
    { nom: "Étalonnage", valeur: 65 },
  ],

  contacts: {
    youtube: "https://www.youtube.com/@MeLeoon",
    discordPseudo: "meleoon",               // copié au clic
    discordServeur: "",                         // lien d'invitation (optionnel) : https://discord.gg/...
    email: "",                                  // optionnel
  },

  // Tes montages : colle les liens YouTube
  montages: [
    { lien: "LIEN_YOUTUBE_1", titre: "Titre du montage 1", desc: "Une ligne pour décrire la vidéo.", tags: ["Minecraft", "60 fps"] },
    { lien: "LIEN_YOUTUBE_2", titre: "Titre du montage 2", desc: "Une ligne pour décrire la vidéo.", tags: ["Motion"] },
    { lien: "LIEN_YOUTUBE_3", titre: "Titre du montage 3", desc: "Une ligne pour décrire la vidéo.", tags: ["Short"] },
    { lien: "LIEN_YOUTUBE_4", titre: "Titre du montage 4", desc: "Une ligne pour décrire la vidéo.", tags: ["Gaming"] },
  ],

  // Playlists portfolio : colle le lien de la playlist (avec list=...)
  playlists: [
    { lien: "LIEN_PLAYLIST_1", titre: "Best-of montages", desc: "Mes meilleurs edits." },
    { lien: "LIEN_PLAYLIST_2", titre: "Shorts", desc: "Formats verticaux." },
  ],

  // Avis clients : UNIQUEMENT de vrais avis, avec l'accord de la personne.
  // Tant que "aRemplacer" est à true, la carte s'affiche comme un emplacement vide.
  avis: [
    { nom: "Nom du client", chaine: "@chaine", note: 5, texte: "Avis à remplacer par un vrai retour client.", aRemplacer: true },
    { nom: "Nom du client", chaine: "@chaine", note: 5, texte: "Avis à remplacer par un vrai retour client.", aRemplacer: true },
    { nom: "Nom du client", chaine: "@chaine", note: 5, texte: "Avis à remplacer par un vrai retour client.", aRemplacer: true },
  ],
};
