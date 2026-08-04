import React, { useState } from "react";
import { TrendingUp, DollarSign, Calendar, BarChart2 } from "lucide-react";

export const InvestmentCalculator: React.FC = () => {
  const [initial, setInitial] = useState<number>(10000);
  const [monthly, setMonthly] = useState<number>(500);
  const [rate, setRate] = useState<number>(8); // 8% annual
  const [years, setYears] = useState<number>(10);

  const calculateGrowth = () => {
    let balance = initial;
    let totalContributed = initial;
    const monthlyRate = rate / 100 / 12;

    const yearlyData = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        balance = (balance + monthly) * (1 + monthlyRate);
        totalContributed += monthly;
      }
      yearlyData.push({
        year: y,
        contributions: totalContributed,
        balance: Math.round(balance),
        interest: Math.round(balance - totalContributed),
      });
    }

    return {
      finalBalance: Math.round(balance),
      totalContributions: totalContributed,
      totalInterest: Math.round(balance - totalContributed),
      yearlyData,
    };
  };

  const results = calculateGrowth();

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-500" /> Investment Growth Calculator
          </h3>
          <p className="text-xs text-slate-400">Compound interest projection with recurring deposits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Starting Investment ($)
            </label>
            <input
              type="number"
              value={initial}
              onChange={(e) => setInitial(Number(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-base font-mono font-bold text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Monthly Contribution ($)
            </label>
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-base font-mono font-bold text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Annual Return (%)
              </label>
              <span className="text-xs font-mono font-bold text-pink-400">{rate}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-pink-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Time Horizon (Years)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 30].map((y) => (
                <button
                  key={y}
                  onClick={() => setYears(y)}
                  className={`py-2 text-xs font-bold rounded-lg border transition ${
                    years === y
                      ? "bg-pink-500 border-pink-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {y} yrs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900 p-4 rounded-xl border border-pink-500/30 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Future Balance</span>
              <div className="text-2xl font-extrabold font-mono text-pink-400">
                ${results.finalBalance.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Deposited</span>
              <div className="text-2xl font-extrabold font-mono text-slate-300">
                ${results.totalContributions.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Interest Earned</span>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">
                ${results.totalInterest.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-pink-400" /> Yearly Growth Projection
            </span>

            <div className="overflow-x-auto max-h-[220px]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="p-2">Year</th>
                    <th className="p-2">Deposits</th>
                    <th className="p-2">Interest</th>
                    <th className="p-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {results.yearlyData.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-800/40">
                      <td className="p-2 text-white font-bold">Year {row.year}</td>
                      <td className="p-2 text-slate-300">${row.contributions.toLocaleString()}</td>
                      <td className="p-2 text-emerald-400">${row.interest.toLocaleString()}</td>
                      <td className="p-2 text-right text-pink-400 font-bold">${row.balance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
