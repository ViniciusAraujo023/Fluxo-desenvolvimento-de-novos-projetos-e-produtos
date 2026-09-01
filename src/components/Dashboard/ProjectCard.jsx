import {
  Calendar,
  User,
  RotateCcw,
} from "lucide-react";

import {
  fmtDate,
} from "../../utils/dateUtils";

import {
  statusBadgeClass,
  progressBarClass,
  isBlockedStatus,
} from "../../utils/statusUtils";

import {
  phaseOf,
} from "../../data/phases";

import {
  STEP_DEFS,
} from "../../data/stepDefs";

function ProjectCard({
  project,
  onOpen,
  onReactivate,
  isAdmin,
}) {
  const TOTAL = STEP_DEFS.length;

  const pct = Math.round(
    (project.currentStep / (TOTAL - 1)) * 100
  );

  const phase = phaseOf(
    Math.min(project.currentStep, TOTAL - 1)
  );

  const blocked = isBlockedStatus(
    project.status
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 hover:border-sky-300 hover:shadow-sm transition-all flex flex-col gap-3">
      <button
        onClick={onOpen}
        className="text-left flex flex-col gap-3"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 leading-snug">
            {project.name}
          </h3>

          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeClass(
              project.status
            )}`}
          >
            {project.status}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} />
            {fmtDate(project.startDate)}
          </span>

          {project.responsavel && (
            <span className="inline-flex items-center gap-1">
              <User size={12} />
              {project.responsavel}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
            <span>{phase.label}</span>

            <span>
              {Math.min(
                project.currentStep + 1,
                TOTAL
              )}
              /{TOTAL}
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all ${progressBarClass(
                project.status
              )}`}
              style={{
                width: `${pct}%`,
              }}
            />
          </div>
        </div>
      </button>

      {blocked && isAdmin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReactivate(project.id);
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800 hover:bg-sky-100"
        >
          <RotateCcw size={13} />
          Reativar projeto
        </button>
      )}
    </div>
  );
}

export {
  ProjectCard,
};
