import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Check, Circle, ChevronLeft, Plus, Paperclip, Download, X,
  ArrowLeft, Calendar, User, Ban, Trash2, AlertCircle, Mail, Send, RotateCcw,
  ShieldCheck, Users, Lock, SkipForward
} from "lucide-react";

/* ===========================================================
   USUÁRIOS
   ===========================================================
   Mock de autenticação — sem backend real. E-mails gerados no
   padrão nome.sobrenome@soprano.com.br como placeholder; troque
   pelos e-mails reais quando tiver a lista definitiva.
   =========================================================== */
const USERS = [
  { id: "vinicius-almeida", name: "Vinícius Almeida", email: "viniciusalmeida@soprano.com.br" },
  { id: "daniel-scotti", name: "Daniel Scotti", email: "daniel.scotti@soprano.com.br" },
  { id: "eduardo-didomenico", name: "Eduardo Di Domenico", email: "eduardo.didomenico@soprano.com.br" },
  { id: "eduarda-bossle", name: "Eduarda Bossle da Silva", email: "eduarda.bossle@soprano.com.br" },
  { id: "grasiele-gervasoni", name: "Grasiele Gervasoni", email: "grasiele.gervasoni@soprano.com.br" },
  { id: "fabiano-picoli", name: "Fabiano Picoli", email: "fabiano.picoli@soprano.com.br" },
  { id: "fabio-boldo", name: "Fabio Boldo", email: "fabio.boldo@soprano.com.br" },
  { id: "nicolas-araujo", name: "Nicolas Araujo", email: "nicolas.araujo@soprano.com.br" },
  { id: "augusto-zolet", name: "Augusto Zolet", email: "augusto.zolet@soprano.com.br" },
  { id: "marcelo-palavro", name: "Marcelo Palavro", email: "marcelo.palavro@soprano.com.br" },
  { id: "gustavo-boff", name: "Gustavo Boff", email: "gustavo.boff@soprano.com.br" },
  { id: "amanda-lazzari", name: "Amanda Lazzari", email: "amanda.lazzari@soprano.com.br" },
  { id: "cristina-andrade", name: "Cristina Andrade", email: "cristina.andrade@soprano.com.br" },
  { id: "lucas-cerutti", name: "Lucas Cerutti", email: "lucas.cerutti@soprano.com.br" },
  { id: "micael-piazza", name: "Micael Piazza", email: "micael.piazza@soprano.com.br" },
  { id: "leonardo-piretti", name: "Leonardo Piretti", email: "leonardo.piretti@soprano.com.br" },
  { id: "cesar-momm", name: "Cesar Momm", email: "cesar.momm@soprano.com.br" },
  { id: "jose-pereira", name: "Jose Pereira", email: "jose.pereira@soprano.com.br" },
  { id: "carla-brust", name: "Carla Brust", email: "carla.brust@soprano.com.br" },
  { id: "fernanda-fogaca", name: "Fernanda Fogaça", email: "fernanda.fogaca@soprano.com.br" },
  { id: "maria-eduarda", name: "Maria Eduarda", email: "maria.eduarda@soprano.com.br" },
  { id: "ketlin-rech", name: "Ketlin Rech", email: "ketlin.rech@soprano.com.br" },
  { id: "manuela-toassi", name: "Manuela Toassi", email: "manuela.toassi@soprano.com.br" },
  { id: "marisa-somavila", name: "Marisa Somavila", email: "marisa.somavila@soprano.com.br" },
  { id: "luana-santos", name: "Luana Santos", email: "luana.santos@soprano.com.br" },
  { id: "tamara-venturin", name: "Tamara Venturin", email: "tamara.venturin@soprano.com.br" },
  { id: "samuel-brando", name: "Samuel Brando", email: "samuel.brando@soprano.com.br" },
];

const userById = (id) => USERS.find((u) => u.id === id);

/* ===========================================================
   EQUIPES
   ===========================================================
   "adminIds" é o responsável/aprovador da etapa dentro da
   equipe — não um nível de permissão extra. Qualquer pessoa da
   equipe (admin ou participante) pode preencher/avançar as
   telas atribuídas a essa equipe.
   =========================================================== */
