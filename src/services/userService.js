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

export { getUserByEmail, createUser, };
