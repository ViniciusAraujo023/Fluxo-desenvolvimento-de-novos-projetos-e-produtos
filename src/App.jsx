import { useState, useEffect } from "react";
import { Header, } from "./components/Layout/Header";
import { useProjects } from "./hooks/UseProjects";
import { EMAILJS_READY, loadEmailJsScript, } from "./services/EmailService";
import { insertProjectRow, updateProjectRow, deleteProjectRow, } from "./services/Supabase";
import { createProject, } from "./utils/ProjectService";
import { STATUS, } from "./data/Constants";
import { ProjectView, } from "./project/ProjectView";
import { ProjectCard, } from "./dashboard/ProjectCard";
import { NewProjectForm, } from "./dashboard/NewProjectForm";
import { LoadingScreen, } from "./components/Layout/LoadingScreen";
import { useAuth } from "./hooks/UseAuth";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { SettingsPage } from "./settings/SettingsPage";
import { canCreateProjects } from "./auth/Permissions";

function App() {
  
  const [loading, setLoading] = useState(true);
  
  const { projects, setProjects, } = useProjects();

  const { user, appUser, loading: authLoading, setAppUser, } = useAuth();
  const currentUser = appUser
  ? {
      id: appUser.id,
      name: appUser.nome,
      role: appUser.perfil,
      email: appUser.email,
      area: appUser.area_id,
    }
  : null;

  const canCreate = canCreateProjects(currentUser);
  
  const [selectedId, setSelectedId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (EMAILJS_READY) {
      loadEmailJsScript().catch(() => {});
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);

  }, []);

  const isAdmin = currentUser?.role === "admin";

  const handleCreate = ({
    name,
    responsavel,
    startDate,
  }) => {
    const newProject = createProject({
      name,
      responsavel,
      startDate,
      currentUser,
    });

    setProjects([
      newProject,
      ...projects,
    ]);

    setShowNew(false);
    setSelectedId(newProject.id);

    insertProjectRow(newProject).catch(() =>
      setSyncError(
        "Não foi possível salvar o novo projeto no Supabase."
      )
    );
  };

  const handleUpdate = (updated) => {
    setProjects(
      projects.map((p) =>
        p.id === updated.id
          ? updated
          : p
      )
    );

    updateProjectRow(updated).catch(() =>
      setSyncError(
        "Não foi possível sincronizar essa alteração com o Supabase."
      )
    );
  };

  const handleReactivate = (id) => {
    const target = projects.find(
      (p) => p.id === id
    );

    if (!target) return;

    const patched = {
      ...target,
      status: STATUS.EM_ANDAMENTO,
    };

    setProjects(
      projects.map((p) =>
        p.id === id
          ? patched
          : p
      )
    );

    updateProjectRow(patched).catch(() =>
      setSyncError(
        "Não foi possível sincronizar a reativação."
      )
    );
  };

  const handleDeleteIdea = (id) => {
    setProjects(
      projects.filter(
        (p) => p.id !== id
      )
    );

    deleteProjectRow(id).catch(() =>
      setSyncError(
        "Não foi possível excluir a ideia."
      )
    );
  };

    if (
      projects === null ||
      authLoading
    ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  const selected = projects.find(
    (p) => p.id === selectedId
  );

  if (selected && currentUser) {
    return (
      <ProjectView
        project={selected}
        onUpdate={handleUpdate}
        onBack={() => setSelectedId(null)}
        onDeleteIdea={handleDeleteIdea}
        currentUser={currentUser}
      />
    );
  }

  const emAndamento = projects.filter(
    (p) => p.status === STATUS.EM_ANDAMENTO
  ).length;

  const concluidos = projects.filter(
    (p) => p.status === STATUS.CONCLUIDO
  ).length;

  

return (
  <ProtectedRoute
    user={user}
    appUser={appUser}
    loading={authLoading}
    onProfileComplete={setAppUser}
  >
    {loading ? (
      <LoadingScreen />
    ) : (
      <div className="min-h-screen bg-slate-50">
        <Header
          setShowNew={setShowNew}
          projects={projects}
          isAdmin={isAdmin}
          canCreate={canCreate}
          emAndamento={emAndamento}
          concluidos={concluidos}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          appUser={appUser}
        />

        {showSettings ? (
          <SettingsPage />
        ) : (
          <div className="px-8 py-8">
            {showNew && (
              <NewProjectForm
                onCreate={handleCreate}
                onCancel={() => setShowNew(false)}
                currentUser={currentUser}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={() => setSelectedId(p.id)}
                  onReactivate={handleReactivate}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </ProtectedRoute>
);
}

export default App;
