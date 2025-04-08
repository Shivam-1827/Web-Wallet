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
      const res =  await axios.post(
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
    <div className="max-w-md mx-auto p-6 rounded-xl shadow bg-white">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Transfer Crypto</h2>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-3">{error}</div>}

      <div className="mb-4">
        <label>Select Crypto</label>
        <select
          value={crypto}
          onChange={(e) => setCrypto(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="ETH">ETH</option>
          <option value="SOL">SOL</option>
          <option value="BTC">BTC</option>
          <option value="POLYGON">POLYGON</option>
        </select>
      </div>

      <div className="mb-2">
        <strong>Available Balance: </strong>
        {selectedWallet?.balances?.find((b: any) => b.token === crypto)?.amount || 0} {crypto}
      </div>

      <div className="mb-4">
        <label>Receiver Address</label>
        <input
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Receiver Address"
        />
      </div>

      <div className="mb-4">
        <label>Amount</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          type="number"
          min="0"
        />
      </div>

      <div className="flex justify-between">
        <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => window.history.back()}>
          Cancel
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleTransfer}>
          Transfer
        </button>
      </div>
    </div>
  );
}
