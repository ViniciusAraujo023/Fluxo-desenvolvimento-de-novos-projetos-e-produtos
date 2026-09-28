import { ChevronLeft } from "lucide-react";
import { Field } from "./Field";

function StepForm({
  fields, draft, setField, blocked, project,
  viewIndex, isReview, isLast, onPrev, onAdvance,
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 flex flex-col gap-5">
      {fields.map((f) => (
        <Field key={f.key} field={f} value={draft[f.key]} onChange={(v) => setField(f.key, v)} disabled={blocked} project={project} />
      ))}

      {!blocked && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
          <button disabled={viewIndex === 0} onClick={onPrev}
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft size={16} /> Voltar
          </button>
          <button onClick={onAdvance} className="rounded-md bg-sky-800 px-5 py-2 text-sm font-medium text-white hover:bg-sky-900">
            {isReview ? "Salvar" : isLast ? "Finalizar projeto" : "Avançar"}
          </button>
        </div>
      )}
    </div>
  );
}

export { StepForm };
