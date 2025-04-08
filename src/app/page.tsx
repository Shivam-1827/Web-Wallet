"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  function handleLogin(){
    router.push("/signin")
  }

  function createWallet(){
    router.push("/signup")
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md text-center">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">MetaVault</h1>
          <p className="text-gray-600 text-lg">Your Asset. Your Control.</p>
        </div>

        <div className="flex flex-col gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            onClick={createWallet}
          >
            Create a new wallet
          </button>
          <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-2 px-4 rounded-lg transition" 
            onClick={handleLogin}
          >
            I already have a wallet
          </button>
        </div>

      </div>
    </div>
  );
}
