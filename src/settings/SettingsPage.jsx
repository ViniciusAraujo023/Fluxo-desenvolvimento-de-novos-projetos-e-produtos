import { useState } from "react";
import { UsersManagement } from "./UsersManagement";
import { AreasManagement } from "./AreasManagement";
import { ActivitiesManagement } from "./ActivitiesManagement";

function SettingsPage() {
  const [tab, setTab] = useState("users");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Configurações
      </h1>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("users")}>Usuários</button>
        <button onClick={() => setTab("areas")}>Áreas</button>
        <button onClick={() => setTab("activities")}>Atividades</button>
      </div>

      {tab === "users" && <UsersManagement />}
      {tab === "areas" && <AreasManagement />}
      {tab === "activities" && <ActivitiesManagement />}
    </div>
  );
}

export { SettingsPage };
