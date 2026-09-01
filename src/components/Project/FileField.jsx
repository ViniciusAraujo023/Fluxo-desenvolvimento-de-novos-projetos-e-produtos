import {
  useRef, 
  useState,
} from "react";

import {
  Paperclip,
  Download,
  X,
} from "lucide-react";

import {
  readFileAsDataURL,
  downloadAttachedFile,
} from "../../utils/fileUtils";

///
function FileField({ label, value, onChange, disabled }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLoading(true);
    try {
      const dataUrl = await readFileAsDataURL(f);
      onChange({ name: f.name, size: f.size, url: dataUrl, attachedAt: new Date().toISOString() });
    } catch {
      onChange({ name: f.name, size: f.size, url: null, attachedAt: new Date().toISOString() });
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{label}</span>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-sky-500 hover:text-sky-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Paperclip size={14} /> {loading ? "Carregando…" : "Anexar arquivo"}
        </button>
        <input ref={inputRef} type="file" className="hidden" onChange={handleSelect} />

        {value?.name ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 pl-2 pr-1 py-1 text-xs text-emerald-700 border border-emerald-200">
            {value.name}
            {value.url && (
              <button
                type="button"
                onClick={() => downloadAttachedFile(value)}
                title="Baixar arquivo para revisão"
                className="rounded p-0.5 hover:bg-emerald-100 text-emerald-700"
              >
                <Download size={12} />
              </button>
            )}
            {!disabled && (
              <button type="button" onClick={() => onChange(null)} className="rounded p-0.5 hover:bg-emerald-100 text-emerald-700">
                <X size={12} />
              </button>
            )}
          </span>
        ) : (
          <span className="text-xs text-slate-400">Nenhum arquivo anexado</span>
        )}
      </div>
    </div>
  );
}


export{
  FileField,
};
