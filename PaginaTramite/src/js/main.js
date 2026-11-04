// ===== Referencias al DOM =====
const chatForm = document.querySelector("#chatForm");
const questionInput = document.querySelector("#questionInput");
const chatLog = document.querySelector("#chatLog");
const toast = document.querySelector("#toast");
 
// ===== Aviso temporal (toast) =====
let toastTimer;
 
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer); // evita que un aviso viejo cierre el nuevo
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}
 
// ===== Mensajes del chat =====
function addMessage(message, type) {
  const bubble = document.createElement("p");
  bubble.className = `chat-message ${type}`;
  bubble.textContent = message;
  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
}
 
// Quita tildes y pasa a minúsculas: "Cédula" -> "cedula"
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
 
function getAnswer(question) {
  const text = normalizeText(question);
 
  if (text.includes("cedula") || text.includes("identidad")) {
    return "Para tramitar tu cédula, revisa los requisitos, el costo y los turnos en el Registro Civil de Ecuador. Esta demostración es educativa: confirma siempre la información en el sitio oficial.";
  }
  if (text.includes("licencia") || text.includes("conducir")) {
    return "Para una licencia de conducir, consulta los requisitos y turnos de la Agencia Nacional de Tránsito (ANT). El trámite puede variar según el tipo de licencia.";
  }
  if (text.includes("certificado") || text.includes("antecedentes") || text.includes("nacimiento")) {
    return "Los certificados dependen de la institución que los emite. Dime qué certificado necesitas y te orientaré sobre dónde consultar los requisitos oficiales.";
  }
  if (text.includes("salud") || text.includes("medic")) {
    return "Para información de salud pública en Ecuador, consulta los canales oficiales del Ministerio de Salud Pública o del IESS, según el servicio que necesites.";
  }
  if (text.includes("hola") || text.includes("buenas")) {
    return "¡Hola! 😊 Puedo orientarte sobre cédulas, certificados, licencias y servicios públicos. ¿Qué trámite necesitas realizar?";
  }
  return "¡Gracias por tu consulta! Esta es una demostración del asistente. Prueba con preguntas sobre cédula, certificados, licencia de conducir o salud. Verifica siempre los requisitos en páginas oficiales.";
}
 
// ===== Formulario del chat =====
if (chatForm && questionInput && chatLog) {
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = questionInput.value.trim();
 
    if (!question) {
      showToast("Escribe una pregunta antes de enviar.");
      questionInput.focus();
      return;
    }
 
    const hint = chatLog.querySelector(".hint");
    if (hint) hint.remove();
 
    addMessage(question, "user");
    addMessage(getAnswer(question), "bot");
 
    questionInput.value = "";
    questionInput.focus();
  });
}
 
// ===== Botones de temas rápidos =====
document.querySelectorAll("[data-topic]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!questionInput) return;
    const topic = button.dataset.topic;
    questionInput.value = `Quiero información sobre ${topic.toLowerCase()}.`;
    const assistant = document.querySelector("#assistant");
    if (assistant) assistant.scrollIntoView({ behavior: "smooth", block: "center" });
    questionInput.focus();
  });
});
 
// ===== Botones con aviso =====

const toastButtons = {
  "#helpBtn": "Elige un trámite o escribe tu pregunta al asistente virtual.",
  "#faqBtn": "Puedes consultar cédulas, certificados, licencias y servicios públicos.",
  "#profileBtn": "La opción de inicio de sesión es una maqueta visual.",
  "#settingsBtn": "Los ajustes estarán disponibles en una próxima versión."
};
 
Object.entries(toastButtons).forEach(([selector, message]) => {
  const element = document.querySelector(selector);
  if (!element) return;
  element.addEventListener("click", (event) => {
    event.preventDefault(); // evita que el enlace "#" salte al inicio
    showToast(message);
  });
});