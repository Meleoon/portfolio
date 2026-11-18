/* Portfolio — rendu à partir de js/data.js + effets vidéo.
   Pour changer le contenu : modifier js/data.js, rien ici. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (t = "") => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (n) => String(n).padStart(2, "0");
  const asset = (p = "") => p; // les chemins de data.js partent de la racine du site (comme cette page)
  // 754868 -> "755K", 1837328 -> "1,8M"
  const num = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(1).replace(".", ",").replace(",0", "")}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : String(n);
  const COLORS = ["lime", "pink", "yellow", "lav"];
  const TILTS = [-1.2, .8, -.6, 1.1, -.9, .5];

  function videoId(link = "") {
    const m = link.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : /^[\w-]{11}$/.test(link) ? link : null;
  }
  function playlistId(link = "") {
    const m = link.match(/[?&]list=([\w-]+)/);
    return m ? m[1] : /^(PL|UU|OL|FL)[\w-]{10,}$/.test(link) ? link : null;
  }

  const S = SITE;
  const longs = S.montages.filter((m) => m.format !== "short");
  const shorts = S.montages.filter((m) => m.format === "short");
  const totalVues = shorts.reduce((s, m) => s + (m.vues || 0), 0);
  const totalLikes = shorts.reduce((s, m) => s + (m.likes || 0), 0);
  const record = Math.max(0, ...shorts.map((m) => m.vues || 0)); // le short le plus vu
  const chaines = new Set(S.montages.map((m) => (m.chaine || "").toLowerCase()).filter(Boolean));

  /* ---------- textes ---------- */
  document.title = `${S.pseudo} — Portfolio ${S.metier}`;
  $("#heroName").textContent = S.pseudo.toUpperCase();
  $("#hudName").textContent = S.pseudo.toUpperCase();
  ["#hudAvatar", "#deskAvatar"].forEach((s) => ($(s).src = asset(S.avatar)));
  $("#deskCaption").textContent = `>> ${S.pseudo}, ${S.metier.toLowerCase()}`;
  // intro du hero : la spécialité en étiquette, puis la mission en une phrase
  $("#heroIntro").innerHTML = `<b>${esc(S.bio.role.split(/,\s*/).join(" · "))}</b><span>${esc(S.bio.mission)}</span>`;
  $("#playerName").textContent = S.pseudo;
  $("#lastUpdate").textContent = S.derniereMaj;
  $("#contactStatus").textContent = S.bio.statut;

  if (totalVues) $("#viewsCount").dataset.count = totalVues; else $("#wViews").remove();
  const todo = [
    shorts.length && { t: `Monter ${shorts.length} shorts`, ok: true },
    totalVues && { t: `Passer les ${num(totalVues)} vues`, ok: true },
    { t: "Ton projet", ok: false },
  ].filter(Boolean);
  $("#todo").innerHTML = todo.map((i) => `<li class="${i.ok ? "done" : ""}"><span class="box">${i.ok ? "✓" : ""}</span><span>${esc(i.t)}</span></li>`).join("");

  /* ---------- chiffres ---------- */
  const nums = [
    totalVues && { v: totalVues, f: num, l: "vues sur les shorts montés" },
    totalLikes && { v: totalLikes, f: num, l: "likes récoltés" },
    record && { v: record, f: num, l: "vues sur un seul short" },
    chaines.size && { v: chaines.size, f: String, l: "chaînes m'ont fait confiance" },
  ].filter(Boolean);
  $("#numGrid").innerHTML = nums.map((n, i) => `
    <div class="num reveal" style="--r:${TILTS[i] * .8}deg"><b data-count="${n.v}" data-fmt="${n.f === num ? "k" : ""}">0</b><span>${esc(n.l)}</span></div>`).join("");

  /* ---------- profil ---------- */
  const b = S.bio;
  $("#bio").innerHTML = `
    <p class="hello">${esc(b.hello)}</p>
    <dl>
      <dt>Player</dt><dd>${esc(S.pseudo)}</dd>
      <dt>Rôle</dt><dd>${esc(b.role)}</dd>
      <dt>Mission</dt><dd>${esc(b.mission)}</dd>
      <dt>Statut</dt><dd>${esc(b.statut)}</dd>
    </dl>
    <p class="go">Let's start the game !</p>`;
  $("#tools").innerHTML = S.logiciels.map((l) => {
    const { nom, style = "" } = typeof l === "string" ? { nom: l } : l;
    const locked = style === "verrouille";
    return `<li class="${style ? "tool-" + esc(style) : ""}"${locked ? ' title="Pas encore débloqué"' : ""}>${esc(nom)}${locked ? "<small>LOCKED</small>" : ""}</li>`;
  }).join("");
  $("#stats").innerHTML = S.stats.map((s) => `
    <div class="stat"><div class="stat-top"><span>${esc(s.nom)}</span><span>${s.valeur}</span></div>
    <div class="stat-bar"><span data-w="${Math.max(0, Math.min(100, s.valeur))}"></span></div></div>`).join("");

  /* ---------- lecteurs vidéo ---------- */
  function player({ vid, list, label, vert }) {
    if (!vid && !list) return `<div class="vid empty ${vert ? "vert" : ""}">${esc(label)}<br />(colle le lien dans data.js)</div>`;
    const bg = vid ? ` style="background-image:url('https://i.ytimg.com/vi/${vid}/hqdefault.jpg')"` : ` style="background:var(--pink)"`;
    return `<button type="button" class="vid ${vert ? "vert" : ""}" data-vid="${vid || ""}" data-list="${list || ""}"${bg} aria-label="Lire : ${esc(label)}">
      <span class="play"></span></button>`;
  }
  document.addEventListener("click", (e) => {
    const el = e.target.closest("button.vid");
    if (!el) return;
    const { vid, list } = el.dataset;
    const src = list
      ? `https://www.youtube-nocookie.com/embed/videoseries?list=${list}&autoplay=1`
      : `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0`;
    const box = document.createElement("div");
    box.className = el.className;
    box.innerHTML = `<iframe src="${src}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="Lecteur YouTube"></iframe>`;
    el.replaceWith(box);
  });

  const feature = (o) => `
    <article class="feature reveal ${o.cls || ""}" style="--c:var(--${o.color})">
      <div class="win-bar"><span class="dots"><i></i><i></i><i></i></span><span class="win-t">${esc(o.file)}</span><span class="win-x">×</span></div>
      <div class="feature-body">
        <div class="feature-media">${o.media || player(o)}</div>
        <div class="feature-info">
          <span class="tag-black">${esc(o.kicker)}</span>
          <h3>${esc(o.label)}</h3>
          ${o.desc ? `<p>${esc(o.desc)}</p>` : ""}
          ${o.chip ? `<span class="chip">${esc(o.chip)}</span>` : ""}
          ${o.extra || ""}
        </div>
      </div>
    </article>`;

  /* ---------- montages ---------- */
  $("#workCount").textContent = pad(S.montages.length);
  $("#longs").innerHTML = longs.map((m, i) => feature({
    vid: videoId(m.lien), label: m.titre, desc: m.desc, color: "lav",
    file: `montage_${pad(i + 1)}.mp4`, kicker: "Vidéo longue", chip: m.chaine && !(m.desc || "").includes(m.chaine) ? `pour ${m.chaine}` : "",
  })).join("") + feature({
    // emplacement vide en fin de liste : invite à proposer sa vidéo
    cls: "slot-card", color: "yellow", file: `montage_${pad(longs.length + 1)}.mp4`, kicker: "Vidéo longue",
    label: "Ta vidéo ?", desc: "La prochaine vidéo longue de cette liste, ça pourrait être la tienne.",
    media: `<a class="vid slot" href="#contact"><span class="plus">+</span><span class="slot-t">Ta vidéo ici ?</span><small>LECTURE EN ATTENTE</small></a>`,
    extra: `<a class="btn btn-black" href="#contact">On en parle →</a>`,
  });
  if (!shorts.length) $("#shortsLabel").remove();
  $("#shorts").innerHTML = shorts.map((m, i) => {
    const c = COLORS[i % COLORS.length];
    const tag = (m.tags || [])[0];
    return `
    <article class="card c-${c} reveal" style="--r:${TILTS[i % TILTS.length]}deg">
      <div class="win-bar"><span class="dots"><i></i><i></i><i></i></span><span class="win-t">${pad(i + 1)} / ${esc((m.chaine || "short").toLowerCase())}</span></div>
      <div class="card-media">${tag ? `<span class="card-tag">${esc(tag)}</span>` : ""}${player({ vid: videoId(m.lien), label: m.titre, vert: true })}</div>
      <div class="card-foot">
        ${m.vues ? `<div class="card-num"><b>${num(m.vues)}</b><small>vues${m.likes ? ` · ♥ ${num(m.likes)}` : ""}</small></div>` : ""}
        <h3>${esc(m.titre)}</h3>
        ${m.chaine ? `<span class="chip">Short pour ${esc(m.chaine)}</span>` : ""}
      </div>
    </article>`;
  }).join("") + (() => {
    // emplacement vide en fin de liste : « ton short ? »
    const i = shorts.length, c = COLORS[i % COLORS.length];
    return `
    <article class="card c-${c} slot-card reveal" style="--r:${TILTS[i % TILTS.length]}deg">
      <div class="win-bar"><span class="dots"><i></i><i></i><i></i></span><span class="win-t">${pad(i + 1)} / toi ?</span></div>
      <div class="card-media"><a class="vid vert slot" href="#contact"><span class="plus">+</span><span class="slot-t">Ton short<br />ici ?</span><small>EN ATTENTE</small></a></div>
      <div class="card-foot">
        <div class="card-num"><b>???</b><small>vues à venir</small></div>
        <h3>Ton prochain short, monté pour qu'on le regarde jusqu'au bout.</h3>
        <a class="chip" href="#contact">Short pour toi →</a>
      </div>
    </article>`;
  })();

  /* ---------- playlists ---------- */
  $("#playlistList").innerHTML = S.playlists.map((p, i) => {
    const list = playlistId(p.lien);
    return feature({
      vid: videoId(p.lien), list, label: p.titre, desc: p.desc, color: COLORS[(i + 1) % COLORS.length],
      file: `playlist_${pad(i + 1)}.m3u`, kicker: "Playlist",
      extra: list ? `<a class="btn btn-black" href="https://www.youtube.com/playlist?list=${list}" target="_blank" rel="noopener">Ouvrir sur YouTube ↗</a>` : "",
    });
  }).join("");

  /* ---------- avis (masqués si afficherAvis: false) ---------- */
  if (S.afficherAvis === false) {
    ["#avis", "#mqAvis", "#navAvis"].forEach((s) => $(s)?.remove());
  } else {
    $("#reviews").innerHTML = S.avis.map((a) => `
      <article class="review reveal ${a.aRemplacer ? "placeholder" : ""}">
        <div class="stars" aria-label="${a.note} sur 5">${"★".repeat(a.note)}${"☆".repeat(5 - a.note)}</div>
        <p>« ${esc(a.texte)} »</p>
        <div class="who">${esc(a.nom)} <small>${esc(a.chaine || "")}</small></div>
      </article>`).join("");
  }
  // numéros de niveau dans l'ordre des sections restantes
  $$("[data-level]").forEach((el, i) => (el.textContent = `LEVEL ${pad(i + 1)}`));

  /* ---------- contact ---------- */
  const c = S.contacts;
  let html = "";
  if (c.youtube) html += `<a class="btn btn-pink" href="${esc(c.youtube)}" target="_blank" rel="noopener">▶ YouTube</a>`;
  if (c.discordPseudo) html += `<button class="btn btn-lav" id="copyDiscord" type="button">Discord : ${esc(c.discordPseudo)} · copier</button>`;
  if (c.discordServeur) html += `<a class="btn btn-paper" href="${esc(c.discordServeur)}" target="_blank" rel="noopener">Serveur Discord →</a>`;
  if (c.email) html += `<a class="btn btn-black" href="mailto:${esc(c.email)}">✉ ${esc(c.email)}</a>`;
  $("#contactBtns").innerHTML = html;
  const toast = (msg) => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1800); };
  $("#copyDiscord")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(c.discordPseudo); toast("Pseudo Discord copié !"); } catch { toast(c.discordPseudo); }
  });

  /* ---------- bandeaux ---------- */
  $$(".marquee-track").forEach((el) => {
    const unit = el.dataset.items.split("|").map((t) => `<span>${esc(t)}</span>`).join("");
    el.innerHTML = unit.repeat(6);
  });

  /* ---------- timelines de montage (playhead lié au scroll) ---------- */
  const tc = (frames) => { const f = Math.floor(frames); return `${pad(Math.floor(f / 90000))}:${pad(Math.floor(f / 1500) % 60)}:${pad(Math.floor(f / 25) % 60)}:${pad(f % 25)}`; };
  $$(".tl").forEach((el, k) => {
    let s = 7 + k * 13;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const v1 = S.montages.map((m) => `<span class="clip v1" style="--g:${(2 + rnd() * 3).toFixed(1)}">${esc(m.titre)}</span>`).join("");
    const v2 = ["TITRE", "ZOOM x2", "SFX", "SOUS-TITRES", "FLASH", "MEME"].map((t) =>
      `<span class="gap" style="--g:${(1 + rnd() * 4).toFixed(1)}"></span><span class="clip v2" style="--g:${(1 + rnd() * 2).toFixed(1)}">${t}</span>`).join("");
    const a1 = ["musique_01.wav", "voix.wav", "whoosh.wav", "musique_02.wav"].map((t) =>
      `<span class="clip a1" style="--g:${(3 + rnd() * 4).toFixed(1)}">${t}</span>`).join("");
    el.innerHTML = `
      <div class="tl-head"><span>${esc(el.dataset.seq)}</span><span class="tl-tc">00:00:00:00</span></div>
      <div class="tl-body">
        <div class="tl-ruler">${Array.from({ length: 8 }, (_, i) => `<span>${tc(i * 8 * 25)}</span>`).join("")}</div>
        <div class="tl-track"><b>V2</b><div class="tl-lane">${v2}</div></div>
        <div class="tl-track"><b>V1</b><div class="tl-lane">${v1}</div></div>
        <div class="tl-track"><b>A1</b><div class="tl-lane">${a1}</div></div>
        <i class="tl-play"></i>
      </div>`;
    el.setAttribute("aria-hidden", "true");
  });

  const xp = $("#xp");
  function onScroll() {
    const h = document.documentElement;
    xp.style.width = (scrollY / Math.max(1, h.scrollHeight - innerHeight)) * 100 + "%";
    $$(".tl").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const q = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      el.style.setProperty("--p", q.toFixed(3));
      el.querySelector(".tl-tc").textContent = tc(q * 64 * 25);
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  /* ---------- timecode REC (25 i/s) ---------- */
  const tcEls = [$("#tc"), $("#vfTc")];
  if (!RM) {
    const t0 = performance.now();
    let last = -1;
    const tick = (now) => {
      const f = Math.floor((now - t0) / 40);
      if (f !== last) { last = f; const t = tc(f); tcEls.forEach((e) => (e.textContent = t)); }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- apparitions, compteurs, barres, coupes ---------- */
  function countUp(el) {
    const target = +el.dataset.count || 0;
    const fmt = el.dataset.fmt === "k" ? num : (n) => n.toLocaleString("fr-FR");
    if (RM) { el.textContent = fmt(target); return; }
    let i = 0; const N = 18;
    const t = setInterval(() => { i++; el.textContent = fmt(i >= N ? target : Math.round(target * (i / N) ** .7)); if (i >= N) clearInterval(t); }, 55);
  }
  function show(el) {
    el.classList.add("in");
    $$(".stat-bar span", el).forEach((s) => (s.style.width = s.dataset.w + "%"));
    $$("[data-count]", el).forEach(countUp);
    if (el.dataset.count) countUp(el);
    const cut = el.classList.contains("cut") ? el : el.querySelector(".cut");
    if (cut && !RM) cut.classList.add("cut-in");
  }
  const targets = [...$$(".reveal"), ...$$(".cut:not(.reveal)"), $("#viewsCount")].filter(Boolean);
  if ("IntersectionObserver" in window && !RM) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return; show(en.target); io.unobserve(en.target);
    }), { threshold: 0.15 });
    targets.forEach((el) => io.observe(el));
  } else targets.forEach(show);

  // « (ça se scrolle) » seulement si la bio dépasse
  const bio = $("#bio");
  const hint = () => ($("#bioHint").style.display = bio.scrollHeight > bio.clientHeight + 4 ? "" : "none");
  hint(); addEventListener("resize", hint);

  /* ---------- flèche « appuie ici bg » : la pointe tombe sous l'onglet « À propos » ---------- */
  const note = $("#tapNote"), aboutTab = $('[data-tab="a-propos"]');
  const placeNote = () => {
    if (!note || !aboutTab) return;
    const t = aboutTab.getBoundingClientRect(), h = note.parentElement.getBoundingClientRect();
    note.style.setProperty("--tip-x", `${t.left + t.width / 2 - h.left}px`);
  };
  placeNote(); addEventListener("resize", placeNote);
  document.fonts?.ready.then(placeNote); // la largeur des onglets change quand la police pixel arrive

  /* ---------- fenêtres déplaçables (bureau, écrans larges) ---------- */
  const desk = $("#desk");
  const wide = matchMedia("(min-width: 961px)");
  let z = 10;
  $$(".win, .sticker", desk).forEach((w) => {
    const handle = w.classList.contains("sticker") ? w : $(".win-bar", w);
    handle.addEventListener("pointerdown", (e) => {
      if (!wide.matches || e.button !== 0) return;
      e.preventDefault();
      const r = w.getBoundingClientRect(), d = desk.getBoundingClientRect();
      const ox = e.clientX - r.left, oy = e.clientY - r.top;
      w.style.zIndex = ++z; w.classList.add("dragging");
      handle.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const dd = desk.getBoundingClientRect();
        w.style.left = ev.clientX - dd.left - ox + "px";
        w.style.top = ev.clientY - dd.top - oy + "px";
      };
      const up = () => { handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", up); w.classList.remove("dragging"); };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
      void d;
    });
  });
  $("#tidy").addEventListener("click", () => $$("#desk > *").forEach((w) => { w.style.left = w.style.top = w.style.zIndex = ""; }));

  /* ---------- grain pellicule ---------- */
  const g = $("#grain");
  if (!RM && g.getContext) {
    const gc = g.getContext("2d"); g.width = g.height = 140;
    const img = gc.createImageData(140, 140);
    const noise = () => {
      for (let i = 0; i < img.data.length; i += 4) { const v = (Math.random() * 255) | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      gc.putImageData(img, 0, 0);
    };
    noise(); setInterval(() => { if (!document.hidden) noise(); }, 160);
  } else g.remove();

  /* ---------- écran de démarrage façon cartouche (1 fois par visite) ---------- */
  const boot = $("#boot");
  let seen = false;
  try { seen = sessionStorage.getItem("booted") === "1"; } catch { /* stockage indisponible */ }
  if (RM || seen) boot.remove();
  else {
    document.body.classList.add("booting");
    const name = (S.pseudo || "PLAYER").toUpperCase();
    $("#bootLogo").textContent = name;
    const lines = [
      "> INSERTION DE LA CARTOUCHE.......",
      `> PROFIL : ${name}`,
      "> IMPORT DES RUSHS........... OK",
      "> SYNC AUDIO / VIDEO......... OK",
      "> RENDU 60 FPS............... OK",
      "> CHARGEMENT DES SFX......... OK",
    ];
    const out = $("#bootLog"), bar = $("#bootBar");
    let i = 0, done = false;
    const finish = () => {
      if (done) return; done = true;
      try { sessionStorage.setItem("booted", "1"); } catch { /* stockage indisponible */ }
      boot.classList.add("off");
      document.body.classList.remove("booting");
      setTimeout(() => boot.remove(), 600);
    };
    const step = () => {
      if (done) return;
      if (i < lines.length) {
        out.textContent += lines[i] + "\n";
        bar.style.width = ((i + 1) / lines.length) * 100 + "%";
        i++; setTimeout(step, 220 + Math.random() * 220);
      } else { $("#bootPress").hidden = false; setTimeout(finish, 1100); }
    };
    setTimeout(step, 300);
    boot.addEventListener("click", finish);
    addEventListener("keydown", finish, { once: true });
  }
})();
