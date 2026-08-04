import React, { useState } from "react";
import { Network, Copy, Check, Search, Plus, Trash2 } from "lucide-react";

export const BooleanCombinator: React.FC = () => {
  const [keywords, setKeywords] = useState<string[]>(["React JS", "TypeScript", "Tailwind CSS"]);
  const [newKw, setNewKw] = useState("");
  const [operator, setOperator] = useState<"AND" | "OR">("AND");
  const [exactMatch, setExactMatch] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleAdd = () => {
    if (newKw.trim()) {
      setKeywords([...keywords, newKw.trim()]);
      setNewKw("");
    }
  };

  const handleRemove = (idx: number) => {
    setKeywords(keywords.filter((_, i) => i !== idx));
  };

  const query = keywords
    .map((k) => (exactMatch ? `"${k}"` : k))
    .join(` ${operator} `);

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-500" /> Boolean Query Combinator
          </h3>
          <p className="text-xs text-slate-400">Build complex AND/OR/NOT search strings for Google & recruiting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newKw}
              onChange={(e) => setNewKw(e.target.value)}
              placeholder="Add search term..."
              className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAdd}
              className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <button
                onClick={() => setOperator("AND")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                  operator === "AND" ? "bg-indigo-500 text-white" : "bg-slate-950 text-slate-400"
                }`}
              >
                AND
              </button>
              <button
                onClick={() => setOperator("OR")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                  operator === "OR" ? "bg-indigo-500 text-white" : "bg-slate-950 text-slate-400"
                }`}
              >
                OR
              </button>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={exactMatch}
                onChange={(e) => setExactMatch(e.target.checked)}
                className="accent-indigo-500 rounded"
              />
              Exact Quotes ("")
            </label>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pt-2">
            {keywords.map((kw, i) => (
              <div key={i} className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                <span className="font-mono text-white">{kw}</span>
                <button onClick={() => handleRemove(i)} className="text-slate-500 hover:text-rose-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-indigo-500/30 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
              Generated Search String
            </span>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 break-all min-h-[140px]">
              {query || "Add keywords to build query"}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? "Query Copied!" : "Copy Search String"}
          </button>
        </div>
      </div>
    </div>
  );
};
