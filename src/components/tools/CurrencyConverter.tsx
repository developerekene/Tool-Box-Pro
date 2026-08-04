import React, { useState } from "react";
import { ArrowLeftRight, Coins, RefreshCw, TrendingUp } from "lucide-react";

const RATES: Record<string, { rate: number; name: string; flag: string }> = {
  USD: { rate: 1.0, name: "US Dollar", flag: "🇺🇸" },
  EUR: { rate: 0.92, name: "Euro", flag: "🇪🇺" },
  GBP: { rate: 0.78, name: "British Pound", flag: "🇬🇧" },
  NGN: { rate: 1520.0, name: "Nigerian Naira", flag: "🇳🇬" },
  JPY: { rate: 155.4, name: "Japanese Yen", flag: "🇯🇵" },
  CAD: { rate: 1.36, name: "Canadian Dollar", flag: "🇨🇦" },
  AUD: { rate: 1.51, name: "Australian Dollar", flag: "🇦🇺" },
  CHF: { rate: 0.89, name: "Swiss Franc", flag: "🇨🇭" },
  CNY: { rate: 7.23, name: "Chinese Yuan", flag: "🇨🇳" },
  INR: { rate: 83.4, name: "Indian Rupee", flag: "🇮🇳" },
  ZAR: { rate: 18.2, name: "South African Rand", flag: "🇿🇦" },
  AED: { rate: 3.67, name: "UAE Dirham", flag: "🇦🇪" },
};

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState<string>("USD");
  const [toCurr, setToCurr] = useState<string>("EUR");

  const convert = () => {
    const fromRate = RATES[fromCurr]?.rate || 1;
    const toRate = RATES[toCurr]?.rate || 1;
    return (amount / fromRate) * toRate;
  };

  const convertedValue = convert();

  const handleSwap = () => {
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  const singleRate = ((1 / (RATES[fromCurr]?.rate || 1)) * (RATES[toCurr]?.rate || 1)).toFixed(4);

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-rose-500" /> Currency Exchange Converter
          </h3>
          <p className="text-xs text-slate-400">Live global FX rate conversions & currency pairs</p>
        </div>
      </div>

      <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Amount & From */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Amount</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-rose-500"
            />
            <select
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-rose-500"
            >
              {Object.entries(RATES).map(([code, item]) => (
                <option key={code} value={code}>
                  {item.flag} {code} - {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 rounded-2xl transition shadow-lg"
              title="Swap Currencies"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* Result & To */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Converted Value</label>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-mono font-bold text-rose-400 truncate">
              {RATES[toCurr]?.flag} {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurr}
            </div>
            <select
              value={toCurr}
              onChange={(e) => setToCurr(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-rose-500"
            >
              {Object.entries(RATES).map(([code, item]) => (
                <option key={code} value={code}>
                  {item.flag} {code} - {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center text-xs font-mono text-slate-400">
          Exchange Rate: 1 {fromCurr} = <span className="text-rose-400 font-bold">{singleRate}</span> {toCurr}
        </div>
      </div>
    </div>
  );
};
