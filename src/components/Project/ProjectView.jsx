import { useState, useEffect } from "react";

import {
  ArrowLeft,
  Calendar,
  User,
  Check,
  Circle,
  ChevronLeft,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Mail,
  Send,
  Ban,
  Trash2,
} from "lucide-react";

import { Field } from "./Field";

import { STEP_DEFS } from "../../data/stepDefs";

import {
  PHASES,
  phaseOf,
} from "../../data/phases";

import {
  STATUS,
} from "../../data/constants";

import {
  isAdminRole,
} from "../../data/users";

import {
  todayISO,
  fmtDate,
} from "../../utils/dateUtils";

import {
  isBlockedStatus,
  statusBadgeClass,
} from "../../utils/statusUtils";

import {
  notifyNewIdea,
  buildIdeaMailto,
  EMAILJS_READY,
  NOTIFY_EMAIL,
} from "../../services/emailService";

import {
  SopranoMark,
} from "../Layout/SopranoMark";

import {
  ProcessingOverlay,
} from "../Layout/ProcessingOverlay";


///
const fieldsFor = (idx, project) => {
  const def = STEP_DEFS[idx];

  if (!def.branch) {
    return def.fields || [];
  }

  const tipo =
    project?.data?.[3]?.importado
      ? "Importado"
      : "Nacional";

  return def.fields[tipo];
};



function ProjectView({ project, onUpdate, onBack, onDeleteIdea, currentUser }) {
  const isAdmin = isAdminRole(currentUser);
  const TOTAL = STEP_DEFS.length;
  const [viewIndex, setViewIndex] = useState(Math.min(project.currentStep, isAdmin ? TOTAL - 1 : 1));
  const [draft, setDraft] = useState(project.data[viewIndex] || {});
  const [processing, setProcessing] = useState(false);

  useEffect(() => { setDraft(project.data[viewIndex] || {}); }, [viewIndex, project.id]);
  useEffect(() => { if (!isAdmin && viewIndex > 1) setViewIndex(1); }, [isAdmin]); // eslint-disable-line

  const setField = (key, val) => setDraft((d) => ({ ...d, [key]: val }));
  const persist = (patch) => onUpdate({ ...project, ...patch, updatedAt: todayISO() });
  const blocked = isBlockedStatus(project.status);
  const ideaApproved = project.currentStep >= 2;

  const handleAdvance = () => {
    if (processing) return;
      setProcessing(true);
    try {
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
    } finally {
    setTimeout(() => {
      setProcessing(false);
    }, 3000);
    }
  };

  const handleDecision = (decisao) => {
    if (processing) return;
      setProcessing(true);
    
    try {
      const nextData = { ...project.data, [viewIndex]: { decisao } };
        if (decisao === "Recusado") {
          persist({ data: nextData, status: STATUS.RECUSADO });
        } else {
        const nextCurrent = Math.min(viewIndex + 1, TOTAL - 1);
        persist({ data: nextData, currentStep: nextCurrent, status: STATUS.EM_ANDAMENTO });
          
        setViewIndex(nextCurrent);
    } finally {
    setTimeout(() => {
      setProcessing(false);
    }, 3000);
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
      {processing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-9999">
          <div className="bg-white rounded-lg px-6 py-4 shadow-lg flex items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-sky-800 animate-spin" />
            <span className="text-slate-700">
                Processando...
            </span>
          </div>
         </div>
      )}
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

export {
  ProjectView,
};
