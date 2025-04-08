"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function TransferCrypto() {
  const [crypto, setCrypto] = useState("ETH");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const res = await axios.get("/api/v1/fetchAccount");
        const accounts = res.data.accounts;
        const allWallets = Object.values(accounts).flat();
        setWallets(allWallets);
      } catch (err) {
        console.error("Fetch Error", err);
      }
    };

    fetchWallets();
  }, []);

  useEffect(() => {
    const matchedWallet = wallets.find(w => w.type === crypto);
    setSelectedWallet(matchedWallet || null);
  }, [crypto, wallets]);

  const handleTransfer = async () => {
    setError("");

    if (!selectedWallet || !selectedWallet.balances) {
      return setError("Wallet not found or no balance info.");
    }

    const balanceObj = selectedWallet.balances.find((b: any) => b.token === crypto);
    const balance = balanceObj?.amount || 0;

    if (parseFloat(amount) > balance) {
      return setError("Insufficient balance");
    }


    console.log(selectedWallet.address);
    console.log(receiver);
    console.log(amount);
    console.log(selectedWallet.type);

    try {
      const res = await axios.post(
        "/api/v1/transfer",
        {
          from: selectedWallet.address,
          to: receiver,
          amount: parseFloat(amount),
          cryptoType: selectedWallet.type,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Transfer successful!");
        setAmount("");
        setReceiver("");
      } else {
        setError(res.data.error || "Transfer failed");
      }
    } catch (err) {
      console.error(err);
      setError("Transfer failed");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-blue-600 mb-6 text-center tracking-tight">
          Transfer Crypto
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm shadow-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block mb-1 text-sm font-medium text-gray-600">Select Crypto</label>
          <select
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="ETH">ETH</option>
            <option value="SOL">SOL</option>
            <option value="BTC">BTC</option>
            <option value="POLYGON">POLYGON</option>
          </select>
        </div>

        <div className="mb-4 text-sm text-gray-700">
          <strong>Available Balance:</strong>{" "}
          {selectedWallet?.balances?.find((b: any) => b.token === crypto)?.amount || 0} {crypto}
        </div>

        <div className="mb-5">
          <label className="block mb-1 text-sm font-medium text-gray-600">Receiver Address</label>
          <input
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter recipient's public key"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-600">Amount</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            className="w-full p-3 border border-gray-300 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter amount to send"
          />
        </div>

        <div className="flex justify-between gap-4">
          <button
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-xl transition"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition"
            onClick={handleTransfer}
          >
            Transfer
          </button>
        </div>
      </div>
    </div>


  );
}
