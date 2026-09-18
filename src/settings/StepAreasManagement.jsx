import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { STEP_DEFS } from "../data/StepDefs";
import { listAreas } from "../services/AreaService";
import { listStepAreas, saveStepArea } from "../services/StepAreaService";

function StepAreasManagement() {
  const [areas, setAreas] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [savingIndex, setSavingIndex] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const areasData = await listAreas();
    const stepAreasData = await listStepAreas();

    setAreas(areasData || []);

    const map = {};
    (stepAreasData || []).forEach((row) => {
      map[row.step_index] = row.area_id;
    });
    setAssignments(map);
  }

  function updateLocal(stepIndex, areaId) {
    setAssignments((current) => ({
      ...current,
      [stepIndex]: areaId,
    }));
  }

  async function handleSave(stepIndex) {
    setSavingIndex(stepIndex);
    await saveStepArea(stepIndex, assignments[stepIndex] || null);
    setSavingIndex(null);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
      <div className="px-5 py-3 text-xs text-slate-500">
        Defina qual área é responsável por cada etapa do processo. Quem for
        gestor dessa área poderá acompanhar e aprovar a etapa correspondente.
      </div>

      {STEP_DEFS.map((step, index) => (
        <div
          key={index}
          className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
              {index + 1}
            </span>
            <p className="text-sm text-slate-900 truncate">{step.title}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={assignments[index] || ""}
              onChange={(e) => updateLocal(index, e.target.value)}
              className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm bg-white"
            >
              <option value="">Sem área definida</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nome}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleSave(index)}
              disabled={savingIndex === index}
              className="inline-flex items-center justify-center rounded-md bg-sky-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-900 disabled:opacity-60 w-[38px]"
            >
              {savingIndex === index ? "..." : <Check size={15} />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export { StepAreasManagement };
