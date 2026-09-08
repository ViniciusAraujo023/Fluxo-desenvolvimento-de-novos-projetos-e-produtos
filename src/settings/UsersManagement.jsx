import { useEffect, useState } from "react";
import { listUsers, approveUser } from "../../services/userService";

function UsersManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const data = await listUsers();
    setUsers(data || []);
  }

  async function handleApprove(id) {
    await approveUser(id);
    loadUsers();
  }

  return (
    <div>
      <h2>Usuarios</h2>

      {users.map((user) => (
        <div key={user.id}>
          <div>{user.email}</div>
          <div>Perfil: {user.perfil}</div>
          <div>{user.aprovado ? "Aprovado" : "Pendente"}</div>

          {!user.aprovado && (
            <button onClick={() => handleApprove(user.id)}>
              Aprovar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export { UsersManagement };

