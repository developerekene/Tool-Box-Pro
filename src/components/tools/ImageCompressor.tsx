import React, { useState, useRef } from "react";
import { Minimize2, Upload, Download, RefreshCw, FileImage } from "lucide-react";

export const ImageCompressor: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80"
  );
  const [originalSize, setOriginalSize] = useState<number>(850 * 1024); // ~850 KB
  const [compressedSrc, setCompressedSrc] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(70); // 10 - 100
  const [maxWidth, setMaxWidth] = useState<number>(1200);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCompressedSrc(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompress = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let w = img.width;
      let h = img.height;

      if (w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      const dataUrl = canvas.toDataURL("image/jpeg", quality / 100);
      setCompressedSrc(dataUrl);

      // Estimate compressed size in bytes from base64 length
      const head = "data:image/jpeg;base64,";
      const sizeInBytes = Math.round(((dataUrl.length - head.length) * 3) / 4);
      setCompressedSize(sizeInBytes);
    };
  };

  const formatKB = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  const savingsPercent = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Minimize2 className="w-5 h-5 text-indigo-500" /> Image Size Compressor
          </h3>
          <p className="text-xs text-slate-400">Optimize image file size without sacrificing visual quality</p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-indigo-500/20"
        >
          <Upload className="w-4 h-4" /> Upload Image
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quality Controls */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Compression Quality
              </label>
              <span className="text-xs font-mono font-bold text-indigo-400">{quality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Max Width Scale (px)
            </label>
            <select
              value={maxWidth}
              onChange={(e) => setMaxWidth(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={800}>800px (Web)</option>
              <option value={1200}>1200px (HD Standard)</option>
              <option value={1920}>1920px (Full HD)</option>
              <option value={3840}>3840px (Original)</option>
            </select>
          </div>

          <button
            onClick={handleCompress}
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition"
          >
            <RefreshCw className="w-4 h-4" /> Compress Image
          </button>
        </div>

        {/* Compression Comparison */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Original Size</span>
              <div className="text-lg font-extrabold font-mono text-white">{formatKB(originalSize)}</div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-indigo-500/30 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Compressed Size</span>
              <div className="text-lg font-extrabold font-mono text-indigo-400">
                {compressedSize > 0 ? formatKB(compressedSize) : "Pending"}
              </div>
              {savingsPercent > 0 && (
                <span className="text-[10px] font-bold text-emerald-400">Saved {savingsPercent}%</span>
              )}
            </div>
          </div>

          {compressedSrc && (
            <div className="bg-slate-900/90 p-4 rounded-xl border border-indigo-500/30 space-y-3 text-center">
              <div className="flex justify-center p-2 bg-slate-950 rounded-lg">
                <img src={compressedSrc} alt="Compressed" className="max-h-56 rounded object-contain" />
              </div>

              <a
                href={compressedSrc}
                download="compressed_image.jpg"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                <Download className="w-4 h-4" /> Download Compressed Image
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
