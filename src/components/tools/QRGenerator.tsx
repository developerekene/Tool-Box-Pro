import React, { useState, useEffect } from "react";
import { QrCode, Download, Copy, Check, Globe, Wifi, User, Mail } from "lucide-react";
import QRCode from "qrcode";

type QRType = "url" | "text" | "wifi" | "vcard";

export const QRGenerator: React.FC = () => {
  const [qrType, setQrType] = useState<QRType>("url");
  const [content, setContent] = useState<string>("https://toolbox.app");
  
  // Customization
  const [fgColor, setFgColor] = useState<string>("#8B5CF6");
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // WiFi fields
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");

  // VCard fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    let payload = content;
    if (qrType === "wifi") {
      payload = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    } else if (qrType === "vcard") {
      payload = `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
    }

    if (!payload.trim()) return;

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [qrType, content, fgColor, bgColor, ssid, password, encryption, name, email, phone]);

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-500" /> QR Code Studio
          </h3>
          <p className="text-xs text-slate-400">Generate styled QR codes with color customization & download</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          {/* Type Selector */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "url", label: "URL", icon: Globe },
              { id: "text", label: "Text", icon: QrCode },
              { id: "wifi", label: "WiFi", icon: Wifi },
              { id: "vcard", label: "Contact", icon: User },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setQrType(item.id as QRType)}
                  className={`py-2 px-1 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1 transition ${
                    qrType === item.id
                      ? "bg-purple-500/20 border-purple-500 text-purple-400"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {item.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Content Inputs */}
          {qrType === "url" && (
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://example.com"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          {qrType === "text" && (
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Plain Text Message
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Type your message here..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          {qrType === "wifi" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Network SSID (Name)
                </label>
                <input
                  type="text"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  placeholder="MyHomeWifi"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="SecretPassword"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {qrType === "vcard" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Foreground Color</label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer bg-slate-950 border border-slate-800 p-1"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Background Color</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer bg-slate-950 border border-slate-800 p-1"
              />
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-purple-500/30 flex flex-col items-center justify-center space-y-4 text-center">
          {qrDataUrl ? (
            <div className="p-4 rounded-2xl shadow-xl bg-white border border-slate-800">
              <img src={qrDataUrl} alt="QR Code" className="w-52 h-52 object-contain" />
            </div>
          ) : (
            <div className="w-52 h-52 bg-slate-950 rounded-2xl flex items-center justify-center text-slate-600">
              Generating...
            </div>
          )}

          <div className="flex items-center gap-3">
            <a
              href={qrDataUrl}
              download="qrcode.png"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition"
            >
              <Download className="w-4 h-4" /> Download PNG
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
