import React, { useState } from "react";
import { Code2, Copy, Check, ArrowRightLeft, ShieldCheck, Binary } from "lucide-react";

export const EncoderDecoder: React.FC = () => {
  const [inputText, setInputText] = useState("Hello ToolBox Developer!");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [algorithm, setAlgorithm] = useState<"base64" | "url" | "html" | "hex" | "binary" | "rot13">("base64");
  const [copied, setCopied] = useState(false);

  const processText = () => {
    if (!inputText) return "";
    try {
      if (algorithm === "base64") {
        return mode === "encode" ? btoa(inputText) : atob(inputText);
      }
      if (algorithm === "url") {
        return mode === "encode" ? encodeURIComponent(inputText) : decodeURIComponent(inputText);
      }
      if (algorithm === "html") {
        if (mode === "encode") {
          return inputText.replace(/[\u00A0-\u9999<>&]/g, (i) => `&#${i.charCodeAt(0)};`);
        } else {
          const doc = new DOMParser().parseFromString(inputText, "text/html");
          return doc.documentElement.textContent || "";
        }
      }
      if (algorithm === "hex") {
        if (mode === "encode") {
          return Array.from(inputText)
            .map((c: string) => c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join(" ");
        } else {
          return inputText
            .split(" ")
            .map((h) => String.fromCharCode(parseInt(h, 16)))
            .join("");
        }
      }
      if (algorithm === "binary") {
        if (mode === "encode") {
          return Array.from(inputText)
            .map((c: string) => c.charCodeAt(0).toString(2).padStart(8, "0"))
            .join(" ");
        } else {
          return inputText
            .split(" ")
            .map((b) => String.fromCharCode(parseInt(b, 2)))
            .join("");
        }
      }
      if (algorithm === "rot13") {
        return inputText.replace(/[a-zA-Z]/g, (c) =>
          String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
        );
      }
      return "";
    } catch {
      return "Invalid payload format for decoding";
    }
  };

  const outputText = processText();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-sky-500" /> Encoder / Decoder Studio
          </h3>
          <p className="text-xs text-slate-400">Base64, URL, HTML, Hex, Binary & ROT13 text manipulation</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode("encode")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              mode === "encode" ? "bg-sky-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              mode === "decode" ? "bg-sky-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings & Input */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Algorithm / Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "base64", label: "Base64" },
                { id: "url", label: "URL Encode" },
                { id: "html", label: "HTML Entities" },
                { id: "hex", label: "Hexadecimal" },
                { id: "binary", label: "Binary" },
                { id: "rot13", label: "ROT13" },
              ].map((alg) => (
                <button
                  key={alg.id}
                  onClick={() => setAlgorithm(alg.id as any)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    algorithm === alg.id
                      ? "bg-sky-500/20 border-sky-500 text-sky-400"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {alg.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Input String
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
              placeholder="Enter text to encode or decode..."
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Output */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-sky-500/30 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Processed Output</span>
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 border border-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm font-mono text-sky-300 break-all min-h-[160px] whitespace-pre-wrap">
              {outputText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
