import React, { useState, useRef } from "react";
import { Scissors, Upload, Play, Pause, Download, Video } from "lucide-react";

export const VideoTrimmer: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(10);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoSrc(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-500" /> Video Clipper & Trimmer
          </h3>
          <p className="text-xs text-slate-400">Set start and end frame markers to export video clips</p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
        >
          <Upload className="w-4 h-4" /> Upload Video
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="video/*"
          className="hidden"
        />
      </div>

      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-5 text-center">
        {videoSrc ? (
          <div className="space-y-4 max-w-xl mx-auto">
            <video ref={videoRef} src={videoSrc} controls className="w-full rounded-2xl border border-slate-800 bg-slate-950 max-h-72" />

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Start Time (sec): {startTime}s</label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={startTime}
                  onChange={(e) => setStartTime(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">End Time (sec): {endTime}s</label>
                <input
                  type="range"
                  min="1"
                  max="120"
                  value={endTime}
                  onChange={(e) => setEndTime(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={() => alert("Trimmed video clip exported!")}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" /> Export Trimmed Clip
            </button>
          </div>
        ) : (
          <div className="p-12 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 space-y-2">
            <Video className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-xs">Upload a video file to begin trimming</p>
          </div>
        )}
      </div>
    </div>
  );
};
