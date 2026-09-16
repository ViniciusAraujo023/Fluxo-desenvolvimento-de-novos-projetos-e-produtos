import { useState } from "react";
import { Users, MapPin, ListChecks } from "lucide-react";
import { UsersManagement } from "./UsersManagement";
import { AreasManagement } from "./AreasManagement";
import { ActivitiesManagement } from "./ActivitiesManagement";

const TABS = [
  { id: "users", label: "Usuários", icon: Users },
  { id: "areas", label: "Áreas", icon: MapPin },
  { id: "activities", label: "Atividades", icon: ListChecks },
];

function SettingsPage() {
  const [tab, setTab] = useState("users");

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Configurações
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Gerencie usuários, áreas e atividades do fluxo.
      </p>

      <div className="mt-6 border-b border-slate-200 flex gap-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === id
                ? "border-sky-800 text-sky-800"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "users" && <UsersManagement />}
        {tab === "areas" && <AreasManagement />}
        {tab === "activities" && <ActivitiesManagement />}
      </div>
    </div>
  );
}

export { SettingsPage };
