import { useState, useEffect } from "react";
import { STEP_DEFS } from "../data/StepDefs";
import { STATUS } from "../data/Constants";
import { todayISO } from "../utils/DateUtils";
import { isBlockedStatus } from "../utils/StatusUtils";
import { notifyNewIdea } from "../services/EmailService";

const TOTAL = STEP_DEFS.length;

const fieldsFor = (idx, project) => {
  const def = STEP_DEFS[idx];
  if (!def.branch) return def.fields || [];

  const tipo = project?.data?.[3]?.importado ? "Importado" : "Nacional";
  return def.fields[tipo];
};

function useProjectWizard({ project, onUpdate, isAdmin }) {
  const [viewIndex, setViewIndex] = useState(
    Math.min(project.currentStep, isAdmin ? TOTAL - 1 : 1)
  );
  const [draft, setDraft] = useState(project.data[viewIndex] || {});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setDraft(project.data[viewIndex] || {});
  }, [viewIndex, project.id]);

  useEffect(() => {
    if (!isAdmin && viewIndex > 1) setViewIndex(1);
  }, [isAdmin]);

  const setField = (key, val) => setDraft((d) => ({ ...d, [key]: val }));

  const persist = (patch) =>
    onUpdate({ ...project, ...patch, updatedAt: todayISO() });

  const isFurthest = viewIndex === project.currentStep;
  const nextCurrent = isFurthest
    ? Math.min(viewIndex + 1, TOTAL - 1)
    : project.currentStep;

  const goToNext = () => {
    if (viewIndex < TOTAL - 1) setViewIndex(viewIndex + 1);
  };

  const handleAdvance = () => {
    if (processing) return;
    setProcessing(true);

    try {
      const nextData = { ...project.data, [viewIndex]: draft };
      const patch = { data: nextData };

      if (isFurthest) {
        patch.currentStep = nextCurrent;
        patch.status =
          viewIndex === TOTAL - 1 ? STATUS.CONCLUIDO : STATUS.EM_ANDAMENTO;
      }

      if (isFurthest && viewIndex === 0 && !project.emailNotified) {
        patch.emailNotified = true;
        patch.emailMethod = notifyNewIdea({ ...project, data: nextData });
      }

      persist(patch);
      goToNext();
    } finally {
      setTimeout(() => setProcessing(false), 3000);
    }
  };

  const handleDecision = (decision) => {
    const nextData = {
      ...project.data,
      [viewIndex]: { ...draft, decisao: decision },
    };
    setDraft(nextData[viewIndex]);

    if (decision === "Recusado") {
      persist({ data: nextData, status: STATUS.RECUSADO });
      return;
    }

    persist({
      data: nextData,
      currentStep: nextCurrent,
      status: STATUS.EM_ANDAMENTO,
    });
    goToNext();
  };

  return {
    TOTAL,
    viewIndex,
    setViewIndex,
    draft,
    setField,
    processing,
    def: STEP_DEFS[viewIndex],
    fields: fieldsFor(viewIndex, project),
    blocked: isBlockedStatus(project.status),
    ideaApproved: project.currentStep >= 2,
    isLast: viewIndex === TOTAL - 1,
    isReview: viewIndex < project.currentStep,
    progressPct: Math.round((project.currentStep / (TOTAL - 1)) * 100),
    handleAdvance,
    handleDecision,
    handleReactivate: () => persist({ status: STATUS.EM_ANDAMENTO }),
    handleCancel: () => persist({ status: STATUS.CANCELADO }),
  };
}

export { useProjectWizard };
