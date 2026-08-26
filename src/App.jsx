
import React, { useState, useEffect, useRef } from "react";
import {
  Check, Circle, ChevronLeft, Plus, Paperclip, Download, X,
  ArrowLeft, Calendar, User, Ban, Trash2, AlertCircle, Mail, Send, RotateCcw, ShieldCheck
} from "lucide-react";

/* ---------------------------------------------------------
   USUÁRIOS (mock — sem backend de autenticação real)
   --------------------------------------------------------- */
const USERS = [
  { id: "u1", name: "Vinícius Almeida", email: "viniciusalmeida@soprano.com.br", role: "admin", area: "Engenharia de Produto" },
  { id: "u2", name: "Daniel Scotti", email: "daniel.scotti@soprano.com.br", role: "admin", area: "Engenharia de Produto" },
  { id: "u3", name: "Eduardo Di Domenico", email: "eduardo.didomenico@soprano.com.br", role: "colaborador", area: "Colaborador" },
  { id: "u4", name: "Eduarda Bossle da Silva", email: "eduarda.bossle@soprano.com.br", role: "colaborador", area: "Colaboradora" },
];

const isAdminRole = (user) => user?.role === "admin";

/* ---------------------------------------------------------
   ESTADOS DO PROJETO
   --------------------------------------------------------- */
const STATUS = {
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDO: "Concluído",
  RECUSADO: "Recusado",
  CANCELADO: "Cancelado",
};

const isBlockedStatus = (status) => status === STATUS.RECUSADO || status === STATUS.CANCELADO;

const statusBadgeClass = (status) => {
  switch (status) {
    case STATUS.CONCLUIDO: return "bg-emerald-100 text-emerald-700";
    case STATUS.RECUSADO: return "bg-rose-100 text-rose-700";
    case STATUS.CANCELADO: return "bg-slate-200 text-slate-600";
    default: return "bg-amber-100 text-amber-700";
  }
};

const progressBarClass = (status) => {
  if (status === STATUS.RECUSADO) return "bg-rose-400";
  if (status === STATUS.CANCELADO) return "bg-slate-400";
  return "bg-sky-800";
};

/* ---------------------------------------------------------
   DEFINIÇÃO DO FLUXO (35 telas)
   --------------------------------------------------------- */
const PHASES = [
  { id: "ideacao", label: "Ideação", range: [0, 1] },
  { id: "viabilidade", label: "Viabilidade & Aprovação", range: [2, 6] },
  { id: "desenvolvimento", label: "Desenvolvimento & Testes", range: [7, 11] },
  { id: "marketing", label: "Marketing & Vendas", range: [12, 19] },
  { id: "registro", label: "Registro & Cadastro", range: [20, 26] },
  { id: "compras", label: "Compras & Importação", range: [27, 33] },
  { id: "lancamento", label: "Lançamento", range: [34, 34] },
];

const phaseOf = (idx) => PHASES.find((p) => idx >= p.range[0] && idx <= p.range[1]);

const OPT_SN = ["Sim", "Não"];
const OPT_AR = ["Aprovado", "Reprovado"];

