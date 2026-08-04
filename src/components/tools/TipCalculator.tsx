import React, { useState } from "react";
import { Coins, Users, DollarSign, Calculator, Receipt } from "lucide-react";

export const TipCalculator: React.FC = () => {
  const [bill, setBill] = useState<number>(120);
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [customTip, setCustomTip] = useState<string>("");
  const [people, setPeople] = useState<number>(3);
  const [taxPercent, setTaxPercent] = useState<number>(8);

  const activeTip = customTip !== "" ? parseFloat(customTip) || 0 : tipPercent;

  const taxAmount = bill * (taxPercent / 100);
  const tipAmount = bill * (activeTip / 100);
  const totalAmount = bill + taxAmount + tipAmount;

  const perPersonBill = people > 0 ? bill / people : 0;
  const perPersonTip = people > 0 ? tipAmount / people : 0;
  const perPersonTotal = people > 0 ? totalAmount / people : 0;

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" /> Tip & Bill Splitter
          </h3>
          <p className="text-xs text-slate-400">Calculate tips, sales tax & split bills evenly among group</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Bill Amount ($)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="number"
                min="0"
                step="0.01"
                value={bill || ""}
                onChange={(e) => setBill(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Tip Percentage (%)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[10, 15, 18, 20, 25].map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    setTipPercent(pct);
                    setCustomTip("");
                  }}
                  className={`py-2 text-xs font-bold rounded-lg border transition ${
                    activeTip === pct && customTip === ""
                      ? "bg-amber-500 border-amber-500 text-slate-950"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <div className="mt-2">
              <input
                type="number"
                placeholder="Or enter custom tip %"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Sales Tax (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={taxPercent}
                onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Split People
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPeople(Math.max(1, people - 1))}
                  className="w-9 h-9 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-bold hover:bg-slate-800 flex items-center justify-center"
                >
                  -
                </button>
                <span className="flex-1 text-center font-mono font-bold text-amber-400">{people}</span>
                <button
                  onClick={() => setPeople(people + 1)}
                  className="w-9 h-9 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-bold hover:bg-slate-800 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 p-6 rounded-2xl border border-amber-500/30 flex flex-col justify-between space-y-6 shadow-xl">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4" /> Per-Person Split ({people} {people === 1 ? "person" : "people"})
            </span>

            <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-2 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Per Person</span>
              <div className="text-4xl font-extrabold font-mono text-amber-400">
                ${perPersonTotal.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Bill: ${perPersonBill.toFixed(2)} | Tip: ${perPersonTip.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Grand Totals */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="text-white">${bill.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax ({taxPercent}%):</span>
              <span className="text-white">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tip ({activeTip}%):</span>
              <span className="text-amber-400">${tipAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm text-white">
              <span>Grand Total:</span>
              <span className="text-amber-400">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
