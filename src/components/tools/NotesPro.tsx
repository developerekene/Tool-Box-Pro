import React, { useState, useEffect } from "react";
import { StickyNote, Plus, Trash2, Edit2, Star, Search, Tag, Eye, Check, Download } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  category: "Work" | "Personal" | "Ideas";
  isPinned: boolean;
  updatedAt: string;
}

const INITIAL_NOTES: Note[] = [
  {
    id: "1",
    title: "ToolBox React Port Notes",
    content: "# ToolBox Project Scope\n- Converted React Native code to React JS with Tailwind CSS\n- High performance & smooth responsiveness\n- All 39 tools ported with full features",
    category: "Work",
    isPinned: true,
    updatedAt: new Date().toLocaleDateString(),
  },
  {
    id: "2",
    title: "Product Launch Checklist",
    content: "1. Perform end-to-end tool testing\n2. Verify cross-browser compatibility\n3. Deploy Cloud Run application",
    category: "Ideas",
    isPinned: false,
    updatedAt: new Date().toLocaleDateString(),
  },
];

export const NotesPro: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("notes_pro_data");
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("notes_pro_data", JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      category: "Personal",
      isPinned: false,
      updatedAt: new Date().toLocaleDateString(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateNote = (field: keyof Note, value: any) => {
    setNotes(
      notes.map((n) =>
        n.id === activeNoteId
          ? { ...n, [field]: value, updatedAt: new Date().toLocaleDateString() }
          : n
      )
    );
  };

  const handleDeleteNote = (id: string) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    if (activeNoteId === id && next.length > 0) {
      setActiveNoteId(next[0].id);
    }
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-rose-500" /> Notes Pro
          </h3>
          <p className="text-xs text-slate-400">Markdown note organizer with tags & quick search</p>
        </div>

        <button
          onClick={handleCreateNote}
          className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-rose-500/20"
        >
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[480px]">
        {/* Notes Sidebar List */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4 flex flex-col">
          {/* Search & Category filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1">
              {["All", "Work", "Personal", "Ideas"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                    selectedCategory === cat
                      ? "bg-rose-500/20 border-rose-500 text-rose-400"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Item Cards */}
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px] pr-1">
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-10">No notes found</p>
            ) : (
              filteredNotes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setActiveNoteId(n.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer space-y-1.5 relative ${
                    n.id === activeNoteId
                      ? "bg-slate-800 border-rose-500/60 shadow-md"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate max-w-[160px]">
                      {n.title || "Untitled Note"}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">{n.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{n.content || "Empty note..."}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Note Content Editor */}
        <div className="md:col-span-2 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col space-y-4">
          {activeNote ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => handleUpdateNote("title", e.target.value)}
                  placeholder="Note Title..."
                  className="bg-transparent text-lg font-bold text-white focus:outline-none border-b border-transparent focus:border-rose-500 pb-0.5 flex-1"
                />

                <div className="flex items-center gap-2">
                  <select
                    value={activeNote.category}
                    onChange={(e) => handleUpdateNote("category", e.target.value)}
                    className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-rose-400 focus:outline-none"
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Ideas">Ideas</option>
                  </select>

                  <button
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                      isPreviewMode
                        ? "bg-rose-500/20 border-rose-500 text-rose-400"
                        : "bg-slate-800 border-slate-700 text-slate-300"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> {isPreviewMode ? "Edit" : "Preview"}
                  </button>

                  <button
                    onClick={() => handleDeleteNote(activeNote.id)}
                    className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg border border-rose-500/20 transition"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isPreviewMode ? (
                <div className="flex-1 p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 text-sm whitespace-pre-wrap font-sans overflow-y-auto max-h-[360px]">
                  {activeNote.content || <span className="text-slate-600">No content preview</span>}
                </div>
              ) : (
                <textarea
                  value={activeNote.content}
                  onChange={(e) => handleUpdateNote("content", e.target.value)}
                  placeholder="Write note content in plain text or Markdown..."
                  rows={14}
                  className="flex-1 p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500 font-mono leading-relaxed"
                />
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <StickyNote className="w-10 h-10 mb-2 opacity-50 text-rose-500" />
              <p className="text-sm">Select or create a note to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
