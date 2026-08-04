import React, { useState, useRef } from "react";
import { Scissors, Upload, Download, Sparkles, Image as ImageIcon } from "lucide-react";

export const BackgroundRemover: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
  );
  const [bgColor, setBgColor] = useState<string>("transparent"); // transparent, #10B981, #3B82F6, #FFFFFF, #000000
  const [tolerance, setTolerance] = useState<number>(30);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setProcessedUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample top-left corner color as background key
      const rKey = data[0];
      const gKey = data[1];
      const bKey = data[2];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dist = Math.sqrt((r - rKey) ** 2 + (g - gKey) ** 2 + (b - bKey) ** 2);

        if (dist < tolerance * 2) {
          if (bgColor === "transparent") {
            data[i + 3] = 0; // Transparent
          } else {
            // Apply solid color hex
            const hex = bgColor.replace("#", "");
            data[i] = parseInt(hex.substring(0, 2), 16) || 255;
            data[i + 1] = parseInt(hex.substring(2, 4), 16) || 255;
            data[i + 2] = parseInt(hex.substring(4, 6), 16) || 255;
            data[i + 3] = 255;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setProcessedUrl(canvas.toDataURL("image/png"));
      setIsProcessing(false);
    };
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Scissors className="w-5 h-5 text-emerald-500" /> AI Background Eraser
          </h3>
          <p className="text-xs text-slate-400">Isolate subjects, strip background & apply custom studio backdrops</p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
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
        {/* Controls */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Threshold Sensitivity
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400">{tolerance}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              New Background Backdrop
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "transparent", label: "Alpha" },
                { id: "#FFFFFF", label: "White" },
                { id: "#10B981", label: "Green" },
                { id: "#3B82F6", label: "Blue" },
              ].map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBgColor(bg.id)}
                  className={`py-2 text-[11px] font-bold rounded-lg border transition ${
                    bgColor === bg.id
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRemoveBackground}
            disabled={isProcessing}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <Sparkles className="w-4 h-4" /> {isProcessing ? "Processing..." : "Remove Background"}
          </button>
        </div>

        {/* Display Canvas */}
        <div className="md:col-span-2 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
          <div className="w-full max-h-[320px] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
            <img
              src={processedUrl || imageSrc || ""}
              alt="Preview"
              className="max-h-[280px] object-contain rounded"
            />
          </div>

          {processedUrl && (
            <a
              href={processedUrl}
              download="isolated_subject.png"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition"
            >
              <Download className="w-4 h-4" /> Download Isolated PNG
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
