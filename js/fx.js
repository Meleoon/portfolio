/* =========================================================
   FX.JS — effets : boot, grain, particules pixel, timecode,
   timelines de montage, glitch, bandeau LEVEL, scotch, annotations,
   parallax, cheat code (↑↑↓↓←→←→BA ou 5 taps sur la photo).
   Chargé APRÈS main.js.
   ========================================================= */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const DATA = typeof SITE !== "undefined" ? SITE : {};
  const PAL = ["#b8e04a", "#ff4fd8", "#3cf08a", "#8a7cff", "#ffe14d", "#f4f1e8"];
  const store = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch {} },
  };
  const pad = (n) => String(n).padStart(2, "0");

  /* ---------- particules pixel ---------- */
  const fx = $("#fx"), fctx = fx.getContext("2d");
  let parts = [], running = false;
  const resize = () => { fx.width = innerWidth; fx.height = innerHeight; };
  resize(); addEventListener("resize", resize);

  function spawn(x, y, vx, vy, s, c, life, grav) {
    parts.push({ x, y, vx, vy, s, c, life, max: life, grav });
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function burst(x, y, n = 14) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 5;
      spawn(x, y, Math.cos(a) * sp, Math.sin(a) * sp - 2, 4 + ((Math.random() * 5) | 0), PAL[i % PAL.length], (40 + Math.random() * 20) | 0, 0.25);
    }
  }
  function tick() {
    fctx.clearRect(0, 0, fx.width, fx.height);
    parts = parts.filter((p) => p.life-- > 0);
    for (const p of parts) {
      p.vy += p.grav; p.x += p.vx; p.y += p.vy;
      fctx.globalAlpha = Math.min(1, (p.life / p.max) * 1.5);
      fctx.fillStyle = p.c;
      fctx.fillRect(Math.round(p.x / 3) * 3, Math.round(p.y / 3) * 3, p.s, p.s);
    }
    fctx.globalAlpha = 1;
    if (parts.length) requestAnimationFrame(tick);
    else { running = false; fctx.clearRect(0, 0, fx.width, fx.height); }
  }
  addEventListener("pointerdown", (e) => burst(e.clientX, e.clientY));
  if (fine && !reduce) {
    let last = 0;
    addEventListener("pointermove", (e) => {
      const t = performance.now(); if (t - last < 40) return; last = t;
      spawn(e.clientX, e.clientY, Math.random() - 0.5, -Math.random() * 0.6, 4, PAL[(Math.random() * PAL.length) | 0], 24, 0.04);
    });
  }

  /* ---------- écran de boot ---------- */
  const boot = $("#boot");
  if (boot) {
    if (reduce || store.get("booted")) boot.remove();
    else {
      document.body.classList.add("booting");
      const name = (DATA.pseudo || "PLAYER").toUpperCase();
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
        if (done) return; done = true; store.set("booted", "1");
        boot.classList.add("off");
        document.body.classList.remove("booting");
        setTimeout(() => boot.remove(), 600);
        setTimeout(() => burst(innerWidth / 2, innerHeight / 2, 50), 250);
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
  }

  /* ---------- grain animé ---------- */
  const g = $("#grain");
  if (g && !reduce) {
    const ctx = g.getContext("2d"); g.width = 160; g.height = 100;
    const img = ctx.createImageData(160, 100); let f = 0;
    (function loop() {
      if (f++ % 8 === 0) { // grain renouvelé ~7 fois/s seulement (moins agressif)
        const d = img.data;
        for (let p = 0; p < d.length; p += 4) { const v = (Math.random() * 255) | 0; d[p] = d[p + 1] = d[p + 2] = v; d[p + 3] = 255; }
        ctx.putImageData(img, 0, 0);
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- hero : lettres, parallax, START ---------- */
  const ht = $(".hero-title");
  let idx = 0;
  (function split(node) {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...n.textContent].forEach((c) => {
          const s = document.createElement("span"); s.className = "ch"; s.textContent = c;
          s.style.setProperty("--i", idx++); frag.appendChild(s);
        });
        n.replaceWith(frag);
      } else split(n);
    });
  })(ht);
  setInterval(() => { if (Math.random() < 0.5) glitch(ht); }, 3500);

  const hero = $(".hero");
  if (fine && !reduce) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      hero.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    hero.addEventListener("pointerleave", () => { hero.style.setProperty("--mx", 0); hero.style.setProperty("--my", 0); });
  }
  $(".hero .btn-start").addEventListener("click", () => {
    const s = $(".hero-screen"); s.classList.remove("shake"); void s.offsetWidth; s.classList.add("shake");
  });

  function glitch(el) { el.classList.remove("glitching"); void el.offsetWidth; el.classList.add("glitching"); setTimeout(() => el.classList.remove("glitching"), 750); }

  /* ---------- timelines de montage ---------- */
  function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }
  const vNames = (DATA.montages || []).map((m) => m.titre);
  const names = {
    v2: ["TITRE", "GLITCH", "ZOOM", "FX", "TEXTE", "FLASH", "SHAKE"],
    v1: vNames.length ? vNames : ["RUSH_01", "RUSH_02", "RUSH_03"],
    a1: ["MUSIC", "WHOOSH", "SFX", "BOOM", "VOIX"],
  };
  $$(".timeline").forEach((tl, k) => {
    const r = rng(k * 97 + 13);
    const track = (id) => {
      let x = r() * 4, html = "", n = 0;
      while (x < 96) {
        const w = 7 + r() * 17, ww = Math.min(w, 100 - x);
        html += `<div class="tl-clip ${id}" data-l="${x}" data-w="${ww}" style="left:${x}%;width:${ww}%">${names[id][n++ % names[id].length]}</div>`;
        x += w + 0.6 + r() * (id === "v2" ? 9 : 2.5);
      }
      return `<div class="tl-track"><div class="tl-label">${id.toUpperCase()}</div><div class="tl-lane">${html}</div></div>`;
    };
    tl.innerHTML = `
      <div class="tl-box">
        <div class="tl-head"><span>${tl.dataset.label || "SEQUENCE_01"}.prproj</span><span class="tl-tc">00:00:00:00</span><span>60 FPS</span></div>
        <div class="tl-body"><div class="tl-ruler"></div>${track("v2")}${track("v1")}${track("a1")}<div class="tl-playhead"></div></div>
      </div>`;
  });
  const boxes = $$(".tl-box");
  const tcOf = (fr) => `${pad((fr / 216000) | 0)}:${pad(((fr / 3600) | 0) % 60)}:${pad(((fr / 60) | 0) % 60)}:${pad(fr % 60)}`;

  /* ---------- scroll : timecode HUD, XP, playheads ---------- */
  const tc = $("#tc"), xp = $("#xpFill");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    tc.textContent = tcOf(Math.round(p * 180 * 60));
    xp.style.width = p * 100 + "%";
    boxes.forEach((b) => {
      const r = b.getBoundingClientRect();
      const q = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      b.style.setProperty("--p", q.toFixed(4));
      b.querySelector(".tl-tc").textContent = tcOf(Math.round(q * 45 * 60));
      const pos = q * 100;
      b.querySelectorAll(".tl-clip").forEach((c) => {
        const l = +c.dataset.l, w = +c.dataset.w;
        c.classList.toggle("hot", pos >= l && pos <= l + w);
      });
    });
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- gribouillis sous les sous-titres ---------- */
  $$(".level-sub").forEach((s, i) => {
    const paths = [
      "M3 9 C 25 3, 45 14, 70 7 S 115 2, 140 9 S 175 13, 187 5",
      "M3 6 C 30 12, 60 2, 95 9 S 150 4, 187 10",
      "M3 10 Q 40 1, 80 8 T 150 7 T 187 4",
    ];
    s.insertAdjacentHTML("afterend", `<svg class="scribble" viewBox="0 0 190 16" aria-hidden="true"><path d="${paths[i % 3]}"/></svg>`);
  });

  /* ---------- glitch + bandeau LEVEL à l'arrivée sur chaque section ---------- */
  const flash = $("#levelFlash"), seen = new Set();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const h = e.target.querySelector("h2");
    glitch(h);
    if (seen.has(e.target)) return;
    seen.add(e.target);
    e.target.querySelectorAll(".scribble path").forEach((p) => p.classList.add("draw"));
    if (!reduce && !document.body.classList.contains("booting")) {
      flash.textContent = `${h.textContent.replace(/\s+/g, " ").trim().toUpperCase()} — START !`;
      flash.classList.remove("go"); void flash.offsetWidth; flash.classList.add("go");
    }
  }), { threshold: 0.6 });
  $$(".level-head").forEach((h) => io.observe(h));

  /* ---------- scotch, stickers, annotations ---------- */
  $$(".video-card, .review, .win-pink, .playlist").forEach((el, i) => {
    const t = document.createElement("span");
    t.className = "tape" + (i % 2 ? " pink" : "");
    t.style.left = 8 + ((i * 37) % 62) + "%";
    t.style.rotate = ((i % 3) - 1) * 8 + "deg";
    el.appendChild(t);
  });

  const arrows = {
    down: "M8 4 C 30 2, 46 12, 44 32 M36 24 L44 33 L51 24",
    left: "M50 10 C 34 2, 16 8, 8 26 M6 15 L8 27 L19 24",
    right: "M4 10 C 22 2, 40 8, 48 26 M37 24 L48 27 L50 15",
  };
  function note(parent, text, style, dir = "down", cls = "") {
    if (!parent) return;
    const n = document.createElement("span");
    n.className = "note " + cls;
    n.style.cssText = style;
    const svg = `<svg viewBox="0 0 56 40"><path d="${arrows[dir]}"/></svg>`;
    n.innerHTML = dir === "left" ? svg + text : text + svg;
    parent.appendChild(n);
  }
  note($(".console"), "c'est moi !!", "top:-46px;right:-10px;", "down", "pink");
  const firstCard = $(".video-card");
  if (firstCard) {
    firstCard.insertAdjacentHTML("beforeend", `<span class="sticker-new">NEW!</span>`);
    note(firstCard, "mon préféré", "top:-52px;left:30%;", "down", "hide-m");
  }
  note($(".hero-screen"), "appuie là", "bottom:44px;right:18%;", "left", "hide-m");
  note($(".contact"), "clique, ça copie", "top:-50px;right:4%;", "down", "pink");
  $(".win-pink")?.insertAdjacentHTML("beforeend", `<span class="stamp">DISPO ✓</span>`);

  /* ---------- cheat code ---------- */
  function party() {
    document.body.classList.toggle("party");
    for (let i = 0; i < 6; i++) setTimeout(() => burst(Math.random() * innerWidth, Math.random() * innerHeight * 0.6, 30), i * 120);
    const t = $("#toast"); t.textContent = "CHEAT CODE ACTIVÉ !!"; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 1800);
  }
  const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let k = 0;
  addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    k = key === code[k] ? k + 1 : key === code[0] ? 1 : 0;
    if (k === code.length) { k = 0; party(); }
  });
  let taps = 0, tt;
  $("#profileAvatar").addEventListener("click", () => {
    taps++; clearTimeout(tt); tt = setTimeout(() => (taps = 0), 1200);
    if (taps >= 5) { taps = 0; party(); }
  });
})();
