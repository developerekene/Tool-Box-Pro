import React, { useState, useRef } from "react";
import { FileArchive, Upload, Download, Trash2, File, Check } from "lucide-react";
import JSZip from "jszip";

interface SelectedFile {
  file: File;
  id: string;
}

export const ZipCreator: React.FC = () => {
  const [fileList, setFileList] = useState<SelectedFile[]>([]);
  const [zipName, setZipName] = useState<string>("ToolBox_Archive");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files).map((f: File) => ({
        file: f,
        id: `${f.name}-${Date.now()}-${Math.random()}`,
      }));
      setFileList((prev) => [...prev, ...filesArr]);
    }
  };

  const handleRemove = (id: string) => {
    setFileList(fileList.filter((f) => f.id !== id));
  };

  const handleDownloadZip = async () => {
    if (fileList.length === 0) return;
    setIsGenerating(true);
    try {
      const zip = new JSZip();
      fileList.forEach((item) => {
        zip.file(item.file.name, item.file);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${zipName || "Archive"}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalBytes = fileList.reduce((acc, curr) => acc + curr.file.size, 0);

  const formatKB = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileArchive className="w-5 h-5 text-rose-500" /> Zip Archive Creator
          </h3>
          <p className="text-xs text-slate-400">Bundle multiple files into a compressed .zip archive</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-rose-500/20"
          >
            <Upload className="w-4 h-4" /> Add Files
          </button>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFilesAdded}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Selected Files List */}
        <div className="md:col-span-2 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Selected Files ({fileList.length})
            </span>
            <span className="text-xs font-mono font-bold text-rose-400">Total: {formatKB(totalBytes)}</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] pr-1">
            {fileList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-12">No files added yet. Click 'Add Files' above.</p>
            ) : (
              fileList.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <File className="w-4 h-4 text-rose-400 shrink-0" />
                    <div className="overflow-hidden">
                      <h5 className="text-xs font-bold text-white truncate">{item.file.name}</h5>
                      <span className="text-[10px] font-mono text-slate-400">{formatKB(item.file.size)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Export Zip Panel */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-rose-500/30 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Zip Archive Name
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={zipName}
                onChange={(e) => setZipName(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-rose-500"
              />
              <span className="text-xs font-mono text-slate-400 font-bold">.zip</span>
            </div>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={fileList.length === 0 || isGenerating}
            className={`w-full py-3 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-2 shadow-lg transition ${
              fileList.length === 0 || isGenerating
                ? "bg-slate-800 opacity-50 cursor-not-allowed"
                : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
            }`}
          >
            <Download className="w-4 h-4" /> {isGenerating ? "Compressing..." : "Download Zip Archive"}
          </button>
        </div>
      </div>
    </div>
  );
};
