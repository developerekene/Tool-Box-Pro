import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Sparkles,
  RefreshCw,
  Gift,
  Globe,
  Heart,
  Activity,
  UserCheck,
  Zap,
  Copy,
  Check,
  Info,
  ChevronRight,
  Sun,
  Star,
} from "lucide-react";

export type AgeInputMode = "full" | "month_year" | "year_only";

interface AgeCalculationResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthdayDays: number;
  nextBirthdayWeekday: string;
  zodiacSign: string;
  zodiacSymbol: string;
  chineseZodiac: string;
  generation: string;
  heartbeats: string;
  breaths: string;
  planetAges: { name: string; age: string; period: string }[];
}

export function AgeCalculator() {
  const [inputMode, setInputMode] = useState<AgeInputMode>("full");

  // Input states
  const [birthYear, setBirthYear] = useState<number>(2000);
  const [birthMonth, setBirthMonth] = useState<number>(1); // 1 - 12
  const [birthDay, setBirthDay] = useState<number>(15); // 1 - 31

  // Target comparison date (defaults to Today)
  const [targetDateStr, setTargetDateStr] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [useTodayAsTarget, setUseTodayAsTarget] = useState<boolean>(true);

  // Live seconds ticker
  const [now, setNow] = useState<Date>(new Date());
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Derive maximum days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const currentMaxDays = getDaysInMonth(birthYear, birthMonth);

  // Target date parsing
  const getTargetDate = (): Date => {
    if (useTodayAsTarget) {
      return now;
    }
    const parsed = new Date(targetDateStr);
    return isNaN(parsed.getTime()) ? now : parsed;
  };

  // Generation lookup
  const getGeneration = (year: number): string => {
    if (year >= 2013) return "Generation Alpha (2013 - Present)";
    if (year >= 1997) return "Generation Z (1997 - 2012)";
    if (year >= 1981) return "Millennials / Gen Y (1981 - 1996)";
    if (year >= 1965) return "Generation X (1965 - 1980)";
    if (year >= 1946) return "Baby Boomers (1946 - 1964)";
    if (year >= 1928) return "Silent Generation (1928 - 1945)";
    return "Greatest Generation (Pre-1928)";
  };

  // Western Zodiac Sign lookup
  const getZodiacSign = (month: number, day: number): { sign: string; symbol: string } => {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: "Aries", symbol: "♈" };
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: "Taurus", symbol: "♉" };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: "Gemini", symbol: "♊" };
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: "Cancer", symbol: "♋" };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: "Leo", symbol: "♌" };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: "Virgo", symbol: "♍" };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: "Libra", symbol: "♎" };
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: "Scorpio", symbol: "♏" };
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: "Sagittarius", symbol: "♐" };
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: "Capricorn", symbol: "♑" };
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: "Aquarius", symbol: "♒" };
    return { sign: "Pisces", symbol: "♓" };
  };

  // Chinese Zodiac Sign lookup
  const getChineseZodiac = (year: number): string => {
    const animals = ["Rat 🐀", "Ox 🐂", "Tiger 🐅", "Rabbit 🐇", "Dragon 🐉", "Snake 🐍", "Horse 🐎", "Goat 🐐", "Monkey 🐒", "Rooster 🐓", "Dog 🐕", "Pig 🐖"];
    // 1900 was Year of the Rat (1900 % 12 = 4)
    const index = (year - 4) % 12;
    return animals[(index + 12) % 12];
  };

  // Core Calculation Function
  const calculateAge = (): AgeCalculationResult => {
    const target = getTargetDate();
    const targetYr = target.getFullYear();
    const targetMo = target.getMonth() + 1; // 1 - 12
    const targetDy = target.getDate();

    if (inputMode === "year_only") {
      const diffYears = targetYr - birthYear;
      const validYears = Math.max(0, diffYears);
      const daysLived = validYears * 365.25;
      const hoursLived = daysLived * 24;
      const minLived = hoursLived * 60;
      const secLived = minLived * 60;

      return {
        years: validYears,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMonths: validYears * 12,
        totalWeeks: Math.floor(daysLived / 7),
        totalDays: Math.floor(daysLived),
        totalHours: Math.floor(hoursLived),
        totalMinutes: Math.floor(minLived),
        totalSeconds: Math.floor(secLived),
        nextBirthdayDays: 0,
        nextBirthdayWeekday: "N/A (Provide Month & Day)",
        zodiacSign: "N/A",
        zodiacSymbol: "⭐",
        chineseZodiac: getChineseZodiac(birthYear),
        generation: getGeneration(birthYear),
        heartbeats: (daysLived * 24 * 60 * 80).toLocaleString(),
        breaths: (daysLived * 24 * 60 * 16).toLocaleString(),
        planetAges: [
          { name: "Mercury", age: (validYears * (365.25 / 87.97)).toFixed(1) + " yrs", period: "88 days" },
          { name: "Venus", age: (validYears * (365.25 / 224.7)).toFixed(1) + " yrs", period: "225 days" },
          { name: "Earth", age: validYears + " yrs", period: "365 days" },
          { name: "Mars", age: (validYears * (365.25 / 687)).toFixed(1) + " yrs", period: "1.88 yrs" },
          { name: "Jupiter", age: (validYears / 11.86).toFixed(1) + " yrs", period: "11.8 yrs" },
          { name: "Saturn", age: (validYears / 29.46).toFixed(1) + " yrs", period: "29.5 yrs" },
        ],
      };
    }

    if (inputMode === "month_year") {
      let years = targetYr - birthYear;
      let months = targetMo - birthMonth;

      if (months < 0) {
        years -= 1;
        months += 12;
      }
      years = Math.max(0, years);

      const totalMonths = years * 12 + months;
      const approxDays = totalMonths * 30.4375;
      const hoursLived = approxDays * 24;

      return {
        years,
        months,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMonths,
        totalWeeks: Math.floor(approxDays / 7),
        totalDays: Math.floor(approxDays),
        totalHours: Math.floor(hoursLived),
        totalMinutes: Math.floor(hoursLived * 60),
        totalSeconds: Math.floor(hoursLived * 3600),
        nextBirthdayDays: 0,
        nextBirthdayWeekday: `Month of ${monthsList[birthMonth - 1]}`,
        zodiacSign: `Sun Sign in ${monthsList[birthMonth - 1]}`,
        zodiacSymbol: "✨",
        chineseZodiac: getChineseZodiac(birthYear),
        generation: getGeneration(birthYear),
        heartbeats: (approxDays * 24 * 60 * 80).toLocaleString(),
        breaths: (approxDays * 24 * 60 * 16).toLocaleString(),
        planetAges: [
          { name: "Mercury", age: ((totalMonths / 12) * (365.25 / 87.97)).toFixed(1) + " yrs", period: "88 days" },
          { name: "Venus", age: ((totalMonths / 12) * (365.25 / 224.7)).toFixed(1) + " yrs", period: "225 days" },
          { name: "Earth", age: (totalMonths / 12).toFixed(1) + " yrs", period: "365 days" },
          { name: "Mars", age: ((totalMonths / 12) * (365.25 / 687)).toFixed(1) + " yrs", period: "1.88 yrs" },
          { name: "Jupiter", age: (totalMonths / 12 / 11.86).toFixed(1) + " yrs", period: "11.8 yrs" },
        ],
      };
    }

    // Full Date Mode (Year, Month, Day)
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

    // Exact difference in time
    const diffMs = target.getTime() - birthDate.getTime();
    const safeDiffMs = Math.max(0, diffMs);

    let years = targetYr - birthYear;
    let months = targetMo - birthMonth;
    let days = targetDy - birthDay;

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(targetYr, targetMo - 1, 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }
    years = Math.max(0, years);

    const totalDays = Math.floor(safeDiffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(safeDiffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(safeDiffMs / (1000 * 60));
    const totalSeconds = Math.floor(safeDiffMs / 1000);

    const hrs = target.getHours();
    const mins = target.getMinutes();
    const secs = target.getSeconds();

    // Next Birthday calculation
    let nextBdayYr = targetYr;
    let nextBdayDate = new Date(nextBdayYr, birthMonth - 1, birthDay);

    if (nextBdayDate.getTime() < target.getTime()) {
      nextBdayYr += 1;
      nextBdayDate = new Date(nextBdayYr, birthMonth - 1, birthDay);
    }

    const nextBdayMs = nextBdayDate.getTime() - target.getTime();
    const nextBdayDays = Math.ceil(nextBdayMs / (1000 * 60 * 60 * 24));
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const nextBdayWeekday = weekdays[nextBdayDate.getDay()];

    const zodiac = getZodiacSign(birthMonth, birthDay);

    return {
      years,
      months,
      days,
      hours: hrs,
      minutes: mins,
      seconds: secs,
      totalMonths: years * 12 + months,
      totalWeeks: Math.floor(totalDays / 7),
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthdayDays: nextBdayDays === 365 || nextBdayDays === 366 ? 0 : nextBdayDays,
      nextBirthdayWeekday: nextBdayWeekday,
      zodiacSign: zodiac.sign,
      zodiacSymbol: zodiac.symbol,
      chineseZodiac: getChineseZodiac(birthYear),
      generation: getGeneration(birthYear),
      heartbeats: (totalMinutes * 80).toLocaleString(),
      breaths: (totalMinutes * 16).toLocaleString(),
      planetAges: [
        { name: "Mercury", age: ((totalDays / 87.97)).toFixed(1) + " yrs", period: "88 days" },
        { name: "Venus", age: ((totalDays / 224.7)).toFixed(1) + " yrs", period: "225 days" },
        { name: "Earth", age: (totalDays / 365.25).toFixed(1) + " yrs", period: "365 days" },
        { name: "Mars", age: ((totalDays / 687)).toFixed(1) + " yrs", period: "1.88 yrs" },
        { name: "Jupiter", age: ((totalDays / (365.25 * 11.86))).toFixed(1) + " yrs", period: "11.8 yrs" },
        { name: "Saturn", age: ((totalDays / (365.25 * 29.46))).toFixed(1) + " yrs", period: "29.5 yrs" },
      ],
    };
  };

  const result = calculateAge();

  const copySummary = () => {
    let summary = `=== AGE CALCULATOR REPORT ===\n`;
    summary += `Input Mode: ${inputMode.toUpperCase()}\n`;
    summary += `Birth Info: ${birthYear}${inputMode !== 'year_only' ? `-${birthMonth}` : ''}${inputMode === 'full' ? `-${birthDay}` : ''}\n`;
    summary += `Target Date: ${getTargetDate().toDateString()}\n`;
    summary += `---------------------------\n`;
    summary += `EXACT AGE: ${result.years} Years, ${result.months} Months, ${result.days} Days\n`;
    summary += `Total Days Lived: ${result.totalDays.toLocaleString()}\n`;
    summary += `Total Hours Lived: ${result.totalHours.toLocaleString()}\n`;
    summary += `Generation: ${result.generation}\n`;
    if (inputMode === 'full') {
      summary += `Zodiac Sign: ${result.zodiacSign} (${result.zodiacSymbol})\n`;
      summary += `Next Birthday in: ${result.nextBirthdayDays} days (${result.nextBirthdayWeekday})\n`;
    }
    summary += `Chinese Zodiac: ${result.chineseZodiac}\n`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#080c17] border border-[#151b2c] rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-xl shadow-inner">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-serif-title font-bold text-white tracking-tight">
              Precision Age & Milestone Calculator
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              SILVER TIER
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Flexible date calculator matching birth year, month, or exact day with current or custom dates. Includes astrological insights, life metrics, and planetary age calculations.
          </p>
        </div>

        {/* Action Copy Report */}
        <button
          onClick={copySummary}
          className="px-4 py-2 bg-[#0c1322] hover:bg-[#121b30] text-slate-200 border border-[#1e2a47] rounded-xl text-xs font-semibold transition flex items-center gap-2 self-start md:self-auto shadow-md"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#C5A059]" />}
          <span>{copied ? "Copied Report!" : "Copy Age Summary"}</span>
        </button>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Input Parameters */}
        <div className="lg:col-span-5 space-y-5">
          {/* Mode Selector */}
          <div className="bg-[#080c17] border border-[#151b2c] rounded-2xl p-4 shadow-xl space-y-3">
            <label className="text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" /> Select Input Precision
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#02050c] p-1.5 border border-[#131b2e] rounded-xl">
              <button
                onClick={() => setInputMode("full")}
                className={`py-2 text-[11px] font-semibold rounded-lg transition text-center ${
                  inputMode === "full"
                    ? "bg-[#111f3f] text-white border border-[#C5A059]/40 shadow-md font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Full Date
              </button>
              <button
                onClick={() => setInputMode("month_year")}
                className={`py-2 text-[11px] font-semibold rounded-lg transition text-center ${
                  inputMode === "month_year"
                    ? "bg-[#111f3f] text-white border border-[#C5A059]/40 shadow-md font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Year + Month
              </button>
              <button
                onClick={() => setInputMode("year_only")}
                className={`py-2 text-[11px] font-semibold rounded-lg transition text-center ${
                  inputMode === "year_only"
                    ? "bg-[#111f3f] text-white border border-[#C5A059]/40 shadow-md font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Year Only
              </button>
            </div>
          </div>

          {/* Birth Date Input Fields */}
          <div className="bg-[#080c17] border border-[#151b2c] rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#C5A059]" />
              Enter Birth Information
            </h3>

            <div className="space-y-3">
              {/* Birth Year */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-medium">Birth Year</label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={birthYear}
                  onChange={(e) => setBirthYear(parseInt(e.target.value) || 2000)}
                  className="w-full px-3.5 py-2.5 bg-[#02050c] border border-[#172033] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#C5A059] transition"
                  placeholder="e.g. 1995"
                />
              </div>

              {/* Birth Month (Shown for Month+Year or Full Date) */}
              {(inputMode === "full" || inputMode === "month_year") && (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Birth Month</label>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#02050c] border border-[#172033] rounded-xl text-sm text-white focus:outline-none focus:border-[#C5A059] transition"
                  >
                    {monthsList.map((m, idx) => (
                      <option key={m} value={idx + 1}>
                        {idx + 1} - {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Birth Day (Shown for Full Date) */}
              {inputMode === "full" && (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Birth Day</label>
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#02050c] border border-[#172033] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#C5A059] transition"
                  >
                    {Array.from({ length: currentMaxDays }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Target Comparison Date Option */}
          <div className="bg-[#080c17] border border-[#151b2c] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059]" /> Compare With
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={useTodayAsTarget}
                  onChange={(e) => setUseTodayAsTarget(e.target.checked)}
                  className="rounded border-[#172033] bg-[#02050c] text-[#C5A059] focus:ring-0"
                />
                <span>Use Current Live Date</span>
              </label>
            </div>

            {!useTodayAsTarget && (
              <div className="pt-2">
                <input
                  type="date"
                  value={targetDateStr}
                  onChange={(e) => setTargetDateStr(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#02050c] border border-[#172033] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            )}

            <div className="p-3 bg-[#02050c] border border-[#131b2e] rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Comparing against: <strong className="text-slate-200">{getTargetDate().toDateString()}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Results & Insights */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Primary Age Showcase Card */}
          <div className="bg-gradient-to-br from-[#0c1836] via-[#080c17] to-[#02050c] border border-[#C5A059]/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-4">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider">
                Current Calculated Age
              </span>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Live Ticking
              </span>
            </div>

            {/* Primary Big Counter */}
            <div className="py-2 border-y border-[#172442] space-y-2">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-4xl sm:text-5xl font-serif-title font-extrabold text-white tracking-tight">
                  {result.years} <span className="text-xl sm:text-2xl font-normal text-[#C5A059]">years</span>
                </span>
                {inputMode !== "year_only" && (
                  <span className="text-3xl sm:text-4xl font-serif-title font-bold text-slate-200">
                    {result.months} <span className="text-lg font-normal text-slate-400">months</span>
                  </span>
                )}
                {inputMode === "full" && (
                  <span className="text-3xl sm:text-4xl font-serif-title font-bold text-slate-200">
                    {result.days} <span className="text-lg font-normal text-slate-400">days</span>
                  </span>
                )}
              </div>

              {inputMode === "full" && (
                <div className="text-xs font-mono text-indigo-300 pt-1 flex items-center gap-3">
                  <span>Exact time today: {result.hours.toString().padStart(2, '0')}h {result.minutes.toString().padStart(2, '0')}m {result.seconds.toString().padStart(2, '0')}s</span>
                </div>
              )}
            </div>

            {/* Generation & Zodiac Badges Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="px-3 py-1 bg-[#101c38] border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-indigo-400" />
                <span>{result.generation}</span>
              </div>
              {inputMode === "full" && (
                <div className="px-3 py-1 bg-[#1c142c] border border-purple-500/30 text-purple-300 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <span className="text-base leading-none">{result.zodiacSymbol}</span>
                  <span>{result.zodiacSign}</span>
                </div>
              )}
              <div className="px-3 py-1 bg-[#261908] border border-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <span>{result.chineseZodiac}</span>
              </div>
            </div>
          </div>

          {/* Next Birthday Countdown Banner (Full Date mode) */}
          {inputMode === "full" && (
            <div className="bg-[#080c17] border border-emerald-500/30 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Next Birthday Countdown
                  </h4>
                  <p className="text-xs text-slate-400">
                    Falling on a <strong className="text-emerald-300">{result.nextBirthdayWeekday}</strong>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-serif-title font-bold text-emerald-400">
                  {result.nextBirthdayDays} <span className="text-xs font-normal text-slate-400">days left</span>
                </div>
              </div>
            </div>
          )}

          {/* Life Cumulative Totals Breakdown */}
          <div className="bg-[#080c17] border border-[#151b2c] rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#C5A059]" />
              Cumulative Life Metrics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#02050c] border border-[#131b2e] rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Total Months</span>
                <div className="text-lg font-bold text-slate-100 font-mono">
                  {result.totalMonths.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-[#02050c] border border-[#131b2e] rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Total Weeks</span>
                <div className="text-lg font-bold text-slate-100 font-mono">
                  {result.totalWeeks.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-[#02050c] border border-[#131b2e] rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Total Days</span>
                <div className="text-lg font-bold text-slate-100 font-mono">
                  {result.totalDays.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-[#02050c] border border-[#131b2e] rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Total Hours</span>
                <div className="text-base font-bold text-slate-200 font-mono">
                  {result.totalHours.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-[#02050c] border border-[#131b2e] rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Est. Heartbeats</span>
                <div className="text-base font-bold text-emerald-400 font-mono truncate">
                  {result.heartbeats}
                </div>
              </div>

              <div className="p-3 bg-[#02050c] border border-[#131b2e] rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Est. Breaths</span>
                <div className="text-base font-bold text-cyan-400 font-mono truncate">
                  {result.breaths}
                </div>
              </div>
            </div>
          </div>

          {/* Planetary Ages Cards */}
          <div className="bg-[#080c17] border border-[#151b2c] rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              Your Age on Other Planets
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {result.planetAges.map((planet) => (
                <div
                  key={planet.name}
                  className="p-3 bg-[#02050c] border border-[#131b2e] rounded-xl hover:border-indigo-500/40 transition space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-200">{planet.name}</span>
                    <span className="text-[9px] font-mono text-slate-500">{planet.period}</span>
                  </div>
                  <div className="text-base font-bold text-[#C5A059] font-mono">
                    {planet.age}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