const TEAMS = {
  avaliacao_ideia: { label: "Avaliação de ideias", adminIds: ["daniel-scotti"], memberIds: ["augusto-zolet", "marcelo-palavro"] },
  comite_aprovacao: { label: "Comitê de aprovação", adminIds: ["daniel-scotti"], memberIds: ["grasiele-gervasoni", "fabiano-picoli", "fabio-boldo", "nicolas-araujo", "augusto-zolet", "marcelo-palavro", "gustavo-boff"] },
  engenharia: { label: "Equipe engenharia", adminIds: ["daniel-scotti"], memberIds: ["eduardo-didomenico", "eduarda-bossle"] },
  marketing: { label: "Equipe marketing", adminIds: ["augusto-zolet", "nicolas-araujo"], memberIds: ["amanda-lazzari", "cristina-andrade"] },
  financeiro: { label: "Equipe financeiro", adminIds: ["lucas-cerutti"], memberIds: [] },
  processos: { label: "Equipe processos", adminIds: ["micael-piazza"], memberIds: ["leonardo-piretti"] },
  qualidade: { label: "Equipe qualidade", adminIds: ["cesar-momm"], memberIds: [] },
  comercial: { label: "Equipe comercial", adminIds: ["fabio-boldo"], memberIds: [] },
  planejamento: { label: "Equipe planejamento", adminIds: ["jose-pereira"], memberIds: [] },
  fiscal: { label: "Equipe fiscal", adminIds: ["carla-brust"], memberIds: [] },
  soprano_asia: { label: "Equipe Soprano Ásia", adminIds: ["fernanda-fogaca"], memberIds: ["maria-eduarda", "ketlin-rech", "manuela-toassi"] },
  pcp: { label: "Equipe PCP", adminIds: ["marisa-somavila"], memberIds: [] },
  compras: { label: "Equipe compras", adminIds: ["luana-santos"], memberIds: [] },
  ferramentaria: { label: "Equipe ferramentaria", adminIds: ["samuel-brando"], memberIds: [] },
};
// Tamara Venturin participa da equipe compras (adicionada à parte para não
// duplicar a leitura acima)
TEAMS.compras.memberIds = ["tamara-venturin"];

const SUPERADMIN_IDS = ["daniel-scotti", "vinicius-almeida"];
const isSuperAdmin = (user) => SUPERADMIN_IDS.includes(user?.id);

const userTeamIds = (user) => {
  if (!user) return [];
  return Object.entries(TEAMS)
    .filter(([, t]) => t.adminIds.includes(user.id) || t.memberIds.includes(user.id))
    .map(([id]) => id);
};

const teamsLabel = (ids) => (ids || []).map((id) => TEAMS[id]?.label || id).join(" / ");

/* ===========================================================
   ESTADOS DO PROJETO
   =========================================================== */
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

/* ===========================================================
   DEFINIÇÃO DO FLUXO (34 telas)
   ===========================================================
   A tela "Validar fornecedor" foi removida. Os índices abaixo
   já refletem a nova ordem final.
   =========================================================== */
const PHASES = [
  { id: "ideacao", label: "Ideação", range: [0, 1] },
  { id: "viabilidade", label: "Viabilidade & Aprovação", range: [2, 6] },
  { id: "desenvolvimento", label: "Desenvolvimento & Testes", range: [7, 10] },
  { id: "marketing", label: "Marketing & Vendas", range: [11, 18] },
  { id: "registro", label: "Registro & Cadastro", range: [19, 25] },
  { id: "compras", label: "Compras & Importação", range: [26, 32] },
  { id: "lancamento", label: "Lançamento", range: [33, 33] },
];

const phaseOf = (idx) => PHASES.find((p) => idx >= p.range[0] && idx <= p.range[1]);

const OPT_SN = ["Sim", "Não"];
const OPT_AR = ["Aprovado", "Reprovado"];

