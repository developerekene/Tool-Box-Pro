import React, { useState, useEffect } from "react";
import { Clock, Bell, Timer, Play, Pause, RotateCcw, Plus, Flag, Globe } from "lucide-react";

export const TimeAlert: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"world" | "alarm" | "stopwatch" | "timer">("world");

  // World Clock
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch state
  const [swTime, setSwTime] = useState<number>(0);
  const [swRunning, setSwRunning] = useState<boolean>(false);
  const [swLaps, setSwLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (swRunning) {
      interval = setInterval(() => setSwTime((t) => t + 10), 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [swRunning]);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 mins
  const [timerRemaining, setTimerRemaining] = useState<number>(300);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerRemaining > 0) {
      interval = setInterval(() => setTimerRemaining((t) => t - 1), 1000);
    } else if (timerRemaining === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerRemaining]);

  const formatMS = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}`;
  };

  const formatSec = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" /> Time Alert & World Clock
          </h3>
          <p className="text-xs text-slate-400">World timezones, alarms, lap stopwatch & countdown timers</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: "world", label: "World Clock", icon: Globe },
            { id: "stopwatch", label: "Stopwatch", icon: Timer },
            { id: "timer", label: "Timer", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* World Clock Tab */}
      {activeTab === "world" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { city: "London (GMT/UTC)", tz: "UTC", flag: "🇬🇧" },
            { city: "New York (EST)", tz: "America/New_York", flag: "🇺🇸" },
            { city: "Tokyo (JST)", tz: "Asia/Tokyo", flag: "🇯🇵" },
            { city: "Lagos (WAT)", tz: "Africa/Lagos", flag: "🇳🇬" },
          ].map((city, i) => {
            const timeStr = now.toLocaleTimeString("en-US", { timeZone: city.tz, hour: "2-digit", minute: "2-digit", second: "2-digit" });
            const dateStr = now.toLocaleDateString("en-US", { timeZone: city.tz, weekday: "short", month: "short", day: "numeric" });
            return (
              <div key={i} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center space-y-2 shadow-lg">
                <span className="text-2xl block">{city.flag}</span>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{city.city}</h4>
                <div className="text-2xl font-extrabold font-mono text-amber-400">{timeStr}</div>
                <p className="text-[11px] font-mono text-slate-500">{dateStr}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Stopwatch Tab */}
      {activeTab === "stopwatch" && (
        <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 space-y-6 text-center">
          <div className="text-6xl font-extrabold font-mono text-amber-400 my-4 tracking-wider">
            {formatMS(swTime)}
          </div>

          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => setSwRunning(!swRunning)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 flex items-center gap-2 shadow-lg transition ${
                swRunning ? "bg-amber-400 hover:bg-amber-500" : "bg-emerald-500 hover:bg-emerald-600 text-slate-950"
              }`}
            >
              {swRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {swRunning ? "Pause" : "Start"}
            </button>

            {swRunning && (
              <button
                onClick={() => setSwLaps([swTime, ...swLaps])}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
              >
                <Flag className="w-4 h-4 text-amber-400" /> Lap
              </button>
            )}

            <button
              onClick={() => {
                setSwRunning(false);
                setSwTime(0);
                setSwLaps([]);
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>

          {swLaps.length > 0 && (
            <div className="max-w-md mx-auto bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
                Lap Times ({swLaps.length})
              </span>
              <div className="max-h-40 overflow-y-auto space-y-1 text-xs font-mono">
                {swLaps.map((lap, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300 py-1 border-b border-slate-900">
                    <span className="text-amber-400 font-bold">Lap {swLaps.length - idx}</span>
                    <span>{formatMS(lap)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timer Tab */}
      {activeTab === "timer" && (
        <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 space-y-6 text-center max-w-lg mx-auto">
          <div className="text-6xl font-extrabold font-mono text-amber-400 my-4 tracking-wider">
            {formatSec(timerRemaining)}
          </div>

          <div className="flex justify-center items-center gap-3">
            {[60, 300, 600, 900, 1800].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setTimerSeconds(sec);
                  setTimerRemaining(sec);
                  setTimerRunning(false);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                  timerSeconds === sec
                    ? "bg-amber-500/20 border-amber-500 text-amber-400"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                {sec / 60}m
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {timerRunning ? "Pause" : "Start Countdown"}
            </button>
            <button
              onClick={() => {
                setTimerRunning(false);
                setTimerRemaining(timerSeconds);
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
