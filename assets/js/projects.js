/**
 * Charge data/projects.json et génère :
 * - la grille de cartes sur la page Réalisations (#projects-grid)
 * - le contenu de la page d'étude de cas (#project-detail), via ?slug=...
 */
(function () {
  "use strict";

  const LANG = window.location.pathname.split("/").filter(Boolean)[0] === "en" ? "en" : "fr";

  const COPY = {
    fr: {
      notFoundTitle: "Projet introuvable",
      notFoundBody: "Ce projet n'existe pas ou a été retiré.",
      backLink: "/fr/realisations.html",
      backLabel: "← Retour aux réalisations",
      viewSite: "Voir le site",
      viewRepo: "Voir le code",
      detailLink: "Visiter le site →",
    },
    en: {
      notFoundTitle: "Project not found",
      notFoundBody: "This project doesn't exist or has been removed.",
      backLink: "/en/realisations.html",
      backLabel: "← Back to work",
      viewSite: "View site",
      viewRepo: "View code",
      detailLink: "Visit site →",
    },
  };

  async function fetchProjects() {
    const res = await fetch("/data/projects.json", { cache: "no-store" });
    const projects = await res.json();
    return projects.filter((p) => p.status === "published");
  }

  function projectCard(project) {
    const t = COPY[LANG];
    const detailUrl = `/${LANG}/${LANG === "fr" ? "projet" : "project"}.html?slug=${project.slug}`;
    const stackTags = project.stack
      .map((tech) => `<span class="rounded-full border border-slate-200 px-3 py-1 font-mono text-xs text-slate-600">${tech}</span>`)
      .join("");

    const image = project.image
      ? `<a href="${detailUrl}" class="block overflow-hidden rounded-card border border-slate-200">
          <img src="${project.image}" alt="${project.title[LANG]}" loading="lazy" class="aspect-video w-full object-cover object-top transition duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100" />
        </a>`
      : "";

    return `
      <article class="flex flex-col rounded-card border border-slate-200 bg-night-900 p-6 shadow-sm transition hover:border-cyan-accent/40 hover:shadow-md">
        ${image}
        <div class="mt-4 flex flex-wrap gap-2">${stackTags}</div>
        <p class="mt-4 font-mono text-xs text-terminal-green">${project.category[LANG]}</p>
        <h3 class="mt-2 text-xl font-bold text-slate-900">${project.title[LANG]}</h3>
        <p class="mt-3 flex-1 text-sm text-slate-600">${project.summary[LANG]}</p>
        <div class="mt-6 flex items-center gap-4">
          <a href="${project.demoUrl || detailUrl}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-cyan-accent hover:underline">${t.detailLink}</a>
        </div>
      </article>
    `;
  }

  async function renderGrid() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;
    const projects = await fetchProjects();
    grid.innerHTML = projects.map(projectCard).join("");
  }

  async function renderFeatured() {
    const grid = document.getElementById("featured-projects-grid");
    if (!grid) return;
    const projects = await fetchProjects();
    grid.innerHTML = projects.slice(0, 3).map(projectCard).join("");
  }

  function setMeta(selector, attr, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }

  function updateMetaTags(project) {
    const title = `${project.title[LANG]} — Idriss Jbilou`;
    const description = project.summary[LANG];
    const url = window.location.href;
    const image = project.image
      ? new URL(project.image, window.location.origin).href
      : "https://idrissjbilou.vercel.app/assets/img/idriss-jbilou.webp";

    setMeta("link[rel='canonical']", "href", url);
    setMeta("meta[name='description']", "content", description);
    setMeta("meta[property='og:title']", "content", title);
    setMeta("meta[property='og:description']", "content", description);
    setMeta("meta[property='og:url']", "content", url);
    setMeta("meta[property='og:image']", "content", image);
    setMeta("meta[name='twitter:title']", "content", title);
    setMeta("meta[name='twitter:description']", "content", description);
    setMeta("meta[name='twitter:image']", "content", image);

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title[LANG],
      description: project.summary[LANG],
      url: url,
      image: image,
      creator: { "@type": "Person", name: "Idriss Jbilou" },
      keywords: project.stack.join(", "),
    });
    document.head.appendChild(ld);
  }

  async function renderDetail() {
    const container = document.getElementById("project-detail");
    if (!container) return;

    const slug = new URLSearchParams(window.location.search).get("slug");
    const projects = await fetchProjects();
    const project = projects.find((p) => p.slug === slug);
    const t = COPY[LANG];

    if (!project) {
      container.innerHTML = `
        <p class="font-mono text-sm text-terminal-green">// 404</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">${t.notFoundTitle}</h1>
        <p class="mt-4 text-slate-600">${t.notFoundBody}</p>
        <a href="${t.backLink}" class="btn-secondary mt-8 inline-flex">${t.backLabel}</a>
      `;
      return;
    }

    document.title = `${project.title[LANG]} — Idriss Jbilou`;
    updateMetaTags(project);

    const stackTags = project.stack
      .map((tech) => `<span class="rounded-full border border-slate-200 px-3 py-1 font-mono text-xs text-slate-600">${tech}</span>`)
      .join("");

    const links = [
      project.demoUrl
        ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">${t.viewSite}</a>`
        : "",
      project.repoUrl
        ? `<a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary">${t.viewRepo}</a>`
        : "",
    ].join("");

    const image = project.image
      ? `<img src="${project.image}" alt="${project.title[LANG]}" class="mt-8 w-full rounded-card border border-slate-200 object-cover object-top" />`
      : "";

    container.innerHTML = `
      <a href="${t.backLink}" class="font-mono text-sm text-terminal-green hover:underline">${t.backLabel}</a>
      <p class="mt-6 font-mono text-sm text-terminal-green">${project.category[LANG]}</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900 md:text-5xl">${project.title[LANG]}</h1>
      <p class="mt-2 text-slate-500">${project.client[LANG]}${project.year ? ` — ${project.year}` : ""}</p>
      ${image}
      <div class="mt-8 flex flex-wrap gap-2">${stackTags}</div>
      <div class="mt-8 flex flex-wrap gap-4">${links}</div>
      <div class="case-study-content mt-10 text-lg leading-relaxed text-slate-600">${project.description[LANG]}</div>
    `;
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderGrid();
    renderFeatured();
    renderDetail();
  });
})();
