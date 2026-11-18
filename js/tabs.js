/* =========================================================
   ONGLETS Accueil / À propos / Contact (utilisé par la V1 et la V2).
   Une seule vue [data-view] visible à la fois, pilotée par l'ancre de l'URL :
   #accueil, #a-propos, #contact, ou l'id de n'importe quel élément d'une vue
   (ex. #level2 ouvre l'Accueil et descend jusqu'aux montages).
   Les liens d'onglet portent data-tab="<id de la vue>".
   ========================================================= */
(() => {
  const views = [...document.querySelectorAll("[data-view]")];
  const tabs = [...document.querySelectorAll("[data-tab]")];
  if (!views.length) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = null;

  function show(hash) {
    const id = decodeURIComponent((hash || "").replace(/^#/, ""));
    const target = id ? document.getElementById(id) : null;
    const view = (target && (target.matches("[data-view]") ? target : target.closest("[data-view]"))) || views[0];
    const changed = view !== current;

    views.forEach((v) => (v.hidden = v !== view));
    tabs.forEach((t) => {
      const on = t.dataset.tab === view.id;
      t.classList.toggle("active", on);
      if (on) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
    });
    if (changed && current && !reduce) { view.classList.remove("view-in"); void view.offsetWidth; view.classList.add("view-in"); }
    current = view;

    // nouvel onglet : saut direct ; même onglet : défilement doux (réglage CSS du site)
    if (target && target !== view) target.scrollIntoView({ block: "start", behavior: changed ? "instant" : "auto" });
    else if (changed || !id) window.scrollTo({ top: 0, behavior: "instant" });
    dispatchEvent(new Event("scroll")); // met à jour timecodes, timelines, barre d'XP
  }

  addEventListener("hashchange", () => show(location.hash));
  // re-cliquer l'onglet déjà ouvert remonte en haut de la vue
  tabs.forEach((t) => t.addEventListener("click", () => {
    if (location.hash === t.getAttribute("href")) window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  }));
  show(location.hash);
})();
