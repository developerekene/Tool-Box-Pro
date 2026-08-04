import React, { useState, useRef } from "react";
import { QrCode, Upload, ExternalLink, Copy, Check } from "lucide-react";

export const QRScanner: React.FC = () => {
  const [scannedResult, setScannedResult] = useState<string | null>("https://toolbox.app/welcome");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate scan decoding
      setScannedResult(`https://toolbox.app/scanned-${file.name.replace(/\.[^/.]+$/, "")}`);
    }
  };

  const handleCopy = () => {
    if (scannedResult) {
      navigator.clipboard.writeText(scannedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-500" /> QR Code Scanner & Reader
          </h3>
          <p className="text-xs text-slate-400">Scan QR codes from image files or camera stream</p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-1.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-purple-500/20"
        >
          <Upload className="w-4 h-4" /> Upload QR Image
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4 text-center">
        {scannedResult ? (
          <div className="p-6 bg-slate-950 rounded-2xl border border-purple-500/30 max-w-lg mx-auto space-y-3">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
              Decoded Content
            </span>
            <div className="p-3 bg-slate-900 rounded-xl font-mono text-sm text-white break-all">
              {scannedResult}
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 text-slate-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy Payload"}
              </button>

              {scannedResult.startsWith("http") && (
                <a
                  href={scannedResult}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-xs font-bold rounded-xl flex items-center gap-1.5 text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Visit Link
                </a>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">Upload a QR code image to reveal payload</p>
        )}
      </div>
    </div>
  );
};
