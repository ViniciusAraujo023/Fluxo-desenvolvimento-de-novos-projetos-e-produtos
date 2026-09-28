import { ShieldCheck, AlertCircle, RotateCcw } from "lucide-react";

function ProjectBanners({ isAdmin, blocked, status, onReactivate }) {
  return (
    <>
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
            Projeto marcado como <strong className="mx-1">{status}</strong>. {isAdmin ? "Você pode navegar pelas etapas já preenchidas para reanalisar a ideia e reativar o projeto quando ela se tornar viável." : "Aguarde um administrador reavaliar."}
          </span>
          {isAdmin && (
            <button onClick={onReactivate} className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-sky-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-900">
              <RotateCcw size={13} /> Reativar projeto
            </button>
          )}
        </div>
      )}
    </>
  );
}

export { ProjectBanners };
