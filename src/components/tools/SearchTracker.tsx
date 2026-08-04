import React, { useState } from "react";
import { Search, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Trash2 } from "lucide-react";

interface TrackedItem {
  id: string;
  keyword: string;
  rank: number;
  change: number;
  domain: string;
}

export const SearchTracker: React.FC = () => {
  const [items, setItems] = useState<TrackedItem[]>([
    { id: "1", keyword: "ToolBox React JS", rank: 3, change: 2, domain: "toolbox.app" },
    { id: "2", keyword: "Free Online Tools Hub", rank: 1, change: 0, domain: "toolbox.app" },
    { id: "3", keyword: "Scientific Calculator Web", rank: 7, change: -1, domain: "toolbox.app" },
  ]);
  const [newKeyword, setNewKeyword] = useState("");

  const handleAdd = () => {
    if (!newKeyword.trim()) return;
    const newItem: TrackedItem = {
      id: Date.now().toString(),
      keyword: newKeyword.trim(),
      rank: Math.floor(Math.random() * 15) + 1,
      change: Math.floor(Math.random() * 5) - 2,
      domain: "toolbox.app",
    };
    setItems([...items, newItem]);
    setNewKeyword("");
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-500" /> Search Rank & Keyword Tracker
          </h3>
          <p className="text-xs text-slate-400">Monitor Google SERP positions, rank velocity & keyword rankings</p>
        </div>
      </div>

      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Enter target keyword to track..."
            className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 transition shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" /> Track Keyword
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between font-mono text-xs">
              <div>
                <h4 className="text-sm font-bold text-white font-sans">{item.keyword}</h4>
                <span className="text-[10px] text-slate-500">{item.domain}</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Rank</span>
                  <span className="text-base font-bold text-emerald-400">#{item.rank}</span>
                </div>

                <div className="text-center min-w-[60px]">
                  <span className="text-[10px] text-slate-400 block uppercase">Change</span>
                  <span className={`font-bold flex items-center justify-center ${item.change > 0 ? "text-emerald-400" : item.change < 0 ? "text-rose-400" : "text-slate-400"}`}>
                    {item.change > 0 ? `+${item.change}` : item.change}
                  </span>
                </div>

                <button onClick={() => setItems(items.filter((i) => i.id !== item.id))} className="text-slate-500 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
