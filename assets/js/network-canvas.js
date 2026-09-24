/**
 * Fond animé de nœuds réseau connectés pour le hero.
 * Réagit au curseur ; désactivé (rendu statique, une seule frame) si
 * l'utilisateur préfère moins de mouvement (prefers-reduced-motion).
 */
(function () {
  "use strict";

  const MAX_DISTANCE = 140;
  const MOUSE_RADIUS = 160;
  const NODE_DENSITY = 0.00009; // nœuds par px²
  const MIN_NODES = 30;
  const MAX_NODES = 90;

  function hexToRgba(hex, alpha) {
    const clean = hex.replace("#", "");
    const value = parseInt(clean, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function initNetworkCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;
    if (!ctx || !container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const rootStyles = getComputedStyle(document.documentElement);
    const accent = (rootStyles.getPropertyValue("--color-cyan-accent") || "#22d3ee").trim();
    const accentSoft = (rootStyles.getPropertyValue("--color-cyan-accent-soft") || "#67e8f9").trim();

    let width = 0;
    let height = 0;
    let nodes = [];
    const mouse = { x: null, y: null };

    function createNodes() {
      const count = Math.min(MAX_NODES, Math.max(MIN_NODES, Math.floor(width * height * NODE_DENSITY)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createNodes();
    }

    function drawFrame() {
      ctx.clearRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        nodes.forEach((node) => {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x <= 0 || node.x >= width) node.vx *= -1;
          if (node.y <= 0 || node.y >= height) node.vy *= -1;
          node.x = Math.min(Math.max(node.x, 0), width);
          node.y = Math.min(Math.max(node.y, 0), height);
        });
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DISTANCE) {
            ctx.strokeStyle = hexToRgba(accent, (1 - dist / MAX_DISTANCE) * 0.35);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        if (mouse.x !== null) {
          const dx = nodes[i].x - mouse.x;
          const dy = nodes[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            ctx.strokeStyle = hexToRgba(accentSoft, (1 - dist / MOUSE_RADIUS) * 0.6);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = hexToRgba(accent, 0.8);
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        requestAnimationFrame(drawFrame);
      }
    }

    function handlePointerMove(event) {
      const rect = container.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    }

    function handlePointerLeave() {
      mouse.x = null;
      mouse.y = null;
    }

    resize();
    drawFrame();

    window.addEventListener("resize", resize);
    if (!prefersReducedMotion) {
      container.addEventListener("mousemove", handlePointerMove);
      container.addEventListener("mouseleave", handlePointerLeave);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-network-canvas]").forEach(initNetworkCanvas);
  });
})();
