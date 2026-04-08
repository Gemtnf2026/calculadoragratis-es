/* Reusable AdSense slots: use <ad-block variant="mid|bottom|sidebar" ...> */
(function () {
  if (!window.customElements || customElements.get("ad-block")) return;

  function ensureMobileHideStyle() {
    if (document.getElementById("ad-block-on-mobile-hide")) return;
    var st = document.createElement("style");
    st.id = "ad-block-on-mobile-hide";
    st.textContent =
      "@media(max-width:640px){ad-block[data-on-mobile=\"hide\"]{display:none!important}}";
    document.head.appendChild(st);
  }

  function ensureSidebarStyle() {
    if (document.getElementById("ad-block-sidebar-style")) return;
    var st = document.createElement("style");
    st.id = "ad-block-sidebar-style";
    st.textContent =
      "@media(min-width:1100px){ad-block[variant=\"sidebar\"] .ad.ad-sidebar.wrap{position:sticky;top:80px;max-width:320px;margin-left:auto;margin-right:auto}}" +
      "@media(max-width:1099px){ad-block[variant=\"sidebar\"]{display:none!important}}";
    document.head.appendChild(st);
  }

  class AdBlock extends HTMLElement {
    connectedCallback() {
      if (this.dataset.adBlockInit) return;
      this.dataset.adBlockInit = "1";

      var variant = (this.getAttribute("variant") || "mid").toLowerCase();
      if (this.getAttribute("data-on-mobile") === "hide") ensureMobileHideStyle();
      if (variant === "sidebar") ensureSidebarStyle();

      var defaultSlot =
        variant === "bottom" ? "333" : variant === "sidebar" ? "111" : "222";
      var slot = this.getAttribute("data-ad-slot") || defaultSlot;
      var client = this.getAttribute("data-ad-client") || "TU_ID";

      var ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", client);
      ins.setAttribute("data-ad-slot", slot);
      ins.setAttribute("data-ad-format", "auto");
      if (
        this.hasAttribute("data-full-width-responsive") ||
        this.hasAttribute("data-fwr")
      ) {
        ins.setAttribute("data-full-width-responsive", "true");
      }

      var insOnly =
        this.hasAttribute("ins-only") || this.hasAttribute("data-ins-only");

      if (insOnly) {
        this.style.display = "block";
        this.appendChild(ins);
      } else {
        var wrapClass = this.getAttribute("data-wrapper-class");
        if (!wrapClass) {
          if (variant === "bottom") wrapClass = "ad ad-b wrap";
          else if (variant === "sidebar") wrapClass = "ad ad-sidebar wrap";
          else wrapClass = "ad ad-m wrap";
        }
        var wrap = document.createElement("div");
        wrap.className = wrapClass;
        var hostStyle = this.getAttribute("style");
        if (hostStyle) {
          wrap.setAttribute("style", hostStyle);
          this.removeAttribute("style");
        }
        this.style.display = "contents";
        wrap.appendChild(ins);
        this.appendChild(wrap);
      }

      function push() {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {}
      }
      if (document.readyState === "complete") setTimeout(push, 0);
      else window.addEventListener("load", push);
    }
  }

  customElements.define("ad-block", AdBlock);
})();
