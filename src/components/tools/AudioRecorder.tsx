import React, { useState, useRef } from "react";
import { Mic, Square, Play, Pause, Download, Radio } from "lucide-react";

export const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Mic className="w-5 h-5 text-rose-500" /> Voice & Audio Dictation Recorder
          </h3>
          <p className="text-xs text-slate-400">Capture voice memos & download high-clarity WebM/WAV audio</p>
        </div>
      </div>

      <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 text-center space-y-6 max-w-lg mx-auto">
        <div className="flex justify-center">
          <div className={`p-6 rounded-full border transition-all ${isRecording ? "bg-rose-500/20 border-rose-500 animate-pulse" : "bg-slate-950 border-slate-800"}`}>
            <Mic className={`w-12 h-12 ${isRecording ? "text-rose-500" : "text-slate-400"}`} />
          </div>
        </div>

        <div>
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 mx-auto shadow-lg shadow-rose-500/20"
            >
              <Square className="w-4 h-4 fill-current" /> Stop Recording
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 mx-auto shadow-lg shadow-rose-500/20"
            >
              <Radio className="w-4 h-4" /> Start Microphone Recording
            </button>
          )}
        </div>

        {audioUrl && (
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <audio src={audioUrl} controls className="w-full h-10" />
            <a
              href={audioUrl}
              download="recording.webm"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              <Download className="w-4 h-4" /> Download Audio File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
