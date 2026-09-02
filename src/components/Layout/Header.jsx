import {
  Plus,
  User,
  ShieldCheck,
} from "lucide-react";

import { USERS } from "../../data/users";

import {
  SopranoMark,
} from "./SopranoMark";



///
function Header({
  currentUserId,
  handleChangeUser,
  setShowNew,
  projects,
  isAdmin,
  emAndamento,
  concluidos,
}) {
  return (
    <header className="border-b border-slate-200 bg-white px-8 py-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <SopranoMark />

          <div className="text-xs text-slate-500 border-l border-slate-200 pl-3">
            Fluxo de engenharia
            <br />
            Novos produtos
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-500">
            <User size={13} />

            <select
              value={currentUserId}
              onChange={(e) =>
                handleChangeUser(e.target.value)
              }
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            >
              {USERS.map((u) => (
                <option
                  key={u.id}
                  value={u.id}
                >
                  {u.name} —{" "}
                  {u.role === "admin"
                    ? "Administrador"
                    : "Colaborador"}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={() => setShowNew(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-sky-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-900"
          >
            <Plus size={16} />
            Solicitar ideia
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-semibold text-slate-900">
              {projects.length}
            </span>{" "}
            <span className="text-slate-500">
              projetos
            </span>
          </div>

          <div>
            <span className="font-semibold text-amber-600">
              {emAndamento}
            </span>{" "}
            <span className="text-slate-500">
              em andamento
            </span>
          </div>

          <div>
            <span className="font-semibold text-emerald-600">
              {concluidos}
            </span>{" "}
            <span className="text-slate-500">
              concluídos
            </span>
          </div>
        </div>

        {!isAdmin && (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck size={13} />
            Modo colaborador: você pode solicitar e acompanhar ideias; a gestão do fluxo é feita por um administrador.
          </span>
        )}
      </div>
    </header>
  );
}

export {
  Header,
};
