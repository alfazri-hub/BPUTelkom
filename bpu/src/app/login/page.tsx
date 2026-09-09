"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [statusLogin, setStatusLogin] = useState("")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatusLogin("loading")

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .eq("password", password)

        if (error || !data || data.length === 0) {
            setStatusLogin("error")
            return
        }

        setStatusLogin("success")
        router.push("/admin")
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-fuchsia-100 p-6">
            <div className="w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-10 transition-all">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Portal Admin</h1>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className="px-6 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700 text-lg transition-all placeholder-gray-400"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="px-6 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-inner text-gray-700 text-lg transition-all placeholder-gray-400"
                    />

                    {statusLogin === "error" ? (
                        <p className="text-red-500 text-center font-medium">Username atau password salah.</p>
                    ) : null}

                    <button
                        type="submit"
                        className="mt-2 px-8 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold text-lg shadow-xl transition-all"
                    >
                        {statusLogin === "loading" ? "Memeriksa..." : "Masuk"}
                    </button>
                </form>
            </div>
        </main>
    )
}