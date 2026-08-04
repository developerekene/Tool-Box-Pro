import React, { useState, useRef } from "react";
import { Crop, RotateCw, ZoomIn, ZoomOut, Download, Upload, RefreshCw, FlipHorizontal, FlipVertical } from "lucide-react";

export const CropTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
  );
  const [aspectRatio, setAspectRatio] = useState<number | null>(1); // 1 = 1:1, 1.333 = 4:3, 1.777 = 16:9, null = Free
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCrop = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let cropWidth = img.width * (1 / zoom);
      let cropHeight = img.height * (1 / zoom);

      if (aspectRatio) {
        if (cropWidth / cropHeight > aspectRatio) {
          cropWidth = cropHeight * aspectRatio;
        } else {
          cropHeight = cropWidth / aspectRatio;
        }
      }

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      const sourceX = (img.width - cropWidth) / 2;
      const sourceY = (img.height - cropHeight) / 2;

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        cropWidth,
        cropHeight,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );
      ctx.restore();

      const dataUrl = canvas.toDataURL("image/png");
      setCroppedImage(dataUrl);
    };
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Crop className="w-5 h-5 text-pink-500" /> Image Crop Tool
          </h3>
          <p className="text-xs text-slate-400">Crop, rotate, flip & adjust resolution</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg flex items-center gap-1.5 border border-slate-700 transition"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Controls Panel */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Free", value: null },
                { label: "1:1", value: 1 },
                { label: "4:3", value: 4 / 3 },
                { label: "16:9", value: 16 / 9 },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setAspectRatio(opt.value)}
                  className={`py-2 text-xs font-medium rounded-lg border transition ${
                    aspectRatio === opt.value
                      ? "bg-pink-500/20 border-pink-500 text-pink-400"
                      : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Rotation & Flip
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5 text-pink-400" /> Rotate 90° ({rotation}°)
              </button>
              <button
                onClick={() => setFlipH((f) => !f)}
                className={`p-2 border rounded-lg ${
                  flipH ? "bg-pink-500/20 border-pink-500 text-pink-400" : "bg-slate-800 border-slate-700 text-slate-300"
                }`}
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFlipV((f) => !f)}
                className={`p-2 border rounded-lg ${
                  flipV ? "bg-pink-500/20 border-pink-500 text-pink-400" : "bg-slate-800 border-slate-700 text-slate-300"
                }`}
                title="Flip Vertical"
              >
                <FlipVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Zoom Level</label>
              <span className="text-xs font-mono text-pink-400">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-pink-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleApplyCrop}
              className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition"
            >
              <Crop className="w-4 h-4" /> Apply Crop
            </button>
          </div>
        </div>

        {/* Image Preview Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[300px] overflow-hidden relative">
            {imageSrc ? (
              <div
                className="relative overflow-hidden max-h-[360px] flex items-center justify-center rounded-lg border border-slate-700/50"
                style={{
                  transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1}) scale(${zoom})`,
                  transition: "transform 0.2s ease-out",
                }}
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Original Canvas"
                  className="max-h-[340px] w-auto object-contain rounded-lg"
                />
              </div>
            ) : (
              <p className="text-sm text-slate-500">No image loaded</p>
            )}
          </div>

          {croppedImage && (
            <div className="bg-slate-900/90 p-4 rounded-xl border border-pink-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">Cropped Result</span>
                <a
                  href={croppedImage}
                  download="cropped_image.png"
                  className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download PNG
                </a>
              </div>
              <div className="flex justify-center p-2 bg-slate-950 rounded-lg">
                <img src={croppedImage} alt="Cropped preview" className="max-h-48 rounded object-contain" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
