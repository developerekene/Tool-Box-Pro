import React, { useState } from "react";
import { FunctionSquare, Calculator, Check, ArrowRight } from "lucide-react";

export const AlgebraCalculator: React.FC = () => {
  const [eqType, setEqType] = useState<"linear" | "quadratic">("quadratic");

  // Quadratic ax^2 + bx + c = 0
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-5);
  const [c, setC] = useState<number>(6);

  // Linear ax + b = c
  const [la, setLa] = useState<number>(3);
  const [lb, setLb] = useState<number>(12);
  const [lc, setLc] = useState<number>(27);

  const solveQuadratic = () => {
    if (a === 0) return { error: "'a' cannot be 0 in a quadratic equation." };
    const discriminant = b * b - 4 * a * c;
    if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return {
        discriminant,
        roots: [`x₁ = ${x1.toFixed(4)}`, `x₂ = ${x2.toFixed(4)}`],
        type: "Two Real Roots",
      };
    } else if (discriminant === 0) {
      const x = -b / (2 * a);
      return {
        discriminant,
        roots: [`x = ${x.toFixed(4)}`],
        type: "One Repeated Real Root",
      };
    } else {
      const real = (-b / (2 * a)).toFixed(4);
      const imag = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
      return {
        discriminant,
        roots: [`x₁ = ${real} + ${imag}i`, `x₂ = ${real} - ${imag}i`],
        type: "Complex Roots",
      };
    }
  };

  const solveLinear = () => {
    if (la === 0) return { error: "'a' cannot be 0." };
    const x = (lc - lb) / la;
    return { root: `x = ${x.toFixed(4)}`, steps: [`${la}x = ${lc} - ${lb}`, `${la}x = ${lc - lb}`, `x = ${x.toFixed(4)}`] };
  };

  const qResult = solveQuadratic();
  const lResult = solveLinear();

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FunctionSquare className="w-5 h-5 text-purple-500" /> Algebra & Equation Solver
          </h3>
          <p className="text-xs text-slate-400">Step-by-step resolution for linear & quadratic algebraic equations</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setEqType("quadratic")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              eqType === "quadratic" ? "bg-purple-500 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Quadratic (ax² + bx + c = 0)
          </button>
          <button
            onClick={() => setEqType("linear")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              eqType === "linear" ? "bg-purple-500 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Linear (ax + b = c)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Coefficients */}
        {eqType === "quadratic" ? (
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Quadratic Equation Coefficients
            </span>

            <div className="grid grid-cols-3 gap-3 font-mono">
              <div>
                <label className="text-xs text-slate-400 block mb-1">a (x²)</label>
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-sm font-bold text-purple-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">b (x)</label>
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-sm font-bold text-purple-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">c (constant)</label>
                <input
                  type="number"
                  value={c}
                  onChange={(e) => setC(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-sm font-bold text-purple-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-center font-mono text-sm text-slate-200">
              {a}x² {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = 0
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Linear Equation Coefficients
            </span>

            <div className="grid grid-cols-3 gap-3 font-mono">
              <div>
                <label className="text-xs text-slate-400 block mb-1">a (x)</label>
                <input
                  type="number"
                  value={la}
                  onChange={(e) => setLa(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-sm font-bold text-purple-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">b (+constant)</label>
                <input
                  type="number"
                  value={lb}
                  onChange={(e) => setLb(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-sm font-bold text-purple-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">c (=result)</label>
                <input
                  type="number"
                  value={lc}
                  onChange={(e) => setLc(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-sm font-bold text-purple-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-center font-mono text-sm text-slate-200">
              {la}x {lb >= 0 ? `+ ${lb}` : `- ${Math.abs(lb)}`} = {lc}
            </div>
          </div>
        )}

        {/* Results Panel */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-3">
              Equation Solutions
            </span>

            {eqType === "quadratic" ? (
              qResult.error ? (
                <p className="text-xs text-rose-400 font-mono">{qResult.error}</p>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
                    <span className="text-xs text-slate-400 font-mono">
                      Discriminant (Δ = b² - 4ac) = {qResult.discriminant}
                    </span>
                    <div className="text-xl font-extrabold font-mono text-purple-400 space-y-1">
                      {qResult.roots?.map((r, i) => (
                        <div key={i}>{r}</div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      {qResult.type}
                    </span>
                  </div>
                </div>
              )
            ) : lResult.error ? (
              <p className="text-xs text-rose-400 font-mono">{lResult.error}</p>
            ) : (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
                <span className="text-xs text-slate-400 font-mono">Solution</span>
                <div className="text-2xl font-extrabold font-mono text-purple-400">{lResult.root}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
