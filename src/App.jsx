import { useState, useEffect } from "react";

import {
  Header,
} from "./components/Layout/Header";

import { useProjects } from "./hooks/useProjects";
import { useCurrentUser } from "./hooks/useCurrentUser";

import {
  EMAILJS_READY,
  loadEmailJsScript,
} from "./services/emailService";

import {
  insertProjectRow,
  updateProjectRow,
  deleteProjectRow,
} from "./services/supabase";

import {
  createProject,
} from "./services/projectService";

import {
  STATUS,
} from "./data/constants";

import {
  isAdminRole,
} from "./data/users";

import {
  ProjectView,
} from "./components/Project/ProjectView";

import {
  ProjectCard,
} from "./components/Dashboard/ProjectCard";

import {
  NewProjectForm,
} from "./components/Dashboard/NewProjectForm";

import {
  LoadingScreen,
} from "./components/Layout/LoadingScreen";



///
function App() {
  
  const [loading, setLoading] = useState(true);
  
  const {
    projects,
    setProjects,
  } = useProjects();

  const {
    currentUserId,
    currentUser,
    changeUser,
  } = useCurrentUser();

  const [selectedId, setSelectedId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    if (EMAILJS_READY) {
      loadEmailJsScript().catch(() => {});
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);

  }, []);

  const isAdmin = isAdminRole(currentUser);

  const handleChangeUser = (id) => {
    changeUser(id);
  };

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
    currentUserId === null
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

  if (selected) {
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
  <>
    {loading ? (
      <LoadingScreen />
    ) : (
      <div className="min-h-screen bg-slate-50">
        <Header
          currentUserId={currentUserId}
          handleChangeUser={handleChangeUser}
          setShowNew={setShowNew}
          projects={projects}
          isAdmin={isAdmin}
          emAndamento={emAndamento}
          concluidos={concluidos}
        />

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
      </div>
    )}
  </>
);

export default App;
