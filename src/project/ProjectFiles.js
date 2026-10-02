import { STEP_DEFS } from "../data/StepDefs";

function fieldsOfStep(step, project) {
  if (!step.branch) return step.fields || [];

  const tipo = project?.data?.[3]?.importado ? "Importado" : "Nacional";
  return step.fields[tipo] || [];
}

function getProjectFiles(project) {
  const files = [];

  STEP_DEFS.forEach((step, stepIndex) => {
    const fields = fieldsOfStep(step, project);
    const stepData = project.data?.[stepIndex] || {};

    fields.forEach((field) => {
      if (field.type !== "file") return;

      const value = stepData[field.key];
      if (!value?.url) return;

      files.push({
        stepIndex,
        stepTitle: step.title,
        fieldLabel: field.label,
        ...value,
      });
    });
  });

  return files;
}

export { getProjectFiles };
