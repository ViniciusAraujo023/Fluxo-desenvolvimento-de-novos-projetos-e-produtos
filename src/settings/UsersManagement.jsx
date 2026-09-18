import { useEffect, useState } from "react";
import { Check, Clock } from "lucide-react";
import { listUsers, approveUser, saveUserSettings, } from "../services/UserService";
import { listAreas, } from "../services/AreaService";

const PERFIL_LABEL = {
  admin: "Administrador",
  gestor: "Gestor",
  colaborador: "Colaborador",
  visualizador: "Visualizador",
};

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const usersData = await listUsers();
    const areasData = await listAreas();

    setUsers(usersData || []);
    setAreas(areasData || []);
  }

  async function handleApprove(id) {
    await approveUser(id);
    loadData();
  }

  async function handleSave(user) {
    setSavingId(user.id);

    await saveUserSettings(user.id, {
      perfil: user.perfil,
      area_id: user.area_id || null,
      ativo: user.ativo,
    });

    setSavingId(null);
    loadData();
  }

  function updateLocalUser(id, field, value) {
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? {
              ...user,
              [field]: value,
            }
          : user
      )
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <p className="font-medium text-slate-900">
                {user.nome || user.email}
              </p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                user.aprovado
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {user.aprovado ? <Check size={11} /> : <Clock size={11} />}
              {user.aprovado ? "Aprovado" : "Pendente"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Perfil</span>
              <select
                value={user.perfil}
                onChange={(e) =>
                  updateLocalUser(user.id, "perfil", e.target.value)
                }
                className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm bg-white"
              >
                {Object.entries(PERFIL_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Área</span>
              <select
                value={user.area_id || ""}
                onChange={(e) =>
                  updateLocalUser(user.id, "area_id", e.target.value)
                }
                className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm bg-white"
              >
                <option value="">Sem área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-end gap-2 pb-1.5">
              <input
                type="checkbox"
                checked={!!user.ativo}
                onChange={(e) =>
                  updateLocalUser(user.id, "ativo", e.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Usuário ativo</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            {!user.aprovado && (
              <button
                onClick={() => handleApprove(user.id)}
                className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
              >
                Aprovar acesso
              </button>
            )}

            <button
              onClick={() => handleSave(user)}
              disabled={savingId === user.id}
              className="rounded-md bg-sky-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-900 disabled:opacity-60"
            >
              {savingId === user.id ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      ))}

      {users.length === 0 && (
        <p className="text-sm text-slate-500 py-8 text-center">
          Nenhum usuário cadastrado ainda.
        </p>
      )}
    </div>
  );
}

export { UsersManagement };
