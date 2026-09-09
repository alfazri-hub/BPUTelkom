"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { setAdminSession } from "@/lib/admin-session";
import { Perforation, PortalLogo } from "@/app/components/portal-ui";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [statusLogin, setStatusLogin] = useState("");
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusLogin("loading");

    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("username", username.trim())
      .eq("password", password);

    if (error) {
      console.error("Login query failed:", error);
      setStatusLogin("connection-error");
      return;
    }

    if (!data || data.length === 0) {
      setStatusLogin("error");
      return;
    }

    setAdminSession();
    router.push("/admin");
  };

  const isLoading = statusLogin === "loading";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-portal-paper2 px-4 py-8 sm:px-8 antialiased">
      {/* Efek Glow Latar Belakang (Diperbesar agar card lebih menonjol) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-portal-red-soft blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-portal-red-soft blur-[100px] opacity-50"
      />

      {/* BUNGKUSAN CARD UTAMA */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-[32px] border border-portal-line bg-portal-paper shadow-2xl transition-all">
        <Perforation />

        <section className="px-8 pb-10 pt-8 sm:px-10">
          <div className="mb-6 flex justify-center">
            <PortalLogo />
          </div>

          <div className="mb-8">
            <h2 className="portal-display text-center text-2xl font-bold text-portal-navy tracking-tight">
              Selamat datang kembali
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-portal-muted font-medium">
              Masukkan kredensial untuk mengakses ruang admin.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-xs font-semibold text-portal-ink">
              Username
              <span className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-portal-line bg-portal-paper2 px-4 py-3.5 transition-all focus-within:border-portal-red focus-within:bg-portal-paper focus-within:ring-4 focus-within:ring-portal-red-soft">
                <User size={16} className="text-portal-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Masukkan username"
                  required
                  className="w-full bg-transparent text-sm font-medium text-portal-ink outline-none placeholder:text-portal-muted placeholder:font-normal"
                />
              </span>
            </label>

            <label className="flex flex-col gap-2 text-xs font-semibold text-portal-ink">
              Password
              <span className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-portal-line bg-portal-paper2 px-4 py-3.5 transition-all focus-within:border-portal-red focus-within:bg-portal-paper focus-within:ring-4 focus-within:ring-portal-red-soft">
                <Lock size={16} className="text-portal-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full bg-transparent text-sm font-medium text-portal-ink outline-none placeholder:text-portal-muted placeholder:font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="shrink-0 text-portal-muted transition hover:text-portal-ink active:scale-95"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>

            {statusLogin === "connection-error" && (
              <div className="rounded-lg bg-red-50 p-3 text-center text-xs font-bold text-portal-red border border-red-100">
                Sistem tidak dapat terhubung ke database.
              </div>
            )}

            {statusLogin === "error" && (
              <div className="rounded-lg bg-red-50 p-3 text-center text-xs font-bold text-portal-red border border-red-100">
                Username atau password salah.
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-portal-red px-5 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#b92d3a] hover:shadow-lg active:scale-95 disabled:cursor-wait disabled:opacity-70"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Memeriksa..." : "Masuk ke dashboard"}
            </button>

            <div className="mt-2 text-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-portal-muted transition-colors hover:text-portal-red"
              >
                <ArrowLeft size={14} />
                Kembali ke beranda
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
