import React, { useState } from "react";
import { Percent, Tag, DollarSign, Sparkles } from "lucide-react";

export const DiscountCalculator: React.FC = () => {
  const [price, setPrice] = useState<number>(150);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [extraCoupon, setExtraCoupon] = useState<number>(10);
  const [taxPercent, setTaxPercent] = useState<number>(7.5);

  const calculateSavings = () => {
    const primarySavings = price * (discountPercent / 100);
    const afterPrimary = price - primarySavings;

    const couponSavings = afterPrimary * (extraCoupon / 100);
    const discountedPrice = afterPrimary - couponSavings;

    const taxAmount = discountedPrice * (taxPercent / 100);
    const finalPrice = discountedPrice + taxAmount;
    const totalSaved = price - discountedPrice;

    return { primarySavings, couponSavings, discountedPrice, taxAmount, finalPrice, totalSaved };
  };

  const { primarySavings, couponSavings, discountedPrice, taxAmount, finalPrice, totalSaved } =
    calculateSavings();

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Percent className="w-5 h-5 text-teal-500" /> Discount & Coupon Calculator
          </h3>
          <p className="text-xs text-slate-400">Calculate stacked discounts, sales tax & net savings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Original Retail Price ($)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-base font-mono font-bold text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Primary Discount (%)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[10, 15, 20, 30, 50].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDiscountPercent(pct)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                    discountPercent === pct
                      ? "bg-teal-500 border-teal-500 text-slate-950"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Extra Coupon (%)
              </label>
              <input
                type="number"
                value={extraCoupon}
                onChange={(e) => setExtraCoupon(Number(e.target.value) || 0)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Sales Tax (%)
              </label>
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-teal-500/30 flex flex-col justify-between space-y-6">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Final Price Payable</span>
            <div className="text-4xl font-extrabold font-mono text-teal-400">
              ${finalPrice.toFixed(2)}
            </div>
            <span className="text-xs font-bold text-emerald-400 block font-mono">
              Total Saved: ${totalSaved.toFixed(2)} ({(price > 0 ? (totalSaved / price) * 100 : 0).toFixed(1)}%)
            </span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Primary Savings ({discountPercent}%):</span>
              <span className="text-white">-${primarySavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Extra Coupon Savings ({extraCoupon}%):</span>
              <span className="text-white">-${couponSavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Estimated Sales Tax ({taxPercent}%):</span>
              <span className="text-slate-300">+${taxAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
