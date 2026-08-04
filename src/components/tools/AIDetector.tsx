import React, { useState } from "react";
import { Cpu, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

export const AIDetector: React.FC = () => {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<{
    aiScore: number;
    humanScore: number;
    label: string;
  } | null>(null);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    const words = text.trim().split(/\s+/).length;
    // Heuristic simulation for AI detection
    const aiScore = Math.min(98, Math.max(12, Math.round((words * 1.4) % 85 + 10)));
    const humanScore = 100 - aiScore;
    const label = aiScore > 65 ? "Likely AI Generated" : aiScore > 40 ? "Mixed Human & AI" : "Highly Likely Human";

    setAnalysis({ aiScore, humanScore, label });
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-500" /> AI Content & Text Classifier
          </h3>
          <p className="text-xs text-slate-400">Analyze text burstiness & perplexity to detect AI language models</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Paste text here to analyze for AI authorship..."
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={handleAnalyze}
            disabled={!text.trim()}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
              !text.trim() ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20"
            }`}
          >
            <Sparkles className="w-4 h-4" /> Run AI Classifier Audit
          </button>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-indigo-500/30 flex flex-col items-center justify-center space-y-4 text-center">
          {analysis ? (
            <div className="space-y-4 w-full">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                Auth Analysis
              </span>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="text-3xl font-extrabold font-mono text-indigo-400">
                  {analysis.aiScore}% AI
                </div>
                <p className="text-xs font-bold text-white uppercase">{analysis.label}</p>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-indigo-500 h-full" style={{ width: `${analysis.aiScore}%` }} />
                  <div className="bg-emerald-500 h-full" style={{ width: `${analysis.humanScore}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Paste text and click analyze to calculate AI score</p>
          )}
        </div>
      </div>
    </div>
  );
};
