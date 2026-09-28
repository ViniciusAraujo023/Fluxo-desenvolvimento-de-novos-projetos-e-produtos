import { Mail, Send } from "lucide-react";
import { buildIdeaMailto, EMAILJS_READY, NOTIFY_EMAIL } from "../services/EmailService";

const SUMMARY_FIELDS = [
  ["Ideia", "ideia"],
  ["Tipo de ideia", "tipoIdeia"],
  ["Segmento", "segmento"],
  ["Descrição", "descricao"],
  ["Justificativa", "justificativa"],
];

function ApprovalStep({ project, draft, blocked, isReview, isAdmin, onDecision }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      {project.emailNotified && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-md border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          <span className="inline-flex items-center gap-2">
            <Mail size={15} />
            {project.emailMethod === "sent"
              ? <>E-mail enviado automaticamente para <strong>{NOTIFY_EMAIL}</strong></>
              : <>Notificação preparada para <strong>{NOTIFY_EMAIL}</strong> {EMAILJS_READY ? "" : "(configure o EmailJS para envio automático)"}</>}
          </span>
          <a href={buildIdeaMailto(project)} className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-sky-800 border border-sky-300 hover:bg-sky-100">
            <Send size={12} /> Reenviar
          </a>
        </div>
      )}

      <h3 className="text-sm font-mono uppercase tracking-wide text-slate-500 mb-3">Resumo da ideia</h3>
      <dl className="grid grid-cols-1 gap-3 text-sm">
        {SUMMARY_FIELDS.map(([label, key]) => (
          <div key={key} className="grid grid-cols-3 gap-2">
            <dt className="text-slate-500">{label}</dt>
            <dd className="col-span-2 text-slate-800">{project.data[0]?.[key] || "—"}</dd>
          </div>
        ))}
      </dl>

      {blocked || isReview ? (
        <div className="mt-6 text-sm text-slate-500">
          Decisão registrada: <span className="font-medium text-slate-800">{draft.decisao || "—"}</span>
        </div>
      ) : isAdmin ? (
        <div className="mt-6 flex gap-3">
          <button onClick={() => onDecision("Recusado")} className="rounded-md border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">Recusar</button>
          <button onClick={() => onDecision("Confirmado")} className="rounded-md bg-sky-800 px-4 py-2 text-sm font-medium text-white hover:bg-sky-900">Confirmar</button>
        </div>
      ) : (
        <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Sua ideia foi registrada e está aguardando avaliação de um administrador.
        </div>
      )}
    </div>
  );
}

export { ApprovalStep };
