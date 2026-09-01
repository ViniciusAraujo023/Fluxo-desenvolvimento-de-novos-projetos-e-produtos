import { fmtDate } from "../utils/dateUtils";

const EMAILJS_SERVICE_ID = "";

const EMAILJS_TEMPLATE_ID = "";

const EMAILJS_PUBLIC_KEY = "";

const EMAILJS_READY = Boolean(
  EMAILJS_SERVICE_ID &&
  EMAILJS_TEMPLATE_ID &&
  EMAILJS_PUBLIC_KEY
);

///
const NOTIFY_EMAIL = "danielscotti@soprano.com.br";

///
function loadEmailJsScript() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) return resolve(window.emailjs);
    const existing = document.getElementById("emailjs-sdk");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.emailjs));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.id = "emailjs-sdk";
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.onload = () => {
      try {
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        resolve(window.emailjs);
      } catch (e) {
        reject(e);
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function emailParams(project) {
  const idea = project.data?.[0] || {};
  return {
    to_email: NOTIFY_EMAIL,
    subject: `Nova ideia de produto aguardando aprovação — ${idea.ideia || project.name}`,
    projeto: project.name,
    ideia: idea.ideia || "—",
    tipo_ideia: idea.tipoIdeia || "—",
    segmento: idea.segmento || "—",
    responsavel: project.responsavel || "—",
    data_inicio: fmtDate(project.startDate),
    descricao: idea.descricao || "—",
    justificativa: idea.justificativa || "—",
  };
}

function buildIdeaMailto(project) {
  const p = emailParams(project);
  const body = [
    "Uma nova ideia de produto foi cadastrada e aguarda avaliação.",
    "",
    `Projeto: ${p.projeto}`,
    `Ideia: ${p.ideia}`,
    `Tipo de ideia: ${p.tipo_ideia}`,
    `Segmento: ${p.segmento}`,
    `Responsável: ${p.responsavel}`,
    `Data de início: ${p.data_inicio}`,
    "",
    `Descrição: ${p.descricao}`,
    `Justificativa: ${p.justificativa}`,
    "",
    "Acesse o fluxo de engenharia para avaliar e confirmar ou recusar esta ideia.",
    "https://fluxo-desenvolvimento-de-novos-proj.vercel.app/",
    "",
  ].join("\n");
  return `mailto:${NOTIFY_EMAIL}?subject=${encodeURIComponent(p.subject)}&body=${encodeURIComponent(body)}`;
}

// Precisa ser chamada de forma SÍNCRONA dentro de um onClick — se rodar
// depois, num useEffect/Promise, o navegador não reconhece mais como
// gesto do usuário e bloqueia a abertura do cliente de e-mail.
function openMailClient(mailtoUrl) {
  const link = document.createElement("a");
  link.href = mailtoUrl;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Dispara a notificação da nova ideia.
 * Retorna "sent" (enviado de verdade via EmailJS) ou "mailto" (abriu o
 * cliente de e-mail como alternativa, quando o EmailJS não está configurado).
 */
function notifyNewIdea(project) {
  if (EMAILJS_READY && window.emailjs) {
    window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams(project)).catch((err) => {
      console.error("Falha ao enviar e-mail automaticamente, tente novamente pelo botão 'Reenviar'.", err);
    });
    return "sent";
  }
  if (EMAILJS_READY && !window.emailjs) {
    loadEmailJsScript().catch(() => {});
  }
  
  openMailClient(buildIdeaMailto(project));
  return "mailto";
}

export {
  EMAILJS_READY,
  NOTIFY_EMAIL,
  loadEmailJsScript,
  emailParams,
  buildIdeaMailto,
  openMailClient,
  notifyNewIdea,
};
