"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function Dashboard() {
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [mnemonicsVisible, setMnemonicsVisible] = useState(false);
  const [mnemonicBtnVisible, setMnemonicBtnVisible] = useState(true);
  const [continueBtnVisible, setContinueBtnVisible] = useState(false);
  const [mnemonics, setMnemonics] = useState<string[]>([]);
  const router = useRouter();

  async function handleMnemonic() {
    try {
      const response = await axios.post("/api/v1/generateMnemonics");

      if (response.data?.mnemonics) {
        const mnemonicArray = response.data.mnemonics.split(" ");
        setMnemonics(mnemonicArray);
        setTaglineVisible(true);
        setMnemonicsVisible(true);
        setMnemonicBtnVisible(false);
        setContinueBtnVisible(true);
      }
    } catch (error) {
      console.error("Error generating mnemonic:", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Secret Recovery Phrase</h2>

        {taglineVisible && (
          <p className="text-center text-red-600 font-medium mb-6">
            This phrase is the <span className="font-bold">ONLY</span> way to recover your wallet.
            Do <span className="font-bold">NOT</span> share it with anyone!
          </p>
        )}

        {mnemonicsVisible && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {mnemonics.map((word, index) => (
              <input
                key={index}
                type="text"
                value={word}
                readOnly
                className="border border-gray-300 rounded-lg px-2 py-3 text-gray-600 text-center text-sm bg-gray-50 cursor-not-allowed"
              />
            ))}
          </div>
        )}

        {mnemonicBtnVisible && (
          <div className="flex justify-center">
            <button
              onClick={handleMnemonic}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Generate Mnemonic
            </button>
          </div>
        )}

        {continueBtnVisible && (
          <div className="flex justify-center mt-4">
            <button

                onClick={()=>{
                    router.push("/homePage")
                }}

              className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-2 px-6 rounded-lg transition"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
