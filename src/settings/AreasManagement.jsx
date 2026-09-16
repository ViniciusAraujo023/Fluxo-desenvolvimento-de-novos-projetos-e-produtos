import { useEffect, useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { listAreas, createArea } from "../services/areaService";

function AreasManagement() {
  const [areas, setAreas] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAreas();
  }, []);

  async function loadAreas() {
    const data = await listAreas();
    setAreas(data || []);
  }

  async function handleCreate() {
    if (!nome.trim()) return;

    setSaving(true);
    await createArea({ nome, descricao });
    setSaving(false);

    setNome("");
    setDescricao("");

    loadAreas();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-medium text-slate-900 mb-3">
          Nova área
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da área"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />

          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição (opcional)"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />

          <button
            onClick={handleCreate}
            disabled={saving || !nome.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-sky-800 px-4 py-2 text-sm font-medium text-white hover:bg-sky-900 disabled:opacity-60"
          >
            <Plus size={15} />
            Criar área
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {areas.map((area) => (
          <div
            key={area.id}
            className="rounded-lg border border-slate-200 bg-white px-5 py-3.5 flex items-center gap-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-800">
              <MapPin size={15} />
            </span>

            <div>
              <p className="text-sm font-medium text-slate-900">
                {area.nome}
              </p>
              {area.descricao && (
                <p className="text-xs text-slate-500">{area.descricao}</p>
              )}
            </div>
          </div>
        ))}

        {areas.length === 0 && (
          <p className="text-sm text-slate-500 py-8 text-center">
            Nenhuma área cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}

export { AreasManagement };
