"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function handleSignup() {
        if (username && email && password) {
            try {
                const response = await axios.post("/api/v1/signup", {
                    username,
                    email,
                    password
                });

                if (response.data.success) {
                    console.log("User created!");
                    router.push("/dashboard");
                } else {
                    console.log("Signup failed:", response.data.error);
                }
            } catch (error) {
                console.error("Signup error:", error);
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign up to <span className="text-indigo-600">MetaVault</span></h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="john123"
                            className="w-full mt-1 p-2 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@gmail.com"
                            className="w-full mt-1 p-2 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="John123@"
                            className="w-full mt-1 p-2 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        onClick={handleSignup}
                        className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}
