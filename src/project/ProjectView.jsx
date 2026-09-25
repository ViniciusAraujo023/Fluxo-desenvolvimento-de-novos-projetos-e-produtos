import { Plus, ShieldCheck, Settings, } from "lucide-react";
import { SopranoMark, } from "./SopranoMark";


function Header({ setShowNew, projects, isAdmin, canCreate, emAndamento, concluidos, showSettings, setShowSettings, appUser,})
{
  return (
    <header className="border-b border-slate-200 bg-white px-4 sm:px-8 py-4 sm:py-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <SopranoMark />

          <div className="text-xs text-slate-500 border-l border-slate-200 pl-3">
            Fluxo de engenharia
            <br />
            Novos projetos

            {appUser && (
              <div className="mt-2">
                <div className="font-medium text-slate-700">
                  {appUser?.nome || "Usuário"}
                </div>

                <div>
                  Perfil: {appUser?.perfil || "-"}
                </div>

                <div>
                  {appUser?.email || "-"}
                </div>
              </div>
            )}
          </div>
          </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Settings size={16} />
              Configurações
            </button>
          )}

          {canCreate && (
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-sky-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-900"
            >
              <Plus size={16} />
              Solicitar ideia
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-semibold text-slate-900">{projects.length}</span>
            <span className="text-slate-500"> projetos</span>
          </div>

          <div>
            <span className="font-semibold text-amber-600">{emAndamento}</span>
            <span className="text-slate-500"> em andamento</span>
          </div>

          <div>
            <span className="font-semibold text-emerald-600">{concluidos}</span>
            <span className="text-slate-500"> concluídos</span>
          </div>
        </div>

        {appUser?.perfil === "visualizador" && (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck size={13} />
            Modo visualizador: você só pode consultar os projetos.
          </span>
        )}
      </div>
    </header>
  );
}

export { Header, };
