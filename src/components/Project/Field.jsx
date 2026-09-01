import { Download } from "lucide-react";
import { FileField } from "./FileField";

///
function Field({ field, value, onChange, disabled }) {
  const { type, label } = field;

  if (type === "download") {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">Modelo</span>
        <button type="button" className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-sky-800 underline decoration-sky-300 underline-offset-2 hover:text-sky-900">
          <Download size={14} /> {label}
        </button>
      </div>
    );
  }
  if (type === "file") return <FileField label={label} value={value} onChange={onChange} disabled={disabled} />;

  if (type === "text") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{label}</span>
        <input type="text" disabled={disabled} value={value || ""} onChange={(e) => onChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-600 disabled:bg-slate-50 disabled:text-slate-400" />
      </label>
    );
  }
  if (type === "textarea") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{label}</span>
        <textarea rows={3} disabled={disabled} value={value || ""} onChange={(e) => onChange(e.target.value)}
          className="resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-600 disabled:bg-slate-50 disabled:text-slate-400" />
      </label>
    );
  }
  if (type === "select") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{label}</span>
        <select disabled={disabled} value={value || ""} onChange={(e) => onChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-600 disabled:bg-slate-50 disabled:text-slate-400">
          <option value="">— selecione —</option>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>
    );
  }
  if (type === "radio") {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{label}</span>
        <div className="flex gap-4">
          {field.options.map((o) => (
            <label key={o} className="inline-flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
              <input type="radio" disabled={disabled} checked={value === o} onChange={() => onChange(o)} className="accent-sky-800" />
              {o}
            </label>
          ))}
        </div>
      </div>
    );
  }
  if (type === "checkbox") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
        <input type="checkbox" disabled={disabled} checked={!!value} onChange={(e) => onChange(e.target.checked)} className="accent-sky-800 h-4 w-4" />
        {label}
      </label>
    );
  }
  if (type === "checklist") {
    const val = value || {};
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{label}</span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-md border border-slate-200 bg-slate-50 p-3">
          {field.options.map((o) => (
            <label key={o} className="inline-flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" disabled={disabled} checked={!!val[o]} onChange={(e) => onChange({ ...val, [o]: e.target.checked })} className="accent-sky-800 h-3.5 w-3.5" />
              {o}
            </label>
          ))}
        </div>
      </div>
    );
  }
  return null;
}


///
export{
  Field,
};
