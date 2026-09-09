"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { setAdminSession } from "@/lib/admin-session";
import { Perforation, PortalLogo } from "@/app/components/portal-ui";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  return (
    <main className="portal-page flex min-h-screen items-center justify-center bg-[#f7f6f2] px-4 py-8 sm:px-8">
      <div className="portal-card w-full max-w-sm">
        <Perforation />
        <section>
          <div className="portal-card-body">
            <div className="mb-6 flex justify-center">
              <PortalLogo />
            </div>
            <div className="mb-8">
              <h2 className="portal-display text-center text-2xl font-semibold text-[#10132a]">
                Selamat datang kembali
              </h2>
              <p className="mt-2 text-center text-sm leading-6 text-[#75798c]">
                Masukkan kredensial untuk mengakses ruang admin.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <label className="portal-label flex flex-col gap-2">
                Username
                <span className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-[#e7e4dd] bg-[#f7f6f2] px-3.5 py-2.5">
                  <User size={15} className="text-[#75798c]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Masukkan username"
                    required
                    className="w-full bg-transparent text-sm font-normal text-[#14172b] outline-none placeholder:text-[#a0a2ad]"
                  />
                </span>
              </label>
              <label className="portal-label flex flex-col gap-2">
                Password
                <span className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-[#e7e4dd] bg-[#f7f6f2] px-3.5 py-2.5">
                  <Lock size={15} className="text-[#75798c]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Masukkan password"
                    required
                    className="w-full bg-transparent text-sm font-normal text-[#14172b] outline-none placeholder:text-[#a0a2ad]"
                  />
                </span>
              </label>
              {statusLogin === "connection-error" ? (
                <p className="status-error">
                  Sistem login tidak dapat terhubung ke database.
                </p>
              ) : null}
              {statusLogin === "error" ? (
                <p className="status-error">Username atau password salah.</p>
              ) : null}
              <button
                type="submit"
                disabled={statusLogin === "loading"}
                className="mt-2 w-full rounded-xl bg-[#d93a46] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b92d3a] disabled:cursor-wait disabled:opacity-60"
              >
                {statusLogin === "loading"
                  ? "Memeriksa..."
                  : "Masuk ke dashboard"}
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#75798c] transition hover:text-[#d93a46]"
              >
                <ArrowLeft size={13} />
                Kembali
              </Link>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
