import React, { useState } from "react";
import { Tier } from "../types";
import { CreditCard, Check, X, ShieldCheck, Lock } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTier: Tier;
  onConfirmSuccess: (tier: Tier) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  targetTier,
  onConfirmSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onConfirmSuccess(targetTier);
        setSuccess(false);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#222222] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 bg-[#1a1a1a] hover:bg-[#222222] text-slate-400 hover:text-white rounded-md transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1">
          <ShieldCheck className="w-8 h-8 text-[#C5A059] mx-auto" />
          <h3 className="font-serif-title text-2xl font-light text-white">Upgrade to {targetTier.toUpperCase()}</h3>
          <p className="text-xs text-slate-400 font-light">Secure 256-bit SSL encrypted upgrade</p>
        </div>

        {success ? (
          <div className="p-8 bg-[#0a0a0a] rounded-xl border border-[#C5A059]/40 text-center space-y-3">
            <Check className="w-12 h-12 text-[#C5A059] mx-auto" />
            <h4 className="font-serif-title text-xl font-medium text-white">Upgrade Successful</h4>
            <p className="text-xs text-slate-400 font-light">Welcome to ToolBox {targetTier.toUpperCase()} Tier.</p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                required
                defaultValue="Alex Johnson"
                className="w-full p-2.5 bg-[#0a0a0a] border border-[#222222] rounded-md text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Card Number
              </label>
              <input
                type="text"
                required
                defaultValue="4242 •••• •••• 4242"
                className="w-full p-2.5 bg-[#0a0a0a] border border-[#222222] rounded-md text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Expiry
                </label>
                <input
                  type="text"
                  required
                  defaultValue="12/28"
                  className="w-full p-2.5 bg-[#0a0a0a] border border-[#222222] rounded-md text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  required
                  defaultValue="888"
                  className="w-full p-2.5 bg-[#0a0a0a] border border-[#222222] rounded-md text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#8C6E3D] text-black font-semibold text-xs rounded-md flex items-center justify-center gap-2 uppercase tracking-wider shadow-md hover:opacity-90 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              {isProcessing ? "Authorizing Upgrade..." : `Confirm ${targetTier.toUpperCase()} Upgrade`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

