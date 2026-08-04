import React, { useState } from "react";
import { Edit, Download, Save, Code } from "lucide-react";

export const FileEditor: React.FC = () => {
  const [content, setContent] = useState<string>(`{\n  "app": "ToolBox",\n  "version": "2.5.0",\n  "mode": "React JS Web",\n  "status": "Active"\n}`);
  const [fileName, setFileName] = useState("config.json");

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-indigo-500" /> Web Text & Code File Editor
          </h3>
          <p className="text-xs text-slate-400">Edit JSON, CSV, Markdown, JS, or TXT directly in browser</p>
        </div>

        <button
          onClick={handleDownload}
          className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
        >
          <Download className="w-4 h-4" /> Save & Download
        </button>
      </div>

      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400 uppercase">Filename:</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-indigo-300 leading-relaxed focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
};
