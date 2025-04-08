"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";

export default function ReceivePage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const res = await axios.get("/api/v1/fetchAccount", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const accounts = res.data?.accounts || {};
        const freshWallets = Object.values(accounts).flat();

        if (freshWallets.length > 0) {
          setWallets(freshWallets);
          setSelectedWallet(freshWallets[0]);
          localStorage.setItem("wallets", JSON.stringify(freshWallets));
        } else {
          console.warn("No wallets found for user");
        }
      } catch (err) {
        console.error("Error fetching wallets from backend:", err);

        const stored = localStorage.getItem("wallets");
        if (stored && stored !== "undefined") {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setWallets(parsed);
              setSelectedWallet(parsed[0]);
            }
          } catch (parseErr) {
            console.error("Error parsing stored wallets:", parseErr);
            localStorage.removeItem("wallets");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  const copyToClipboard = () => {
    if (selectedWallet?.address) {
      navigator.clipboard.writeText(selectedWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBackToHome = () => {
    router.push("/homePage");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Receive Crypto</h2>

        {loading ? (
          <p className="text-gray-500">Loading wallets...</p>
        ) : selectedWallet ? (
          <>
            <p className="text-gray-600 mb-2 font-medium">
              Scan this QR code to get your {selectedWallet.type} address:
            </p>

            <div className="flex justify-center my-6">
              <QRCodeCanvas value={selectedWallet.address || ""} size={180} />
            </div>

            <input
              type="text"
              className="w-full border px-4 py-2 rounded-lg text-gray-700 font-mono text-sm mb-4"
              value={selectedWallet.address}
              readOnly
            />

            <button
              onClick={copyToClipboard}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              {copied ? "Copied!" : "Copy address"}
            </button>

            {wallets.length > 1 && (
              <div className="mt-6">
                <label className="block mb-1 text-sm text-gray-600 font-medium">
                  Select Wallet
                </label>
                <select
                  value={selectedWallet.id}
                  onChange={(e) => {
                    const wallet = wallets.find((w) => String(w.id) === e.target.value);
                    setSelectedWallet(wallet);
                  }}
                  className="w-full border px-3 py-2 text-gray-600 rounded-lg"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.type} - {w.address.slice(0, 10)}...
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">No wallet available.</p>
        )}

        <button
          onClick={handleBackToHome}
          className="mt-6 text-sm text-blue-600 hover:underline"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
