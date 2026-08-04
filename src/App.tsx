import React, { useState, useEffect } from "react";
import { TOOLS } from "./data/toolsData";
import { Tier, Category, ToolItem } from "./types";
import {
  Wrench,
  Search,
  Crown,
  Shield,
  Zap,
  Award,
  ArrowLeft,
  Lock,
  Sparkles,
  Layers,
  Star,
  Grid,
  List,
  Filter,
  CheckCircle2,
  X,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

// Tool Components Imports
import { CropTool } from "./components/tools/CropTool";
import { AuthenticatorTool } from "./components/tools/AuthenticatorTool";
import { ScientificCalculator } from "./components/tools/ScientificCalculator";
import { BMICalculator } from "./components/tools/BMICalculator";
import { WordCounter } from "./components/tools/WordCounter";
import { TipCalculator } from "./components/tools/TipCalculator";
import { UnitConverter } from "./components/tools/UnitConverter";
import { QRGenerator } from "./components/tools/QRGenerator";
import { NotesPro } from "./components/tools/NotesPro";
import { TimeAlert } from "./components/tools/TimeAlert";
import { CalendarTool } from "./components/tools/CalendarTool";
import { LoanCalculator } from "./components/tools/LoanCalculator";
import { ImageCompressor } from "./components/tools/ImageCompressor";
import { EncoderDecoder } from "./components/tools/EncoderDecoder";
import { CurrencyConverter } from "./components/tools/CurrencyConverter";
import { ZipCreator } from "./components/tools/ZipCreator";
import { InvestmentCalculator } from "./components/tools/InvestmentCalculator";
import { FuelCostCalculator } from "./components/tools/FuelCostCalculator";
import { MortgageCalculator } from "./components/tools/MortgageCalculator";
import { DiscountCalculator } from "./components/tools/DiscountCalculator";
import { AlgebraCalculator } from "./components/tools/AlgebraCalculator";
import { BackgroundRemover } from "./components/tools/BackgroundRemover";
import { FileConverter } from "./components/tools/FileConverter";
import { FileCompressor } from "./components/tools/FileCompressor";
import { ImageEditor } from "./components/tools/ImageEditor";
import { Phrasebook } from "./components/tools/Phrasebook";
import { KeywordGenerator } from "./components/tools/KeywordGenerator";
import { PdfScanner } from "./components/tools/PdfScanner";
import { QRScanner } from "./components/tools/QRScanner";
import { TranslatorTool } from "./components/tools/TranslatorTool";
import { BooleanCombinator } from "./components/tools/BooleanCombinator";
import { SearchTracker } from "./components/tools/SearchTracker";
import { AIDetector } from "./components/tools/AIDetector";
import { PlagiarismChecker } from "./components/tools/PlagiarismChecker";
import { AudioRecorder } from "./components/tools/AudioRecorder";
import { VideoTrimmer } from "./components/tools/VideoTrimmer";
import { PdfEditor } from "./components/tools/PdfEditor";
import { FileEditor } from "./components/tools/FileEditor";
import { FormFillSign } from "./components/tools/FormFillSign";
import { CoinCounter } from "./components/tools/CoinCounter";
import { AgeCalculator } from "./components/tools/AgeCalculator";

// Modal Imports
import { MembershipModal } from "./components/MembershipModal";
import { CheckoutModal } from "./components/CheckoutModal";
import { getToolIcon } from "./lib/iconMap";

const TIER_RANK: Record<string, number> = {
  bronze: 1,
  silver: 2,
  gold: 3,
  platinum: 4,
};

export default function App() {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<Tier>("platinum"); // Default to Platinum so all tools are immediately usable
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("toolbox_favs");
      return saved ? JSON.parse(saved) : ["40", "1", "39", "13", "4"];
    } catch {
      return ["40", "1", "39", "13", "4"];
    }
  });

  // Modals
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutTargetTier, setCheckoutTargetTier] = useState<Tier>("platinum");

  useEffect(() => {
    try {
      localStorage.setItem("toolbox_favs", JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (toolId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const activeTool = TOOLS.find((t) => t.id === selectedToolId);

  // Helper to test if user's tier unlocks tool
  const isToolUnlocked = (toolTier?: Tier) => {
    if (!toolTier) return true;
    const userRank = TIER_RANK[userTier.toString().toLowerCase()] || 4;
    const toolRank = TIER_RANK[toolTier.toString().toLowerCase()] || 1;
    return userRank >= toolRank;
  };

  const handleSelectTier = (tier: Tier) => {
    const userRank = TIER_RANK[userTier.toString().toLowerCase()] || 4;
    const targetRank = TIER_RANK[tier.toString().toLowerCase()] || 1;
    if (targetRank > userRank) {
      setCheckoutTargetTier(tier);
      setShowCheckoutModal(true);
    } else {
      setUserTier(tier);
    }
  };

  const categories: { id: string; label: string }[] = [
    { id: "All", label: "All Tools" },
    { id: "Favorites", label: "⭐ Favorites" },
    { id: "Media & Files", label: "Media & Files" },
    { id: "Developer & Security", label: "Developer & Security" },
    { id: "Calculators", label: "Calculators" },
    { id: "Text & Content", label: "Text & Content" },
    { id: "Utilities", label: "Utilities" },
    { id: "Productivity", label: "Productivity" },
  ];

  const filteredTools = TOOLS.filter((tool) => {
    // Favorites check
    if (selectedCategory === "Favorites") {
      if (!favorites.includes(tool.id)) return false;
    } else if (selectedCategory !== "All" && tool.category !== selectedCategory) {
      return false;
    }

    // Tier Filter check
    if (selectedTierFilter !== "All") {
      const required = (tool.requiredTier || tool.tier || "Bronze").toString().toLowerCase();
      if (required !== selectedTierFilter.toLowerCase()) return false;
    }

    // Search query check
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchesTitle = tool.title.toLowerCase().includes(query);
      const matchesDesc = tool.description.toLowerCase().includes(query);
      const matchesCategory = tool.category.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
    }

    return true;
  });

  const renderToolComponent = (toolId: string) => {
    switch (toolId) {
      case "1":
      case "crop":
        return <CropTool />;
      case "2":
      case "word-counter":
        return <WordCounter />;
      case "3":
      case "pdf-scanner":
        return <PdfScanner />;
      case "4":
      case "qr-generator":
        return <QRGenerator />;
      case "5":
      case "notes-pro":
        return <NotesPro />;
      case "6":
      case "video-trimmer":
        return <VideoTrimmer />;
      case "7":
      case "image-compressor":
        return <ImageCompressor />;
      case "8":
      case "translator":
        return <TranslatorTool />;
      case "9":
      case "audio-recorder":
        return <AudioRecorder />;
      case "10":
      case "zip-creator":
        return <ZipCreator />;
      case "11":
      case "qr-scanner":
        return <QRScanner />;
      case "12":
      case "encoder-decoder":
        return <EncoderDecoder />;
      case "13":
      case "scientific-calc":
        return <ScientificCalculator />;
      case "14":
      case "bmi-calc":
        return <BMICalculator />;
      case "15":
      case "loan-calc":
        return <LoanCalculator />;
      case "16":
      case "tip-calc":
        return <TipCalculator />;
      case "17":
      case "currency-converter":
        return <CurrencyConverter />;
      case "18":
      case "unit-converter":
        return <UnitConverter />;
      case "19":
      case "investment-calc":
        return <InvestmentCalculator />;
      case "20":
      case "discount-calc":
        return <DiscountCalculator />;
      case "21":
      case "fuel-calc":
        return <FuelCostCalculator />;
      case "22":
      case "mortgage-calc":
        return <MortgageCalculator />;
      case "23":
      case "algebra-calc":
        return <AlgebraCalculator />;
      case "24":
      case "background-remover":
        return <BackgroundRemover />;
      case "25":
      case "file-converter":
        return <FileConverter />;
      case "26":
      case "file-compressor":
        return <FileCompressor />;
      case "27":
      case "pdf-editor":
        return <PdfEditor />;
      case "28":
      case "file-editor":
        return <FileEditor />;
      case "29":
      case "form-fill-sign":
        return <FormFillSign />;
      case "30":
      case "image-editor":
        return <ImageEditor />;
      case "31":
      case "time-alert":
        return <TimeAlert />;
      case "32":
      case "calendar":
        return <CalendarTool />;
      case "33":
      case "phrasebook":
        return <Phrasebook />;
      case "34":
      case "keyword-generator":
        return <KeywordGenerator />;
      case "35":
      case "boolean-combinator":
        return <BooleanCombinator />;
      case "36":
      case "search-tracker":
        return <SearchTracker />;
      case "37":
      case "ai-detector":
        return <AIDetector />;
      case "38":
      case "plagiarism-checker":
        return <PlagiarismChecker />;
      case "39":
      case "authenticator":
        return <AuthenticatorTool />;
      case "40":
      case "coin-counter":
        return <CoinCounter />;
      case "41":
      case "age-calc":
        return <AgeCalculator />;
      default:
        return (
          <div className="p-12 text-center text-slate-400">
            Tool implementation loading...
          </div>
        );
    }
  };

  const getTierBadgeClass = (tier?: Tier) => {
    const t = (tier || "bronze").toString().toLowerCase();
    switch (t) {
      case "bronze":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      case "silver":
        return "bg-slate-700/40 text-slate-200 border-slate-600/50";
      case "gold":
        return "bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/50";
      case "platinum":
        return "bg-purple-900/40 text-purple-300 border-purple-500/50";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#000105] text-slate-200 font-sans antialiased selection:bg-[#C5A059] selection:text-black flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-[#02050c]/90 border-b border-[#111827] sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div
            onClick={() => setSelectedToolId(null)}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C5A059] via-[#8C6E3D] to-indigo-600 p-[1px] shadow-lg group-hover:shadow-[#C5A059]/30 transition-shadow">
              <div className="w-full h-full bg-[#030712] rounded-[11px] flex items-center justify-center text-[#C5A059]">
                <Wrench className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-title font-bold text-lg tracking-tight text-white group-hover:text-[#C5A059] transition-colors">
                  TOOLBOX <span className="text-[#C5A059]">PRO</span>
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  v2.5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                40 Offline-Ready Utilities & Calculators
              </p>
            </div>
          </div>

          {/* Quick Search in Navbar if not in active tool */}
          {!selectedToolId && (
            <div className="flex-1 max-w-md relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 40 tools (e.g. coin, crop, auth, pdf)..."
                className="w-full pl-10 pr-9 py-1.5 bg-[#060a14] border border-[#172033] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#C5A059] transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* User Tier Badge & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMembershipModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#091124] border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all flex items-center gap-1.5 shadow-md"
            >
              <Crown className="w-3.5 h-3.5" />
              <span className="capitalize">{userTier} Plan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedToolId && activeTool ? (
          /* Single Active Tool Workspace */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#131b2e] pb-4 gap-3">
              <button
                onClick={() => setSelectedToolId(null)}
                className="px-4 py-2 bg-[#060a14] hover:bg-[#0c1222] text-slate-300 text-xs font-medium rounded-lg border border-[#131b2e] hover:border-[#C5A059]/60 flex items-center gap-2 transition self-start shadow-md"
              >
                <ArrowLeft className="w-4 h-4 text-[#C5A059]" /> Back to Tool Suite
              </button>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-200">{activeTool.category}</span>
                </div>

                <button
                  onClick={() => toggleFavorite(activeTool.id)}
                  className={`p-2 rounded-lg border text-xs transition flex items-center gap-1.5 ${
                    favorites.includes(activeTool.id)
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                      : "bg-[#060a14] text-slate-400 border-[#131b2e] hover:text-amber-300"
                  }`}
                  title={favorites.includes(activeTool.id) ? "Unstar tool" : "Star as favorite"}
                >
                  <Star
                    className={`w-4 h-4 ${
                      favorites.includes(activeTool.id) ? "fill-amber-400 text-amber-400" : ""
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {favorites.includes(activeTool.id) ? "Favorited" : "Favorite"}
                  </span>
                </button>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-mono font-bold border ${getTierBadgeClass(
                    activeTool.tier || activeTool.requiredTier
                  )}`}
                >
                  {activeTool.tier || activeTool.requiredTier || "Bronze"}
                </span>
              </div>
            </div>

            {/* Lock check if user tier is below required tier */}
            {!isToolUnlocked(activeTool.tier || activeTool.requiredTier) ? (
              <div className="bg-[#060a14] border border-[#C5A059]/30 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-2xl my-12">
                <div className="w-14 h-14 rounded-full bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif-title text-xl text-slate-100">
                    {activeTool.tier || activeTool.requiredTier} Tier Required
                  </h3>
                  <p className="text-xs text-slate-400">
                    This utility requires a higher membership plan to unlock full access. Upgrade your account today!
                  </p>
                </div>
                <button
                  onClick={() => setShowMembershipModal(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#8C6E3D] text-black font-semibold text-xs rounded-lg transition shadow-lg hover:opacity-90"
                >
                  Upgrade Membership Plan
                </button>
              </div>
            ) : (
              <div className="bg-[#060a14] border border-[#131b2e] rounded-2xl p-6 shadow-2xl">
                {renderToolComponent(activeTool.id)}
              </div>
            )}
          </div>
        ) : (
          /* Main Dashboard Hub View */
          <div className="space-y-8">
            {/* Hero Header Card */}
            <div className="bg-gradient-to-br from-[#091124] via-[#050812] to-[#000105] p-6 md:p-8 rounded-2xl border border-[#1b2742] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Decorative radial lighting */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-3 max-w-2xl z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a142c] border border-[#C5A059]/40 text-[#C5A059] text-[11px] font-semibold tracking-wider uppercase shadow-inner">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>100% Client-Side Local Execution</span>
                </div>
                <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                  All Your Daily Utilities. <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-amber-200 to-[#8C6E3D]">
                    Zero Data Leakage.
                  </span>
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                  40 professional tools including camera coin counter, authenticator, image editor, PDF scanner, financial calculators, and developer utilities.
                </p>

                {/* Feature Chips */}
                <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-300">
                  <span className="flex items-center gap-1 bg-[#060a14] px-2.5 py-1 rounded-md border border-[#172033]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Private & Secure
                  </span>
                  <span className="flex items-center gap-1 bg-[#060a14] px-2.5 py-1 rounded-md border border-[#172033]">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant Processing
                  </span>
                  <span className="flex items-center gap-1 bg-[#060a14] px-2.5 py-1 rounded-md border border-[#172033]">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> 40 Built-in Tools
                  </span>
                </div>
              </div>

              {/* Action Side Panel */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 z-10 w-full md:w-auto">
                <button
                  onClick={() => setShowMembershipModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#8C6E3D] hover:opacity-90 text-black font-bold rounded-xl text-xs uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>View Membership</span>
                </button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 40 tools..."
                className="w-full pl-10 pr-9 py-2 bg-[#060a14] border border-[#172033] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Pills & View Controls */}
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Category Navigation Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shadow-sm ${
                          isSelected
                            ? "bg-[#0c1836] border-[#C5A059] text-[#C5A059] shadow-[#C5A059]/10"
                            : "bg-[#060a14] border-[#131b2e] text-slate-400 hover:text-slate-200 hover:border-[#1e2a47]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tier Filter & View Toggles */}
                <div className="flex items-center gap-3 justify-between lg:justify-end border-t lg:border-t-0 border-[#131b2e] pt-3 lg:pt-0">
                  <div className="flex items-center gap-1.5 bg-[#060a14] p-1 border border-[#131b2e] rounded-xl text-xs">
                    <span className="text-slate-500 px-2 font-mono text-[10px]">Tier:</span>
                    {["All", "Bronze", "Silver", "Gold", "Platinum"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTierFilter(t)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                          selectedTierFilter === t
                            ? "bg-[#111f3f] text-[#C5A059] border border-[#C5A059]/40"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Grid / List View Toggle Buttons */}
                  <div className="flex items-center bg-[#060a14] p-1 border border-[#131b2e] rounded-xl">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition ${
                        viewMode === "grid"
                          ? "bg-[#111f3f] text-[#C5A059]"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg transition ${
                        viewMode === "list"
                          ? "bg-[#111f3f] text-[#C5A059]"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty Search / Category Results */}
            {filteredTools.length === 0 && (
              <div className="bg-[#060a14] border border-[#131b2e] rounded-2xl p-12 text-center space-y-3 my-8">
                <div className="w-12 h-12 rounded-full bg-[#111a2e] text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">No Matching Tools Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search query, clearing filters, or switching category tabs.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedTierFilter("All");
                  }}
                  className="px-4 py-2 bg-[#111f3f] text-[#C5A059] border border-[#C5A059]/40 text-xs font-semibold rounded-lg hover:bg-[#C5A059] hover:text-black transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Tools Grid Layout */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredTools.map((tool) => {
                  const toolTier = tool.tier || tool.requiredTier || "bronze";
                  const unlocked = isToolUnlocked(toolTier);
                  const ToolIcon = getToolIcon(tool.icon);
                  const toolColor = tool.color || "#C5A059";
                  const isFav = favorites.includes(tool.id);

                  return (
                    <div
                      key={tool.id}
                      onClick={() => setSelectedToolId(tool.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${toolColor}80`;
                        e.currentTarget.style.boxShadow = `0 10px 30px -5px ${toolColor}25`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#131b2e";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      className="group bg-[#060a14] hover:bg-[#0a1020] p-5 rounded-2xl border border-[#131b2e] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden shadow-lg"
                    >
                      {/* Top Accent Line with Tool's Unique Color */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
                        style={{ backgroundColor: toolColor }}
                      />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          {/* Vibrant Custom Icon Box */}
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md"
                            style={{
                              backgroundColor: `${toolColor}18`,
                              borderColor: `${toolColor}45`,
                              borderWidth: "1px",
                              color: toolColor,
                            }}
                          >
                            <ToolIcon className="w-5.5 h-5.5" />
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Star Favorite Toggle */}
                            <button
                              onClick={(e) => toggleFavorite(tool.id, e)}
                              className={`p-1.5 rounded-lg transition ${
                                isFav
                                  ? "text-amber-400 bg-amber-500/10"
                                  : "text-slate-600 hover:text-amber-400 opacity-0 group-hover:opacity-100"
                              }`}
                              title={isFav ? "Unstar" : "Star favorite"}
                            >
                              <Star className={`w-4 h-4 ${isFav ? "fill-amber-400" : ""}`} />
                            </button>

                            {/* Tier Badge */}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold border ${getTierBadgeClass(
                                toolTier
                              )}`}
                            >
                              {tool.badge || toolTier}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-serif-title text-lg font-bold text-slate-100 group-hover:text-white transition-colors flex items-center gap-1.5">
                            {tool.title}
                            {!unlocked && (
                              <Lock className="w-3.5 h-3.5 text-[#C5A059] shrink-0 opacity-80" />
                            )}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-3 border-t border-[#101728] flex items-center justify-between text-[10px] tracking-wider uppercase font-mono font-bold text-slate-500">
                        <span>{tool.category}</span>
                        <span
                          className="opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex items-center gap-1"
                          style={{ color: toolColor }}
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Compact List View */
              <div className="bg-[#060a14] border border-[#131b2e] rounded-2xl overflow-hidden divide-y divide-[#101728] shadow-xl">
                {filteredTools.map((tool) => {
                  const toolTier = tool.tier || tool.requiredTier || "bronze";
                  const unlocked = isToolUnlocked(toolTier);
                  const ToolIcon = getToolIcon(tool.icon);
                  const toolColor = tool.color || "#C5A059";
                  const isFav = favorites.includes(tool.id);

                  return (
                    <div
                      key={tool.id}
                      onClick={() => setSelectedToolId(tool.id)}
                      className="p-4 hover:bg-[#0a1020] transition-colors cursor-pointer flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: `${toolColor}18`,
                            borderColor: `${toolColor}45`,
                            borderWidth: "1px",
                            color: toolColor,
                          }}
                        >
                          <ToolIcon className="w-5 h-5" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-100 group-hover:text-white truncate">
                              {tool.title}
                            </h3>
                            {!unlocked && <Lock className="w-3 h-3 text-[#C5A059] shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-400 truncate">{tool.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] font-mono text-slate-500 uppercase hidden sm:inline">
                          {tool.category}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold border ${getTierBadgeClass(
                            toolTier
                          )}`}
                        >
                          {tool.badge || toolTier}
                        </span>

                        <button
                          onClick={(e) => toggleFavorite(tool.id, e)}
                          className="p-1 text-slate-500 hover:text-amber-400"
                        >
                          <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Membership & Checkout Modals */}
      <MembershipModal
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
        currentTier={userTier}
        onSelectTier={handleSelectTier}
      />

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        targetTier={checkoutTargetTier}
        onSuccess={() => {
          setUserTier(checkoutTargetTier);
          setShowCheckoutModal(false);
          setShowMembershipModal(false);
        }}
      />

      {/* Status Bar Footer */}
      <footer className="h-10 border-t border-[#111827] bg-[#02050c] flex items-center px-6 justify-between text-[11px] text-slate-500 mt-12">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-slate-300 font-mono text-[10px]">Client Environment Ready</span>
          </div>
          <div className="h-3 w-[1px] bg-[#111827]"></div>
          <span className="text-slate-500">40 Utilities Active</span>
        </div>
        <div className="flex items-center gap-4 hidden sm:flex">
          <span>Local Storage Persistence</span>
          <div className="h-3 w-[1px] bg-[#111827]"></div>
          <span>© {new Date().getFullYear()} ToolBox Pro</span>
        </div>
      </footer>
    </div>
  );
}