const STEP_DEFS = [
  { title: "Solicitar avaliação de nova ideia de produto", fields: [
    { key: "ideia", label: "Ideia", type: "text" },
    { key: "tipoIdeia", label: "Tipo de ideia", type: "select", options: ["Redução de custo", "Inovação", "Melhoria"] },
    { key: "segmento", label: "Segmento", type: "select", options: [
      "Banho", "Sobre Pia", "Lixeiras", "Organização", "Caixas Térmicas",
      "Bolsas Térmicas", "Isotérmicos", "Garrafas Térmicas", "Marmitas", "Utilidades", "Outros",
    ]},
    { key: "descricao", label: "Descrição da ideia", type: "textarea" },
    { key: "justificativa", label: "Justificativa", type: "textarea" },
  ]},
  { title: "Avaliar ideia de novo produto", approval: true },
  { title: "Aprovar TAP / Escopo", fields: [
    { key: "tap", label: "TAP preenchida", type: "file" },
    { key: "escopo", label: "Escopo preenchido", type: "file" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
  ]},
  { title: "Avaliar projeto nacional / importado", fields: [
    { key: "nacional", label: "Nacional", type: "checkbox" },
    { key: "importado", label: "Importado", type: "checkbox" },
    { key: "docViabilidade", label: "Doc. viabilidade técnica", type: "file" },
    { key: "investimento", label: "Investimento", type: "file" },
    { key: "observacao", label: "Observação", type: "textarea" },
  ]},
  { title: "Alinhar projeto de novo produto", fields: [
    { key: "projetoValidado", label: "Projeto validado", type: "select", options: OPT_SN },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Analisar o projeto conforme o tipo", branch: true, fields: {
    Importado: [
      { key: "solicitarAmostra", label: "Solicitar amostra", type: "select", options: OPT_SN },
      { key: "anexarCotacao", label: "Anexar cotação", type: "file" },
      { key: "loteMinimo", label: "Lote mínimo", type: "text" },
      { key: "custoValidado", label: "Custo validado", type: "select", options: OPT_SN },
      { key: "observacao", label: "Observação", type: "textarea" },
    ],
    Nacional: [
      { key: "investimentoAtualizado", label: "Investimento atualizado", type: "file" },
      { key: "custoAtualizado", label: "Custo atualizado", type: "file" },
      { key: "conceitoProduto", label: "Conceito do produto", type: "file" },
      { key: "observacao", label: "Observação", type: "textarea" },
    ],
  }},
  { title: "Avaliar custos do projeto de novo produto", fields: [
    { key: "baixarCusto", label: "Custo anexado", type: "download" },
    { key: "custosValidados", label: "Custos validados", type: "radio", options: OPT_SN },
    { key: "anexarNovoCusto", label: "Anexar novo custo", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Validar fornecedor", fields: [
    { key: "certificadoIso", label: "Certificado ISO", type: "file" },
    { key: "fornecedorValidado", label: "Fornecedor validado", type: "select", options: OPT_SN },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Validar processo ferramental", fields: [
    { key: "docValidacaoFerramental", label: "Doc. validação ferramental", type: "file" },
    { key: "validacao", label: "Validação", type: "select", options: OPT_SN },
    { key: "observacao", label: "Observação", type: "textarea" },
  ]},
  { title: "Testar produto", fields: [
    { key: "arquivoPadraoTestes", label: "Arquivo padrão de testes", type: "download" },
    { key: "testePreenchido", label: "Teste preenchido", type: "file" },
    { key: "testeValidado", label: "Teste validado", type: "radio", options: OPT_SN },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Avaliar alternativas / Apresentar projeto", fields: [
    { key: "apresentacaoPPT", label: "Apresentação PPT", type: "file" },
    { key: "projetoValidado", label: "Projeto validado", type: "select", options: OPT_SN },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Definir cores e acabamento / Enviar render", fields: [
    { key: "definicaoCores", label: "Definição das cores", type: "text" },
    { key: "acabamentoCorpo", label: "Acabamento e corpo", type: "text" },
    { key: "renderProduto", label: "Render do produto", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Desenvolver briefing do marketing", fields: [
    { key: "briefingMkt", label: "Briefing do MKT", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Alinhar previsão de vendas — Marketing", fields: [
    { key: "previsaoVendas", label: "Previsão de vendas", type: "file" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Alinhar previsão de vendas — Comercial", fields: [
    { key: "previsaoVendas", label: "Previsão de vendas", type: "file" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Alinhar previsão de vendas — Planejamento", fields: [
    { key: "previsaoVendas", label: "Previsão de vendas", type: "file" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Preencher AI", fields: [
    { key: "baixarModeloAI", label: "Modelo padrão de AI", type: "download" },
    { key: "anexarAI", label: "Anexar AI", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastro de produto — Etapa 1", fields: [
    { key: "checklist1", label: "Itens de cadastro", type: "checklist", options: [
      "Planilha / Cubagem", "EN0105", "CD1117", "CD0204", "CD0022",
      "CD0138", "CD0903", "CE0106", "CD2561", "CD1112", "FT0301",
    ]},
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastro de produto — Etapa 2", fields: [
    { key: "checklist2", label: "Itens de cadastro", type: "checklist", options: [
      "Criação da PS", "Criação da INSP", "Cadastro FTP",
    ]},
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastrar processo do item", fields: [
    { key: "planilhaCusto", label: "Planilha de custo", type: "download" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastrar dados fiscais do item (check do fiscal)", fields: [
    { key: "cadastroFiscal", label: "Cadastro fiscal", type: "download" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Desenhar plano de comunicação", fields: [
    { key: "planoComunicacao", label: "Plano de comunicação", type: "file" },
    { key: "etiquetasTags", label: "Etiquetas / tags", type: "file" },
    { key: "embalagens", label: "Embalagens", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastrar PS / II / CNP / SISCOMEX / FTP", fields: [
    { key: "checklist3", label: "Itens cadastrados", type: "checklist", options: [
      "PS", "Inspection Instruction", "CNP", "SISCOMEX", "FTP",
    ]},
    { key: "arquivosCadastro", label: "Arquivos de cadastro", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Definir insumos", fields: [
    { key: "definicaoInsumos", label: "Definição de insumos", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Enviar documentação PS / II / ArtWork", subtitle: "Segmentação importado", fields: [
    { key: "ps", label: "PS", type: "file" },
    { key: "inspectionInstruction", label: "Inspection Instruction", type: "file" },
    { key: "artwork", label: "ArtWork", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Desenvolver fornecedores / Validar matéria-prima", fields: [
    { key: "validacaoFornecedor", label: "Validação fornecedor", type: "file" },
    { key: "aprovacao", label: "Aprovação", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Validar processos", subtitle: "Ficha padrão try-out", fields: [
    { key: "fichaPadrao", label: "Ficha padrão try-out", type: "download" },
    { key: "fichaPreenchida", label: "Ficha preenchida", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastrar solicitação de compra — TOTVS", fields: [
    { key: "numeroSolicitacao", label: "Nº da solicitação", type: "text" },
    { key: "printCadastro", label: "Print do cadastro", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastrar pedido de compra — TOTVS", fields: [
    { key: "numeroPedido", label: "Nº do pedido", type: "text" },
    { key: "printPedido", label: "Print do pedido", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Registrar PI no TOTVS", fields: [
    { key: "arquivoProforma", label: "Arquivo proforma", type: "file" },
    { key: "arquivoInvoice", label: "Arquivo invoice", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Aprovar PI TOTVS", fields: [
    { key: "aprovacaoPiTotvs", label: "Aprovação PI TOTVS", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Anexar arquivo de inspeção", fields: [
    { key: "arquivoInspecao", label: "Arquivo de inspeção preenchido", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Aprovar / Acompanhar pedido — lote piloto", fields: [
    { key: "aprovacaoInspecao", label: "Aprovação da inspeção", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Validar custos e preço de lista", fields: [
    { key: "validacaoCusto", label: "Validação de custo", type: "file" },
    { key: "aprovacaoPrecoLista", label: "Aprovação preço de lista", type: "select", options: OPT_AR },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Plano de lançamento", fields: [
    { key: "planoLancamento", label: "Plano de lançamento", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
];

const TOTAL = STEP_DEFS.length;

const fieldsFor = (idx, project) => {
  const def = STEP_DEFS[idx];
  if (!def.branch) return def.fields || [];
  const tipo = project?.data?.[3]?.importado ? "Importado" : "Nacional";
  return def.fields[tipo];
};

const uid = () => Math.random().toString(36).slice(2, 10);
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtDate = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/* ---------------------------------------------------------
   E-MAIL — envio real (EmailJS) com fallback para "mailto:"
   ---------------------------------------------------------
   Para o e-mail sair automaticamente (sem depender do cliente
   de e-mail do usuário), crie uma conta gratuita em
   https://www.emailjs.com, configure um serviço + template e
   preencha as três constantes abaixo. Sem isso preenchido, o
   sistema cai automaticamente para abrir um rascunho no
   cliente de e-mail padrão.
   --------------------------------------------------------- */
const EMAILJS_SERVICE_ID = ""; // ex: "service_abc123"
const EMAILJS_TEMPLATE_ID = ""; // ex: "template_xyz789"
const EMAILJS_PUBLIC_KEY = ""; // ex: "AbCdEfGhIjKlMnOp"
const EMAILJS_READY = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

const NOTIFY_EMAIL = "viniciusalmeida@soprano.com.br";

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

/* ---------------------------------------------------------
   PERSISTÊNCIA — Supabase (via REST/PostgREST, sem depender do
   pacote @supabase/supabase-js, que não pode ser importado neste
   ambiente de artifact — apenas bibliotecas de uma lista fixa
   estão disponíveis). Toda chamada usa fetch() puro contra o
   endpoint REST automático que o Supabase expõe para cada tabela.
   ---------------------------------------------------------
   Preencha as duas constantes abaixo com os dados do seu projeto
   Supabase (Project Settings → API):
   --------------------------------------------------------- */
const SUPABASE_URL =
  "https://usyajcoisqhlhcuoplqt.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_zHKLjz7nf01h8PicTn_0EQ_49kH9-JP";
const SUPABASE_READY = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

async function supaRequest(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase ${res.status}: ${detail || res.statusText}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// snake_case (banco) <-> camelCase (app)
function rowToProject(row) {
  return {
    id: row.id,
    name: row.name,
    responsavel: row.responsavel,
    startDate: row.start_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    currentStep: row.current_step,
    status: row.status,
    emailNotified: row.email_notified,
    emailMethod: row.email_method,
    data: row.data || {},
  };
}
function projectToRow(project) {
  return {
    id: project.id,
    name: project.name,
    responsavel: project.responsavel,
    start_date: project.startDate,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
    created_by: project.createdBy,
    current_step: project.currentStep,
    status: project.status,
    email_notified: !!project.emailNotified,
    email_method: project.emailMethod || null,
    data: project.data || {},
  };
}

async function loadProjects() {
  if (!SUPABASE_READY) return [];
  try {
    const rows = await supaRequest("projects?select=*&order=created_at.desc");
    return (rows || []).map(rowToProject);
  } catch (e) {
    console.error("Erro ao carregar projetos do Supabase:", e);
    return [];
  }
}
async function insertProjectRow(project) {
  if (!SUPABASE_READY) return;
  try {
    await supaRequest("projects", { method: "POST", body: JSON.stringify(projectToRow(project)) });
  } catch (e) {
    console.error("Erro ao criar projeto no Supabase:", e);
    throw e;
  }
}
async function updateProjectRow(project) {
  if (!SUPABASE_READY) return;
  try {
    await supaRequest(`projects?id=eq.${encodeURIComponent(project.id)}`, {
      method: "PATCH",
      body: JSON.stringify(projectToRow(project)),
    });
  } catch (e) {
    console.error("Erro ao atualizar projeto no Supabase:", e);
    throw e;
  }
}
async function deleteProjectRow(id) {
  if (!SUPABASE_READY) return;
  try {
    await supaRequest(`projects?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch (e) {
    console.error("Erro ao excluir projeto no Supabase:", e);
    throw e;
  }
}

// Seleção de "usuário atual" (sem autenticação real) guardada numa
// tabelinha chave/valor — em produção isso viria do Supabase Auth.
async function loadCurrentUserId() {
  if (!SUPABASE_READY) return USERS[0].id;
  try {
    const rows = await supaRequest("app_state?select=value&key=eq.current_user_id");
    return rows?.[0]?.value ?? USERS[0].id;
  } catch (e) {
    console.error("Erro ao carregar usuário atual do Supabase:", e);
    return USERS[0].id;
  }
}
async function saveCurrentUserId(id) {
  if (!SUPABASE_READY) return;
  try {
    await supaRequest("app_state", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ key: "current_user_id", value: id }),
    });
  } catch (e) {
    console.error("Erro ao salvar usuário atual no Supabase:", e);
  }
}

/* ---------------------------------------------------------
   MARCA SOPRANO
   Aproximação do azul identificado na logo enviada
   (~#0B4C7C). Como a paleta do artifact usa só classes
   Tailwind pré-compiladas, o mais próximo do tom oficial é a
   escala "sky" (sky-800/900) — ajuste depois para o hex exato
   se seu time de design tiver o guia de marca.
   --------------------------------------------------------- */
const SOPRANO_LOGO_DATA_URI = "data:image/png;base64,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";

// Logo real da Soprano (fornecida pelo usuário), em cores originais.
// Sobre fundo escuro (barra lateral) vai dentro de um selo branco para manter
// a cor de marca legível; sobre fundo branco (cabeçalho) é usada direto.
function SopranoMark({ size = "md", onDark = false }) {
  const h = size === "sm" ? "h-5" : "h-7";
  const img = <img src={SOPRANO_LOGO_DATA_URI} alt="Soprano" className={`${h} w-auto object-contain`} />;
  if (!onDark) return img;
  return (
    <div className={`inline-flex items-center rounded bg-white px-2 ${size === "sm" ? "py-1" : "py-1.5"} shrink-0`}>
      {img}
    </div>
  );
}

/* ---------------------------------------------------------
   CAMPOS DE FORMULÁRIO
   --------------------------------------------------------- */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function downloadAttachedFile(value) {
  if (!value?.url) return;
  const a = document.createElement("a");
  a.href = value.url;
  a.download = value.name || "arquivo";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function FileField({ label, value, onChange, disabled }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLoading(true);
    try {
      const dataUrl = await readFileAsDataURL(f);
      onChange({ name: f.name, size: f.size, url: dataUrl, attachedAt: new Date().toISOString() });
    } catch {
      onChange({ name: f.name, size: f.size, url: null, attachedAt: new Date().toISOString() });
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{label}</span>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-sky-500 hover:text-sky-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Paperclip size={14} /> {loading ? "Carregando…" : "Anexar arquivo"}
        </button>
        <input ref={inputRef} type="file" className="hidden" onChange={handleSelect} />

        {value?.name ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 pl-2 pr-1 py-1 text-xs text-emerald-700 border border-emerald-200">
            {value.name}
            {value.url && (
              <button
                type="button"
                onClick={() => downloadAttachedFile(value)}
                title="Baixar arquivo para revisão"
                className="rounded p-0.5 hover:bg-emerald-100 text-emerald-700"
              >
                <Download size={12} />
              </button>
            )}
            {!disabled && (
              <button type="button" onClick={() => onChange(null)} className="rounded p-0.5 hover:bg-emerald-100 text-emerald-700">
                <X size={12} />
              </button>
            )}
          </span>
        ) : (
          <span className="text-xs text-slate-400">Nenhum arquivo anexado</span>
        )}
      </div>
    </div>
  );
}

function Field({ field, value, onChange, disabled }) {
  const { type, label } = field;

  if (type === "download") {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">Modelo</span>
        <button type="button" className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-sky-800 underline decoration-sky-300 underline-offset-2 hover:text-sky-900">
          <Download size={14} /> {label}
        </button>
      </div>
    );
  }
  if (type === "file") return <FileField label={label} value={value} onChange={onChange} disabled={disabled} />;

  if (type === "text") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{label}</span>
        <input type="text" disabled={disabled} value={value || ""} onChange={(e) => onChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-600 disabled:bg-slate-50 disabled:text-slate-400" />
      </label>
    );
  }
  if (type === "textarea") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{label}</span>
        <textarea rows={3} disabled={disabled} value={value || ""} onChange={(e) => onChange(e.target.value)}
          className="resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-600 disabled:bg-slate-50 disabled:text-slate-400" />
      </label>
    );
  }
  if (type === "select") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{label}</span>
        <select disabled={disabled} value={value || ""} onChange={(e) => onChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-600 disabled:bg-slate-50 disabled:text-slate-400">
          <option value="">— selecione —</option>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>
    );
  }
  if (type === "radio") {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{label}</span>
        <div className="flex gap-4">
          {field.options.map((o) => (
            <label key={o} className="inline-flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
              <input type="radio" disabled={disabled} checked={value === o} onChange={() => onChange(o)} className="accent-sky-800" />
              {o}
            </label>
          ))}
        </div>
      </div>
    );
  }
  if (type === "checkbox") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
        <input type="checkbox" disabled={disabled} checked={!!value} onChange={(e) => onChange(e.target.checked)} className="accent-sky-800 h-4 w-4" />
        {label}
      </label>
    );
  }
  if (type === "checklist") {
    const val = value || {};
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{label}</span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-md border border-slate-200 bg-slate-50 p-3">
          {field.options.map((o) => (
            <label key={o} className="inline-flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" disabled={disabled} checked={!!val[o]} onChange={(e) => onChange({ ...val, [o]: e.target.checked })} className="accent-sky-800 h-3.5 w-3.5" />
              {o}
            </label>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

/* ---------------------------------------------------------
   TELA DE UM PROJETO
   --------------------------------------------------------- */
function ProjectView({ project, onUpdate, onBack, onDeleteIdea, currentUser }) {
  const isAdmin = isAdminRole(currentUser);
  const [viewIndex, setViewIndex] = useState(Math.min(project.currentStep, isAdmin ? TOTAL - 1 : 1));
  const [draft, setDraft] = useState(project.data[viewIndex] || {});

  useEffect(() => { setDraft(project.data[viewIndex] || {}); }, [viewIndex, project.id]);
  useEffect(() => { if (!isAdmin && viewIndex > 1) setViewIndex(1); }, [isAdmin]); // eslint-disable-line

  const setField = (key, val) => setDraft((d) => ({ ...d, [key]: val }));
  const persist = (patch) => onUpdate({ ...project, ...patch, updatedAt: todayISO() });
  const blocked = isBlockedStatus(project.status);
  const ideaApproved = project.currentStep >= 2;

  const handleAdvance = () => {
    const nextData = { ...project.data, [viewIndex]: draft };
    const isFurthest = viewIndex === project.currentStep;
    const nextCurrent = isFurthest ? Math.min(viewIndex + 1, TOTAL - 1) : project.currentStep;
    const finished = isFurthest && viewIndex === TOTAL - 1;

    const patch = { data: nextData };
    if (isFurthest) {
      patch.currentStep = nextCurrent;
      patch.status = finished ? STATUS.CONCLUIDO : STATUS.EM_ANDAMENTO;
    }
    if (isFurthest && viewIndex === 0 && !project.emailNotified) {
      const result = notifyNewIdea({ ...project, data: nextData });
      patch.emailNotified = true;
      patch.emailMethod = result;
    }

    persist(patch);
    if (viewIndex < TOTAL - 1) setViewIndex(viewIndex + 1);
  };

  const handleDecision = (decisao) => {
    const nextData = { ...project.data, [viewIndex]: { decisao } };
    if (decisao === "Recusado") {
      persist({ data: nextData, status: STATUS.RECUSADO });
    } else {
      const nextCurrent = Math.min(viewIndex + 1, TOTAL - 1);
      persist({ data: nextData, currentStep: nextCurrent, status: STATUS.EM_ANDAMENTO });
      setViewIndex(nextCurrent);
    }
  };

  const handleReactivate = () => persist({ status: STATUS.EM_ANDAMENTO });

  const handleCancel = () => {
    if (confirm(`Cancelar o projeto "${project.name}"? Ele ficará marcado como cancelado, sem perder o histórico, e poderá ser reativado depois caso a ideia volte a ser viável.`)) {
      persist({ status: STATUS.CANCELADO });
    }
  };

  const handleDeleteIdea = () => {
    if (confirm(`Excluir a ideia "${project.name}"? Como ainda não foi aprovada, ela será removida definitivamente.`)) {
      onDeleteIdea(project.id);
      onBack();
    }
  };

  const def = STEP_DEFS[viewIndex];
  const fields = fieldsFor(viewIndex, project);
  const progressPct = Math.round((project.currentStep / (TOTAL - 1)) * 100);
  const isReview = viewIndex < project.currentStep;
  const isLast = viewIndex === TOTAL - 1;

  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      <aside className="w-72 shrink-0 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <SopranoMark size="sm" onDark />
          </div>
          <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-slate-400 hover:text-white transition-colors mb-3">
            <ArrowLeft size={14} /> Projetos
          </button>
          <h2 className="text-white font-semibold text-base leading-snug">{project.name}</h2>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar size={12} /> Início {fmtDate(project.startDate)}
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full bg-sky-600 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="mt-1 text-[11px] font-mono text-slate-500">{progressPct}% concluído</div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <User size={11} /> {currentUser.name} · {isAdmin ? "Administrador" : "Colaborador"}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {PHASES.map((phase) => (
            <div key={phase.id} className="mb-1">
              <div className="px-5 pt-3 pb-1 text-[10px] font-mono uppercase tracking-widest text-slate-500">{phase.label}</div>
              {STEP_DEFS.map((s, idx) => {
                if (idx < phase.range[0] || idx > phase.range[1]) return null;
                const done = idx < project.currentStep;
                const current = idx === viewIndex;
                const reachable = isAdmin ? idx <= project.currentStep : idx <= 1;
                return (
                  <button key={idx} disabled={!reachable} onClick={() => setViewIndex(idx)}
                    className={`w-full flex items-center gap-2.5 px-5 py-1.5 text-left text-[13px] transition-colors ${
                      current ? "bg-sky-800 text-white" : reachable ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 cursor-not-allowed"
                    }`}>
                    <span className="shrink-0">
                      {done && !current ? <Check size={14} className="text-emerald-400" /> : <Circle size={9} className={current ? "fill-white text-white" : "fill-slate-700 text-slate-700"} />}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 w-6 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="truncate">{s.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="border-b border-slate-200 bg-white px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-sky-800">
                Etapa {String(viewIndex + 1).padStart(2, "0")} / {TOTAL} · {phaseOf(viewIndex).label}
              </div>
              <h1 className="text-xl font-semibold text-slate-900 mt-0.5">{def.title}</h1>
              {def.subtitle && <p className="text-sm text-slate-500">{def.subtitle}</p>}
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(project.status)}`}>{project.status}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          {!isAdmin && (
            <div className="mb-6 flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-slate-400" />
              Você está vendo como colaborador: pode solicitar ideias e acompanhar o status, mas apenas um administrador aprova, avança e gerencia o projeto.
            </div>
          )}

          {blocked && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span className="inline-flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                Projeto marcado como <strong className="mx-1">{project.status}</strong>. {isAdmin ? "Você pode navegar pelas etapas já preenchidas para reanalisar a ideia e reativar o projeto quando ela se tornar viável." : "Aguarde um administrador reavaliar."}
              </span>
              {isAdmin && (
                <button onClick={handleReactivate} className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-sky-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-900">
                  <RotateCcw size={13} /> Reativar projeto
                </button>
              )}
            </div>
          )}

          <div className="max-w-2xl">
            {def.approval ? (
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                {project.emailNotified && (
                  <div className="mb-5 flex items-center justify-between gap-3 rounded-md border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                    <span className="inline-flex items-center gap-2">
                      <Mail size={15} />
                      {project.emailMethod === "sent"
                        ? <>E-mail enviado automaticamente para <strong>{NOTIFY_EMAIL}</strong></>
                        : <>Notificação preparada para <strong>{NOTIFY_EMAIL}</strong> {EMAILJS_READY ? "" : "(configure o EmailJS para envio automático)"}</>}
                    </span>
                    <a href={buildIdeaMailto(project)} className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-sky-800 border border-sky-300 hover:bg-sky-100">
                      <Send size={12} /> Reenviar
                    </a>
                  </div>
                )}
                <h3 className="text-sm font-mono uppercase tracking-wide text-slate-500 mb-3">Resumo da ideia</h3>
                <dl className="grid grid-cols-1 gap-3 text-sm">
                  {Object.entries({
                    "Ideia": project.data[0]?.ideia,
                    "Tipo de ideia": project.data[0]?.tipoIdeia,
                    "Segmento": project.data[0]?.segmento,
                    "Descrição": project.data[0]?.descricao,
                    "Justificativa": project.data[0]?.justificativa,
                  }).map(([k, v]) => (
                    <div key={k} className="grid grid-cols-3 gap-2">
                      <dt className="text-slate-500">{k}</dt>
                      <dd className="col-span-2 text-slate-800">{v || "—"}</dd>
                    </div>
                  ))}
                </dl>
                {blocked || isReview ? (
                  <div className="mt-6 text-sm text-slate-500">
                    Decisão registrada: <span className="font-medium text-slate-800">{draft.decisao || "—"}</span>
                  </div>
                ) : isAdmin ? (
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => handleDecision("Recusado")} className="rounded-md border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">Recusar</button>
                    <button onClick={() => handleDecision("Confirmado")} className="rounded-md bg-sky-800 px-4 py-2 text-sm font-medium text-white hover:bg-sky-900">Confirmar</button>
                  </div>
                ) : (
                  <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    Sua ideia foi registrada e está aguardando avaliação de um administrador.
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white p-6 flex flex-col gap-5">
                {fields.map((f) => (
                  <Field key={f.key} field={f} value={draft[f.key]} onChange={(v) => setField(f.key, v)} disabled={blocked} />
                ))}
                {!blocked && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                    <button disabled={viewIndex === 0} onClick={() => setViewIndex(viewIndex - 1)}
                      className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronLeft size={16} /> Voltar
                    </button>
                    <button onClick={handleAdvance} className="rounded-md bg-sky-800 px-5 py-2 text-sm font-medium text-white hover:bg-sky-900">
                      {isReview ? "Salvar" : isLast ? "Finalizar projeto" : "Avançar"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isAdmin && !blocked && (
            ideaApproved ? (
              <button onClick={handleCancel} className="mt-8 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600">
                <Ban size={13} /> Cancelar projeto
              </button>
            ) : (
              <button onClick={handleDeleteIdea} className="mt-8 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600">
                <Trash2 size={13} /> Excluir ideia
              </button>
            )
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------------------------------
   DASHBOARD
   --------------------------------------------------------- */
function NewProjectForm({ onCreate, onCancel, currentUser }) {
  const [name, setName] = useState("");
  const [responsavel, setResponsavel] = useState(currentUser?.name || "");
  const [startDate, setStartDate] = useState(todayISO());

  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50/40 p-6 mb-8">
      <h3 className="text-sm font-mono uppercase tracking-wide text-sky-800 mb-4">Nova ideia / projeto</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="flex flex-col gap-1.5 sm:col-span-1">
          <span className="text-xs text-slate-500">Nome do produto / projeto</span>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            placeholder="Ex: Caixa térmica 100L" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-500">Solicitante</span>
          <input value={responsavel} onChange={(e) => setResponsavel(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-500">Data de início</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40" />
        </label>
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={onCancel} className="rounded-md px-4 py-2 text-sm text-slate-500 hover:text-slate-800">Cancelar</button>
        <button disabled={!name.trim()} onClick={() => onCreate({ name: name.trim(), responsavel: responsavel.trim(), startDate })}
          className="rounded-md bg-sky-800 px-4 py-2 text-sm font-medium text-white hover:bg-sky-900 disabled:opacity-40 disabled:cursor-not-allowed">
          Solicitar ideia
        </button>
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen, onReactivate, isAdmin }) {
  const pct = Math.round((project.currentStep / (TOTAL - 1)) * 100);
  const phase = phaseOf(Math.min(project.currentStep, TOTAL - 1));
  const blocked = isBlockedStatus(project.status);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 hover:border-sky-300 hover:shadow-sm transition-all flex flex-col gap-3">
      <button onClick={onOpen} className="text-left flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 leading-snug">{project.name}</h3>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeClass(project.status)}`}>{project.status}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1"><Calendar size={12} /> {fmtDate(project.startDate)}</span>
          {project.responsavel && <span className="inline-flex items-center gap-1"><User size={12} /> {project.responsavel}</span>}
        </div>
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
            <span>{phase.label}</span>
            <span>{Math.min(project.currentStep + 1, TOTAL)}/{TOTAL}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full transition-all ${progressBarClass(project.status)}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </button>
      {blocked && isAdmin && (
        <button onClick={(e) => { e.stopPropagation(); onReactivate(project.id); }}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800 hover:bg-sky-100">
          <RotateCcw size={13} /> Reativar projeto
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   APP
   --------------------------------------------------------- */
export default function App() {
  const [projects, setProjects] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    loadProjects().then((p) => setProjects(p));
    loadCurrentUserId().then((id) => setCurrentUserId(id));
    if (EMAILJS_READY) loadEmailJsScript().catch(() => {});
  }, []);

  const currentUser = USERS.find((u) => u.id === currentUserId) || USERS[0];
  const isAdmin = isAdminRole(currentUser);

  const handleChangeUser = (id) => {
    setCurrentUserId(id);
    saveCurrentUserId(id);
  };

  // Atualização otimista: a tela reage na hora e a gravação no Supabase
  // acontece em paralelo. Se a gravação falhar, mostra um aviso discreto
  // (os dados continuam corretos na tela, só não foram sincronizados).
  const handleCreate = ({ name, responsavel, startDate }) => {
    const newProject = {
      id: uid(), name, responsavel, startDate,
      createdAt: todayISO(), updatedAt: todayISO(), createdBy: currentUser.id,
      currentStep: 0, status: STATUS.EM_ANDAMENTO, emailNotified: false, data: {},
    };
    setProjects([newProject, ...projects]);
    setShowNew(false);
    setSelectedId(newProject.id);
    insertProjectRow(newProject).catch(() => setSyncError("Não foi possível salvar o novo projeto no Supabase."));
  };

  const handleUpdate = (updated) => {
    setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
    updateProjectRow(updated).catch(() => setSyncError("Não foi possível sincronizar essa alteração com o Supabase."));
  };

  const handleReactivate = (id) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const patched = { ...target, status: STATUS.EM_ANDAMENTO, updatedAt: todayISO() };
    setProjects(projects.map((p) => (p.id === id ? patched : p)));
    updateProjectRow(patched).catch(() => setSyncError("Não foi possível sincronizar a reativação com o Supabase."));
  };

  const handleDeleteIdea = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
    deleteProjectRow(id).catch(() => setSyncError("Não foi possível excluir a ideia no Supabase."));
  };

  if (projects === null || currentUserId === null) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-sm">Carregando…</div>;
  }

  const selected = projects.find((p) => p.id === selectedId);
  if (selected) {
    return (
      <ProjectView
        project={selected}
        onUpdate={handleUpdate}
        onBack={() => setSelectedId(null)}
        onDeleteIdea={handleDeleteIdea}
        currentUser={currentUser}
      />
    );
  }

  const emAndamento = projects.filter((p) => p.status === STATUS.EM_ANDAMENTO).length;
  const concluidos = projects.filter((p) => p.status === STATUS.CONCLUIDO).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <SopranoMark />
            <div className="text-xs text-slate-500 border-l border-slate-200 pl-3">Fluxo de engenharia<br />Novos produtos</div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <User size={13} />
              <select
                value={currentUserId}
                onChange={(e) => handleChangeUser(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                {USERS.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} — {u.role === "admin" ? "Administrador" : "Colaborador"}</option>
                ))}
              </select>
            </label>
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-sky-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-900"
            >
              <Plus size={16} /> Solicitar ideia
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-6 text-sm">
            <div><span className="font-semibold text-slate-900">{projects.length}</span> <span className="text-slate-500">projetos</span></div>
            <div><span className="font-semibold text-amber-600">{emAndamento}</span> <span className="text-slate-500">em andamento</span></div>
            <div><span className="font-semibold text-emerald-600">{concluidos}</span> <span className="text-slate-500">concluídos</span></div>
          </div>
          {!isAdmin && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck size={13} /> Modo colaborador: você pode solicitar e acompanhar ideias; a gestão do fluxo é feita por um administrador.
            </span>
          )}
        </div>
      </header>

      {!SUPABASE_READY && (
        <div className="bg-amber-50 border-b border-amber-200 px-8 py-2 text-xs text-amber-800">
          Supabase não configurado — preencha <code>SUPABASE_URL</code> e <code>SUPABASE_ANON_KEY</code> no topo do arquivo para persistir os dados (por enquanto a tela funciona, mas nada é salvo).
        </div>
      )}
      {syncError && (
        <div className="bg-rose-50 border-b border-rose-200 px-8 py-2 text-xs text-rose-700 flex items-center justify-between gap-3">
          <span>{syncError}</span>
          <button onClick={() => setSyncError("")} className="text-rose-500 hover:text-rose-800">
            <X size={13} />
          </button>
        </div>
      )}

      <div className="px-8 py-8">
        {showNew && <NewProjectForm onCreate={handleCreate} onCancel={() => setShowNew(false)} currentUser={currentUser} />}
        {projects.length === 0 && !showNew ? (
          <div className="rounded-lg border border-dashed border-slate-300 py-16 text-center text-slate-400">
            Nenhum projeto cadastrado ainda. Clique em "Solicitar ideia" para iniciar o fluxo.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={() => setSelectedId(p.id)} onReactivate={handleReactivate} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
