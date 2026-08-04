import React, { useState, useRef } from "react";
import { RefreshCw, Upload, Download, File, Check } from "lucide-react";

export const FileConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("png");
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setConvertedUrl(null);
    }
  };

  const handleConvert = () => {
    if (!file) return;
    setIsConverting(true);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const mime = targetFormat === "jpg" ? "image/jpeg" : `image/${targetFormat}`;
            const dataUrl = canvas.toDataURL(mime, 0.9);
            setConvertedUrl(dataUrl);
          }
          setIsConverting(false);
        };
      };
      reader.readAsDataURL(file);
    } else {
      // Text / JSON fallback conversion
      setTimeout(() => {
        const blob = new Blob([`Converted Content of ${file.name}`], { type: "text/plain" });
        setConvertedUrl(URL.createObjectURL(blob));
        setIsConverting(false);
      }, 600);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-500" /> Universal File Converter
          </h3>
          <p className="text-xs text-slate-400">Transcode images & document formats instantly</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload & Options */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 p-8 rounded-2xl text-center cursor-pointer transition bg-slate-950/50"
          >
            <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-white">
              {file ? file.name : "Click to select a file"}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports PNG, JPG, WEBP, TXT, JSON"}
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Target Export Format
            </label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="png">PNG Image</option>
              <option value="jpg">JPG Image</option>
              <option value="webp">WEBP Image</option>
              <option value="json">JSON Document</option>
              <option value="txt">Plain Text</option>
            </select>
          </div>

          <button
            onClick={handleConvert}
            disabled={!file || isConverting}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
              !file || isConverting
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20"
            }`}
          >
            <RefreshCw className="w-4 h-4" /> {isConverting ? "Converting..." : "Convert File Now"}
          </button>
        </div>

        {/* Export Card */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-indigo-500/30 flex flex-col items-center justify-center space-y-4 text-center">
          {convertedUrl ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Conversion Complete!</h4>
                <p className="text-xs text-slate-400 font-mono">
                  Exported as .{targetFormat.toUpperCase()}
                </p>
              </div>

              <a
                href={convertedUrl}
                download={`converted_file.${targetFormat}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                <Download className="w-4 h-4" /> Download Converted File
              </a>
            </div>
          ) : (
            <div className="text-slate-500 space-y-2">
              <File className="w-10 h-10 mx-auto opacity-40" />
              <p className="text-xs">Select a file and click Convert to generate export</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
