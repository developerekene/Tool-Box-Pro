import React, { useState } from "react";
import { Sparkles, Search, Download, Copy, Check, BarChart2 } from "lucide-react";

interface KeywordIdea {
  keyword: string;
  volume: string;
  difficulty: "Low" | "Medium" | "High";
  cpc: string;
}

export const KeywordGenerator: React.FC = () => {
  const [topic, setTopic] = useState("productivity tools");
  const [results, setResults] = useState<KeywordIdea[]>([]);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    const base = topic.trim().toLowerCase();
    const generated: KeywordIdea[] = [
      { keyword: `best ${base} 2026`, volume: "18.2K", difficulty: "Medium", cpc: "$2.40" },
      { keyword: `free ${base} for students`, volume: "12.5K", difficulty: "Low", cpc: "$0.85" },
      { keyword: `top rated ${base} app`, volume: "9.4K", difficulty: "High", cpc: "$4.10" },
      { keyword: `how to use ${base}`, volume: "24.1K", difficulty: "Low", cpc: "$1.15" },
      { keyword: `${base} vs alternatives`, volume: "6.8K", difficulty: "Medium", cpc: "$3.50" },
      { keyword: `open source ${base}`, volume: "8.1K", difficulty: "Low", cpc: "$0.95" },
    ];
    setResults(generated);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" /> SEO Keyword Generator
          </h3>
          <p className="text-xs text-slate-400">Long-tail search queries, estimated monthly volume & keyword difficulty</p>
        </div>
      </div>

      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter seed topic or keyword..."
            className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleGenerate}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-indigo-500/20"
          >
            <Search className="w-4 h-4" /> Generate Keywords
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
              Keyword Suggestions ({results.length})
            </span>

            <div className="divide-y divide-slate-800/80 font-mono text-xs">
              {results.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <span className="text-white font-bold">{item.keyword}</span>
                  <div className="flex items-center gap-4 text-slate-400">
                    <span>Vol: {item.volume}</span>
                    <span className={item.difficulty === "Low" ? "text-emerald-400" : item.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"}>
                      Diff: {item.difficulty}
                    </span>
                    <span className="text-slate-300">CPC: {item.cpc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
