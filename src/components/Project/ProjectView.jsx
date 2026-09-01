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
import { PHASES, phaseOf } from "../../data/phases";
import { STATUS } from "../../data/constants";
import { isAdminRole } from "../../data/users";

import { todayISO, fmtDate } from "../../utils/dateUtils";
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

import { SopranoMark } from "../Layout/SopranoMark";

function ProjectView({
  project,
  onUpdate,
  onBack,
  onDeleteIdea,
  currentUser,
}) {
  const TOTAL = STEP_DEFS.length;

  const isAdmin = isAdminRole(currentUser);

  const [viewIndex, setViewIndex] = useState(
    Math.min(
      project.currentStep,
      isAdmin ? TOTAL - 1 : 1
    )
  );

  const [draft, setDraft] = useState(
    project.data[viewIndex] || {}
  );

  useEffect(() => {
    setDraft(
      project.data[viewIndex] || {}
    );
  }, [viewIndex, project.id]);

  useEffect(() => {
    if (!isAdmin && viewIndex > 1) {
      setViewIndex(1);
    }
  }, [isAdmin]);

  const setField = (key, val) =>
    setDraft((d) => ({
      ...d,
      val,
    }));

  const persist = (patch) =>
    onUpdate({
      ...project,
      ...patch,
      updatedAt: todayISO(),
    });

  const blocked = isBlockedStatus(
    project.status
  );

  const ideaApproved =
    project.currentStep >= 2;

  const handleAdvance = () => {
    const nextData = {
      ...project.data,
      [viewIndex]: draft,
    };

    const isFurthest =
      viewIndex === project.currentStep;

    const nextCurrent = isFurthest
min(
          viewIndex + 1,
          TOTAL - 1
        )
      : project.currentStep;

    const finished =
      isFurthest &&
      viewIndex === TOTAL - 1;

    const patch = {
      data: nextData,
    };

    if (isFurthest) {
      patch.currentStep = nextCurrent;
      patch.status = finished
        ? STATUS.CONCLUIDO
        : STATUS.EM_ANDAMENTO;
    }

    if (
      isFurthest &&
      viewIndex === 0 &&
      !project.emailNotified
    ) {
      const result = notifyNewIdea({
        ...project,
        data: nextData,
      });

      patch.emailNotified = true;
      patch.emailMethod = result;
    }

    persist(patch);

    if (viewIndex < TOTAL - 1) {
      setViewIndex(viewIndex + 1);
    }
  };

  const handleDecision = (decisao) => {
    const nextData = {
      ...project.data,
      { decisao },
    };

    if (decisao === "Recusado") {
      persist({
        data: nextData,
        status: STATUS.RECUSADO,
      });
    } else {
      const nextCurrent = Math.min(
        viewIndex + 1,
        TOTAL - 1
      );

      persist({
        data: nextData,
        currentStep: nextCurrent,
        status: STATUS.EM_ANDAMENTO,
      });

      setViewIndex(nextCurrent);
    }
  };

  const handleReactivate = () =>
    persist({
      status: STATUS.EM_ANDAMENTO,
    });

  const handleCancel = () => {
    if (
      confirm(
        `Cancelar o projeto "${project.name}"?`
      )
    ) {
      persist({
        status: STATUS.CANCELADO,
      });
    }
  };

  const handleDeleteIdea = () => {
    if (
      confirm(
        `Excluir a ideia "${project.name}"?`
      )
    ) {
      onDeleteIdea(project.id);
      onBack();
    }
  };

  const def = STEP_DEFS[viewIndex];

  const fields = fieldsFor(
    viewIndex,
    project
  );

  const progressPct = Math.round(
    (project.currentStep /
      (TOTAL - 1)) *
      100
  );

  const isReview =
    viewIndex < project.currentStep;

  const isLast =
    viewIndex === TOTAL - 1;

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

export {
  ProjectView,
};
