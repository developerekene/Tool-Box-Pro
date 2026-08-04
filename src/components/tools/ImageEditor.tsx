import React, { useState, useRef } from "react";
import { Sliders, RotateCw, Download, Upload, Image as ImageIcon, Sparkles } from "lucide-react";

export const ImageEditor: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>(
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
  );
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [filter, setFilter] = useState<"none" | "grayscale" | "sepia" | "invert">("none");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) ${
      filter === "grayscale" ? "grayscale(100%)" : filter === "sepia" ? "sepia(100%)" : filter === "invert" ? "invert(100%)" : ""
    }`,
    transform: `rotate(${rotation}deg)`,
  };

  const handleDownload = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${
          filter === "grayscale" ? "grayscale(100%)" : filter === "sepia" ? "sepia(100%)" : filter === "invert" ? "invert(100%)" : ""
        }`;
        ctx.drawImage(img, 0, 0);
        const url = canvas.toDataURL("image/jpeg");
        const a = document.createElement("a");
        a.href = url;
        a.download = "edited_image.jpg";
        a.click();
      }
    };
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-500" /> Photo & Image Studio
          </h3>
          <p className="text-xs text-slate-400">Brightness, contrast, rotation & creative filter adjustments</p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
        >
          <Upload className="w-4 h-4" /> Change Image
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => setImageSrc(reader.result as string);
              reader.readAsDataURL(file);
            }
          }}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sliders */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-semibold uppercase">Brightness</span>
              <span className="text-indigo-400 font-mono font-bold">{brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-semibold uppercase">Contrast</span>
              <span className="text-indigo-400 font-mono font-bold">{contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Color Filter
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["none", "grayscale", "sepia", "invert"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`py-1.5 text-xs font-bold rounded-lg border capitalize transition ${
                    filter === f
                      ? "bg-indigo-500/20 border-indigo-500 text-indigo-400"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
            >
              <RotateCw className="w-4 h-4 text-indigo-400" /> Rotate 90°
            </button>
          </div>
        </div>

        {/* Preview Canvas */}
        <div className="md:col-span-2 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
          <div className="w-full max-h-[300px] bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
            <img src={imageSrc} alt="Preview" style={filterStyle} className="max-h-[260px] object-contain transition-all" />
          </div>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition"
          >
            <Download className="w-4 h-4" /> Download Edited Photo
          </button>
        </div>
      </div>
    </div>
  );
};
