/* Rendu du site à partir de js/data.js — pas besoin de toucher ce fichier pour changer le contenu. */
(() => {
  const $ = (s) => document.querySelector(s);
  const esc = (t = "") => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tilt = () => `${(Math.random() * 3 - 1.5).toFixed(1)}deg`;

  // --- liens YouTube -> id ---
  function videoId(link = "") {
    const m = link.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    if (m) return m[1];
    return /^[\w-]{11}$/.test(link) ? link : null;
  }
  function playlistId(link = "") {
    const m = link.match(/[?&]list=([\w-]+)/);
    if (m) return m[1];
    return /^(PL|UU|OL|FL)[\w-]{10,}$/.test(link) ? link : null;
  }

  // --- lecteur léger : miniature d'abord, iframe au clic ---
  function ytBlock({ vid, list, label }) {
    if (!vid && !list) return `<div class="yt empty">${esc(label)}<br/>(colle le lien dans data.js)</div>`;
    const thumb = vid ? `style="background-image:url('https://i.ytimg.com/vi/${vid}/hqdefault.jpg')"` : `style="background:linear-gradient(135deg,#ff4fd8,#8a7cff)"`;
    return `<div class="yt" ${thumb} data-vid="${vid || ""}" data-list="${list || ""}" role="button" tabindex="0" aria-label="Lire ${esc(label)}"><span class="yt-play"></span></div>`;
  }
  document.addEventListener("click", (e) => {
    const el = e.target.closest(".yt[data-vid], .yt[data-list]");
    if (!el || el.querySelector("iframe")) return;
    const { vid, list } = el.dataset;
    const src = list
      ? `https://www.youtube-nocookie.com/embed/videoseries?list=${list}&autoplay=1`
      : `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0`;
    el.classList.add("playing");
    el.innerHTML = `<iframe src="${src}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="Lecteur YouTube"></iframe>`;
  });
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList?.contains("yt")) { e.preventDefault(); e.target.click(); }
  });

  // --- textes généraux ---
  document.title = `${SITE.pseudo} — Portfolio ${SITE.metier}`;
  $("#hudXp").textContent = `XP: MONTAGE LVL ${SITE.niveau}`;
  $("#heroName").textContent = SITE.pseudo.toUpperCase();
  $("#heroJob").textContent = SITE.metier.toUpperCase();
  $("#playerName").textContent = SITE.pseudo;
  $("#lastUpdate").textContent = SITE.derniereMaj;
  ["#heroAvatar", "#profileAvatar"].forEach((s) => ($(s).src = SITE.avatar));

  // --- bio (effet machine à écrire sur la 1re ligne) ---
  const b = SITE.bio;
  $("#bioBox").innerHTML = `
    <p class="hello"><span id="typed"></span><span class="caret"></span></p>
    <p><b>Player :</b> ${esc(SITE.pseudo)}</p>
    <p><b>Rôle :</b> ${esc(b.role)}</p>
    <p><b>Mission :</b> ${esc(b.mission)}</p>
    <p><b>Statut :</b> ${esc(b.statut)}</p>
    <p>Let's start the game !</p>`;
  let typedStarted = false;
  function typeHello() {
    if (typedStarted) return; typedStarted = true;
    const out = $("#typed"); let i = 0;
    const t = setInterval(() => { out.textContent = b.hello.slice(0, ++i); if (i >= b.hello.length) clearInterval(t); }, 45);
  }

  // --- logiciels + stats ---
  $("#toolsList").innerHTML = SITE.logiciels.map((l) => `<li>${esc(l)}</li>`).join("");
  $("#statsList").innerHTML = SITE.stats.map((s) => `
    <div class="stat"><div class="stat-top"><span>${esc(s.nom)}</span><span>${s.valeur}</span></div>
    <div class="stat-bar"><span data-w="${Math.max(0, Math.min(100, s.valeur))}"></span></div></div>`).join("");

  // --- montages ---
  $("#videosGrid").innerHTML = SITE.montages.map((m, i) => `
    <article class="win video-card reveal" style="--r:${tilt()}">
      <div class="win-bar"><span class="win-title">montage_${String(i + 1).padStart(2, "0")}.mp4</span><span class="win-btns"><i></i><i></i><i></i></span></div>
      <div class="win-body">
        ${ytBlock({ vid: videoId(m.lien), label: m.titre })}
        <div class="video-info">
          <h3>${esc(m.titre)}</h3>
          <p>${esc(m.desc)}</p>
          <div class="tags">${(m.tags || []).map((t) => `<span>#${esc(t)}</span>`).join("")}</div>
        </div>
      </div>
    </article>`).join("");

  // --- playlists ---
  $("#playlistsGrid").innerHTML = SITE.playlists.map((p) => {
    const list = playlistId(p.lien);
    return `
    <article class="zine playlist reveal" style="--r:${tilt()}">
      <div class="zine-label">&gt;&gt; PLAYLIST !!</div>
      ${ytBlock({ list, label: p.titre })}
      <h3>${esc(p.titre)}</h3>
      <p>${esc(p.desc)}</p>
      ${list ? `<a class="open" href="https://www.youtube.com/playlist?list=${list}" target="_blank" rel="noopener">Ouvrir sur YouTube ↗</a>` : ""}
    </article>`;
  }).join("");

  // --- avis ---
  $("#reviewsGrid").innerHTML = SITE.avis.map((a) => `
    <article class="review reveal ${a.aRemplacer ? "placeholder" : ""}" style="--r:${tilt()}">
      <div class="stars" aria-label="${a.note} sur 5">${"★".repeat(a.note)}${"☆".repeat(5 - a.note)}</div>
      <p>« ${esc(a.texte)} »</p>
      <div class="who">${esc(a.nom)} <small>${esc(a.chaine || "")}</small></div>
    </article>`).join("");

  // --- contact ---
  const c = SITE.contacts;
  let html = "";
  if (c.youtube) html += `<a class="contact-btn c-yt" href="${esc(c.youtube)}" target="_blank" rel="noopener"><span>▶ YouTube</span><span class="arrow">&gt;&gt;</span></a>`;
  if (c.discordPseudo) html += `<button class="contact-btn c-dc" id="copyDiscord"><span>Discord : ${esc(c.discordPseudo)}</span><span class="arrow">COPIER</span></button>`;
  if (c.discordServeur) html += `<a class="contact-btn c-dc" href="${esc(c.discordServeur)}" target="_blank" rel="noopener"><span>Rejoindre le serveur Discord</span><span class="arrow">&gt;&gt;</span></a>`;
  if (c.email) html += `<a class="contact-btn c-mail" href="mailto:${esc(c.email)}"><span>✉ ${esc(c.email)}</span><span class="arrow">&gt;&gt;</span></a>`;
  $("#contactBox").innerHTML = html;

  const toast = (msg) => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 1800); };
  $("#copyDiscord")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(c.discordPseudo); toast("Pseudo Discord copié !"); }
    catch { toast(c.discordPseudo); }
  });

  // --- marquees ---
  document.querySelectorAll(".marquee-track").forEach((el) => {
    const unit = `<span>${esc(el.dataset.text)}</span><b>★</b>`;
    el.innerHTML = unit.repeat(16);
  });

  // --- étoiles de fond ---
  const sb = $("#starsBg");
  for (let i = 0; i < 60; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = (Math.random() * 2.4).toFixed(2) + "s";
    if (i % 7 === 0) s.style.background = "#ff4fd8";
    if (i % 11 === 0) s.style.background = "#b8e04a";
    sb.appendChild(s);
  }

  // --- étoiles déco dans les sections ---
  document.querySelectorAll(".level").forEach((sec, i) => {
    const st = document.createElement("span");
    st.className = "deco-star";
    st.style.top = "60px";
    st.style[i % 2 ? "left" : "right"] = "4%";
    sec.appendChild(st);
  });

  // --- apparition au scroll ---
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      en.target.querySelectorAll(".stat-bar span").forEach((s) => (s.style.width = s.dataset.w + "%"));
      if (en.target.querySelector("#bioBox")) typeHello();
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
