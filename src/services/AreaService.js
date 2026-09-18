import { supabase } from "./AuthService";

async function listAreas() {
  const { data, error } = await supabase
    .from("areas")
    .select("*")
    .order("nome");

  if (error) {
    throw error;
  }

  return data;
}

async function createArea({
  nome,
  descricao,
}) {
  const { data, error } = await supabase
    .from("areas")
    .insert([
      {
        nome,
        descricao,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function updateArea(
  id,
  updates
) {
  const { data, error } = await supabase
    .from("areas")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export { listAreas, createArea,updateArea, };
