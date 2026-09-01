import { useState } from "react";

import {
  todayISO,
} from "../../utils/dateUtils";

function NewProjectForm({
  onCreate,
  onCancel,
  currentUser,
}) {
  const [name, setName] = useState("");

  const [responsavel, setResponsavel] = useState(
    currentUser?.name || ""
  );

  const [startDate, setStartDate] =
    useState(todayISO());

  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50/40 p-6 mb-8">
      <h3 className="text-sm font-mono uppercase tracking-wide text-sky-800 mb-4">
        Nova ideia / projeto
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="flex flex-col gap-1.5 sm:col-span-1">
          <span className="text-xs text-slate-500">
            Nome do produto / projeto
          </span>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            placeholder="Ex: Caixa térmica 100L"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-500">
            Solicitante
          </span>

          <input
            value={responsavel}
            onChange={(e) =>
              setResponsavel(e.target.value)
            }
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-500">
            Data de início
          </span>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm text-slate-500 hover:text-slate-800"
        >
          Cancelar
        </button>

        <button
          disabled={!name.trim()}
          onClick={() =>
            onCreate({
              name: name.trim(),
              responsavel: responsavel.trim(),
              startDate,
            })
          }
          className="rounded-md bg-sky-800 px-4 py-2 text-sm font-medium text-white hover:bg-sky-900 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Solicitar ideia
        </button>
      </div>
    </div>
  );
}

export {
  NewProjectForm,
};
