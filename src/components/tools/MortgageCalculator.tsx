import React, { useState } from "react";
import { Home, DollarSign, Building, Shield, FileText } from "lucide-react";

export const MortgageCalculator: React.FC = () => {
  const [homePrice, setHomePrice] = useState<number>(400000);
  const [downPercent, setDownPercent] = useState<number>(20); // 20%
  const [rate, setRate] = useState<number>(6.5);
  const [termYears, setTermYears] = useState<number>(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState<number>(1.2); // 1.2% / year
  const [insuranceYearly, setInsuranceYearly] = useState<number>(1200);
  const [hoaMonthly, setHoaMonthly] = useState<number>(100);

  const downPayment = (homePrice * downPercent) / 100;
  const loanPrincipal = homePrice - downPayment;

  const calculateMortgage = () => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = termYears * 12;

    let piMonthly = 0;
    if (monthlyRate > 0) {
      piMonthly =
        (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      piMonthly = loanPrincipal / numPayments;
    }

    const propertyTaxMonthly = (homePrice * (propertyTaxRate / 100)) / 12;
    const insuranceMonthly = insuranceYearly / 12;
    const totalMonthly = piMonthly + propertyTaxMonthly + insuranceMonthly + hoaMonthly;

    return {
      piMonthly,
      propertyTaxMonthly,
      insuranceMonthly,
      totalMonthly,
    };
  };

  const results = calculateMortgage();

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-purple-500" /> Mortgage & Housing Calculator
          </h3>
          <p className="text-xs text-slate-400">Monthly P&I, property tax, insurance & HOA payment estimate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Home Purchase Price ($)
            </label>
            <input
              type="number"
              step="5000"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-base font-mono font-bold text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Down Payment ({downPercent}%)
              </label>
              <span className="text-xs font-mono text-purple-400">${downPayment.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={downPercent}
              onChange={(e) => setDownPercent(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Loan Term
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 20, 30].map((t) => (
                <button
                  key={t}
                  onClick={() => setTermYears(t)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                    termYears === t
                      ? "bg-purple-500 border-purple-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  {t} Years
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 bg-slate-900/90 p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between space-y-6">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Estimated Total Monthly Payment</span>
            <div className="text-5xl font-extrabold font-mono text-purple-400">
              ${Math.round(results.totalMonthly).toLocaleString()}
            </div>
            <span className="text-xs text-slate-400 block font-mono">
              Loan Principal: ${loanPrincipal.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Principal & Int.</span>
              <span className="text-white font-bold">${Math.round(results.piMonthly)}/mo</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Property Tax</span>
              <span className="text-white font-bold">${Math.round(results.propertyTaxMonthly)}/mo</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Home Insurance</span>
              <span className="text-white font-bold">${Math.round(results.insuranceMonthly)}/mo</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">HOA Fees</span>
              <span className="text-white font-bold">${hoaMonthly}/mo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
