/**
 * Injecte le header/footer partagés, applique la langue courante
 * (détectée depuis /fr/ ou /en/ dans l'URL) et gère le menu mobile.
 */
(function () {
  "use strict";

  const LANG = window.location.pathname.split("/").filter(Boolean)[0] === "en" ? "en" : "fr";

  // Chemin normalisé (ex: "/fr" ou "/fr/" -> "/fr/index.html") pour comparer
  // les URLs de façon fiable même si un serveur retire le index.html visible.
  function normalizedPath(pathname) {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "/fr/index.html";
    if (segments.length === 1 && (segments[0] === "fr" || segments[0] === "en")) {
      return `/${segments[0]}/index.html`;
    }
    return `/${segments.join("/")}`;
  }

  async function injectPartial(placeholderId, url) {
    const el = document.getElementById(placeholderId);
    if (!el) return;
    const res = await fetch(url, { cache: "no-store" });
    el.outerHTML = await res.text();
  }

  function applyLanguage() {
    document.querySelectorAll("[data-href-fr], [data-href-en]").forEach((el) => {
      const href = el.dataset[LANG === "fr" ? "hrefFr" : "hrefEn"];
      if (href) el.setAttribute("href", href);
    });

    document.querySelectorAll("[data-label-fr], [data-label-en]").forEach((el) => {
      const label = el.dataset[LANG === "fr" ? "labelFr" : "labelEn"];
      if (label !== undefined) {
        if (el.hasAttribute("aria-label")) {
          el.setAttribute("aria-label", label);
        } else {
          el.textContent = label;
        }
      }
    });

    // Sélecteur de langue : reconstruit le chemin équivalent dans l'autre langue
    const currentPath = normalizedPath(window.location.pathname);
    const otherLang = LANG === "fr" ? "en" : "fr";
    const otherPath = currentPath.replace(/^\/(fr|en)\//, `/${otherLang}/`);

    document.querySelectorAll("[data-lang-link]").forEach((el) => {
      const targetLang = el.dataset.langLink;
      el.setAttribute("href", targetLang === LANG ? currentPath : otherPath);
      el.setAttribute("aria-current", targetLang === LANG ? "true" : "false");
      el.classList.toggle("lang-link--active", targetLang === LANG);
    });

    document.documentElement.setAttribute("lang", LANG);
  }

  function highlightActiveNavLink() {
    const currentPath = normalizedPath(window.location.pathname);
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (normalizedPath(link.getAttribute("href")) === currentPath) {
        link.setAttribute("aria-current", "page");
        link.classList.add("nav-link--active");
      }
    });
  }

  function setupMobileMenu() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    const iconOpen = document.getElementById("nav-toggle-icon-open");
    const iconClose = document.getElementById("nav-toggle-icon-close");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("hidden");
      iconOpen.classList.toggle("hidden");
      iconClose.classList.toggle("hidden");
    });
  }

  async function init() {
    await Promise.all([
      injectPartial("header-placeholder", "/partials/header.html"),
      injectPartial("footer-placeholder", "/partials/footer.html"),
    ]);
    applyLanguage();
    highlightActiveNavLink();
    setupMobileMenu();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
