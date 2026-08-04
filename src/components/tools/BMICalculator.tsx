import React, { useState } from "react";
import { Activity, Heart, Info, Scale, ArrowRight } from "lucide-react";

export const BMICalculator: React.FC = () => {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState<number>(175); // cm or inches
  const [weight, setWeight] = useState<number>(70); // kg or lbs
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<"male" | "female">("male");

  const calculateBMI = () => {
    if (unit === "metric") {
      const heightInMeters = height / 100;
      if (heightInMeters <= 0) return 0;
      return weight / (heightInMeters * heightInMeters);
    } else {
      if (height <= 0) return 0;
      return (weight / (height * height)) * 703;
    }
  };

  const bmi = calculateBMI();

  const getCategory = (val: number) => {
    if (val < 18.5) return { label: "Underweight", color: "text-sky-400", bg: "bg-sky-500", border: "border-sky-500" };
    if (val < 25) return { label: "Normal Weight", color: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500" };
    if (val < 30) return { label: "Overweight", color: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500" };
    return { label: "Obese", color: "text-rose-400", bg: "bg-rose-500", border: "border-rose-500" };
  };

  const category = getCategory(bmi);

  const getIdealWeight = () => {
    if (unit === "metric") {
      const hM = height / 100;
      const minW = Math.round(18.5 * hM * hM);
      const maxW = Math.round(24.9 * hM * hM);
      return `${minW} kg - ${maxW} kg`;
    } else {
      const minW = Math.round((18.5 * height * height) / 703);
      const maxW = Math.round((24.9 * height * height) / 703);
      return `${minW} lbs - ${maxW} lbs`;
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" /> BMI Health Calculator
          </h3>
          <p className="text-xs text-slate-400">Track body composition & ideal healthy weight range</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setUnit("metric");
              setHeight(175);
              setWeight(70);
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              unit === "metric" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Metric (kg/cm)
          </button>
          <button
            onClick={() => {
              setUnit("imperial");
              setHeight(68);
              setWeight(150);
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              unit === "imperial" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Imperial (lbs/in)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGender("male")}
              className={`p-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition ${
                gender === "male"
                  ? "bg-amber-500/20 border-amber-500 text-amber-400"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
              }`}
            >
              👨 Male
            </button>
            <button
              onClick={() => setGender("female")}
              className={`p-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition ${
                gender === "female"
                  ? "bg-amber-500/20 border-amber-500 text-amber-400"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
              }`}
            >
              👩 Female
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Height ({unit === "metric" ? "cm" : "inches"})
              </label>
              <span className="text-sm font-bold font-mono text-amber-400">
                {height} {unit === "metric" ? "cm" : "in"}
              </span>
            </div>
            <input
              type="range"
              min={unit === "metric" ? 100 : 40}
              max={unit === "metric" ? 220 : 86}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Weight ({unit === "metric" ? "kg" : "lbs"})
              </label>
              <span className="text-sm font-bold font-mono text-amber-400">
                {weight} {unit === "metric" ? "kg" : "lbs"}
              </span>
            </div>
            <input
              type="range"
              min={unit === "metric" ? 30 : 66}
              max={unit === "metric" ? 180 : 400}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Age</label>
            <input
              type="number"
              min="10"
              max="120"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Results Gauge & Advice */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Body Mass Index</span>
            <div className="text-5xl font-extrabold font-mono text-white my-2">
              {bmi.toFixed(1)}
            </div>
            <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${category.bg} text-slate-950`}>
              {category.label}
            </div>
          </div>

          {/* Visual BMI Gauge Bar */}
          <div className="space-y-1">
            <div className="flex text-[10px] text-slate-400 justify-between font-mono">
              <span>Under (&lt;18.5)</span>
              <span>Normal (18.5-24.9)</span>
              <span>Over (25-29.9)</span>
              <span>Obese (&gt;30)</span>
            </div>
            <div className="h-3 bg-slate-950 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-slate-800">
              <div className="h-full bg-sky-500 flex-1 rounded-l" />
              <div className="h-full bg-emerald-500 flex-1" />
              <div className="h-full bg-amber-500 flex-1" />
              <div className="h-full bg-rose-500 flex-1 rounded-r" />
            </div>
          </div>

          {/* Ideal Weight Range */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-400" /> Ideal Healthy Weight:
              </span>
              <span className="font-mono font-bold text-amber-400">{getIdealWeight()}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Based on World Health Organization (WHO) benchmarks for a adult {gender} height of {height} {unit === "metric" ? "cm" : "in"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
