import { supabase } from "./authService";

async function listActivities() {
  const { data, error } = await supabase
    .from("activities")
    .select(`
      *,
      areas (
        id,
        nome
      )
    `)
    .order("nome");

  if (error) {
    throw error;
  }

  return data;
}

async function createActivity({
  nome,
  area_id,
}) {
  const { data, error } = await supabase
    .from("activities")
    .insert([
      {
        nome,
        area_id,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function updateActivity(
  id,
  updates
) {
  const { data, error } = await supabase
    .from("activities")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function deleteActivity(id) {
  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export { listActivities, createActivity, updateActivity, deleteActivity, };
