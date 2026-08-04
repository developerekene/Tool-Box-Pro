import React from "react";
import { Tier } from "../types";
import { Shield, Check, Zap, Crown, Award, X } from "lucide-react";

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: Tier;
  onSelectTier: (tier: Tier) => void;
}

const TIER_DETAILS: Record<string, { title: string; price: string; color: string; icon: any; features: string[] }> = {
  bronze: {
    title: "Bronze Tier",
    price: "Free Forever",
    color: "bg-[#121212] border-[#333333] text-amber-400",
    icon: Award,
    features: ["Access to 10 Essential Tools", "Standard Processing Speed", "Local Device Storage"],
  },
  silver: {
    title: "Silver Tier",
    price: "$4.99 / mo",
    color: "bg-[#121212] border-[#333333] text-slate-300",
    icon: Shield,
    features: ["Access to 18 Core Tools", "Faster Canvas Operations", "PDF & Auth Utilities"],
  },
  gold: {
    title: "Gold Tier",
    price: "$9.99 / mo",
    color: "bg-[#121212] border-[#C5A059]/60 text-[#C5A059]",
    icon: Zap,
    features: ["Access to 29 Advanced Tools", "AI Background Eraser & Compression", "No Limits or Watermarks"],
  },
  platinum: {
    title: "Platinum Tier",
    price: "$19.99 / mo",
    color: "bg-[#121212] border-purple-500/50 text-purple-300",
    icon: Crown,
    features: ["Access to ALL 39 Tools", "AI Content Classifier & SEO Rank Tracker", "Priority Processing Engine"],
  },
};

export const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onSelectTier,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121212] border border-[#222222] rounded-2xl w-full max-w-4xl p-6 md:p-8 space-y-6 shadow-2xl relative my-8 text-slate-200">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 bg-[#1a1a1a] hover:bg-[#222222] text-slate-400 hover:text-white rounded-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.2em]">
            Membership Plans & Access Tiers
          </span>
          <h2 className="font-serif-title text-3xl font-light text-[#f1f1f1]">Unlock Pro Web Utilities</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto font-light">
            Select a tier tailored to your daily workflow. Upgrade or adjust anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(["bronze", "silver", "gold", "platinum"] as Tier[]).map((tier) => {
            const detail = TIER_DETAILS[tier.toString().toLowerCase()] || TIER_DETAILS["bronze"];
            const Icon = detail.icon;
            const isCurrent = currentTier.toString().toLowerCase() === tier.toString().toLowerCase();

            return (
              <div
                key={tier}
                className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
                  isCurrent ? "ring-1 ring-[#C5A059] shadow-lg shadow-[#C5A059]/10" : "opacity-90 hover:opacity-100"
                } ${detail.color}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Icon className="w-6 h-6" />
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-[#C5A059] text-black text-[9px] font-bold rounded-sm uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif-title text-xl font-medium text-white">{detail.title}</h3>
                    <p className="text-xs font-mono font-semibold text-slate-300 mt-0.5">{detail.price}</p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-400 pt-2 font-light">
                    {detail.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    onSelectTier(tier);
                    onClose();
                  }}
                  className={`w-full py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition ${
                    isCurrent
                      ? "bg-[#1a1a1a] text-slate-500 border border-[#222222] cursor-default"
                      : "bg-[#C5A059] text-black hover:bg-[#b08e4d]"
                  }`}
                >
                  {isCurrent ? "Current Plan" : `Switch to ${tier}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

