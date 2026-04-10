/* CMP ligero + Google Consent Mode v2 (RGPD). Requiere gtag en la página. */
(function () {
  var STORAGE = "cg_consent_v1";

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || typeof o !== "object") return null;
      return o;
    } catch (e) {
      return null;
    }
  }

  function write(o) {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(o));
    } catch (e) {}
  }

  function applyConsent(prefs, opts) {
    opts = opts || {};
    if (typeof gtag !== "function") return;
    var ads = !!prefs.ads;
    var analytics = !!prefs.analytics;
    gtag("consent", "update", {
      ad_storage: ads ? "granted" : "denied",
      ad_user_data: ads ? "granted" : "denied",
      ad_personalization: ads ? "granted" : "denied",
      analytics_storage: analytics ? "granted" : "denied"
    });
    try {
      window.dispatchEvent(
        new CustomEvent("cg-consent-updated", { detail: prefs })
      );
    } catch (e) {}
    if (!opts.skipAdRefresh) {
      refreshAdSense();
    }
  }

  function refreshAdSense() {
    try {
      document.querySelectorAll("ins.adsbygoogle").forEach(function (ins) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      });
    } catch (e) {}
  }

  function hideBar() {
    var root = document.getElementById("cg-cookie-root");
    if (root) {
      root.remove();
    }
    document.body.classList.remove("cg-cookie-open");
  }

  function showBar() {
    document.body.classList.add("cg-cookie-open");
  }

  function renderBanner() {
    if (document.getElementById("cg-cookie-root")) return;

    document.body.insertAdjacentHTML(
      "beforeend",
      '<div id="cg-cookie-root" class="cg-cookie-banner" role="dialog" aria-modal="true" aria-labelledby="cg-cookie-title" aria-describedby="cg-cookie-desc">' +
        '<div class="cg-cookie-inner">' +
        '<p id="cg-cookie-title" class="cg-cookie-title">Cookies y privacidad</p>' +
        '<p id="cg-cookie-desc" class="cg-cookie-text">Usamos cookies propias y de terceros para medir el tráfico (Google Analytics) y mostrar publicidad relevante (Google AdSense). Las cookies estrictamente necesarias permiten el funcionamiento básico del sitio. Puedes aceptar todas, rechazar las opcionales o configurar por categorías. Más detalle en nuestra <a href="politica-cookies.html">política de cookies</a>.</p>' +
        '<div class="cg-cookie-actions">' +
        '<button type="button" class="cg-btn cg-btn-secondary" id="cg-reject">Solo necesarias</button>' +
        '<button type="button" class="cg-btn cg-btn-ghost" id="cg-customize">Personalizar</button>' +
        '<button type="button" class="cg-btn cg-btn-primary" id="cg-accept">Aceptar todas</button>' +
        "</div>" +
        '<div id="cg-cookie-panel" class="cg-cookie-panel" hidden>' +
        '<label class="cg-check"><input type="checkbox" id="cg-opt-analytics" /> <span>Estadísticas (Google Analytics)</span></label>' +
        '<label class="cg-check"><input type="checkbox" id="cg-opt-ads" /> <span>Publicidad (Google AdSense)</span></label>' +
        '<button type="button" class="cg-btn cg-btn-primary cg-btn-block" id="cg-save">Guardar preferencias</button>' +
        "</div>" +
        "</div>" +
        "</div>"
    );

    showBar();

    document.getElementById("cg-accept").addEventListener("click", function () {
      var prefs = { analytics: true, ads: true, updated: Date.now() };
      write(prefs);
      applyConsent(prefs);
      hideBar();
    });

    document.getElementById("cg-reject").addEventListener("click", function () {
      var prefs = { analytics: false, ads: false, updated: Date.now() };
      write(prefs);
      applyConsent(prefs);
      hideBar();
    });

    var panel = document.getElementById("cg-cookie-panel");
    document
      .getElementById("cg-customize")
      .addEventListener("click", function () {
        var open = panel.hidden;
        panel.hidden = !open;
        if (open) {
          document.getElementById("cg-opt-analytics").focus();
        }
      });

    document.getElementById("cg-save").addEventListener("click", function () {
      var prefs = {
        analytics: document.getElementById("cg-opt-analytics").checked,
        ads: document.getElementById("cg-opt-ads").checked,
        updated: Date.now()
      };
      write(prefs);
      applyConsent(prefs);
      hideBar();
    });
  }

  function init() {
    var stored = read();
    if (
      stored &&
      typeof stored.analytics === "boolean" &&
      typeof stored.ads === "boolean"
    ) {
      applyConsent(
        {
          analytics: stored.analytics,
          ads: stored.ads
        },
        { skipAdRefresh: true }
      );
      return;
    }
    renderBanner();
  }

  window.openCookiePreferences = function () {
    try {
      localStorage.removeItem(STORAGE);
    } catch (e) {}
    hideBar();
    renderBanner();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
