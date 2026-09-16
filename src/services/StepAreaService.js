import { supabase } from "./authService";

async function listStepAreas() {
  const { data, error } = await supabase
    .from("step_areas")
    .select("*");

  if (error) {
    console.error("Erro ao carregar áreas das etapas:", error);
    return [];
  }

  return data;
}

async function saveStepArea(stepIndex, areaId) {
  const { data, error } = await supabase
    .from("step_areas")
    .upsert(
      {
        step_index: stepIndex,
        area_id: areaId || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "step_index" }
    )
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar área da etapa:", error);
    return null;
  }

  return data;
}

export { listStepAreas, saveStepArea };
