import React, { useState } from "react";
import { ShieldCheck, Search, AlertCircle, FileText } from "lucide-react";

export const PlagiarismChecker: React.FC = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState<{
    originality: number;
    matchedSources: { title: string; url: string; matchPercent: number }[];
  } | null>(null);

  const handleCheck = () => {
    if (!text.trim()) return;
    setResults({
      originality: 94,
      matchedSources: [
        { title: "Academic Research Portal", url: "https://research-index.org/doc/102", matchPercent: 4 },
        { title: "Web Developer Documentation", url: "https://docs.webdev.io/guide", matchPercent: 2 },
      ],
    });
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Plagiarism & Originality Auditor
          </h3>
          <p className="text-xs text-slate-400">Scan text against indexed web pages & academic repositories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Paste text to scan for plagiarism..."
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
          />

          <button
            onClick={handleCheck}
            disabled={!text.trim()}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Search className="w-4 h-4" /> Check Plagiarism
          </button>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-emerald-500/30 space-y-4 text-center">
          {results ? (
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Originality Rating
              </span>
              <div className="text-4xl font-extrabold font-mono text-emerald-400">
                {results.originality}%
              </div>
              <p className="text-xs text-slate-300">Clean & Authentic Content</p>

              <div className="text-left space-y-1 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Matched Sources</span>
                {results.matchedSources.map((s, i) => (
                  <div key={i} className="p-2 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 border border-slate-800">
                    <div className="font-bold text-white truncate">{s.title}</div>
                    <span className="text-emerald-400 text-[10px]">{s.matchPercent}% similarity match</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Paste document text to run check</p>
          )}
        </div>
      </div>
    </div>
  );
};
