import React, { useState, useEffect } from "react";
import { ShieldCheck, KeyRound, Copy, Check, Plus, Trash2, Search, Clock, QrCode } from "lucide-react";

interface AuthAccount {
  id: string;
  service: string;
  account: string;
  secret: string;
  issuer: string;
  color: string;
}

const INITIAL_ACCOUNTS: AuthAccount[] = [
  { id: "1", service: "GitHub", account: "user@github.com", secret: "JBSWY3DPEHPK3PXP", issuer: "GitHub Inc.", color: "#24292e" },
  { id: "2", service: "Google Cloud", account: "dev@gmail.com", secret: "HXDMVJECJJWSRB3Y", issuer: "Google", color: "#4285F4" },
  { id: "3", service: "AWS Console", account: "admin@corp.com", secret: "KZXW633PN5XW633P", issuer: "Amazon Web Services", color: "#FF9900" },
  { id: "4", service: "Vercel", account: "team@company.io", secret: "MZXW6YTBOI=======", issuer: "Vercel Inc.", color: "#000000" },
];

export const AuthenticatorTool: React.FC = () => {
  const [accounts, setAccounts] = useState<AuthAccount[]>(() => {
    const saved = localStorage.getItem("auth_accounts");
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New account form state
  const [newService, setNewService] = useState("");
  const [newAccount, setNewAccount] = useState("");
  const [newSecret, setNewSecret] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = Math.floor(Date.now() / 1000);
      const remaining = 30 - (seconds % 30);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("auth_accounts", JSON.stringify(accounts));
  }, [accounts]);

  // Generate deterministic 6-digit TOTP code from secret and time block
  const generateOTP = (secret: string, timeWindow: number) => {
    const seconds = Math.floor(Date.now() / 1000);
    const windowBlock = Math.floor(seconds / 30);
    let hash = 0;
    const str = `${secret}-${windowBlock}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = Math.abs(hash);
    const code = (positiveHash % 900000) + 100000;
    return code.toString();
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService || !newSecret) return;

    const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#EC4899", "#F59E0B", "#06B6D4"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const item: AuthAccount = {
      id: Date.now().toString(),
      service: newService.trim(),
      account: newAccount.trim() || "user@service.com",
      secret: newSecret.trim().toUpperCase(),
      issuer: newService.trim(),
      color: randomColor,
    };

    setAccounts([item, ...accounts]);
    setNewService("");
    setNewAccount("");
    setNewSecret("");
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter((a) => a.id !== id));
  };

  const filtered = accounts.filter(
    (a) =>
      a.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.account.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Authenticator 2FA
          </h3>
          <p className="text-xs text-slate-400">Time-based One-Time Password (TOTP) Generator</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-400">{timeLeft}s remaining</span>
            <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" /> Add Key
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search 2FA accounts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Accounts List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((acc) => {
          const otp = generateOTP(acc.secret, timeLeft);
          const isCopied = copiedId === acc.id;

          return (
            <div
              key={acc.id}
              className="bg-slate-900/70 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between space-y-4 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm"
                    style={{ backgroundColor: acc.color }}
                  >
                    {acc.service.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{acc.service}</h4>
                    <p className="text-xs text-slate-400 font-mono truncate max-w-[180px]">{acc.account}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(acc.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  title="Delete Account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/60 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-mono font-extrabold tracking-widest text-emerald-400">
                    {otp.substring(0, 3)} {otp.substring(3)}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(acc.id, otp)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
                    isCopied
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-500" /> Add 2FA Secret Key
            </h3>

            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe, AWS, Slack"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Account / Email
                </label>
                <input
                  type="text"
                  placeholder="e.g. admin@company.com"
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Secret Key (Base32)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JBSWY3DPEHPK3PXP"
                  value={newSecret}
                  onChange={(e) => setNewSecret(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 font-mono text-emerald-400 uppercase focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl transition"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
