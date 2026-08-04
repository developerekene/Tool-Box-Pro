import React, { useState } from "react";
import { FileText, Type, Edit3, Download, Plus, Trash2 } from "lucide-react";

interface PDFAnnotation {
  id: string;
  text: string;
  page: number;
}

export const PdfEditor: React.FC = () => {
  const [annotations, setAnnotations] = useState<PDFAnnotation[]>([
    { id: "1", text: "Approved by Review Committee", page: 1 },
  ]);
  const [newNote, setNewNote] = useState("");

  const handleAdd = () => {
    if (!newNote.trim()) return;
    setAnnotations([...annotations, { id: Date.now().toString(), text: newNote.trim(), page: 1 }]);
    setNewNote("");
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-500" /> Interactive PDF Markup Editor
          </h3>
          <p className="text-xs text-slate-400">Add text overlays, signatures & page annotations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">Add Text Annotation</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Type annotation text..."
              className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
            <button onClick={handleAdd} className="px-3.5 py-2 bg-sky-500 text-slate-950 font-bold text-xs rounded-xl">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {annotations.map((ann) => (
              <div key={ann.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-white font-mono">{ann.text}</span>
                <button onClick={() => setAnnotations(annotations.filter((a) => a.id !== ann.id))} className="text-slate-500 hover:text-rose-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-sky-500/30 flex flex-col items-center justify-center space-y-4">
          <div className="w-full bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-2 min-h-[180px] flex flex-col justify-center">
            <FileText className="w-10 h-10 text-sky-400 mx-auto" />
            <span className="text-xs font-bold text-white block">Document Preview (Page 1)</span>
            {annotations.map((ann) => (
              <span key={ann.id} className="inline-block px-2.5 py-1 bg-sky-500/20 text-sky-300 text-[11px] rounded font-mono">
                "{ann.text}"
              </span>
            ))}
          </div>

          <button onClick={() => alert("Annotated PDF Exported!")} className="px-4 py-2 bg-sky-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg">
            <Download className="w-4 h-4" /> Export Edited PDF
          </button>
        </div>
      </div>
    </div>
  );
};
