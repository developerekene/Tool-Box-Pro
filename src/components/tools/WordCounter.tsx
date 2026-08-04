import React, { useState } from "react";
import { Type, Copy, Trash2, Check, FileText, Clock, Hash, AlignLeft } from "lucide-react";

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>(
    "ToolBox is a powerful suite of developer and productivity utilities. Convert your text, analyze document readability, calculate financial metrics, and streamline your workflow with speed and elegance."
  );
  const [copied, setCopied] = useState(false);

  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;

  // Reading time (approx 200 words per minute)
  const readingTimeMin = Math.ceil(words / 200);
  // Speaking time (approx 130 words per minute)
  const speakingTimeMin = Math.ceil(words / 130);

  // Top Keyword Density Analysis
  const getTopKeywords = () => {
    if (!text.trim()) return [];
    const stopWords = new Set(["the", "a", "an", "and", "or", "but", "is", "are", "of", "to", "in", "for", "with", "on", "at", "by", "from", "it", "this", "that", "your", "you", "a"]);
    const wordList = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

    const freqMap: Record<string, number> = {};
    wordList.forEach((w) => {
      freqMap[w] = (freqMap[w] || 0) + 1;
    });

    return Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / (words || 1)) * 100).toFixed(1),
      }));
  };

  const keywords = getTopKeywords();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const transformCase = (type: "upper" | "lower" | "title" | "sentence") => {
    if (type === "upper") setText(text.toUpperCase());
    if (type === "lower") setText(text.toLowerCase());
    if (type === "title")
      setText(
        text
          .toLowerCase()
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      );
    if (type === "sentence")
      setText(
        text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase())
      );
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Type className="w-5 h-5 text-emerald-500" /> Word & Text Metrics
          </h3>
          <p className="text-xs text-slate-400">Live text metrics, keyword density & case conversions</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg flex items-center gap-1.5 border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={() => setText("")}
            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-rose-500/20 transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Words", value: words, color: "text-emerald-400" },
          { label: "Characters", value: charCount, color: "text-blue-400" },
          { label: "No Spaces", value: charNoSpaces, color: "text-purple-400" },
          { label: "Sentences", value: sentences, color: "text-amber-400" },
          { label: "Paragraphs", value: paragraphs, color: "text-pink-400" },
          { label: "Reading Time", value: `~${readingTimeMin} min`, color: "text-cyan-400" },
        ].map((m, i) => (
          <div key={i} className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{m.label}</span>
            <span className={`text-xl font-extrabold font-mono ${m.color}`}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* Text Area & Case Converters */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Text Canvas</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "UPPERCASE", type: "upper" },
              { label: "lowercase", type: "lower" },
              { label: "Title Case", type: "title" },
              { label: "Sentence case", type: "sentence" },
            ].map((c) => (
              <button
                key={c.type}
                onClick={() => transformCase(c.type as any)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 rounded-lg border border-slate-700/60 transition"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text here to analyze..."
          rows={7}
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
        />
      </div>

      {/* Top Keyword Density */}
      {keywords.length > 0 && (
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Hash className="w-4 h-4 text-emerald-400" /> Top Keyword Density
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {keywords.map((kw, i) => (
              <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-center space-y-1">
                <p className="text-xs font-bold text-white truncate">{kw.word}</p>
                <div className="flex justify-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>{kw.count}x</span>
                  <span>({kw.percent}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
