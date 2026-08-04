import React, { useState } from "react";
import { FileText, Camera, Download, Sparkles, Check } from "lucide-react";

export const PdfScanner: React.FC = () => {
  const [scannedPages, setScannedPages] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScannedPages((prev) => [...prev, `Scanned Page #${prev.length + 1}`]);
      setIsScanning(false);
    }, 800);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Digital Document Scanner
          </h3>
          <p className="text-xs text-slate-400">Capture pages, auto-crop borders & combine into PDF</p>
        </div>

        <button
          onClick={handleSimulateScan}
          disabled={isScanning}
          className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-indigo-500/20"
        >
          <Camera className="w-4 h-4" /> {isScanning ? "Scanning..." : "Scan New Page"}
        </button>
      </div>

      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Document Queue ({scannedPages.length} Pages)
        </span>

        {scannedPages.length === 0 ? (
          <div className="p-12 border-2 border-dashed border-slate-800 rounded-2xl text-center space-y-2 text-slate-500">
            <Camera className="w-8 h-8 mx-auto opacity-50" />
            <p className="text-xs">No pages captured yet. Click 'Scan New Page' to add pages.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {scannedPages.map((page, i) => (
              <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
                <FileText className="w-8 h-8 text-indigo-400 mx-auto" />
                <span className="text-xs font-bold text-white block">{page}</span>
              </div>
            ))}
          </div>
        )}

        {scannedPages.length > 0 && (
          <button
            onClick={() => alert("PDF document exported!")}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" /> Export Combined PDF Document
          </button>
        )}
      </div>
    </div>
  );
};
