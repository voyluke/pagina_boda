const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyq4hiH4LUpl8EJU_xPmT6VxlsiAFCLks__NiRDcvwi0yCFuvMYfX2wtPWHDT1YTwu/exec";

const openModalButton = document.getElementById("open-rsvp-modal");
const closeModalButton = document.getElementById("close-rsvp-modal");
const modalOverlay = document.getElementById("rsvp-modal-overlay");
const rsvpForm = document.getElementById("rsvp-form");
const rsvpStatus = document.getElementById("rsvp-status");
const testConnectionButton = document.getElementById("test-rsvp-connection");

const setStatus = (message, color = "#0e2841") => {
  rsvpStatus.textContent = message;
  rsvpStatus.style.color = color;
};

const openModal = () => {
  modalOverlay.classList.remove("hidden");
};

const closeModal = () => {
  modalOverlay.classList.add("hidden");
};

openModalButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalOverlay.classList.contains("hidden")) {
    closeModal();
  }
});

const postToScript = async (payload) => {
  const body = new URLSearchParams(payload);

  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body,
  });
};

testConnectionButton.addEventListener("click", async () => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")) {
    setStatus("Falta conectar Google Sheets: pega tu URL en app.js.", "#b00020");
    return;
  }

  setStatus("Probando conexión...", "#156082");

  try {
    await fetch(`${GOOGLE_SCRIPT_URL}?ping=1`, { method: "GET", mode: "no-cors" });
    setStatus("Endpoint alcanzable. Si no guarda, revisa permisos/deploy en Apps Script.", "#156082");
  } catch (error) {
    setStatus("No se pudo conectar. Revisa el despliegue del Apps Script.", "#b00020");
  }
});

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")) {
    setStatus("Falta conectar Google Sheets: pega tu URL en app.js.", "#b00020");
    return;
  }

  const formData = new FormData(rsvpForm);
  const payload = {
    name: String(formData.get("name") || "").trim(),
    people: String(formData.get("people") || "").trim(),
    transport: String(formData.get("transport") || "").trim(),
    dietary: String(formData.get("dietary") || "").trim(),
  };

  if (!payload.name || !payload.people || !payload.transport) {
    setStatus("Por favor completa todos los campos.", "#b00020");
    return;
  }

  if (!["1", "2"].includes(payload.people)) {
    setStatus("Solo se permite confirmar 1 o 2 personas.", "#b00020");
    return;
  }

  if (!["1", "2", "3"].includes(payload.transport)) {
    setStatus("Selecciona una opción válida de transporte.", "#b00020");
    return;
  }

  setStatus("Enviando...", "#156082");

  try {
    await postToScript(payload);

    setStatus("Gracias, tu confirmación fue enviada. Verifica la hoja en unos segundos.", "#156082");
    rsvpForm.reset();

    window.setTimeout(() => {
      closeModal();
      setStatus("");
    }, 1200);
  } catch (error) {
    setStatus("No se pudo enviar. Revisa URL y despliegue del Apps Script.", "#b00020");
  }
});
