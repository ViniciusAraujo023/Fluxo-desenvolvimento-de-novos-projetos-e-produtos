import { useState } from "react";
import { Menu, Ban, Trash2 } from "lucide-react";
import { phaseOf } from "../data/Phases";
import { statusBadgeClass } from "../utils/StatusUtils";
import { useProjectWizard } from "../hooks/UseProjectWizard";
import { ProcessingOverlay } from "../components/Layout/ProcessingOverlay";
import { ProjectSidebar } from "./ProjectSidebar";
import { ProjectBanners } from "./ProjectBanners";
import { ApprovalStep } from "./ApprovalStep";
import { StepForm } from "./StepForm";

function ProjectView({ project, onUpdate, onBack, onDeleteIdea, currentUser }) {
  const isAdmin = currentUser?.role === "admin";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const wizard = useProjectWizard({ project, onUpdate, isAdmin });
  const { def, viewIndex, blocked } = wizard;

  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      {wizard.processing && <ProcessingOverlay />}

      <ProjectSidebar
        project={project}
        viewIndex={viewIndex}
        onSelect={wizard.setViewIndex}
        isAdmin={isAdmin}
        currentUser={currentUser}
        progressPct={wizard.progressPct}
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onBack={onBack}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-slate-200 bg-white px-4 sm:px-8 py-4 sm:py-5">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 lg:hidden"
          >
            <Menu size={14} /> Etapas
          </button>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-sky-800">
                Etapa {String(viewIndex + 1).padStart(2, "0")} / {wizard.TOTAL} · {phaseOf(viewIndex).label}
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 mt-0.5">{def.title}</h1>
              {def.subtitle && <p className="text-sm text-slate-500">{def.subtitle}</p>}
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(project.status)}`}>{project.status}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8">
          <ProjectBanners
            isAdmin={isAdmin}
            blocked={blocked}
            status={project.status}
            onReactivate={wizard.handleReactivate}
          />

          <div className="max-w-2xl">
            {def.approval ? (
              <ApprovalStep
                project={project}
                draft={wizard.draft}
                blocked={blocked}
                isReview={wizard.isReview}
                isAdmin={isAdmin}
                onDecision={wizard.handleDecision}
              />
            ) : (
              <StepForm
                fields={wizard.fields}
                draft={wizard.draft}
                setField={wizard.setField}
                blocked={blocked}
                project={project}
                viewIndex={viewIndex}
                isReview={wizard.isReview}
                isLast={wizard.isLast}
                onPrev={() => wizard.setViewIndex(viewIndex - 1)}
                onAdvance={wizard.handleAdvance}
              />
            )}
          </div>

          {isAdmin && !blocked && (
            wizard.ideaApproved ? (
              <button onClick={wizard.handleCancel} className="mt-8 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600">
                <Ban size={13} /> Cancelar projeto
              </button>
            ) : (
              <button onClick={() => onDeleteIdea(project.id)} className="mt-8 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600">
                <Trash2 size={13} /> Excluir ideia
              </button>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export { ProjectView };
