import { ArrowLeft, Calendar, User, Check, Circle, X } from "lucide-react";
import { STEP_DEFS } from "../data/StepDefs";
import { PHASES } from "../data/Phases";
import { fmtDate } from "../utils/DateUtils";
import { SopranoMark } from "../components/Layout/SopranoMark";

function ProjectSidebar({
  project, viewIndex, onSelect, isAdmin, currentUser,
  progressPct, open, onClose, onBack,
}) {
  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-4">
            <SopranoMark size="sm" onDark />
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
              <X size={18} />
            </button>
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
                  <button key={idx} disabled={!reachable} onClick={() => { onSelect(idx); onClose(); }}
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
    </>
  );
}

export { ProjectSidebar };
