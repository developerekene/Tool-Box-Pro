import React, { useState } from "react";
import { Calculator, History, Trash2, Delete, CornerDownLeft } from "lucide-react";

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState<string>("0");
  const [expression, setExpression] = useState<string>("");
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [isDeg, setIsDeg] = useState<boolean>(true);
  const [memory, setMemory] = useState<number>(0);

  const handleNum = (num: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    if (display === "Error") return;
    setExpression(expression + display + " " + op + " ");
    setDisplay("0");
  };

  const handleFunc = (fn: string) => {
    if (display === "Error") return;
    const val = parseFloat(display);
    let res = 0;
    try {
      const radFactor = isDeg ? Math.PI / 180 : 1;
      switch (fn) {
        case "sin":
          res = Math.sin(val * radFactor);
          break;
        case "cos":
          res = Math.cos(val * radFactor);
          break;
        case "tan":
          res = Math.tan(val * radFactor);
          break;
        case "asin":
          res = isDeg ? (Math.asin(val) * 180) / Math.PI : Math.asin(val);
          break;
        case "acos":
          res = isDeg ? (Math.acos(val) * 180) / Math.PI : Math.acos(val);
          break;
        case "atan":
          res = isDeg ? (Math.atan(val) * 180) / Math.PI : Math.atan(val);
          break;
        case "sqrt":
          res = Math.sqrt(val);
          break;
        case "sqr":
          res = Math.pow(val, 2);
          break;
        case "log":
          res = Math.log10(val);
          break;
        case "ln":
          res = Math.log(val);
          break;
        case "1/x":
          res = 1 / val;
          break;
        case "fact":
          res = factorial(val);
          break;
        default:
          return;
      }
      const strRes = Number.isFinite(res) ? res.toString() : "Error";
      setDisplay(strRes);
      setHistory([{ expr: `${fn}(${val})`, result: strRes }, ...history]);
    } catch {
      setDisplay("Error");
    }
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const handleEqual = () => {
    if (display === "Error") return;
    const fullExpr = expression + display;
    try {
      // Safe evaluation of basic expression
      const cleanExpr = fullExpr.replace(/×/g, "*").replace(/÷/g, "/");
      // eslint-disable-next-line no-eval
      const evalRes = eval(cleanExpr);
      const strRes = Number.isFinite(evalRes) ? evalRes.toString() : "Error";
      setDisplay(strRes);
      setExpression("");
      if (strRes !== "Error") {
        setHistory([{ expr: fullExpr, result: strRes }, ...history.slice(0, 19)]);
      }
    } catch {
      setDisplay("Error");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
  };

  const handleBackspace = () => {
    if (display.length <= 1 || display === "Error") {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleConstant = (c: "pi" | "e") => {
    const val = c === "pi" ? Math.PI.toString() : Math.E.toString();
    setDisplay(val);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-500" /> Scientific Calculator
          </h3>
          <p className="text-xs text-slate-400">Trigonometric, logarithmic & exponential math engine</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDeg(!isDeg)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
              isDeg ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            {isDeg ? "DEG" : "RAD"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calculator */}
        <div className="lg:col-span-2 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          {/* Display screen */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right space-y-1">
            <div className="text-xs font-mono text-slate-500 min-h-[20px] overflow-hidden truncate">
              {expression}
            </div>
            <div className="text-3xl font-mono font-bold text-blue-400 overflow-x-auto whitespace-nowrap scrollbar-none">
              {display}
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-5 gap-2 text-xs font-bold">
            {/* Row 1 */}
            <button onClick={() => handleFunc("sin")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">sin</button>
            <button onClick={() => handleFunc("cos")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">cos</button>
            <button onClick={() => handleFunc("tan")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">tan</button>
            <button onClick={handleClear} className="p-3 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-xl">AC</button>
            <button onClick={handleBackspace} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center">
              <Delete className="w-4 h-4" />
            </button>

            {/* Row 2 */}
            <button onClick={() => handleFunc("asin")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">sin⁻¹</button>
            <button onClick={() => handleFunc("acos")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">cos⁻¹</button>
            <button onClick={() => handleFunc("atan")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">tan⁻¹</button>
            <button onClick={() => handleFunc("log")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">log</button>
            <button onClick={() => handleFunc("ln")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">ln</button>

            {/* Row 3 */}
            <button onClick={() => handleFunc("sqrt")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">√x</button>
            <button onClick={() => handleFunc("sqr")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">x²</button>
            <button onClick={() => handleFunc("1/x")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">1/x</button>
            <button onClick={() => handleConstant("pi")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">π</button>
            <button onClick={() => handleOp("/")} className="p-3 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-xl">÷</button>

            {/* Row 4 */}
            <button onClick={() => handleNum("7")} className="p-3.5 bg-slate-950 hover:bg-slate-800 rounded-xl text-white text-base">7</button>
            <button onClick={() => handleNum("8")} className="p-3.5 bg-slate-950 hover:bg-slate-800 rounded-xl text-white text-base">8</button>
            <button onClick={() => handleNum("9")} className="p-3.5 bg-slate-950 hover:bg-slate-800 rounded-xl text-white text-base">9</button>
            <button onClick={() => handleFunc("fact")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">n!</button>
            <button onClick={() => handleOp("*")} className="p-3 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-xl">×</button>

            {/* Row 5 */}
            <button onClick={() => handleNum("4")} className="p-3.5 bg-slate-950 hover:bg-slate-800 rounded-xl text-white text-base">4</button>
            <button onClick={() => handleNum("5")} className="p-3.5 bg-slate-950 hover:bg-slate-800 rounded-xl text-white text-base">5</button>
            <button onClick={() => handleNum("6")} className="p-3.5 bg-slate-950 hover:bg-slate-800 rounded-xl text-white text-base">6</button>
            <button onClick={() => handleConstant("e")} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-300">e</button>
            <button onClick={() => handleOp("-")} className="p-3 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-xl">-</button>

            {/* Row 6 */}
            <button onClick={() => handleNum("1")} className="p-3.5 bg-slate-950 hover:bg-slate-800 rounded-xl text-white text-base">1</button>
            <button onClick={() => handleNum("2")} className="p-3.5 bg-slate-950 hover:bg-slate-800 rounded-xl text-white text-base">2</button>
            <button onClick={() => handleNum("3")} className="p-3.5 bg-slate-950 hover:bg-slate-800 rounded-xl text-white text-base">3</button>
            <button onClick={() => handleNum(".")} className="p-3.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white text-base">.</button>
            <button onClick={() => handleOp("+")} className="p-3 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-xl">+</button>

            {/* Row 7 */}
            <button onClick={() => handleNum("0")} className="col-span-2 p-3.5 bg-slate-950 hover:bg-slate-800 rounded-xl text-white text-base">0</button>
            <button onClick={handleEqual} className="col-span-3 p-3.5 bg-blue-500 hover:bg-blue-600 text-slate-950 font-extrabold rounded-xl text-base flex items-center justify-center gap-2">
              <CornerDownLeft className="w-5 h-5" /> Calculate
            </button>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-blue-400" /> Calculation Log
            </span>
            {history.length > 0 && (
              <button onClick={() => setHistory([])} className="text-slate-500 hover:text-rose-400 transition" title="Clear log">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-[360px] pr-1">
            {history.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No history recorded yet</p>
            ) : (
              history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setDisplay(item.result)}
                  className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-blue-500/40 cursor-pointer text-right space-y-0.5 transition"
                >
                  <p className="text-[11px] font-mono text-slate-500">{item.expr}</p>
                  <p className="text-sm font-mono font-bold text-blue-400">= {item.result}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
