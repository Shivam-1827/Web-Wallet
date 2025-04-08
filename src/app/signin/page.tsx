"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSignin() {
    if (!username || !password) {
      return alert("Username and password are required");
    }

    try {
      const response = await axios.post("/api/v1/signin", {
        username,
        password,
      });

      const { success, user } = response.data;

      if (success && user) {
        console.log("User found:", user);
        router.push("/homePage");
      } else {
        console.log("Login failed");
        alert("Login failed");
      }
    } catch (err: any) {
      console.error("Signin failed:", err.response?.data?.error || err.message);
      alert(err.response?.data?.error || "Something went wrong during signin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign in to <span className="text-indigo-600">MetaVault</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john123"
              className="w-full mt-1 p-2 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="John123@"
              className="w-full mt-1 p-2 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleSignin}
            className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
