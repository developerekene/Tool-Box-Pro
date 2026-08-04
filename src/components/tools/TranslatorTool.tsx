import React, { useState } from "react";
import { Languages, ArrowLeftRight, Copy, Check, Sparkles } from "lucide-react";

const TRANSLATIONS: Record<string, Record<string, string>> = {
  es: { "hello world": "hola mundo", "how are you": "cómo estás", "thank you": "gracias" },
  fr: { "hello world": "bonjour le monde", "how are you": "comment allez-vous", "thank you": "merci" },
  de: { "hello world": "hallo welt", "how are you": "wie geht es dir", "thank you": "danke" },
};

export const TranslatorTool: React.FC = () => {
  const [sourceText, setSourceText] = useState("Hello world");
  const [targetLang, setTargetLang] = useState<"es" | "fr" | "de">("es");
  const [copied, setCopied] = useState(false);

  const translate = () => {
    if (!sourceText.trim()) return "";
    const key = sourceText.toLowerCase().trim();
    if (TRANSLATIONS[targetLang]?.[key]) {
      return TRANSLATIONS[targetLang][key];
    }
    return `[${targetLang.toUpperCase()}]: ${sourceText}`;
  };

  const translatedText = translate();

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Languages className="w-5 h-5 text-sky-500" /> Multi-Language Translator
          </h3>
          <p className="text-xs text-slate-400">Instant cross-language text translation & localization</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: "es", label: "Spanish" },
            { id: "fr", label: "French" },
            { id: "de", label: "German" },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setTargetLang(lang.id as any)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                targetLang === lang.id ? "bg-sky-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            English Source Text
          </label>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={6}
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 font-sans"
            placeholder="Type text to translate..."
          />
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-sky-500/30 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Translation ({targetLang.toUpperCase()})
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm text-sky-300 font-sans min-h-[140px] capitalize">
              {translatedText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
