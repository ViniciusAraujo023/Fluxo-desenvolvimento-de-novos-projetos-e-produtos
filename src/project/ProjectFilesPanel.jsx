import { Paperclip, Download } from "lucide-react";
import { getProjectFiles } from "./ProjectFiles";
import { downloadAttachedFile } from "../utils/FileUtils";

function ProjectFilesPanel({ project }) {
  const files = getProjectFiles(project);

  if (files.length === 0) {
    return (
      <div className="px-5 py-6 text-xs text-slate-500">
        Nenhum arquivo anexado ainda neste projeto.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 py-2">
      {files.map((file, i) => (
        <button
          key={i}
          onClick={() => downloadAttachedFile(file)}
          className="flex items-start gap-2.5 px-5 py-2 text-left text-[13px] text-slate-300 hover:bg-slate-800"
        >
          <Paperclip size={13} className="mt-0.5 shrink-0 text-slate-500" />
          <span className="flex-1 min-w-0">
            <span className="block truncate text-slate-200">{file.name}</span>
            <span className="block truncate text-[11px] text-slate-500">
              {file.fieldLabel} · etapa {String(file.stepIndex + 1).padStart(2, "0")}
            </span>
          </span>
          <Download size={13} className="mt-0.5 shrink-0 text-slate-500" />
        </button>
      ))}
    </div>
  );
}

export { ProjectFilesPanel };
