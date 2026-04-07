/* autor: Gemma Ramo | copyright g@ramo | v1 */
document.addEventListener("DOMContentLoaded", function () {

  const bloqueSEO = `
    <section class="trust wrap">

      <h2>¿Por qué usar nuestras calculadoras?</h2>

      <ul class="trust-list">
        <li>✅ 100% gratuitas y sin registro</li>
        <li>✅ Resultados instantáneos</li>
        <li>✅ Cálculos basados en fórmulas reales</li>
        <li>✅ Adaptadas a España</li>
        <li>✅ Funcionan en móvil y ordenador</li>
      </ul>

    </section>

    <section class="disclaimer wrap">

      <p>
        ⚠️ <strong>Aviso:</strong> Los resultados son orientativos y pueden no ser exactos.
        Esta herramienta no sustituye asesoramiento profesional.
      </p>

    </section>
  `;

  // Insertar antes del footer
  const footer = document.querySelector("footer");

  if (footer && !document.querySelector("section.trust.wrap")) {
    footer.insertAdjacentHTML("beforebegin", bloqueSEO);
  }

});
