import React, { useState } from "react";
import { Fuel, Users, Navigation, DollarSign } from "lucide-react";

export const FuelCostCalculator: React.FC = () => {
  const [distance, setDistance] = useState<number>(350); // miles or km
  const [unit, setUnit] = useState<"mpg" | "metric">("mpg");
  const [efficiency, setEfficiency] = useState<number>(28); // MPG or L/100km
  const [pricePerUnit, setPricePerUnit] = useState<number>(3.85); // $ / gal or L
  const [passengers, setPassengers] = useState<number>(4);

  const calculateFuel = () => {
    let fuelNeeded = 0;
    if (unit === "mpg") {
      fuelNeeded = efficiency > 0 ? distance / efficiency : 0;
    } else {
      fuelNeeded = (distance * efficiency) / 100;
    }
    const totalCost = fuelNeeded * pricePerUnit;
    const perPerson = passengers > 0 ? totalCost / passengers : 0;

    return { fuelNeeded, totalCost, perPerson };
  };

  const { fuelNeeded, totalCost, perPerson } = calculateFuel();

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Fuel className="w-5 h-5 text-rose-500" /> Fuel Cost & Trip Splitter
          </h3>
          <p className="text-xs text-slate-400">Calculate fuel volume, gas expense & split cost per rider</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setUnit("mpg");
              setEfficiency(28);
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              unit === "mpg" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            US (Miles / MPG)
          </button>
          <button
            onClick={() => {
              setUnit("metric");
              setEfficiency(8.5);
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              unit === "metric" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Metric (Km / L/100km)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Trip Distance ({unit === "mpg" ? "Miles" : "Kilometers"})
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Fuel Efficiency ({unit === "mpg" ? "MPG" : "L / 100km"})
            </label>
            <input
              type="number"
              step="0.1"
              value={efficiency}
              onChange={(e) => setEfficiency(Number(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Fuel Price per {unit === "mpg" ? "Gallon ($)" : "Liter ($)"}
            </label>
            <input
              type="number"
              step="0.01"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(Number(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Number of Passengers
            </label>
            <input
              type="number"
              min="1"
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value) || 1)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-rose-500/30 flex flex-col justify-between space-y-6">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Cost Per Passenger</span>
            <div className="text-4xl font-extrabold font-mono text-rose-400">
              ${perPerson.toFixed(2)}
            </div>
            <span className="text-xs text-slate-400 block font-mono">
              Total Fuel: ${totalCost.toFixed(2)}
            </span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Required Fuel Volume:</span>
              <span className="text-white">
                {fuelNeeded.toFixed(2)} {unit === "mpg" ? "Gallons" : "Liters"}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Fuel Expense:</span>
              <span className="text-rose-400 font-bold">${totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
