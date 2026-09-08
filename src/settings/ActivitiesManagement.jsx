import { useEffect, useState } from "react";
import { listActivities, createActivity } from "../../services/activityService";
import { listAreas } from "../../services/areaService";

function ActivitiesManagement() {
  const [activities, setActivities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [nome, setNome] = useState("");
  const [areaId, setAreaId] = useState("");

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

    await createActivity({
      nome,
      area_id: areaId,
    });

    setNome("");
    setAreaId("");

    loadData();
  }

  return (
    <div>
      <h2>Atividades</h2>

      <div>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da atividade"
        />

        <select
          value={areaId}
          onChange={(e) => setAreaId(e.target.value)}
        >
          <option value="">Selecione uma área</option>

          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.nome}
            </option>
          ))}
        </select>

        <button onClick={handleCreate}>
          Criar Atividade
        </button>
      </div>

      {activities.map((activity) => (
        <div key={activity.id}>
          <strong>{activity.nome}</strong>
          <div>Área: {activity.areas?.nome}</div>
        </div>
      ))}
    </div>
  );
}

export { ActivitiesManagement };
