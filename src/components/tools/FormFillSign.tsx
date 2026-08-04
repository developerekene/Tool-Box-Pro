import React, { useState, useRef } from "react";
import { PenTool, Check, Download, RotateCcw, FileCheck } from "lucide-react";

export const FormFillSign: React.FC = () => {
  const [fullName, setFullName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane.doe@example.com");
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = "#8B5CF6";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignatureUrl(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureUrl(null);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <PenTool className="w-5 h-5 text-purple-500" /> Digital Form Fill & E-Sign
          </h3>
          <p className="text-xs text-slate-400">Complete agreement fields & draw legal digital signature</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          {/* Canvas Signature Pad */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Draw E-Signature</label>
              <button onClick={clearSignature} className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Clear Pad
              </button>
            </div>

            <canvas
              ref={canvasRef}
              width={320}
              height={120}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-28 bg-slate-950 border border-slate-800 rounded-xl cursor-crosshair"
            />
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between space-y-4">
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <FileCheck className="w-8 h-8 text-purple-400" />
            <h4 className="text-sm font-bold text-white">Signed Document Certificate</h4>
            <div className="text-xs font-mono text-slate-300 space-y-1">
              <div>Signer: <span className="text-white font-bold">{fullName}</span></div>
              <div>Email: <span className="text-slate-400">{email}</span></div>
              <div>Timestamp: <span className="text-purple-400">{new Date().toLocaleString()}</span></div>
            </div>

            {signatureUrl && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Signature Capture:</span>
                <img src={signatureUrl} alt="Signature" className="h-10 object-contain bg-slate-900 p-1 rounded border border-slate-800" />
              </div>
            )}
          </div>

          <button
            onClick={() => alert("Form and digital signature document exported!")}
            className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" /> Download Signed Form PDF
          </button>
        </div>
      </div>
    </div>
  );
};
