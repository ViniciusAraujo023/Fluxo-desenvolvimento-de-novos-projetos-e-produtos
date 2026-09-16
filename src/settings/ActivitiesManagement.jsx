import { useEffect, useState } from "react";
import { Plus, ListChecks } from "lucide-react";
import { listActivities, createActivity } from "../services/activityService";
import { listAreas } from "../services/areaService";

function ActivitiesManagement() {
  const [activities, setActivities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [nome, setNome] = useState("");
  const [areaId, setAreaId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const activitiesData = await listActivities();
    const areasData = await listAreas();

    setActivities(activitiesData || []);
    setAreas(areasData || []);
  }

  async function handleCreate() {
    if (!nome.trim() || !areaId) return;

    setSaving(true);
    await createActivity({
      nome,
      area_id: areaId,
    });
    setSaving(false);

    setNome("");
    setAreaId("");

    loadData();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-medium text-slate-900 mb-3">
          Nova atividade
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da atividade"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />

          <select
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
          >
            <option value="">Selecione uma área</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nome}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreate}
            disabled={saving || !nome.trim() || !areaId}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-sky-800 px-4 py-2 text-sm font-medium text-white hover:bg-sky-900 disabled:opacity-60"
          >
            <Plus size={15} />
            Criar atividade
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="rounded-lg border border-slate-200 bg-white px-5 py-3.5 flex items-center gap-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-800">
              <ListChecks size={15} />
            </span>

            <div>
              <p className="text-sm font-medium text-slate-900">
                {activity.nome}
              </p>
              <p className="text-xs text-slate-500">
                {activity.areas?.nome || "Sem área"}
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <p className="text-sm text-slate-500 py-8 text-center">
            Nenhuma atividade cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}

export { ActivitiesManagement };
