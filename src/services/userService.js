import { supabase } from "./authService";


async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    return null;
  }

  return data;
}

async function createUser({
  email,
  nome,
}) {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        email,
        nome,
        perfil: "visualizador",
        aprovado: false,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function listUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

async function updateUser(
  id,
  updates
) {
  const { data, error } =
    await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}

async function approveUser(id) {
  return updateUser(id, {
    aprovado: true,
  });
}

async function saveUserSettings(
  id,
  {
    perfil,
    area_id,
    ativo,
  }
) {
  return updateUser(id, {
    perfil,
    area_id,
    ativo,
  });
}

export { getUserByEmail, createUser, listUsers, updateUser, approveUser, saveUserSettings, };