// Equipe(s) responsável por cada tela (índice = posição em STEP_DEFS).
// null = aberta a qualquer usuário (só a tela 0, de solicitação).
const STEP_TEAMS = [
  null,                             // 0  Solicitar ideia
  ["avaliacao_ideia"],              // 1  Avaliar ideia
  ["comite_aprovacao"],             // 2  Aprovar TAP / Escopo
  ["engenharia"],                   // 3  Avaliar projeto nacional/importado
  ["comite_aprovacao"],             // 4  Alinhar projeto de novo produto
  ["engenharia"],                   // 5  Analisar o projeto conforme o tipo
  ["financeiro"],                   // 6  Avaliar custos do projeto
  ["processos"],                    // 7  Validar processo ferramental
  ["engenharia"],                   // 8  Testar produto
  ["comite_aprovacao"],             // 9  Avaliar alternativas / Apresentar projeto
  ["engenharia"],                   // 10 Definir cores e acabamento / Enviar render
  ["marketing"],                    // 11 Desenvolver briefing do marketing
  ["marketing"],                    // 12 Alinhar previsão de vendas — Marketing
  ["comercial"],                    // 13 Alinhar previsão de vendas — Comercial
  ["planejamento"],                 // 14 Alinhar previsão de vendas — Planejamento
  ["engenharia"],                   // 15 Preencher AI
  ["engenharia"],                   // 16 Cadastro de produto — Etapa 1
  ["engenharia"],                   // 17 Cadastro de produto — Etapa 2
  ["processos", "ferramentaria"],   // 18 Cadastrar processo do item
  ["fiscal"],                       // 19 Cadastrar dados fiscais do item
  ["marketing"],                    // 20 Desenhar plano de comunicação
  ["engenharia"],                   // 21 Cadastrar PS/II/CNP/SISCOMEX/FTP
  ["planejamento", "pcp"],          // 22 Definir insumos
  ["soprano_asia"],                 // 23 Enviar documentação PS/II/ArtWork
  ["qualidade"],                    // 24 Desenvolver fornecedores / Validar matéria-prima
  ["processos", "ferramentaria"],   // 25 Validar processos
  ["planejamento", "pcp"],          // 26 Cadastrar solicitação de compra — TOTVS
  ["compras"],                      // 27 Cadastrar pedido de compra — TOTVS
  ["soprano_asia"],                 // 28 Registrar PI no TOTVS
  ["compras"],                      // 29 Aprovar PI TOTVS
  ["soprano_asia"],                 // 30 Anexar arquivo de inspeção
  ["engenharia"],                   // 31 Aprovar / Acompanhar pedido — lote piloto
  ["financeiro"],                   // 32 Validar custos e preço de lista
  ["marketing"],                    // 33 Plano de lançamento
];

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
  { title: "Avaliar ideia de novo produto", approval: true, stepOwnerNote: "Decisão: Daniel Scotti" },
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
    { key: "renderFrontal", label: "Render do Produto – Vista Frontal", type: "file" },
    { key: "renderLateralDireita", label: "Render do Produto – Vista Lateral Direita", type: "file" },
    { key: "renderLateralEsquerda", label: "Render do Produto – Vista Lateral Esquerda", type: "file" },
    { key: "renderSuperior", label: "Render do Produto – Vista Superior", type: "file" },
    { key: "renderPerspectiva", label: "Render do Produto – Perspectiva", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Desenvolver briefing do marketing", stepOwnerNote: "Responsável pela etapa: Augusto Zolet", fields: [
    { key: "briefingMkt", label: "Briefing do MKT", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Alinhar previsão de vendas — Marketing", stepOwnerNote: "Responsável pela etapa: Augusto Zolet", fields: [
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
    { key: "aiAplicavel", label: "Aplicável a AI?", type: "select", options: OPT_SN },
    { key: "baixarModeloAI", label: "Modelo padrão de AI", type: "download", dependsOn: { key: "aiAplicavel", equals: "Sim" } },
    { key: "anexarAI", label: "Anexar AI", type: "file", dependsOn: { key: "aiAplicavel", equals: "Sim" } },
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
    { key: "cadastroEN0507", label: "Cadastro EN0507", type: "checkbox" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastrar dados fiscais do item (check do fiscal)", fields: [
    { key: "checklistFiscal", label: "Itens de cadastro fiscal", type: "checklist", options: [
      "Cadastrar CD0903", "Cadastrar FT0918", "Cadastrar CD0356", "Cadastrar Relacionados x Tributos x Estado em HTML",
    ]},
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Desenhar plano de comunicação", stepOwnerNote: "Responsável pela etapa: Nicolas Araujo", fields: [
    { key: "planoComunicacao", label: "Plano de comunicação", type: "file" },
    { key: "etiquetasTags", label: "Etiquetas / tags", type: "file" },
    { key: "embalagens", label: "Embalagens", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Cadastrar PS / II / CNP / SISCOMEX / FTP", fields: [
    { key: "checklist3", label: "Itens cadastrados", type: "checklist", options: [
      "PS", "Inspection Instruction", "CNP", "SISCOMEX", "FTP", "Mercanet (ESCD015)",
    ]},
    { key: "arquivosCadastro", label: "Arquivos de cadastro", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Definir insumos", fields: [
    { key: "descricaoItensCompra", label: "Descrição dos itens para compra", type: "textarea" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Enviar documentação PS / II / ArtWork", subtitle: "Segmentação importado", conditionalOn: { sourceStep: 3, key: "importado" }, fields: [
    { key: "ps", label: "PS", type: "file" },
    { key: "inspectionInstruction", label: "Inspection Instruction", type: "file" },
    { key: "artwork", label: "ArtWork", type: "file" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Desenvolver fornecedores / Validar matéria-prima", fields: [
    { key: "startFluxoAmostras", label: "Start Fluxo de desenvolvimento de Amostras", type: "checkbox" },
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
    { key: "custoSellInSellOut", label: "Custo/Sell in/Sell out", type: "file" },
    { key: "validarPrecoLista", label: "Validar preço de lista", type: "checkbox" },
    { key: "observacoes", label: "Observações", type: "textarea" },
  ]},
  { title: "Plano de lançamento", stepOwnerNote: "Responsável pela etapa: Nicolas Araujo", fields: [
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

/* ---------- controle de acesso por etapa ---------- */
const hasTeamAccess = (user, teamIds) => {
  const own = userTeamIds(user);
  return (teamIds || []).some((t) => own.includes(t));
};
const canEditStep = (user, idx) => {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  if (idx === 0) return true; // qualquer usuário pode solicitar ideia
  return hasTeamAccess(user, STEP_TEAMS[idx]);
};
const canManageProject = (user) => isSuperAdmin(user) || hasTeamAccess(user, ["avaliacao_ideia"]);

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
// Notifica o admin da equipe de avaliação de ideias (Daniel Scotti).
const NOTIFY_EMAIL = userById("daniel-scotti").email;

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
    "(Equipe de avaliação: Daniel Scotti, Augusto Zolet e Marcelo Palavro)",
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

function openMailClient(mailtoUrl) {
  const link = document.createElement("a");
  link.href = mailtoUrl;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

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
   PERSISTÊNCIA
   ---------------------------------------------------------
   Chaves em v2: a reestruturação das telas (remoção de "Validar
   fornecedor" + mudança de campos) tornaria dados salvos com a
   estrutura antiga inconsistentes, então o armazenamento
   recomeça do zero.
   --------------------------------------------------------- */
const STORAGE_KEY = "workflow_projects_v2";
const USER_STORAGE_KEY = "workflow_current_user_v2";

async function loadProjects() {
  try {
    const res = await window.storage.get(STORAGE_KEY, false);
    return res ? JSON.parse(res.value) : [];
  } catch {
    return [];
  }
}
async function saveProjects(projects) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(projects), false);
  } catch {
    /* silencioso — dados continuam válidos durante a sessão */
  }
}
async function loadCurrentUserId() {
  try {
    const res = await window.storage.get(USER_STORAGE_KEY, false);
    return res ? JSON.parse(res.value) : USERS[0].id;
  } catch {
    return USERS[0].id;
  }
}
async function saveCurrentUserId(id) {
  try {
    await window.storage.set(USER_STORAGE_KEY, JSON.stringify(id), false);
  } catch {
    /* silencioso */
  }
}

/* ---------------------------------------------------------
   MARCA SOPRANO
   --------------------------------------------------------- */
const SOPRANO_LOGO_DATA_URI = "";

function SopranoMark({ size = "md", onDark = false }) {
  const h = size === "sm" ? "h-5 text-sm" : "h-7 text-lg";
  if (SOPRANO_LOGO_DATA_URI) {
    const img = <img src={SOPRANO_LOGO_DATA_URI} alt="Soprano" className={`${h.split(" ")[0]} w-auto object-contain`} />;
    if (!onDark) return img;
    return (
      <div className={`inline-flex items-center rounded bg-white px-2 ${size === "sm" ? "py-1" : "py-1.5"} shrink-0`}>
        {img}
      </div>
    );
  }
  const text = <span className={`font-bold tracking-tight ${h.split(" ")[1]} ${onDark ? "text-white" : "text-sky-800"}`}>SOPRANO</span>;
  if (!onDark) return text;
  return (
    <div className={`inline-flex items-center rounded bg-sky-950 px-2 ${size === "sm" ? "py-1" : "py-1.5"} shrink-0`}>
      {text}
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

function Field({ field, value, onChange, disabled, lockedByDependency }) {
  const { type, label } = field;
  if (type === "download") {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">Modelo</span>
        <button type="button" disabled={disabled} className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-sky-800 underline decoration-sky-300 underline-offset-2 hover:text-sky-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline">
          <Download size={14} /> {label}
        </button>
        {lockedByDependency && <span className="text-[11px] text-slate-400">Disponível apenas se aplicável = Sim</span>}
      </div>
    );
  }
  if (type === "file") {
    return (
      <div className="flex flex-col gap-1">
        <FileField label={label} value={value} onChange={onChange} disabled={disabled} />
        {lockedByDependency && <span className="text-[11px] text-slate-400">Disponível apenas se aplicável = Sim</span>}
      </div>
    );
  }
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
      <label className={`inline-flex items-center gap-2 text-sm text-slate-700 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
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
            <label key={o} className={`inline-flex items-center gap-1.5 text-sm text-slate-700 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
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
  const superAdmin = isSuperAdmin(currentUser);
  const canManage = canManageProject(currentUser);
  const [viewIndex, setViewIndex] = useState(Math.min(project.currentStep, TOTAL - 1));
  const [draft, setDraft] = useState(project.data[viewIndex] || {});
  useEffect(() => { setDraft(project.data[viewIndex] || {}); }, [viewIndex, project.id]);

  const setField = (key, val) => setDraft((d) => ({ ...d, [key]: val }));
  const persist = (patch) => onUpdate({ ...project, ...patch, updatedAt: todayISO() });
  const blocked = isBlockedStatus(project.status);
  const ideaApproved = project.currentStep >= 2;
  const canEdit = canEditStep(currentUser, viewIndex);

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

  const handleSkipNotApplicable = () => {
    const nextData = { ...project.data, [viewIndex]: { naoAplicavel: true } };
    const isFurthest = viewIndex === project.currentStep;
    const nextCurrent = isFurthest ? Math.min(viewIndex + 1, TOTAL - 1) : project.currentStep;
    const patch = { data: nextData };
    if (isFurthest) {
      patch.currentStep = nextCurrent;
      patch.status = STATUS.EM_ANDAMENTO;
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
  const stepTeams = STEP_TEAMS[viewIndex];

  const isImportado = !!project.data?.[3]?.importado;
  const conditionalSkip = def.conditionalOn && !isImportado;
  const alreadySkipped = !!project.data?.[viewIndex]?.naoAplicavel;

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
            <User size={11} /> {currentUser.name} {superAdmin && <span className="ml-1 rounded bg-sky-800 px-1.5 py-0.5 text-[10px] text-white">acesso total</span>}
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
                const reachable = idx <= project.currentStep;
                const editableHere = canEditStep(currentUser, idx);
                return (
                  <button key={idx} disabled={!reachable} onClick={() => setViewIndex(idx)}
                    className={`w-full flex items-center gap-2.5 px-5 py-1.5 text-left text-[13px] transition-colors ${
                      current ? "bg-sky-800 text-white" : reachable ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 cursor-not-allowed"
                    }`}>
                    <span className="shrink-0">
                      {done && !current ? <Check size={14} className="text-emerald-400" /> : <Circle size={9} className={current ? "fill-white text-white" : "fill-slate-700 text-slate-700"} />}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 w-6 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="truncate flex-1">{s.title}</span>
                    {reachable && !editableHere && <Lock size={10} className="shrink-0 text-slate-500" />}
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
              <div className="mt-1.5 flex items-center gap-3 flex-wrap">
                {stepTeams && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <Users size={11} /> {teamsLabel(stepTeams)}
                  </span>
                )}
                {def.stepOwnerNote && (
                  <span className="text-[11px] text-slate-400">{def.stepOwnerNote}</span>
                )}
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(project.status)}`}>{project.status}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-8">
          {!canEdit && !blocked && (
            <div className="mb-6 flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-slate-400" />
              Esta etapa é da {stepTeams ? teamsLabel(stepTeams) : "outra área"}. Você pode acompanhar o andamento, mas só quem está nessa equipe (ou um administrador do sistema) pode preencher e avançar.
            </div>
          )}
          {blocked && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span className="inline-flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                Projeto marcado como <strong className="mx-1">{project.status}</strong>. {canManage ? "Você pode navegar pelas etapas já preenchidas para reanalisar a ideia e reativar o projeto quando ela se tornar viável." : "Aguarde a equipe de avaliação reavaliar."}
              </span>
              {canManage && (
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
                ) : canEdit ? (
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => handleDecision("Recusado")} className="rounded-md border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">Recusar</button>
                    <button onClick={() => handleDecision("Confirmado")} className="rounded-md bg-sky-800 px-4 py-2 text-sm font-medium text-white hover:bg-sky-900">Confirmar</button>
                  </div>
                ) : (
                  <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    Sua ideia foi registrada e está aguardando avaliação da equipe responsável.
                  </div>
                )}
              </div>
            ) : conditionalSkip && !isReview ? (
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <SkipForward size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  Esta etapa só se aplica a projetos <strong>importados</strong>. Como este projeto foi marcado como <strong>nacional</strong>, ela não precisa ser preenchida.
                </div>
                {canEdit && (
                  <div className="mt-5">
                    <button onClick={handleSkipNotApplicable} className="rounded-md bg-sky-800 px-5 py-2 text-sm font-medium text-white hover:bg-sky-900">
                      Avançar (não aplicável)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white p-6 flex flex-col gap-5">
                {conditionalSkip && isReview && alreadySkipped ? (
                  <div className="text-sm text-slate-500">Marcada como não aplicável (projeto nacional).</div>
                ) : (
                  fields.map((f) => {
                    const dependencyUnmet = f.dependsOn && draft[f.dependsOn.key] !== f.dependsOn.equals;
                    return (
                      <Field key={f.key} field={f} value={draft[f.key]} onChange={(v) => setField(f.key, v)}
                        disabled={blocked || !canEdit || dependencyUnmet} lockedByDependency={dependencyUnmet} />
                    );
                  })
                )}
                {!blocked && canEdit && (
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
                {!blocked && !canEdit && (
                  <div className="flex items-center justify-start pt-2 border-t border-slate-100 mt-2">
                    <button disabled={viewIndex === 0} onClick={() => setViewIndex(viewIndex - 1)}
                      className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronLeft size={16} /> Voltar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {canManage && !blocked && (
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

function ProjectCard({ project, onOpen, onReactivate, canManage }) {
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
      {blocked && canManage && (
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

  useEffect(() => {
    loadProjects().then((p) => setProjects(p));
    loadCurrentUserId().then((id) => setCurrentUserId(id));
    if (EMAILJS_READY) loadEmailJsScript().catch(() => {});
  }, []);

  const persist = useCallback((next) => { setProjects(next); saveProjects(next); }, []);
  const currentUser = userById(currentUserId) || USERS[0];
  const canManage = canManageProject(currentUser);
  const myTeams = userTeamIds(currentUser);

  const handleChangeUser = (id) => {
    setCurrentUserId(id);
    saveCurrentUserId(id);
  };

  const handleCreate = ({ name, responsavel, startDate }) => {
    const newProject = {
      id: uid(), name, responsavel, startDate,
      createdAt: todayISO(), updatedAt: todayISO(), createdBy: currentUser.id,
      currentStep: 0, status: STATUS.EM_ANDAMENTO, emailNotified: false, data: {},
    };
    persist([newProject, ...projects]);
    setShowNew(false);
    setSelectedId(newProject.id);
  };

  const handleUpdate = (updated) => persist(projects.map((p) => (p.id === updated.id ? updated : p)));
  const handleReactivate = (id) => persist(projects.map((p) => (p.id === id ? { ...p, status: STATUS.EM_ANDAMENTO, updatedAt: todayISO() } : p)));
  const handleDeleteIdea = (id) => persist(projects.filter((p) => p.id !== id));

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
                  <option key={u.id} value={u.id}>{u.name}{isSuperAdmin(u) ? " — acesso total" : ""}</option>
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
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck size={13} />
            {isSuperAdmin(currentUser)
              ? "Administrador do sistema: acesso total a todas as etapas."
              : myTeams.length > 0
                ? `Sua área: ${teamsLabel(myTeams)}.`
                : "Você pode solicitar e acompanhar ideias; a edição das etapas é feita pelas equipes responsáveis."}
          </span>
        </div>
      </header>
      <div className="px-8 py-8">
        {showNew && <NewProjectForm onCreate={handleCreate} onCancel={() => setShowNew(false)} currentUser={currentUser} />}
        {projects.length === 0 && !showNew ? (
          <div className="rounded-lg border border-dashed border-slate-300 py-16 text-center text-slate-400">
            Nenhum projeto cadastrado ainda. Clique em "Solicitar ideia" para iniciar o fluxo.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={() => setSelectedId(p.id)} onReactivate={handleReactivate} canManage={canManage} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
