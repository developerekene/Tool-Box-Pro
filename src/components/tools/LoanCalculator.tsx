import React, { useState } from "react";
import { Landmark, DollarSign, PieChart, Table } from "lucide-react";

export const LoanCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [years, setYears] = useState<number>(30);

  const calculateLoan = () => {
    const principal = amount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) {
      const mPay = principal / numberOfPayments;
      return {
        monthlyPayment: mPay,
        totalPayment: principal,
        totalInterest: 0,
        schedule: [],
      };
    }

    const mPay =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPay = mPay * numberOfPayments;
    const totalInt = totalPay - principal;

    // Generate annual breakdown
    const schedule = [];
    let balance = principal;
    for (let y = 1; y <= years; y++) {
      let interestYear = 0;
      let principalYear = 0;
      for (let m = 1; m <= 12; m++) {
        const i = balance * monthlyRate;
        const p = mPay - i;
        interestYear += i;
        principalYear += p;
        balance -= p;
      }
      schedule.push({
        year: y,
        principalPaid: principalYear,
        interestPaid: interestYear,
        remainingBalance: Math.max(0, balance),
      });
    }

    return {
      monthlyPayment: mPay,
      totalPayment: totalPay,
      totalInterest: totalInt,
      schedule,
    };
  };

  const results = calculateLoan();

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-500" /> Loan & Amortization Calculator
          </h3>
          <p className="text-xs text-slate-400">Monthly payment breakdown, total interest cost & schedule</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Loan Principal Amount ($)
            </label>
            <input
              type="number"
              min="1000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-base font-mono font-bold text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Interest Rate (%)
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="20"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Loan Duration (Years)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 30].map((y) => (
                <button
                  key={y}
                  onClick={() => setYears(y)}
                  className={`py-2 text-xs font-bold rounded-lg border transition ${
                    years === y
                      ? "bg-amber-500 border-amber-500 text-slate-950"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {y} yrs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Overview & Amortization Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/30 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Payment</span>
              <div className="text-2xl font-extrabold font-mono text-amber-400">
                ${results.monthlyPayment.toFixed(2)}
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Interest</span>
              <div className="text-2xl font-extrabold font-mono text-rose-400">
                ${results.totalInterest.toFixed(2)}
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Cost</span>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">
                ${results.totalPayment.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Amortization Schedule Table */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Table className="w-4 h-4 text-amber-400" /> Amortization Schedule (Yearly)
            </span>

            <div className="overflow-x-auto max-h-[220px]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="p-2">Year</th>
                    <th className="p-2">Principal Paid</th>
                    <th className="p-2">Interest Paid</th>
                    <th className="p-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {results.schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-800/40">
                      <td className="p-2 text-white font-bold">Year {row.year}</td>
                      <td className="p-2 text-emerald-400">${row.principalPaid.toFixed(2)}</td>
                      <td className="p-2 text-rose-400">${row.interestPaid.toFixed(2)}</td>
                      <td className="p-2 text-right text-slate-300">${row.remainingBalance.toFixed(2)}</td>
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
