import { useEffect, useState } from "react";
import { listUsers, approveUser, saveUserSettings, } from "../services/userService";
import { listAreas, } from "../services/areaService";

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [areas, setAreas] = useState([]);

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
    await saveUserSettings(user.id, {
      perfil: user.perfil,
      area_id: user.area_id || null,
      ativo: user.ativo,
    });

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
    <div>
      <h2>Usuários</h2>

      {users.map((user) => (
        <div key={user.id}>
          <div><strong>{user.email}</strong></div>

          <div>Perfil:</div>
          <select
            value={user.perfil}
            onChange={(e) =>
              updateLocalUser(user.id, 'perfil', e.target.value)
            }
          >
            <option value="admin">Administrador</option>
            <option value="gestor">Gestor</option>
            <option value="colaborador">Colaborador</option>
            <option value="visualizador">Visualizador</option>
          </select>

          <div>Área:</div>
          <select
            value={user.area_id || ''}
            onChange={(e) =>
              updateLocalUser(user.id, 'area_id', e.target.value)
            }
          >
            <option value="">Sem área</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nome}
              </option>
            ))}
          </select>

          <div>
            <label>
              <input
                type="checkbox"
                checked={!!user.ativo}
                onChange={(e) =>
                  updateLocalUser(user.id, 'ativo', e.target.checked)
                }
              />
              Usuário ativo
            </label>
          </div>

          <div>
            Status: {user.aprovado ? 'Aprovado' : 'Pendente'}
          </div>

          {!user.aprovado && (
            <button onClick={() => handleApprove(user.id)}>
              Aprovar
            </button>
          )}

          <button onClick={() => handleSave(user)}>
            Salvar
          </button>
        </div>
      ))}
    </div>
  );
}

export { UsersManagement };
