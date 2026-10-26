(() => {
  "use strict";

  // Conexión de formularios de TIERRA DE SUEÑOS con Web3Forms.
  // Esta clave es la clave pública de acceso generada para el formulario.
  const ACCESS_KEY = "a71109e9-4d26-4bc0-adee-b8644b3a998f";
  const ENDPOINT = "https://api.web3forms.com/submit";

  async function connectForm(id, subject) {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const button = form.querySelector('button[type="submit"], input[type="submit"]');
      const originalButtonText = button ? (button.textContent || button.value) : "";
      let status = form.parentElement.querySelector(".web3forms-status");
      if (!status) {
        status = document.createElement("p");
        status.className = "small-note web3forms-status";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
        form.insertAdjacentElement("afterend", status);
      }

      const payload = new FormData(form);
      payload.set("access_key", ACCESS_KEY);
      payload.set("subject", subject);
      payload.set("from_name", "TIERRA DE SUEÑOS - Página web");
      payload.set("botcheck", "");

      if (button) {
        button.disabled = true;
        if ("value" in button && button.tagName === "INPUT") button.value = "Enviando...";
        else button.textContent = "Enviando...";
      }
      status.textContent = "Enviando tu información. Por favor espera...";

      try {
        const response = await fetch(ENDPOINT, {
          method: "POST",
          body: payload,
          headers: { "Accept": "application/json" }
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "No fue posible enviar el formulario.");
        }

        status.textContent = "¡Información enviada correctamente! Tierra de Sueños recibió tu solicitud. Gracias por contactarnos.";
        form.reset();
      } catch (error) {
        console.error("Error al enviar formulario Web3Forms:", error);
        status.textContent = "No pudimos enviar la información. Revisa tu conexión e inténtalo de nuevo. Si el problema continúa, contáctanos por WhatsApp.";
      } finally {
        if (button) {
          button.disabled = false;
          if ("value" in button && button.tagName === "INPUT") button.value = originalButtonText;
          else button.textContent = originalButtonText;
        }
      }
    });
  }

  connectForm("property-form", "Nueva oferta de propiedad - TIERRA DE SUEÑOS");
  connectForm("work-form", "Nueva solicitud para trabajar con TIERRA DE SUEÑOS");
})();
