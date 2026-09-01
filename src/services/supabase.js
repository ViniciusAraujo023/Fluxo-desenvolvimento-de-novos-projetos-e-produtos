import { USERS } from "../data/users";


///
const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL;

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY;

const SUPABASE_READY = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY
);

///
async function supaRequest(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase ${res.status}: ${detail || res.statusText}`);
  }
  
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

///
function rowToProject(row) {
  return {
    id: row.id,
    name: row.name,
    responsavel: row.responsavel,
    startDate: row.start_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    currentStep: row.current_step,
    status: row.status,
    emailNotified: row.email_notified,
    emailMethod: row.email_method,
    data: row.data || {},
  };
}

function projectToRow(project) {
  return {
    id: project.id,
    name: project.name,
    responsavel: project.responsavel,
    start_date: project.startDate,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
    created_by: project.createdBy,
    current_step: project.currentStep,
    status: project.status,
    email_notified: !!project.emailNotified,
    email_method: project.emailMethod || null,
    data: project.data || {},
  };
}

///
async function loadProjects() {
  if (!SUPABASE_READY) return [];
  try {
    const rows = await supaRequest("projects?select=*&order=created_at.desc");
    return (rows || []).map(rowToProject);
  } catch (e) {
    console.error("Erro ao carregar projetos do Supabase:", e);
    return [];
  }
}
async function insertProjectRow(project) {
  if (!SUPABASE_READY) return;
  try {
    await supaRequest("projects", { method: "POST", body: JSON.stringify(projectToRow(project)) });
  } catch (e) {
    console.error("Erro ao criar projeto no Supabase:", e);
    throw e;
  }
}
async function updateProjectRow(project) {
  if (!SUPABASE_READY) return;
  try {
    await supaRequest(`projects?id=eq.${encodeURIComponent(project.id)}`, {
      method: "PATCH",
      body: JSON.stringify(projectToRow(project)),
    });
  } catch (e) {
    console.error("Erro ao atualizar projeto no Supabase:", e);
    throw e;
  }
}
async function deleteProjectRow(id) {
  if (!SUPABASE_READY) return;
  try {
    await supaRequest(`projects?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch (e) {
    console.error("Erro ao excluir projeto no Supabase:", e);
    throw e;
  }
}

///
async function loadCurrentUserId() {
  if (!SUPABASE_READY) return USERS[0].id;
  try {
    const rows = await supaRequest("app_state?select=value&key=eq.current_user_id");
    return rows?.[0]?.value ?? USERS[0].id;
  } catch (e) {
    console.error("Erro ao carregar usuário atual do Supabase:", e);
    return USERS[0].id;
  }
}
async function saveCurrentUserId(id) {
  if (!SUPABASE_READY) return;
  try {
    await supaRequest("app_state", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ key: "current_user_id", value: id }),
    });
  } catch (e) {
    console.error("Erro ao salvar usuário atual no Supabase:", e);
  }
}


///
export {
  SUPABASE_READY,
  loadProjects,
  insertProjectRow,
  updateProjectRow,
  deleteProjectRow,
  loadCurrentUserId,
  saveCurrentUserId,
};
