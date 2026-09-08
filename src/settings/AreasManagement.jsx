import { useEffect, useState } from "react";
import { listAreas, createArea } from "../../services/areaService";

function AreasManagement() {
  const [areas, setAreas] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    loadAreas();
  }, []);

  async function loadAreas() {
    const data = await listAreas();
    setAreas(data || []);
  }

  async function handleCreate() {
    if (!nome.trim()) return;

    await createArea({ nome, descricao });

    setNome("");
    setDescricao("");

    loadAreas();
  }

  return (
    <div>
      <h2>Áreas</h2>

      <div>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da área"
        />

        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição"
        />

        <button onClick={handleCreate}>
          Criar Área
        </button>
      </div>

      {areas.map((area) => (
        <div key={area.id}>
          <strong>{area.nome}</strong>
          <div>{area.descricao}</div>
        </div>
      ))}
    </div>
  );
}

export { AreasManagement };

