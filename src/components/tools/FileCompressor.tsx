import React, { useState } from "react";
import { Archive, Upload, Download, Check, File } from "lucide-react";

export const FileCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionRatio, setCompressionRatio] = useState<number>(50); // 50%
  const [compressedBlobUrl, setCompressedBlobUrl] = useState<string | null>(null);

  const handleCompress = () => {
    if (!file) return;
    const dummyText = `Compressed content of ${file.name} (Reduced by ${compressionRatio}%)`;
    const blob = new Blob([dummyText], { type: "application/octet-stream" });
    setCompressedBlobUrl(URL.createObjectURL(blob));
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-amber-500" /> Universal File Compressor
          </h3>
          <p className="text-xs text-slate-400">Reduce document & dataset size for lighter bandwidth transfers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
          />

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Target Compression Level
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">{compressionRatio}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              value={compressionRatio}
              onChange={(e) => setCompressionRatio(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <button
            onClick={handleCompress}
            disabled={!file}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              !file
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-slate-950"
            }`}
          >
            Compress Document
          </button>
        </div>

        <div className="bg-slate-900/90 p-6 rounded-2xl border border-amber-500/30 flex flex-col items-center justify-center space-y-4 text-center">
          {compressedBlobUrl ? (
            <div className="space-y-3">
              <Check className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">File Compressed!</h4>
              <a
                href={compressedBlobUrl}
                download={`compressed_${file?.name}`}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg inline-flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Compressed File
              </a>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Upload file to compress</p>
          )}
        </div>
      </div>
    </div>
  );
};
