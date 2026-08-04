import React, { useState } from "react";
import { Ruler, ArrowRightLeft, Scale, Thermometer, Box, Zap, Clock, HardDrive } from "lucide-react";

type UnitCategory = "length" | "weight" | "temperature" | "area" | "volume" | "speed" | "data";

interface UnitOption {
  name: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const UNITS_DATA: Record<UnitCategory, Record<string, UnitOption>> = {
  length: {
    Meter: { name: "Meter (m)", toBase: (v) => v, fromBase: (v) => v },
    Kilometer: { name: "Kilometer (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    Centimeter: { name: "Centimeter (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    Millimeter: { name: "Millimeter (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    Mile: { name: "Mile (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    Yard: { name: "Yard (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    Foot: { name: "Foot (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    Inch: { name: "Inch (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  },
  weight: {
    Kilogram: { name: "Kilogram (kg)", toBase: (v) => v, fromBase: (v) => v },
    Gram: { name: "Gram (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    Pound: { name: "Pound (lb)", toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
    Ounce: { name: "Ounce (oz)", toBase: (v) => v * 0.028349523, fromBase: (v) => v / 0.028349523 },
    MetricTon: { name: "Metric Ton (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  },
  temperature: {
    Celsius: { name: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
    Fahrenheit: { name: "Fahrenheit (°F)", toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
    Kelvin: { name: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
  area: {
    SquareMeter: { name: "Square Meter (m²)", toBase: (v) => v, fromBase: (v) => v },
    SquareKilometer: { name: "Square Kilometer (km²)", toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    SquareFoot: { name: "Square Foot (ft²)", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    Acre: { name: "Acre (ac)", toBase: (v) => v * 4046.856, fromBase: (v) => v / 4046.856 },
    Hectare: { name: "Hectare (ha)", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
  },
  volume: {
    Liter: { name: "Liter (L)", toBase: (v) => v, fromBase: (v) => v },
    Milliliter: { name: "Milliliter (mL)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    Gallon: { name: "Gallon (US gal)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    CubicMeter: { name: "Cubic Meter (m³)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  },
  speed: {
    MeterPerSec: { name: "Meters / sec (m/s)", toBase: (v) => v, fromBase: (v) => v },
    KmPerHour: { name: "Kilometers / hr (km/h)", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    MilesPerHour: { name: "Miles / hr (mph)", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    Knot: { name: "Knot (kn)", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
  },
  data: {
    Megabyte: { name: "Megabyte (MB)", toBase: (v) => v, fromBase: (v) => v },
    Gigabyte: { name: "Gigabyte (GB)", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    Terabyte: { name: "Terabyte (TB)", toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
    Kilobyte: { name: "Kilobyte (KB)", toBase: (v) => v / 1024, fromBase: (v) => v * 1024 },
    Byte: { name: "Byte (B)", toBase: (v) => v / (1024 * 1024), fromBase: (v) => v * (1024 * 1024) },
  },
};

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnitKey, setFromUnitKey] = useState<string>("Kilometer");
  const [toUnitKey, setToUnitKey] = useState<string>("Mile");
  const [inputValue, setInputValue] = useState<number>(10);

  const currentCategoryUnits = UNITS_DATA[category];

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const keys = Object.keys(UNITS_DATA[cat]);
    setFromUnitKey(keys[0]);
    setToUnitKey(keys[1] || keys[0]);
  };

  const convert = () => {
    const fromOpt = currentCategoryUnits[fromUnitKey];
    const toOpt = currentCategoryUnits[toUnitKey];
    if (!fromOpt || !toOpt) return 0;
    const baseValue = fromOpt.toBase(inputValue);
    return toOpt.fromBase(baseValue);
  };

  const result = convert();

  const handleSwap = () => {
    const temp = fromUnitKey;
    setFromUnitKey(toUnitKey);
    setToUnitKey(temp);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Ruler className="w-5 h-5 text-indigo-500" /> Unit Converter
          </h3>
          <p className="text-xs text-slate-400">Instant multi-unit conversion engine</p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "length", label: "Length", icon: Ruler },
          { key: "weight", label: "Weight", icon: Scale },
          { key: "temperature", label: "Temperature", icon: Thermometer },
          { key: "area", label: "Area", icon: Box },
          { key: "volume", label: "Volume", icon: Box },
          { key: "speed", label: "Speed", icon: Zap },
          { key: "data", label: "Digital Data", icon: HardDrive },
        ].map((cat) => {
          const IconComp = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
                category === cat.key
                  ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <IconComp className="w-3.5 h-3.5" /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* Converter Interface */}
      <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From Unit */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">From</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
            />
            <select
              value={fromUnitKey}
              onChange={(e) => setFromUnitKey(e.target.value)}
              className="w-full p-2.5 bg-[#0a0a0a] border border-[#222222] rounded-md text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#C5A059]"
            >
              {Object.entries(currentCategoryUnits).map(([key, opt]: [string, any]) => (
                <option key={key} value={key}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-3 bg-[#181818] hover:bg-[#222222] text-[#C5A059] border border-[#333333] rounded-md transition shadow-md"
              title="Swap Units"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* To Unit */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">To</label>
            <div className="p-3 bg-[#0a0a0a] border border-[#222222] rounded-md text-lg font-mono font-bold text-[#C5A059] truncate">
              {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
            <select
              value={toUnitKey}
              onChange={(e) => setToUnitKey(e.target.value)}
              className="w-full p-2.5 bg-[#0a0a0a] border border-[#222222] rounded-md text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#C5A059]"
            >
              {Object.entries(currentCategoryUnits).map(([key, opt]: [string, any]) => (
                <option key={key} value={key}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conversion Equation Bar */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-center text-xs font-mono text-slate-400">
          <span className="text-white font-bold">{inputValue}</span> {currentCategoryUnits[fromUnitKey]?.name} ={" "}
          <span className="text-indigo-400 font-bold">{result.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>{" "}
          {currentCategoryUnits[toUnitKey]?.name}
        </div>
      </div>
    </div>
  );
};
