"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type Balance = {
  id: string;
  token: string;
  amount: number;
};

type Wallet = {
  id: string;
  type: string;
  address: string;
  balances: Balance[];
};

export default function MetaVaultHomePage() {
  const [accounts, setAccounts] = useState<Wallet[][]>([]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleTransfer = () => {
    localStorage.setItem("wallets", JSON.stringify(currentWallets));
    router.push("/transfer");
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("/api/v1/fetchAccount");
      const accountMap = response.data.accounts;
       setUsername( response.data.user);


      const structuredAccounts: Wallet[][] = Object.keys(accountMap)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((key) => accountMap[key]);

      setAccounts(structuredAccounts);
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    }
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      await axios.post("/api/v1/createAccount");
      await fetchAccounts();
      setSelectedAccountIndex(accounts.length); 
    } catch (err) {
      console.error("Failed to create account", err);
    }
    setLoading(false);
  };

  const currentWallets = accounts[selectedAccountIndex] || [];

  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow-md">
        <h1 className="text-xl font-bold">Welcome to MetaVault {username}</h1>

        <div className="flex gap-4 items-center">
          <button
            onClick={handleCreateAccount}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {accounts.length > 0 && (
            <select
              className="bg-gray-800 text-white border border-gray-700 p-2 rounded-lg"
              value={selectedAccountIndex}
              onChange={(e) => setSelectedAccountIndex(parseInt(e.target.value))}
            >
              {accounts.map((_, index) => (
                <option key={index} value={index}>
                  Account {index + 1}
                </option>
              ))}
            </select>
          )}
        </div>
      </nav>

      {currentWallets.length > 0 && (
        <div className="flex justify-end gap-4 px-6 mt-6">
        <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-5 py-2 rounded-2xl shadow-lg transition-all duration-200" 
        onClick={handleTransfer}>
          <ArrowUpCircle className="w-5 h-5" />
          Transfer Crypto
        </button>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-5 py-2 rounded-2xl shadow-lg transition-all duration-200"
        onClick={()=> router.push("/receive")}>
          <ArrowDownCircle className="w-5 h-5" />
          Receive Crypto
        </button>
      </div>
      
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {currentWallets.map((wallet) => {
          const balanceObj = wallet.balances.find(
            (b) => b.token.toLowerCase() === wallet.type.toLowerCase()
          );
          const balance = balanceObj?.amount ?? 0;

          return (
            <div
              key={wallet.id}
              className="bg-gray-50 rounded-2xl shadow-md p-5 flex justify-between items-center"
            >
              <div>
                <div className="text-lg font-semibold">{wallet.type}</div>
                <div className="text-sm text-gray-700">
                  {balance} {wallet.type}
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-700 text-lg font-bold">${balance.toFixed(2)}</div>
                <div className="text-green-400 text-sm">+${balance.toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
