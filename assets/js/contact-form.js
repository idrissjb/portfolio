/**
 * Envoi du formulaire de contact via l'API Web3Forms (AJAX, sans rechargement).
 * Remplacer WEB3FORMS_ACCESS_KEY par la vraie clé d'accès publique
 * (créée gratuitement sur https://web3forms.com).
 */
(function () {
  "use strict";

  const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";
  const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

  const MESSAGES = {
    fr: {
      sending: "Envoi en cours…",
      success: "Message envoyé ! Je vous réponds au plus vite.",
      error: "Une erreur est survenue. Réessayez ou contactez-moi directement par e-mail/WhatsApp.",
    },
    en: {
      sending: "Sending…",
      success: "Message sent! I'll get back to you shortly.",
      error: "Something went wrong. Please try again or reach me directly by email/WhatsApp.",
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const lang = window.location.pathname.split("/").filter(Boolean)[0] === "en" ? "en" : "fr";
    const t = MESSAGES[lang];
    const statusEl = document.getElementById("contact-form-status");
    const submitBtn = form.querySelector("button[type='submit']");

    const accessKeyInput = form.querySelector("input[name='access_key']");
    if (accessKeyInput) accessKeyInput.value = WEB3FORMS_ACCESS_KEY;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      submitBtn.disabled = true;
      statusEl.textContent = t.sending;
      statusEl.className = "mt-4 text-sm text-slate-500";

      try {
        const formData = new FormData(form);
        const res = await fetch(WEB3FORMS_ENDPOINT, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });
        const result = await res.json();

        if (result.success) {
          statusEl.textContent = t.success;
          statusEl.className = "mt-4 text-sm text-terminal-green";
          form.reset();
        } else {
          throw new Error(result.message || "Web3Forms error");
        }
      } catch (err) {
        statusEl.textContent = t.error;
        statusEl.className = "mt-4 text-sm text-red-600";
      } finally {
        submitBtn.disabled = false;
      }
    });
  });
})();
