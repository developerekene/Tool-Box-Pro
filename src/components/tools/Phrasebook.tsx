import React, { useState } from "react";
import { Languages, Volume2, Search, Bookmark, Copy, Check } from "lucide-react";

interface Phrase {
  category: "Greetings" | "Travel" | "Dining" | "Emergency";
  english: string;
  spanish: string;
  french: string;
  german: string;
}

const PHRASES: Phrase[] = [
  { category: "Greetings", english: "Hello, how are you?", spanish: "¡Hola, ¿cómo estás?", french: "Bonjour, comment allez-vous ?", german: "Hallo, wie geht es dir?" },
  { category: "Greetings", english: "Nice to meet you", spanish: "Mucho gusto", french: "Enchanté", german: "Schön Sie kennenzulernen" },
  { category: "Travel", english: "Where is the train station?", spanish: "¿Dónde está la estación de trenes?", french: "Où est la gare ?", german: "Wo ist der Bahnhof?" },
  { category: "Dining", english: "Check, please", spanish: "La cuenta, por favor", french: "L'addition, s'il vous plaît", german: "Die Rechnung, bitte" },
  { category: "Emergency", english: "I need help!", spanish: "¡Necesito ayuda!", french: "J'ai besoin d'aide !", german: "Ich brauche Hilfe!" },
];

export const Phrasebook: React.FC = () => {
  const [targetLang, setTargetLang] = useState<"spanish" | "french" | "german">("spanish");
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const filtered = PHRASES.filter((p) => {
    const matchCat = selectedCat === "All" || p.category === selectedCat;
    const matchQuery = p.english.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Languages className="w-5 h-5 text-sky-500" /> Multi-Language Travel Phrasebook
          </h3>
          <p className="text-xs text-slate-400">Essential conversational phrases for international travellers</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(["spanish", "french", "german"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setTargetLang(lang)}
              className={`px-3 py-1 text-xs font-bold capitalize rounded-lg transition ${
                targetLang === lang ? "bg-sky-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-1">
            {["All", "Greetings", "Travel", "Dining", "Emergency"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                  selectedCat === cat
                    ? "bg-sky-500/20 border-sky-500 text-sky-400"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search phrase..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {filtered.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">{item.category}</span>
              </div>
              <p className="text-xs text-slate-400">{item.english}</p>
              <p className="text-sm font-bold text-white">{item[targetLang]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
